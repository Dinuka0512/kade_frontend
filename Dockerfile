# Base stage
FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

# ============================================
# Dependencies stage (full install for build)
# ============================================
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile || pnpm install --frozen-lockfile --prefer-offline

# ============================================
# Production dependencies stage (runtime)
# ============================================
FROM base AS prod-deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install --prod --frozen-lockfile || pnpm install --prod --frozen-lockfile --prefer-offline

# ============================================
# Builder stage
# ============================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_USE_MOCK=false
ARG API_PROXY_TARGET=http://localhost:8000/api

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK
ENV API_PROXY_TARGET=$API_PROXY_TARGET

RUN pnpm build

# ============================================
# Runner stage (uses pm2-runtime)
# ============================================
FROM base AS runner
WORKDIR /app

ARG API_PROXY_TARGET=http://localhost:8000/api

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV API_PROXY_TARGET=$API_PROXY_TARGET

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/ecosystem.config.cjs ./ecosystem.config.cjs

EXPOSE 8080

CMD ["node_modules/pm2/bin/pm2-runtime", "start", "ecosystem.config.cjs"]