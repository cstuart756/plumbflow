"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in");
    if (!loggedIn) {
      router.replace("/account/login");
    } else {
      setEmail(loggedIn);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_logged_in");
    router.replace("/account/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-200">My Account</h1>
        <div className="mb-4 text-lg text-zinc-800 dark:text-zinc-100">Welcome, <span className="font-semibold">{email}</span></div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
