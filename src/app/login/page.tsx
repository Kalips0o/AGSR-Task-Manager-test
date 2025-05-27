"use client";

import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/loginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <LoginForm onSuccess={handleLoginSuccess} />
    </main>
  );
}
