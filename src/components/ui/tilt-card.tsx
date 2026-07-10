"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  staggerIndex?: number;
  maxTilt?: number;
  perspective?: number;
}

export function TiltCard({
  children,
  className = "",
  staggerIndex = 0,
  maxTilt = 6,
  perspective = 800,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: `translateY(24px)`,
    transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)`,
    transitionDelay: `${staggerIndex * 80}ms`,
  });
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          setStyle((prev) => ({
            ...prev,
            opacity: 1,
            transform: `translateY(0)`,
          }));
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [staggerIndex]);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!ref.current || prefersReducedMotion) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * maxTilt;
      const tiltY = (0.5 - x) * maxTilt;
      const shadowX = (x - 0.5) * 16;
      const shadowY = (y - 0.5) * 16;

      setStyle((prev) => ({
        ...prev,
        transform: entered
          ? `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
          : prev.transform,
        boxShadow: entered
          ? `${shadowX}px ${shadowY}px 32px rgba(35, 43, 28, 0.14)`
          : undefined,
        transition: `box-shadow 0.1s linear, transform 0.1s linear`,
      }));
    },
    [maxTilt, perspective, entered, prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (prefersReducedMotion) return;
    setStyle((prev) => ({
      ...prev,
      transform: entered ? `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)` : prev.transform,
      boxShadow: entered ? undefined : prev.boxShadow,
      transition: `box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
    }));
  }, [perspective, entered, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
