"use client";

import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { itemCount } = useCart();

  return (
    <span className="flex items-center gap-1 text-surface hover:text-surface/80 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-pit text-white text-[10px] font-bold leading-none px-1">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </span>
  );
}
