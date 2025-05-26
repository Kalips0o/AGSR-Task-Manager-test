"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Example local validation
    if (email === "test@example.com" && password === "123456") {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-semibold mb-6">Sign In</h1>

      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit}>
        <input
          required
          className="border px-4 py-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          className="border px-4 py-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
