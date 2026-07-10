"use client";

import { InputHTMLAttributes, useId } from "react";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label?: string;
}

export function Toggle({ label, id, ...props }: ToggleProps) {
  const uid = useId();
  const inputId = id || uid;

  return (
    <label className="group inline-flex items-center gap-3 cursor-pointer">
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input
          type="checkbox"
          id={inputId}
          className="peer sr-only"
          {...props}
        />
        <span
          className="absolute inset-0 rounded-full transition-colors duration-[500ms] motion-safe:peer-checked:bg-avocado-flesh bg-line"
          style={{ transitionTimingFunction: "var(--bezier-spring)" }}
        />
        <span
          className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-md transition-all duration-[500ms] motion-safe:peer-checked:translate-x-5 motion-safe:peer-checked:scale-[1.15] motion-safe:peer-active:scale-90"
          style={{ transitionTimingFunction: "var(--bezier-spring)" }}
        />
      </span>
      {label && (
        <span className="text-sm text-surface select-none">{label}</span>
      )}
    </label>
  );
}
