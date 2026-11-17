"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import s from "./PortfolioArtwork.module.css";
export function HeroVisual({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      !window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    root.current?.style.setProperty(
      "--px",
      String((event.clientX - rect.left) / rect.width - 0.5),
    );
    root.current?.style.setProperty(
      "--py",
      String((event.clientY - rect.top) / rect.height - 0.5),
    );
  }
  function reset() {
    root.current?.style.setProperty("--px", "0");
    root.current?.style.setProperty("--py", "0");
  }
  return (
    <div
      ref={root}
      className={s.hero}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
