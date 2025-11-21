"use client";

import { Card, CardContent } from "./Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  gradient?: string;
  className?: string;
  animate?: boolean;
  format?: "currency" | "number" | "percentage";
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  gradient,
  className,
  animate = true,
  format,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  const trendIcons = {
    up: "↗",
    down: "↘",
    neutral: "→",
  };

  // Parse value - handle currency strings like "£6,800.00" or numbers
  const parseValue = (val: string | number): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      // Remove currency symbols and commas
      const cleaned = val.replace(/[£$€,\s]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Format value based on format prop or original format
  const formatValue = (num: number, original: string | number): string => {
    // Use format prop if provided
    if (format === "currency") {
      return `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (format === "percentage") {
      return `${num.toFixed(1)}%`;
    }
    if (format === "number") {
      return Math.round(num).toLocaleString("en-GB");
    }

    // Fallback to detecting from original value
    if (typeof original === "string") {
      if (original.includes("£")) {
        return `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (original.includes("%")) {
        return `${num.toFixed(1)}%`;
      }
      if (original.includes("$")) {
        return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
    // For numbers, check if original was currency formatted
    if (typeof original === "number" && num > 0) {
      // If it's a large number, assume it's currency
      if (num >= 100) {
        return `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
    return Math.round(num).toLocaleString("en-GB");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!animate || !isVisible) {
      setDisplayValue(parseValue(value));
      return;
    }

    const targetValue = parseValue(value);
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of animation steps
    const increment = targetValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(increment * currentStep);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible, animate]);

  const formattedDisplayValue = formatValue(displayValue, value);

  return (
    <Card ref={cardRef} className={cn("relative overflow-hidden", className)}>
      {gradient && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: gradient,
          }}
        />
      )}
      <CardContent className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{formattedDisplayValue}</h3>
              {change !== undefined && change !== 0 && (
                <span className={cn("text-sm font-medium", trendColors[trend])}>
                  {trendIcons[trend]} {Math.abs(change)}%
                </span>
              )}
            </div>
          </div>
          {Icon && (
            <div className="p-2 rounded-lg bg-[#0a9396]/10">
              <Icon className="h-5 w-5 text-[#0a9396]" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

