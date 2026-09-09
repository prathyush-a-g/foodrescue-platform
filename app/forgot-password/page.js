"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message || "If an account exists, reset instructions will be sent.");
    } catch {
      setMessage("Unable to request a reset right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-3xl font-bold text-green-700">FoodRescue</Link>
        <div className="surface-card mt-8 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-2 text-slate-600">Enter your account email and we&apos;ll send password reset instructions.</p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-green-600" placeholder="you@example.com" />
            </div>
            {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60">{loading ? "Sending…" : "Send reset instructions"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600"><Link href="/login" className="font-semibold text-green-700">Back to login</Link></p>
        </div>
      </div>
    </main>
  );
}
