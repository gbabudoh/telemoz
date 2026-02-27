"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "dark" | "light";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
  variant = "dark",
}: ModalProps) {
  if (!isOpen) return null;

  const variantClasses = {
    dark: "bg-gray-900 border-gray-800 text-white",
    light: "bg-white border-gray-200 text-gray-900",
  };

  const headerBorderClasses = {
    dark: "border-gray-800",
    light: "border-gray-200",
  };

  const titleClasses = {
    dark: "text-white",
    light: "text-gray-900",
  };

  const closeButtonClasses = {
    dark: "text-gray-400 hover:bg-gray-800 hover:text-white",
    light: "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full rounded-xl border shadow-2xl transition-all duration-300",
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className={cn("flex items-center justify-between border-b px-6 py-4", headerBorderClasses[variant])}>
              <h2 className={cn("text-xl font-semibold", titleClasses[variant])}>{title}</h2>
              <button
                onClick={onClose}
                className={cn("rounded-lg p-1 transition-colors", closeButtonClasses[variant])}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

