"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const tenantSlug = formData.get("tenantSlug") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      tenantSlug,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email, password, or business URL");
      setIsLoading(false);
    } else {
      router.push("/app");
      router.refresh();
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {registered && (
          <p className="mt-2 text-center text-sm text-green-600 bg-green-50 p-2 rounded">
            Account created! Please sign in.
          </p>
        )}
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input name="tenantSlug" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Business URL (e.g. smith-plumbing)" />
          </div>
          <div>
            <input name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
          </div>
          <div>
            <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
          </div>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <Link href="/register" className="text-sm text-blue-600 hover:text-blue-500">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}