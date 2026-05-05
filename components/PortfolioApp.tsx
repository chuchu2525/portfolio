"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  getAttributeById,
  getContributingProjects,
  getSkillScore,
  maxRadarScore,
  projects,
  skillAttributes,
  type Project,
  type SkillAttributeId
} from "@/lib/portfolio-data";

const center = 160;
const radius = 136;
const heroRadius = 118;

const navLinkClass = "border-b-2 border-transparent py-1 hover:border-[var(--rust)] hover:text-[var(--yellow)] focus-visible:border-[var(--rust)] focus-visible:text-[var(--yellow)]";
const ticketClass = "inline-flex w-fit border border-dashed border-[rgba(255,178,182,0.65)] bg-[var(--rust)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--rust-soft)]";
const sectionClass = "px-[clamp(18px,5vw,72px)] py-[clamp(70px,9vw,124px)]";
const sectionHeadClass = "grid gap-3.5";
const sectionEyebrowClass = ticketClass;
const h2Class = "m-0 font-serif text-4xl leading-tight tracking-normal sm:text-5xl lg:text-6xl";
const paragraphClass = "m-0 max-w-[720px] text-base leading-8 text-[var(--muted)] sm:text-lg";
const chipBaseClass = "min-h-8 cursor-pointer rounded border px-3 text-[11px] font-bold tracking-[0.1em]";
const chipIdleClass = "border-[var(--line)] bg-[#242424] text-[var(--text)]";
const chipActiveClass = "border-[#574400] bg-[var(--yellow)] text-[#241a00]";
const tagClass = "inline-flex min-h-7 items-center rounded-full border border-[var(--line)] bg-[#303030] px-2.5 text-[11px] font-bold before:mr-2 before:block before:size-[7px] before:rounded-full before:bg-[var(--yellow)]";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function chipClass(active: boolean) {
  return cn(chipBaseClass, active ? chipActiveClass : chipIdleClass);
}

function buttonLinkClass(tone: "yellow" | "dark") {
  return cn(
    "inline-flex min-h-[50px] cursor-pointer items-center justify-center rounded-lg border px-6 text-[13px] font-bold tracking-[0.12em]",
    tone === "yellow"
      ? "border-[#574400] bg-linear-to-b from-[#ffe580] to-[var(--yellow)] text-[#241a00] shadow-[inset_0_1px_rgba(255,255,255,0.6),0_5px_0_rgba(0,0,0,0.38)]"
      : "border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-[inset_0_1px_rgba(255,255,255,0.08)]"
  );
}

function getPoint(index: number, total: number, ratio = 1, pointRadius = radius) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    x: center + Math.cos(angle) * pointRadius * ratio,
    y: center + Math.sin(angle) * pointRadius * ratio
  };
}

function pointsToString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function getHeroAxisStyle(index: number, total: number): CSSProperties {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    left: `${50 + Math.cos(angle) * 37}%`,
    top: `${50 + Math.sin(angle) * 37}%`
  };
}

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
        <line key={skillAttributes[index].id} x1={center} y1={center} x2={point.x} y2={point.y} />
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

function HeroRadar() {
  const total = skillAttributes.length;
  const points = skillAttributes.map((attribute, index) => {
    const ratio = Math.min(getSkillScore(attribute.id) / maxRadarScore, 1);
    return getPoint(index, total, ratio, heroRadius);
  });
  const outerPoints = skillAttributes.map((_, index) => getPoint(index, total, 1, heroRadius));

  return (
    <svg className="hero-radar" viewBox="0 0 320 320" aria-hidden="true">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          className="hero-radar-ring"
          key={ratio}
          points={pointsToString(skillAttributes.map((_, index) => getPoint(index, total, ratio, heroRadius)))}
        />
      ))}
      <polygon className="radar-paper" points={pointsToString(outerPoints)} />
      <polygon className="radar-fill" points={pointsToString(points)} />
      {skillAttributes.map((_, index) => {
        const point = outerPoints[index];
        return <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} />;
      })}
    </svg>
  );
}

function AttributeTags({ project }: { project: Project }) {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {project.attributes.map((attribute) => (
        <span className={tagClass} key={`${project.id}-${attribute.id}`}>
          {getAttributeById(attribute.id).displayName}
        </span>
      ))}
    </div>
  );
}

