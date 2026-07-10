import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-light" | "ghost-pit" | "solid-white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  trailingIcon?: ReactNode;
}

const baseMotion =
  "transition-all duration-[400ms] motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97]";
const baseMotionDisabled =
  "disabled:opacity-50 disabled:motion-safe:hover:scale-100 disabled:motion-safe:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-pit text-white hover:bg-[#8f5523] motion-safe:hover:shadow-[0_8px_24px_rgba(156,85,35,0.28)]",
  secondary:
    "border-2 border-white/30 text-surface hover:bg-white/10 motion-safe:hover:shadow-[0_8px_24px_rgba(244,240,228,0.08)]",
  "ghost-light":
    "border-2 border-surface text-surface hover:bg-surface/10 motion-safe:hover:shadow-[0_8px_24px_rgba(244,240,228,0.10)]",
  "ghost-pit":
    "border-2 border-pit text-surface hover:bg-pit hover:text-white motion-safe:hover:shadow-[0_8px_24px_rgba(156,85,35,0.2)]",
  "solid-white":
    "bg-white text-surface hover:bg-white/90 motion-safe:hover:shadow-[0_8px_24px_rgba(156,85,35,0.18)]",
};

export function Button({ variant = "primary", className = "", children, trailingIcon, ...props }: ButtonProps) {
  return (
    <button
      className={`group relative inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-lg font-sans font-semibold text-sm ${baseMotion} ${baseMotionDisabled} ${variants[variant]} ${className}`}
      style={{ transitionTimingFunction: "var(--bezier-snappy)" }}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {trailingIcon && (
          <span className="inline-block transition-transform duration-[400ms] group-hover:translate-x-1 group-hover:-translate-y-[1px]" style={{ transitionTimingFunction: "var(--bezier-spring)" }}>
            {trailingIcon}
          </span>
        )}
      </span>
    </button>
  );
}
