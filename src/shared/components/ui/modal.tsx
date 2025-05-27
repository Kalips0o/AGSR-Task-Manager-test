import React, { useEffect, useCallback, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import { IconClose } from "../icons/icon-close";

import { Button } from "./button";
import { Portal } from "./portal";
import { Typography } from "./typography";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  size = "md",
  isLoading = false,
}: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, handleEscape, handleClickOutside]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
      >
        {/* Затемнение фона */}
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/50 transition-opacity duration-200 ease-in-out"
        />

        {/* Контент модального окна */}
        <div
          className={cn(
            "relative z-50 w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden",
            "transform transition-all duration-200 ease-in-out",
            "animate-in fade-in zoom-in-95",
            sizeClasses[size],
            className
          )}
          ref={modalContentRef}
        >
          {/* Заголовок с кнопкой закрытия */}
          <div className="relative px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {title && (
                <Typography className="text-gray-800 flex-1" variant="headline-2-bold">
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <Button
                  className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                  size="icon"
                  title="Close"
                  variant="ghost"
                  onClick={onClose}
                >
                  <IconClose className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Контент */}
          <div
            className={cn(
              "px-6 py-4",
              "transition-opacity duration-200",
              isLoading && "opacity-50 pointer-events-none",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