export function PortfolioApp() {
  const [activeSkillId, setActiveSkillId] = useState<SkillAttributeId>("frontend");
  const [activeFilter, setActiveFilter] = useState<SkillAttributeId | "all">("all");
  const [isHeroRadarOpen, setIsHeroRadarOpen] = useState(false);

  const activeSkill = getAttributeById(activeSkillId);
  const activeProjects = useMemo(() => getContributingProjects(activeSkillId), [activeSkillId]);
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) =>
      project.attributes.some((attribute) => attribute.id === activeFilter)
    );
  }, [activeFilter]);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const supportingProject = projects.find((project) => !project.featured) ?? projects[1];

  return (
    <>
      <header className="sticky top-0 z-50 grid min-h-[66px] grid-cols-1 items-center gap-7 border-b-2 border-dashed border-[rgba(189,194,255,0.35)] px-[clamp(18px,4vw,48px)] shadow-[0_4px_0_rgba(0,0,0,0.35)] [background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent),var(--denim)] sm:min-h-[84px] sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
        <a className="font-serif text-2xl font-extrabold italic text-[var(--yellow)] shadow-black [text-shadow:2px_2px_0_#020202]" href="#top">
          YUU&apos;s room
        </a>
        <nav className="hidden gap-[clamp(14px,2.6vw,30px)] font-serif text-[19px] lg:flex" aria-label="Primary">
          <a className={navLinkClass} href="#top">Home</a>
          <a className={navLinkClass} href="#matrix">Skills</a>
          <a className={navLinkClass} href="#archive">Projects</a>
          <a className={navLinkClass} href="#about">About</a>
          <a className={navLinkClass} href="#contact">Contact</a>
        </nav>
        <a className="hidden min-h-9 items-center justify-center justify-self-end rounded-full border border-[#493b00] bg-linear-to-b from-[#ffe279] to-[var(--yellow)] px-6 text-xs font-bold tracking-[0.18em] text-[#241a00] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_rgba(0,0,0,0.4)] sm:inline-flex" href="mailto:hello@example.com">
          Contact
        </a>
      </header>

      <main id="top">
        <section className="relative grid min-h-[calc(100vh-84px)] grid-cols-1 items-center gap-[clamp(28px,5vw,72px)] border-x border-dashed border-[rgba(189,194,255,0.25)] px-[clamp(18px,5vw,72px)] py-[clamp(48px,7vw,96px)] [background:linear-gradient(90deg,rgba(26,35,126,0.95),rgba(26,35,126,0.82)),repeating-linear-gradient(45deg,rgba(255,255,255,0.025)_0_2px,transparent_2px_5px)] before:absolute before:inset-y-0 before:left-[5.2vw] before:border-l before:border-dashed before:border-[rgba(189,194,255,0.32)] after:absolute after:inset-y-0 after:right-[5.2vw] after:border-l after:border-dashed after:border-[rgba(189,194,255,0.32)] md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)]">
          <div className="relative z-10 max-w-[760px]">
            <span className={ticketClass}>FULL-STACK WEB ENGINEER</span>
            <h1 className="my-6 max-w-[780px] font-serif text-[clamp(40px,6.4vw,88px)] leading-[0.98] tracking-normal text-[var(--text)] [text-shadow:3px_3px_0_rgba(0,0,0,0.42)]">
              課題を解決する、<span className="block italic text-[var(--yellow)]">利益をあげるエンジニア</span>
            </h1>
            <p className="m-0 max-w-[660px] border-l-[5px] border-[var(--yellow)] bg-[rgba(9,9,13,0.26)] py-3 pr-0 pl-5 text-base leading-8 text-[var(--muted)] sm:text-lg">
              UI実装、設計、改善を横断しながら、採用担当者にもエンジニアにも伝わる形で経験を整理するポートフォリオ。
              古着とレコードの質感を、情報構造と技術領域の見せ方に接続します。
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a className={buttonLinkClass("yellow")} href="#archive">View Projects</a>
              <a className={buttonLinkClass("dark")} href="#matrix">Skill Matrix</a>
            </div>
          </div>

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
        </section>

        <section className={cn(sectionClass, "mx-auto max-w-[1280px]")}>
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-[var(--line)] pb-4">
            <h2 className="m-0 font-serif text-4xl tracking-normal sm:text-5xl">Recent Patches</h2>
            <a className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--yellow)]" href="#archive">View Archive</a>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article className="relative grid min-h-[300px] content-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_18px_34px_rgba(0,0,0,0.32)] before:pointer-events-none before:absolute before:inset-2.5 before:rounded-md before:border-2 before:border-dashed before:border-[rgba(189,194,255,0.25)]">
              <div className="featured-patch-art absolute inset-0 opacity-15 lg:inset-y-0 lg:right-0 lg:left-[48%] lg:opacity-75" />
              <span className="absolute top-5 right-5 z-[2] border border-[rgba(255,178,182,0.55)] bg-[var(--rust)] px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[var(--rust-soft)]">FEATURED</span>
              <div className="relative z-[1]">
                <h3 className="m-0 mb-3 font-serif text-3xl tracking-normal text-[var(--yellow)]">{featuredProject.title}</h3>
                <p className="m-0 max-w-xl leading-7 text-[var(--muted)]">{featuredProject.description}</p>
              </div>
              <div className="relative z-[1] mt-7 flex flex-wrap gap-2">
                {featuredProject.techTags.map((tag) => (
                  <span className="inline-flex min-h-7 items-center rounded border border-[var(--line)] bg-[var(--panel-hi)] px-2 text-[11px]" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
            <article className="relative grid min-h-[300px] content-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_18px_34px_rgba(0,0,0,0.32)] before:pointer-events-none before:absolute before:inset-2.5 before:rounded-md before:border-2 before:border-dashed before:border-[rgba(189,194,255,0.25)]">
              <span className="material-dot-art relative z-[1] mb-5 size-13 rounded-full border border-[var(--line)]" />
              <h3 className="relative z-[1] m-0 mb-3 font-serif text-3xl tracking-normal text-[var(--yellow)]">{supportingProject.title}</h3>
              <p className="relative z-[1] m-0 leading-7 text-[var(--muted)]">{supportingProject.description}</p>
              <div className="relative z-[1] mt-7 flex flex-wrap gap-2">
                {supportingProject.techTags.map((tag) => (
                  <span className="inline-flex min-h-7 items-center rounded border border-[var(--line)] bg-[var(--panel-hi)] px-2 text-[11px]" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="matrix" className={cn(sectionClass, "mx-auto grid max-w-[1280px] grid-cols-1 gap-[clamp(28px,5vw,64px)] lg:grid-cols-[minmax(300px,480px)_minmax(0,1fr)]")}>
          <aside className="self-start border-2 border-[var(--line)] bg-[repeating-radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.035)_0_1px,transparent_2px_5px),#121212] p-8">
            <div className={cn(sectionHeadClass, "mb-6")}>
              <span className={sectionEyebrowClass}>SPINDLE 10</span>
              <h2 className={h2Class}>Skill Matrix</h2>
            </div>
            <RadarChart activeId={activeSkillId} onSelect={setActiveSkillId} />
            <div className="flex flex-wrap gap-2">
              {skillAttributes.map((attribute) => (
                <button className={chipClass(activeSkillId === attribute.id)} key={attribute.id} type="button" onClick={() => setActiveSkillId(attribute.id)}>
                  {attribute.label}
                </button>
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

        <section id="archive" className={cn(sectionClass, "border-y border-[#252525] bg-[#101010]")}>
          <div className={cn(sectionHeadClass, "mx-auto mb-8 max-w-[820px] justify-items-center text-center")}>
            <span className={sectionEyebrowClass}>PROJECT CRATE</span>
            <h2 className={h2Class}>Selected Works</h2>
            <p className={paragraphClass}>
              実績や経験をレコードスリーブとして並べ、関係する技術領域でフィルタできる構成にしています。
            </p>
          </div>
          <div className="mx-auto mb-8 flex flex-wrap justify-center gap-2">
            <button className={chipClass(activeFilter === "all")} type="button" onClick={() => setActiveFilter("all")}>ALL</button>
            {skillAttributes.map((attribute) => (
              <button className={chipClass(activeFilter === attribute.id)} key={attribute.id} type="button" onClick={() => setActiveFilter(attribute.id)}>
                {attribute.label}
              </button>
            ))}
          </div>
          <div className="relative mx-auto grid w-[min(1240px,100%)] grid-cols-1 gap-6 border-b-[34px] border-[#151515] bg-[linear-gradient(90deg,#161616,#303030_4%,#151515_9%,#151515_91%,#303030_96%,#161616)] p-8 pb-14 shadow-[inset_0_-14px_22px_rgba(0,0,0,0.9)] lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <article className="group relative min-h-[390px] overflow-hidden border-2 border-[var(--line)] bg-[var(--panel)] shadow-[0_18px_28px_rgba(0,0,0,0.42)]" key={project.id}>
                <div className="record-sleeve-art absolute top-4 left-1/2 z-0 aspect-square w-[62%] -translate-x-1/2 rounded-full transition-transform duration-300 group-hover:-translate-y-7 group-hover:rotate-[15deg]" />
                <div className="cover-art absolute inset-x-4 top-4 h-[150px] border border-[var(--line)]" data-code={project.coverCode}>
                  <span className="absolute top-3 right-3 border border-[rgba(255,178,182,0.4)] bg-[var(--rust)] px-2 py-1.5 text-[10px] font-bold text-[var(--rust-soft)]">{project.coverCode}</span>
                </div>
                <div className="relative z-[1] grid min-h-[inherit] content-end bg-linear-to-b from-transparent from-30% to-[rgba(32,32,32,0.98)] to-60% p-5">
                  <span className={ticketClass}>{project.role}</span>
                  <div className="relative top-auto right-auto mb-6 block w-[min(100%,220px)] rotate-1 border border-[var(--yellow-2)] bg-[#ffe08a] px-3 pt-6 pb-3 text-center text-[10px] leading-5 font-bold text-[#5d4900] shadow-[5px_7px_0_rgba(0,0,0,0.25)] before:absolute before:top-[-8px] before:left-1/2 before:size-3.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-[#5d4900] before:bg-[var(--bg)] sm:absolute sm:top-5 sm:right-4 sm:w-[122px] sm:rotate-[3deg]">
                    {project.attributes.map((attribute) => getAttributeById(attribute.id).label).join(" / ")}
                  </div>
                  <h3 className="m-0 mb-2.5 max-w-full font-serif text-[29px] tracking-normal text-[#dfe1ff] sm:max-w-[calc(100%-134px)]">{project.title}</h3>
                  <p className="m-0 leading-7 text-[var(--muted)]">{project.description}</p>
                  <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold tracking-[0.08em] text-[var(--yellow)]">
                    <span>{project.period}</span>
                    <span>{project.techTags.join(" / ")}</span>
                  </div>
                  <AttributeTags project={project} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className={cn(sectionClass, "about-texture mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[clamp(34px,6vw,72px)] lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)]")}>
          <div className="relative border-2 border-[var(--line)] bg-[var(--panel-hi)] p-4 shadow-[14px_14px_0_var(--denim)]">
            <span className="absolute top-0 right-0 z-[1] translate-x-4 -translate-y-1/2 border-2 border-[#241a00] bg-[var(--yellow)] px-3 py-1.5 text-xs font-bold tracking-[0.1em] text-[#241a00]">ISSUE 01</span>
            <div className="portrait-art aspect-[3/4]" aria-hidden="true" />
            <div className="mt-3.5 flex justify-between gap-3.5 border-t-2 border-[var(--line)] pt-3 text-[11px] font-bold tracking-[0.1em] text-[var(--muted)]">
              <span>VOL. XLII</span>
              <span>ANALOG CODEWORKS</span>
            </div>
          </div>
          <div className="grid gap-5">
            <span className="text-xs font-bold tracking-[0.2em] text-[var(--yellow)]">LINER NOTES</span>
            <h2 className="m-0 font-serif text-5xl leading-none tracking-normal sm:text-7xl">
              The Articulate <span className="italic text-[var(--yellow)]">Craftsman.</span>
            </h2>
            <div className="relative border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[8px_8px_0_#050505,8px_8px_0_2px_var(--line)] before:absolute before:top-8 before:left-[-13px] before:size-6 before:rounded-full before:border-2 before:border-[var(--bg)] before:bg-[var(--yellow)]">
              <p className="m-0 text-base leading-8 text-[var(--muted)] sm:text-lg">
                Webアプリを、ただ動くものではなく、使われながら改善できるものとして作ることを重視しています。
                画面の手触り、データの持ち方、リリース後の運用までをひと続きの品質として扱います。
              </p>
              <p className="mt-4 mb-0 text-base leading-8 text-[var(--muted)] sm:text-lg">
                古着の縫い目やレコードの溝のように、細部には作り手の判断が残ります。
                このサイトでは、その判断をスキルと経験の両方から読める形にします。
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className={cn(sectionClass, "mx-auto grid max-w-[1240px] gap-8 lg:flex lg:items-end lg:justify-between")}>
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[var(--yellow)]">CONTACT</span>
            <h2 className="mt-4 mb-0 max-w-[760px] font-serif text-4xl leading-tight tracking-normal sm:text-6xl">採用・相談・技術の話はこちらから。</h2>
          </div>
          <div className="flex flex-wrap gap-3.5 lg:justify-end">
            <a className={buttonLinkClass("yellow")} href="mailto:hello@example.com">Email</a>
            <a className={buttonLinkClass("dark")} href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <a className={buttonLinkClass("dark")} href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </section>
      </main>

      <footer className="flex min-h-[110px] flex-col justify-between gap-5 border-t-4 border-double border-[#252525] bg-[#070707] px-[clamp(18px,4vw,64px)] py-10 text-xs tracking-[0.14em] text-[#777] sm:flex-row">
        <span>© ANALOG CODEWORKS / STATIC EXPORT</span>
        <span>NEXT.JS / REACT / TYPESCRIPT</span>
      </footer>
    </>
  );
}
