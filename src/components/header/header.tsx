"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Typography } from "@/shared/components/ui/typography";

import { IconLogout } from "../../shared/components/icons/icon-logout";

interface HeaderProps {
  email: string;
}

export function Header({ email }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Add proper logout logic here
    // For now, just redirect to login page
    router.push("/login");
  };

  return (
    <header className="w-full h-14 px-6 flex items-center justify-between bg-white border-b border-gray-200">
      <Typography className="text-gray-800" variant="headline-2-bold">
        Task Manager
      </Typography>

      <div className="flex items-center gap-4">
        <Typography className="text-gray-600" variant="body-m-medium">
          {email}
        </Typography>
        <Button
          className="text-gray-600 hover:text-red-600"
          size="icon"
          title="Logout"
          variant="ghost"
          onClick={handleLogout}
        >
          <IconLogout className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
