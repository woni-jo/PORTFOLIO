"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  once?: boolean;
};

export default function TypewriterText({
  text,
  className,
  speed = 34,
  startDelay = 140,
  once = true,
}: TypewriterTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const chars = useMemo(() => Array.from(text), [text]);
  const [isInView, setIsInView] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          return;
        }

        if (!once) {
          setIsInView(false);
          setTypedCount(0);
          setHasPlayed(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  useEffect(() => {
    if (!isInView) return;
    if (once && hasPlayed) return;

    let typeTimer: ReturnType<typeof setInterval> | null = null;
    const startTimer = setTimeout(() => {
      typeTimer = setInterval(() => {
        setTypedCount((prev) => {
          const next = prev + 1;

          if (next >= chars.length) {
            if (typeTimer) clearInterval(typeTimer);
            setHasPlayed(true);
            return chars.length;
          }

          return next;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [chars.length, hasPlayed, isInView, once, speed, startDelay]);

  const typedText = chars.slice(0, typedCount).join("");
  const showCursor = typedCount < chars.length;

  return (
    <p ref={ref} className={className} aria-live="polite">
      {typedText}
      <span className={`ml-0.5 inline-block ${showCursor ? "animate-pulse opacity-100" : "opacity-0"}`}>|</span>
    </p>
  );
}
