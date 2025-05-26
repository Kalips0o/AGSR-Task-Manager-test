"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "../shared/components/ui/button";
import { Typography } from "../shared/components/ui/typography";

export default function HomePage() {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4 bg-gray-50 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
        <Typography className="text-gray-800" tag="h1" variant="headline-1">
          Welcome to the Task Manager
        </Typography>

        <Typography className="text-gray-600" variant="body-m-regular">
          Please log in to access the application.
        </Typography>

        <Button className="w-full h-11 text-base" onClick={handleGoToLogin}>
          Login
        </Button>
      </div>
    </main>
  );
}
