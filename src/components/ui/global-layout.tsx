"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { VideoBg } from "./video-bg";

export function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <VideoBg>{children}</VideoBg>
    </CartProvider>
  );
}
