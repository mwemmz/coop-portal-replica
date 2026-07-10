import { ReactNode } from "react";

type Tone = "success" | "pending" | "info" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-surface/20 text-surface",
  pending: "bg-surface/15 text-surface/80",
  info: "bg-surface/15 text-surface",
  danger: "bg-red-500/20 text-red-200",
  neutral: "bg-surface/10 text-surface/60",
};

const toneLabels: Partial<Record<Tone, string>> = {
  success: "Active",
  pending: "Pending",
  info: "Info",
  danger: "Action needed",
  neutral: "—",
};

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toUpperCase();
  if (["PAID", "ACTIVE", "COMPLETED", "SUCCESS"].includes(s)) return "success";
  if (["PENDING", "CONFIRMED"].includes(s)) return "pending";
  if (["DISPATCHED"].includes(s)) return "info";
  if (["FAILED", "CANCELLED"].includes(s)) return "danger";
  return "neutral";
}

export { toneLabels };
