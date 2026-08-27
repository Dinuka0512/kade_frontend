"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400";

const homeByRole: Record<User["role"], string> = {
  customer: "/",
  vendor: "/dashboard",
  admin: "/admin",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(email, password);
      router.push(next !== "/" ? next : homeByRole[user.role]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12 sm:px-0">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Sign in to your Kade account.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-black-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black-950/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          New to Kade?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export function LoginView() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
