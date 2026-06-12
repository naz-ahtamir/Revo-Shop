"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--gray-200)] bg-white p-8">
      <h1 className="display-md mb-2 text-[var(--black)]">Register</h1>
      <p className="mb-6 text-sm text-[var(--black)]">Sign up for a new account</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--black)]">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--black)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--orange)] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
