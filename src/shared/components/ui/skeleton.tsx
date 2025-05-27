import React from "react";

import { cn } from "@/shared/lib/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "text" | "title" | "avatar" | "card" | "task" | "list";
}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  const baseStyles = "bg-gray-200 animate-pulse rounded-md";

  const variantStyles = {
    text: "h-4 w-full",
    title: "h-8 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    card: "h-[200px] w-full",
    task: "h-[120px] w-full",
    list: "h-[150px] w-full",
  };

  return (
    <div
      className={cn(baseStyles, variant && variantStyles[variant], className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

// Утилитарные компоненты для частых случаев использования
function SkeletonGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {children}
    </div>
  );
}

function SkeletonRow({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function SkeletonStack({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}

// Примеры использования для разных типов контента
function TaskSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 bg-white border border-gray-200 rounded-lg", className)}>
      <SkeletonGroup>
        <SkeletonRow>
          <Skeleton className="h-4 w-4 rounded-sm" variant="avatar" />
          <Skeleton className="h-6 w-1/2" variant="title" />
        </SkeletonRow>
        <Skeleton className="w-3/4" variant="text" />
        <SkeletonRow>
          <Skeleton className="w-24" variant="text" />
          <Skeleton className="w-32" variant="text" />
        </SkeletonRow>
      </SkeletonGroup>
    </div>
  );
}

function ListSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 bg-white border border-gray-200 rounded-lg", className)}>
      <SkeletonGroup>
        <Skeleton className="h-6 w-2/3" variant="title" />
        <Skeleton className="w-20" variant="text" />
        <SkeletonRow>
          <Skeleton variant="avatar" />
          <Skeleton variant="avatar" />
        </SkeletonRow>
      </SkeletonGroup>
    </div>
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4", className)}>
      <SkeletonGroup>
        <Skeleton variant="title" />
        <Skeleton variant="text" />
        <Skeleton className="w-2/3" variant="text" />
      </SkeletonGroup>
    </div>
  );
}

export {
  Skeleton,
  SkeletonGroup,
  SkeletonRow,
  SkeletonStack,
  TaskSkeleton,
  ListSkeleton,
  CardSkeleton,
};
