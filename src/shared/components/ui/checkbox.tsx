import React from "react";

import { cn } from "@/shared/lib/utils";

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  className?: string;
  name?: string;
  id?: string;
  title?: string;
}

export function Checkbox({
  checked,
  disabled,
  onChange,
  className,
  name,
  id,
  title,
}: CheckboxProps) {
  return (
    <div className="relative inline-flex">
      <input
        checked={checked}
        className={cn(
          "peer appearance-none h-4 w-4 rounded border border-gray-300",
          "bg-white cursor-pointer transition-colors",
          "checked:bg-gray-600 checked:border-gray-600",
          "hover:border-gray-400 checked:hover:bg-gray-700 checked:hover:border-gray-700",
          "focus:outline-none focus:ring-1 focus:ring-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "disabled:checked:bg-gray-400 disabled:checked:border-gray-400",
          className
        )}
        disabled={disabled}
        id={id}
        name={name}
        title={title}
        type="checkbox"
        onChange={onChange}
      />
      <svg
        className={cn(
          "absolute left-0 top-0 h-4 w-4 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity",
          "text-white"
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
