"use client";

import React from "react";

import { Provider } from "react-redux";

import { AuthProvider } from "@/components/providers/authProvider";
import { store } from "@/shared/redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
