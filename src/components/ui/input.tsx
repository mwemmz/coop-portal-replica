import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-surface">
        {label}
      </label>
      <input
        id={id}
        className={`min-h-[44px] rounded-lg border border-line bg-surface px-4 py-2 text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-avocado-flesh ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
