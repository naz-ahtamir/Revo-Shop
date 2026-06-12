"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--gray-200)] bg-white p-8">
      <h1 className="display-md mb-2 text-[var(--black)]">Login</h1>
      <p className="mb-6 text-sm text-[var(--black)]">Sign in to your RevoShop account</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--black)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--black)]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--black)]">
        Don’t have an account?{" "}
        <Link href="/register" className="font-semibold text-[var(--orange)] hover:underline">
          Register
        </Link>
      </p>      
    </div>
  );
}
