import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "light" | "dark";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const sizeStyles: Record<LogoSize, { wordmark: string; icon: string; gap: string }> = {
  sm: { wordmark: "text-xl", icon: "size-4", gap: "gap-1.5" },
  md: { wordmark: "text-3xl", icon: "size-6", gap: "gap-2.5" },
  lg: { wordmark: "text-5xl", icon: "size-9", gap: "gap-3.5" },
};

const variantStyles: Record<LogoVariant, string> = {
  light: "text-brand-cream",
  dark: "text-brand-midnight",
};

export function Logo({ size = "md", variant = "light", className }: LogoProps) {
  const sizing = sizeStyles[size];
  return (
    <span
      className={cn(
        "inline-flex items-center font-serif font-medium tracking-tight",
        sizing.gap,
        variantStyles[variant],
        className,
      )}
    >
      <Moon
        className={cn(sizing.icon, "-rotate-12 fill-brand-amber stroke-brand-amber")}
        aria-hidden="true"
      />
      <span className={sizing.wordmark}>Bedtime Library</span>
    </span>
  );
}
