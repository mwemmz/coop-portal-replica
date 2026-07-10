import { ReactNode } from "react";

interface GlassBadgeProps {
  children: ReactNode;
  className?: string;
  /** Optional icon shown before text */
  icon?: ReactNode;
}

export function GlassBadge({ children, className = "", icon }: GlassBadgeProps) {
  return (
    <span className={`glass-badge ${className}`}>
      {icon && <span className="shrink-0 opacity-70">{icon}</span>}
      {children}
    </span>
  );
}
