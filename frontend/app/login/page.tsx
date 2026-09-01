"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginStudent } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm(): string | null {
    if (!email.trim()) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Password is required.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await loginStudent(email, password);

      router.push("/profile");
    } catch (loginError) {
      if (
        loginError instanceof Error &&
        loginError.message === "INVALID_CREDENTIALS"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FC] px-4 py-10 text-[#172033]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-3xl border border-[#E5E7EB] bg-white p-7 shadow-xl shadow-purple-100/30 md:p-9">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#6D28D9]">
              ACE Discover AI
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#172033]">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              Login to continue discovering opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172033]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-4 py-3.5 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172033]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-4 py-3.5 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-6 py-3.5 font-bold text-white shadow-md shadow-purple-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-[#64748B]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-bold text-[#6D28D9] transition hover:text-[#8B2CF5] hover:underline"
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}