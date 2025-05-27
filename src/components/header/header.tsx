"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/shared/components/ui/button";
import { Typography } from "@/shared/components/ui/typography";
import { logout, selectAuthEmail } from "@/shared/redux/slices/authSlice";

import { IconLogout } from "../../shared/components/icons/icon-logout";

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = useSelector(selectAuthEmail);

  const handleLogout = () => {
    dispatch(logout());
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
