"use client";
import Link from "next/link";
import { useState } from "react";
import {
  skillAttributes,
  getSkillScore,
  getContributingProjects,
  getAttributeById,
  maxRadarScore,
  type SkillAttributeId,
} from "@/lib/portfolio-data";
import { buildRadarGeometry } from "./radar";
import { ChipButton } from "./shared";
const radar = buildRadarGeometry({
  items: skillAttributes,
  getScore: (item) => getSkillScore(item.id),
  maxScore: maxRadarScore,
  pointRadius: 112,
  labelRatio: 1.25,
});
export function SkillMatrix() {
  const [active, setActive] = useState<SkillAttributeId>("frontend");
  const attribute = getAttributeById(active);
  const related = getContributingProjects(active);
  return (
    <div id="matrix" className="mt-6 border-t border-[var(--line)] pt-6">
      <p className="text-xs leading-7 text-[var(--muted)]">
        10の領域を、掲載した経験から集計しています。経験ありは1、キャッチアップ中は0.5。表示上限は
        {maxRadarScore}です。
      </p>
      <div
        className="mt-5 flex flex-wrap gap-2"
        aria-label="経験を確認する領域"
      >
        {skillAttributes.map((item) => (
          <ChipButton
            key={item.id}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          >
            {item.displayName}
          </ChipButton>
        ))}
      </div>
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[.8fr_1fr]">
        <svg
          viewBox="0 0 320 320"
          role="img"
          aria-labelledby="radar-title radar-description"
          className="mx-auto w-full max-w-[360px]"
        >
          <title id="radar-title">10領域の経験データ</title>
          <desc id="radar-description">
            {skillAttributes
              .map((item) => `${item.displayName} ${getSkillScore(item.id)}`)
              .join("、")}
          </desc>
          {radar.rings.map((r) => (
            <polygon
              key={r.ratio}
              points={r.pointsString}
              fill="none"
              stroke="var(--line)"
            />
          ))}
          {radar.axes.map((axis) => (
            <line
              key={axis.item.id}
              x1="160"
              y1="160"
              x2={axis.point.x}
              y2={axis.point.y}
              stroke="var(--line)"
            />
          ))}
          <polygon
            points={radar.scorePointsString}
            fill="#ffdf0066"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          {radar.scorePoints.map((point) => (
            <g key={point.item.id}>
              <circle
                cx={point.point.x}
                cy={point.point.y}
                r={point.item.id === active ? 4 : 2.5}
                fill={point.item.id === active ? "var(--ink)" : "var(--yellow)"}
                stroke="var(--ink)"
              />
              <text
                x={point.labelPoint.x}
                y={point.labelPoint.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fill="var(--muted)"
              >
                {point.item.shortName}
              </text>
            </g>
          ))}
        </svg>
        <div aria-live="polite">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-[-.04em]">
              {attribute.displayName}
            </h3>
            <span className="font-mono text-xs">
              {getSkillScore(active)}{" "}
              <span className="text-[var(--muted)]">/ {maxRadarScore}</span>
            </span>
          </div>
          <p className="mt-3 text-xs leading-7 text-[var(--muted)]">
            {attribute.description}
          </p>
          <ul className="mt-5 divide-y divide-[var(--line)]">
            {related.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}/`}
                  className="flex min-h-14 items-center justify-between gap-4 py-3 text-xs hover:underline"
                >
                  <span>{project.title}</span>
                  <span className="shrink-0 text-[10px] text-[var(--muted)]">
                    {project.attributes.find((a) => a.id === active)?.level ===
                    "experienced"
                      ? "経験あり / 1"
                      : "キャッチアップ中 / 0.5"}{" "}
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {related.length === 0 && (
            <p className="mt-5 text-xs">この領域の経験は、今後追加します。</p>
          )}
        </div>
      </div>
    </div>
  );
}
