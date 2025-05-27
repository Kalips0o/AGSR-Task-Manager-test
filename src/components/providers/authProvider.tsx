"use client";

import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/shared/redux";
import { loadPersistedState } from "@/shared/redux/slices/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadPersistedState());
  }, [dispatch]);

  return <>{children}</>;
}
