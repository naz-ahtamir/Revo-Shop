"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormInputs>({
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError("email", { type: "manual", message: "Incorrect email or password" });
      return;
    }
    
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--gray-200)] bg-white p-8">
      <h1 className="display-md mb-2 text-[var(--black)]">Login</h1>
      <p className="mb-6 text-sm text-[var(--black)]">Sign in to your RevoShop account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.email?.message && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.email.message}</p>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--black)]">Email</label>
          <input
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
            })}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
          {errors.email && errors.email.type !== "manual" && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--black)]">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[var(--black)] outline-none focus:border-[var(--orange)]"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full justify-center">
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--black)]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[var(--orange)] hover:underline">
          Register
        </Link>
      </p>      
    </div>
  );
}
