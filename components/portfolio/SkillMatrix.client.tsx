"use client";

import { useMemo, useState } from "react";
import {
  getAttributeById,
  getContributingProjects,
  getSkillScore,
  maxRadarScore,
  skillAttributes,
  type SkillAttributeId
} from "@/lib/portfolio-data";
import { getPoint, pointsToString, radarCenter } from "./radar";
import { ChipButton } from "./shared";
import { cn, h2Class, paragraphClass, sectionClass, sectionEyebrowClass, sectionHeadClass } from "./styles";

function RadarChart({
  activeId,
  onSelect
}: {
  activeId: SkillAttributeId;
  onSelect: (id: SkillAttributeId) => void;
}) {
  const total = skillAttributes.length;
  const outerPoints = skillAttributes.map((_, index) => getPoint(index, total));
  const scorePoints = skillAttributes.map((attribute, index) => {
    const ratio = Math.min(getSkillScore(attribute.id) / maxRadarScore, 1);
    return getPoint(index, total, ratio);
  });

  return (
    <svg className="matrix-radar" viewBox="0 0 320 320" role="img" aria-label="Skill radar">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          className="radar-ring"
          points={pointsToString(skillAttributes.map((_, index) => getPoint(index, total, ratio)))}
        />
      ))}
      {outerPoints.map((point, index) => (
        <line key={skillAttributes[index].id} x1={radarCenter} y1={radarCenter} x2={point.x} y2={point.y} />
      ))}
      <polygon className="skill-polygon" points={pointsToString(scorePoints)} />
      {scorePoints.map((point, index) => {
        const attribute = skillAttributes[index];
        const outerPoint = getPoint(index, total, 1.14);

        return (
          <g
            className="svg-button"
            key={attribute.id}
            role="button"
            tabIndex={0}
            aria-label={`${attribute.displayName}を表示`}
            onClick={() => onSelect(attribute.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(attribute.id);
              }
            }}
          >
            <circle
              className={activeId === attribute.id ? "point active" : "point"}
              cx={point.x}
              cy={point.y}
              r="6"
            />
            <text x={outerPoint.x} y={outerPoint.y} textAnchor="middle" dominantBaseline="middle">
              {attribute.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function SkillMatrix() {
  const [activeSkillId, setActiveSkillId] = useState<SkillAttributeId>("frontend");

  const activeSkill = getAttributeById(activeSkillId);
  const activeProjects = useMemo(() => getContributingProjects(activeSkillId), [activeSkillId]);

  return (
    <section id="matrix" className={cn(sectionClass, "mx-auto grid max-w-[1280px] grid-cols-1 gap-[clamp(28px,5vw,64px)] lg:grid-cols-[minmax(300px,480px)_minmax(0,1fr)]")}>
      <aside className="self-start border-2 border-[var(--line)] bg-[repeating-radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.035)_0_1px,transparent_2px_5px),#121212] p-8">
        <div className={cn(sectionHeadClass, "mb-6")}>
          <span className={sectionEyebrowClass}>SPINDLE 10</span>
          <h2 className={h2Class}>Skill Matrix</h2>
        </div>
        <RadarChart activeId={activeSkillId} onSelect={setActiveSkillId} />
        <div className="flex flex-wrap gap-2">
          {skillAttributes.map((attribute) => (
            <ChipButton active={activeSkillId === attribute.id} key={attribute.id} onClick={() => setActiveSkillId(attribute.id)}>
              {attribute.label}
            </ChipButton>
          ))}
        </div>
      </aside>

      <div>
        <div className={cn(sectionHeadClass, "mb-6")}>
          <span className={sectionEyebrowClass}>FIELD NOTES</span>
          <h2 className={h2Class}>Field Notes</h2>
          <p className={paragraphClass}>
            スコアは経験データから集計します。経験ありは1.0、キャッチアップ中は0.5として扱い、
            最大値は設定で変更できるようにしています。
          </p>
        </div>
        <div className="denim-texture relative min-h-[300px] border-2 border-dashed border-[rgba(189,194,255,0.34)] p-[clamp(26px,4vw,42px)] shadow-[0_18px_34px_rgba(0,0,0,0.34)] before:pointer-events-none before:absolute before:inset-4 before:border before:border-[rgba(189,194,255,0.22)]">
          <span className="relative z-[1] mb-6 inline-flex max-w-[min(100%,520px)] border-2 border-[var(--rust)] bg-[rgba(147,0,10,0.62)] px-4 py-2.5 font-bold tracking-[0.08em] text-[var(--rust-soft)]">{activeSkill.displayName}</span>
          <div className="relative top-auto right-auto z-[1] mb-6 block w-[min(100%,220px)] rotate-1 border border-[var(--yellow-2)] bg-[#ffe08a] px-3 pt-6 pb-3 text-center text-[11px] leading-5 font-bold text-[#5d4900] shadow-[5px_7px_0_rgba(0,0,0,0.25)] before:absolute before:top-[-8px] before:left-1/2 before:size-3.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-[#5d4900] before:bg-[var(--bg)] lg:absolute lg:top-6 lg:right-[-18px] lg:w-[150px] lg:rotate-[5deg]">{activeSkill.garmentPart}</div>
          <p className="relative z-[1] m-0 mb-5 max-w-[720px] text-base leading-8 text-[var(--text)] sm:text-xl">{activeSkill.description}</p>
          <div className="relative z-[1] mb-6 inline-flex items-baseline gap-1.5 rounded border border-[rgba(255,210,69,0.5)] bg-[rgba(0,0,0,0.22)] px-3 py-2">
            <span className="text-[28px] font-extrabold text-[var(--yellow)]">{getSkillScore(activeSkill.id).toFixed(1)}</span>
            <small className="font-bold text-[var(--muted)]">/ {maxRadarScore}</small>
          </div>
          <div className="relative z-[1] grid gap-3.5">
            {activeSkill.stack.map((item) => (
              <div className="grid grid-cols-1 items-center gap-3.5 text-[13px] font-bold tracking-[0.04em] sm:grid-cols-[minmax(90px,150px)_1fr_48px]" key={item.name}>
                <span>{item.name}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.12)]">
                  <span className="block h-full bg-linear-to-r from-[var(--yellow)] to-[var(--rust-soft)]" style={{ width: `${item.level}%` }} />
                </span>
                <span>{item.level}</span>
              </div>
            ))}
          </div>
          <div className="relative z-[1] mt-7 flex flex-wrap gap-2">
            {activeProjects.map((project) => (
              <span className="inline-flex min-h-7 items-center rounded border border-[var(--line)] bg-[var(--panel-hi)] px-2 text-[11px]" key={project.id}>{project.title}</span>
            ))}
          </div>
        </div>

        <div className="relative mt-8 w-[min(100%,520px)] rotate-1 bg-[var(--paper)] bg-linear-to-b from-[rgba(255,255,255,0.4)] to-transparent p-8 text-[var(--paper-ink)] shadow-[12px_14px_0_rgba(0,0,0,0.28)] before:absolute before:top-3 before:right-3.5 before:left-3.5 before:border-t-2 before:border-dashed before:border-[rgba(37,35,33,0.42)] after:absolute after:right-3.5 after:bottom-3 after:left-3.5 after:border-t-2 after:border-dashed after:border-[rgba(37,35,33,0.42)]">
          <span className="block text-center text-[34px]">⌁</span>
          <h3 className="my-2 mb-6 text-center font-serif text-3xl tracking-[0.1em]">Care Instructions</h3>
          <dl className="grid">
            {[
              ["Material", "Experience Data"],
              ["Fit", "Static Export"],
              ["Maintenance", "Update Data First"],
              ["Warning", "Do Not Fake Scores"]
            ].map(([term, detail]) => (
              <div className="flex justify-between gap-3.5 border-t border-[rgba(37,35,33,0.18)] py-3" key={term}>
                <dt className="m-0 text-[13px] font-bold uppercase tracking-[0.12em]">{term}</dt>
                <dd className="m-0 text-[13px] font-bold uppercase tracking-[0.12em] last:text-[var(--rust)]">{detail}</dd>
              </div>
            ))}
          </dl>
          <div className="barcode mt-6 h-11 w-[140px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
