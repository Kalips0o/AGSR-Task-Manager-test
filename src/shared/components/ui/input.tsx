import * as React from "react";

import { cn } from "@/shared/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            error && "border-red-500 focus:ring-red-300",
            className
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
