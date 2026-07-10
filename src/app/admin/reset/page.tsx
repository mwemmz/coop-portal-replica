"use client";

import { Suspense, FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestReset(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/auth/reset/request", {
      method: "POST",
      body: JSON.stringify({ identifier: email, type: "admin" }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.resetUrl);
    } else {
      setError(data.error || "Request failed");
    }
  }

  async function confirmReset(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/auth/reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => (window.location.href = "/admin/login"), 2000);
    } else {
      setError(data.error || "Reset failed");
    }
  }

  if (token) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#354026" }}>
        <form onSubmit={confirmReset} className="w-full max-w-sm space-y-4 rounded-xl p-8" style={{ backgroundColor: "#F4F0E4" }}>
          <h1 className="text-2xl font-bold" style={{ color: "#354026" }}>Set New Password</h1>
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            style={{ borderColor: "#C6BDA2", backgroundColor: "#F4F0E4" }}
            required
            minLength={6}
          />
          <button type="submit" className="w-full rounded-lg py-3 font-semibold text-white" style={{ backgroundColor: "#354026" }}>
            Reset Password
          </button>
          {message && <p className="text-green-700 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#354026" }}>
      <form onSubmit={requestReset} className="w-full max-w-sm space-y-4 rounded-xl p-8" style={{ backgroundColor: "#F4F0E4" }}>
        <h1 className="text-2xl font-bold" style={{ color: "#354026" }}>Forgot Password</h1>
        <p className="text-sm" style={{ color: "#9C5523" }}>
          Enter your registered email to receive a reset link.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
          style={{ borderColor: "#C6BDA2", backgroundColor: "#F4F0E4" }}
          required
        />
        <button type="submit" className="w-full rounded-lg py-3 font-semibold text-white" style={{ backgroundColor: "#354026" }}>
          Send Reset Link
        </button>
        {message && (
          <div className="text-xs break-all" style={{ color: "#354026" }}>
            <p className="font-semibold">Reset URL (dev):</p>
            <a href={message} className="underline">{message}</a>
          </div>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <a href="/admin/login" className="block text-center text-sm underline" style={{ color: "#9C5523" }}>
          Back to login
        </a>
      </form>
    </main>
  );
}

export default function AdminResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
