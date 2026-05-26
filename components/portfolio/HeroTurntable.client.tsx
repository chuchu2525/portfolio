"use client";

import { useEffect, useRef, useState } from "react";
import { getSkillScore, maxRadarScore, skillAttributes } from "@/lib/portfolio-data";
import { buildRadarGeometry, getHeroAxisStyle, heroRadarRadius, radarCenter } from "./radar";

const longPressDelayMs = 280;
const longPressMoveTolerancePx = 14;

const heroRadarGeometry = buildRadarGeometry({
  items: skillAttributes,
  getScore: (attribute) => getSkillScore(attribute.id),
  maxScore: maxRadarScore,
  pointRadius: heroRadarRadius
});

function HeroRadar() {
  return (
    <svg className="hero-radar" viewBox="0 0 320 320" aria-hidden="true">
      {heroRadarGeometry.rings.map((ring) => (
        <polygon
          className="hero-radar-ring"
          key={ring.ratio}
          points={ring.pointsString}
        />
      ))}
      <polygon className="radar-paper" points={heroRadarGeometry.outerPointsString} />
      <polygon className="radar-fill" points={heroRadarGeometry.scorePointsString} />
      {heroRadarGeometry.axes.map(({ item, point }) => (
        <line key={item.id} x1={radarCenter} y1={radarCenter} x2={point.x} y2={point.y} />
      ))}
    </svg>
  );
}

export function HeroTurntable() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [isHeroRadarLatchedOpen, setIsHeroRadarLatchedOpen] = useState(false);
  const [isHeroRadarPreviewOpen, setIsHeroRadarPreviewOpen] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const query = window.matchMedia("(hover: none) and (pointer: coarse)");
    const syncPointerMode = () => setIsCoarsePointer(query.matches);

    syncPointerMode();
    query.addEventListener("change", syncPointerMode);

    return () => query.removeEventListener("change", syncPointerMode);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  const clearHoldTimer = () => {
    if (!holdTimerRef.current) {
      return;
    }

    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  };

  const resetTouchPreview = () => {
    clearHoldTimer();
    activePointerIdRef.current = null;
    pointerStartRef.current = null;
    setIsHeroRadarPreviewOpen(false);
  };

  const isHeroRadarOpen = isHeroRadarLatchedOpen || isHeroRadarPreviewOpen;

  return (
    <button
      className="hero-turntable relative aspect-square w-[min(100%,420px)] cursor-pointer justify-self-center rounded-xl border-[5px] border-[#343434] bg-[#111] shadow-[0_28px_60px_rgba(0,0,0,0.55),inset_0_2px_8px_rgba(255,255,255,0.07)] outline-none focus-visible:ring-4 focus-visible:ring-[rgba(255,210,69,0.55)] md:w-[min(100%,340px)] lg:w-[min(100%,520px)]"
      type="button"
      aria-label="スキルレーダーを表示"
      aria-pressed={isHeroRadarLatchedOpen}
      data-radar-open={isHeroRadarOpen}
      onClick={(event) => {
        if (isCoarsePointer) {
          event.preventDefault();
          return;
        }

        setIsHeroRadarLatchedOpen((current) => !current);
      }}
      onPointerDown={(event) => {
        if (!isCoarsePointer || (event.pointerType !== "touch" && event.pointerType !== "pen")) {
          return;
        }

        resetTouchPreview();
        activePointerIdRef.current = event.pointerId;
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
        holdTimerRef.current = setTimeout(() => {
          setIsHeroRadarPreviewOpen(true);
        }, longPressDelayMs);
      }}
      onPointerMove={(event) => {
        if (activePointerIdRef.current !== event.pointerId || !pointerStartRef.current) {
          return;
        }

        const deltaX = event.clientX - pointerStartRef.current.x;
        const deltaY = event.clientY - pointerStartRef.current.y;

        if (Math.hypot(deltaX, deltaY) > longPressMoveTolerancePx) {
          resetTouchPreview();
        }
      }}
      onPointerUp={(event) => {
        if (activePointerIdRef.current !== event.pointerId) {
          return;
        }

        resetTouchPreview();
      }}
      onPointerCancel={(event) => {
        if (activePointerIdRef.current !== event.pointerId) {
          return;
        }

        resetTouchPreview();
      }}
      onContextMenu={(event) => {
        if (isCoarsePointer) {
          event.preventDefault();
        }
      }}
    >
      <div className="absolute inset-[8%] rounded-full bg-[#0a0a0a]" />
      <div className="record-grooves motion-safe-spin absolute inset-[9%] z-[1] rounded-full shadow-[0_18px_34px_rgba(0,0,0,0.7)]">
        <div className="record-shine absolute inset-0 rounded-[inherit]" />
      </div>
      <div className="record-center-label pointer-events-none absolute z-[2] grid place-items-center rounded-full">
        <span className="record-label-top">YUU&apos;s</span>
        <span className="record-label-bottom">SKILL</span>
      </div>
      <div className="record-radar-surface pointer-events-none absolute inset-[10.5%] z-[3] grid place-items-center rounded-full">
        <HeroRadar />
      </div>
      <span className="record-spindle pointer-events-none absolute z-[4] size-[18px] rounded-full border border-[#3d2f00] bg-[radial-gradient(circle_at_35%_30%,#fff2a5,var(--yellow-2)_54%,#4a3900)]" />
      <div className="pointer-events-none absolute inset-[10.5%] z-[5] rounded-full" aria-hidden="true">
        {skillAttributes.map((attribute, index) => (
          <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded border border-[rgba(255,210,69,0.28)] bg-[rgba(7,7,7,0.54)] px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-[#f0ece5] shadow-[0_5px_14px_rgba(0,0,0,0.32)]" key={attribute.id} style={getHeroAxisStyle(index, skillAttributes.length)}>
            {attribute.label}
          </span>
        ))}
      </div>
      <div className="hero-axis-caption absolute right-[7%] bottom-[7%] z-[6] flex gap-2.5 whitespace-nowrap text-[10px] font-extrabold tracking-[0.12em] text-[var(--muted)]" aria-hidden="true">
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">HOVER / HOLD</span>
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">10 ATTRIBUTES</span>
      </div>
    </button>
  );
}
