import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "glass-strong" | "double-bezel" | "double-bezel-strong";
}

const outer: Record<string, string> = {
  default: "rounded-xl bg-surface border border-line",
  glass: "glass-card",
  "glass-strong": "glass-card-strong",
  "double-bezel": "double-bezel",
  "double-bezel-strong": "double-bezel-strong",
};

const inner: Record<string, string> = {
  "double-bezel": "double-bezel-inner",
  "double-bezel-strong": "double-bezel-strong-inner",
};

export function Card({ children, className = "", variant = "glass" }: CardProps) {
  const hasInner = variant === "double-bezel" || variant === "double-bezel-strong";

  const outerClass = `${outer[variant] || outer.glass} p-4 ${className}`;

  if (hasInner) {
    return (
      <div className={outer[variant]}>
        <div className={`${inner[variant]} ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return <div className={outerClass}>{children}</div>;
}
