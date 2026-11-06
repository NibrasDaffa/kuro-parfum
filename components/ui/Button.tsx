import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes } from "react";

export function buttonClass(variant: "primary" | "outline" = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
    variant === "primary" && "bg-accent text-bg hover:bg-accent-light",
    variant === "outline" && "border border-accent bg-transparent text-accent hover:bg-accent hover:text-bg",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
