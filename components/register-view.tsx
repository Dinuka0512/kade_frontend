"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400";

export function RegisterView() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("customer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await register(name, email, password, role);
      router.push(user.role === "vendor" ? "/dashboard" : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions: { value: User["role"]; title: string; description: string }[] = [
    { value: "customer", title: "Customer", description: "Shop and track your orders" },
    { value: "vendor", title: "Vendor", description: "Sell products from a dashboard" },
  ];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12 sm:px-0">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Join the island&apos;s local marketplace.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setRole(option.value)}
                className={`rounded-xl border p-3 text-left transition ${
                  role === option.value
                    ? "border-brand-500 bg-brand-50"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span className="block text-sm font-semibold text-ink">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-soft">
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Full name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sanduni Perera"
              className={inputClass}
            />
          </label>
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
              placeholder="At least 6 characters"
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
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
