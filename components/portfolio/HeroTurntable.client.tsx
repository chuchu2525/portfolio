"use client";

import { useState } from "react";
import { getSkillScore, maxRadarScore, skillAttributes } from "@/lib/portfolio-data";
import { getHeroAxisStyle, getPoint, heroRadarRadius, pointsToString, radarCenter } from "./radar";

function HeroRadar() {
  const total = skillAttributes.length;
  const points = skillAttributes.map((attribute, index) => {
    const ratio = Math.min(getSkillScore(attribute.id) / maxRadarScore, 1);
    return getPoint(index, total, ratio, heroRadarRadius);
  });
  const outerPoints = skillAttributes.map((_, index) => getPoint(index, total, 1, heroRadarRadius));

  return (
    <svg className="hero-radar" viewBox="0 0 320 320" aria-hidden="true">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          className="hero-radar-ring"
          key={ratio}
          points={pointsToString(skillAttributes.map((_, index) => getPoint(index, total, ratio, heroRadarRadius)))}
        />
      ))}
      <polygon className="radar-paper" points={pointsToString(outerPoints)} />
      <polygon className="radar-fill" points={pointsToString(points)} />
      {skillAttributes.map((_, index) => {
        const point = outerPoints[index];
        return <line key={index} x1={radarCenter} y1={radarCenter} x2={point.x} y2={point.y} />;
      })}
    </svg>
  );
}

export function HeroTurntable() {
  const [isHeroRadarOpen, setIsHeroRadarOpen] = useState(false);

  return (
    <button
      className="hero-turntable relative aspect-square w-[min(100%,420px)] cursor-pointer justify-self-center rounded-xl border-[5px] border-[#343434] bg-[#111] shadow-[0_28px_60px_rgba(0,0,0,0.55),inset_0_2px_8px_rgba(255,255,255,0.07)] outline-none focus-visible:ring-4 focus-visible:ring-[rgba(255,210,69,0.55)] md:w-[min(100%,340px)] lg:w-[min(100%,520px)]"
      type="button"
      aria-label="スキルレーダーを表示"
      aria-pressed={isHeroRadarOpen}
      data-radar-open={isHeroRadarOpen}
      onClick={() => setIsHeroRadarOpen((current) => !current)}
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
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">HOVER / TAP</span>
        <span className="rounded-full border border-[rgba(185,181,197,0.28)] bg-[rgba(7,7,7,0.42)] px-2 py-1">10 ATTRIBUTES</span>
      </div>
    </button>
  );
}
