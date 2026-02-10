"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          next: nextPath
        })
      });

      const data = (await response.json()) as { redirectTo?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in.");
      }

      window.location.href = data.redirectTo || "/os/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-steel/15 bg-white p-6 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Dealer OS Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-coal">Sign in</h1>
      </div>

      <label className="block space-y-1 text-sm font-medium text-coal">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input"
          required
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-coal">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input"
          required
        />
      </label>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white hover:bg-coal/90 disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-steel">
        Credentials are controlled by platform and dealer role env vars (for example `PLATFORM_OWNER_EMAIL`,
        `DEALER_ADMIN_EMAIL`, `DEALER_SALES_EMAIL`).
      </p>
    </form>
  );
}
