"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

type GradientVariant = "flesh-skin" | "pit-skin";

interface GlassCardProps {
  children: ReactNode;
  gradientVariant?: GradientVariant;
  className?: string;
  staggerIndex?: number;
  /** Element that overflows the card boundary (~40–60% outside) */
  floatingChild?: ReactNode;
  floatingPosition?: "top-left" | "top-right";
  /** Override floating position with custom Tailwind classes */
  floatingClass?: string;
  maxTilt?: number;
  perspective?: number;
}

const gradientClasses: Record<GradientVariant, string> = {
  "flesh-skin": "bg-gradient-flesh-skin--lit",
  "pit-skin": "bg-gradient-pit-skin--lit",
};

const blobVariants: Record<GradientVariant, string> = {
  "flesh-skin": "glass-blob--flesh",
  "pit-skin": "glass-blob--pit",
};

const floatingPositions: Record<string, string> = {
  "top-left": "-top-8 -left-8",
  "top-right": "-top-8 -right-8",
};

export function GlassCard({
  children,
  gradientVariant = "flesh-skin",
  className = "",
  staggerIndex = 0,
  floatingChild,
  floatingPosition = "top-left",
  floatingClass,
  maxTilt = 6,
  perspective = 800,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shadowX: 0, shadowY: 0 });
  const [hovering, setHovering] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  /* ---------- staggered entrance ---------- */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [staggerIndex]);

  /* ---------- entrance style ---------- */
  const rootStyle: React.CSSProperties = {
    opacity: 0,
    transform: `translateY(24px)`,
    transition: prefersReducedMotion
      ? "none"
      : `opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerIndex * 80}ms,
         transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerIndex * 80}ms`,
  };
  if (entered) {
    rootStyle.opacity = 1;
    rootStyle.transform = `translateY(0)`;
  }

  /* ---------- hover 3D tilt ---------- */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * maxTilt;
      const tiltY = (0.5 - x) * maxTilt;
      const shadowX = (x - 0.5) * 16;
      const shadowY = (y - 0.5) * 16;
      setTilt({ x: tiltX, y: tiltY, shadowX, shadowY });
      setHovering(true);
    },
    [maxTilt, prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (prefersReducedMotion) return;
    setTilt({ x: 0, y: 0, shadowX: 0, shadowY: 0 });
    setHovering(false);
  }, [prefersReducedMotion]);

  const tiltStyle: React.CSSProperties = entered
    ? {
        transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        boxShadow: hovering
          ? `${tilt.shadowX}px ${tilt.shadowY}px 32px rgba(35, 43, 28, 0.14)`
          : "0 20px 60px -10px rgba(35, 43, 28, 0.4)",
        transition: hovering
          ? "box-shadow 0.1s linear, transform 0.1s linear"
          : `box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
             transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }
    : {};

  /* ---------- floating child parallax ---------- */
  const floatStyle: React.CSSProperties = hovering
    ? {
        transform: `translate(${-tilt.y * 4}px, ${tilt.x * 4}px)`,
        transition: "transform 0.1s linear",
      }
    : {
        transition: `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      };

  const blobClass = blobVariants[gradientVariant];
  const posClass = floatingClass || floatingPositions[floatingPosition] || floatingPositions["top-left"];

  return (
    <div
      ref={ref}
      className={`relative ${gradientClasses[gradientVariant]} ${className}`}
      style={rootStyle}
    >
      {/* atmospheric blob */}
      <div className={`glass-blob ${blobClass} -top-20 -right-20`} />

      {/* glass surface */}
      <div
        className={`rounded-3xl ${floatingChild ? "overflow-visible" : "overflow-hidden"} relative`}
      >
        <div
          className={`glass-surface p-8`}
          style={tiltStyle}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {children}
        </div>
      </div>

      {/* floating overlay element (breaks card boundary) */}
      {floatingChild && (
        <div
          className={`absolute ${posClass} z-10 ${entered ? "glass-float-entrance" : ""}`}
          style={{
            ...floatStyle,
            filter: "drop-shadow(0 8px 24px rgba(35, 43, 28, 0.35))",
          }}
        >
          {floatingChild}
        </div>
      )}
    </div>
  );
}
