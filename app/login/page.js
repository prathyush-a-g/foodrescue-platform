"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        const destinations = {
          provider: "/provider/dashboard",
          receiver: "/donations",
          volunteer: "/donations",
          admin: "/",
        };
        router.push(destinations[data.user.role] || "/");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 text-black">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold text-green-600"
          >
            FoodRescue
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-600">
            Login to continue helping reduce food waste.
          </p>
        </div>

        {/* Login Card */}
        <div className="surface-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-black"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm font-semibold text-green-700 hover:text-green-800">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-black"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-black">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-black">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
