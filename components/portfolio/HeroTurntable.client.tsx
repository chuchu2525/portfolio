"use client";

import { useEffect, useRef, useState } from "react";
import { getSkillScore, maxRadarScore, skillAttributes } from "@/lib/portfolio-data";
import { buildRadarGeometry, getHeroAxisStyle, heroRadarRadius, radarCenter } from "./radar";
import styles from "./HeroTurntable.module.css";
import { cn } from "./styles";

const heroRadarGeometry = buildRadarGeometry({
  items: skillAttributes,
  getScore: (attribute) => getSkillScore(attribute.id),
  maxScore: maxRadarScore,
  pointRadius: heroRadarRadius
});

function HeroRadar() {
  return (
    <svg className={styles.radar} viewBox="0 0 320 320" aria-hidden="true">
      {heroRadarGeometry.rings.map((ring) => (
        <polygon
          className={styles.radarRing}
          key={ring.ratio}
          points={ring.pointsString}
        />
      ))}
      <polygon className={styles.radarPaper} points={heroRadarGeometry.outerPointsString} />
      <polygon className={styles.radarFill} points={heroRadarGeometry.scorePointsString} />
      {heroRadarGeometry.axes.map(({ item, point }) => (
        <line key={item.id} x1={radarCenter} y1={radarCenter} x2={point.x} y2={point.y} />
      ))}
    </svg>
  );
}

export function HeroTurntable() {
  const [isHeroRadarOpen, setIsHeroRadarOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isHeroRadarOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !(event.target instanceof Node)) {
        return;
      }

      if (!buttonRef.current?.contains(event.target)) {
        setIsHeroRadarOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isHeroRadarOpen]);

  return (
    <button
      ref={buttonRef}
      className={cn(
        styles.turntable,
        "relative aspect-square w-[min(100%,420px)] cursor-pointer justify-self-center rounded-xl border-[5px] border-[#343434] bg-[#111] shadow-[0_28px_60px_rgba(0,0,0,0.55),inset_0_2px_8px_rgba(255,255,255,0.07)] outline-none focus-visible:ring-4 focus-visible:ring-[rgba(255,210,69,0.55)] md:w-[min(100%,340px)] lg:w-[min(100%,520px)]"
      )}
      type="button"
      aria-label="スキルレーダーを表示"
      aria-pressed={isHeroRadarOpen}
      data-radar-open={isHeroRadarOpen}
      onClick={() => setIsHeroRadarOpen((current) => !current)}
    >
      <div className="absolute inset-[8%] rounded-full bg-[#0a0a0a]" />
      <div className={cn(styles.grooves, "absolute inset-[9%] z-[1] rounded-full shadow-[0_18px_34px_rgba(0,0,0,0.7)]")}>
        <div className={cn(styles.shine, "absolute inset-0 rounded-[inherit]")} />
      </div>
      <div className={cn(styles.centerLabel, "pointer-events-none absolute z-[2] grid place-items-center rounded-full")}>
        <span className={styles.labelTop}>YUU&apos;s</span>
        <span className={styles.labelBottom}>SKILL</span>
      </div>
      <div className={cn(styles.radarSurface, "pointer-events-none absolute inset-[10.5%] z-[3] grid place-items-center rounded-full")}>
        <HeroRadar />
      </div>
      <span className={cn(styles.spindle, "pointer-events-none absolute z-[4] size-[18px] rounded-full border border-[#3d2f00] bg-[radial-gradient(circle_at_35%_30%,#fff2a5,var(--yellow-2)_54%,#4a3900)]")} />
      <div className="pointer-events-none absolute inset-[10.5%] z-[5] rounded-full" aria-hidden="true">
        {skillAttributes.map((attribute, index) => (
          <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded border border-[rgba(255,210,69,0.28)] bg-[rgba(7,7,7,0.54)] px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-[#f0ece5] shadow-[0_5px_14px_rgba(0,0,0,0.32)]" key={attribute.id} style={getHeroAxisStyle(index, skillAttributes.length)}>
            {attribute.label}
          </span>
        ))}
      </div>
      <div className={cn(styles.axisCaption, "absolute right-[7%] bottom-[7%] z-[6] flex gap-2.5 whitespace-nowrap text-[10px] font-extrabold tracking-[0.12em] text-[var(--muted)]")} aria-hidden="true">
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">HOVER / TAP</span>
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">10 ATTRIBUTES</span>
      </div>
    </button>
  );
}
