"use client";

import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { DashboardContent } from "@/components/dashboard/dashboardContent";
import { Header } from "@/components/header/header";
import type { AppDispatch } from "@/shared/redux";
import { fetchLists } from "@/shared/redux/slices/tasksSlice";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <DashboardContent />
      </main>
    </>
  );
}
