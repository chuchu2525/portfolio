"use client";

import { useMemo, useState } from "react";
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

function getPoint(index: number, total: number, ratio = 1) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    x: center + Math.cos(angle) * radius * ratio,
    y: center + Math.sin(angle) * radius * ratio
  };
}

function pointsToString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
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
    return getPoint(index, total, ratio);
  });

  return (
    <svg className="hero-radar" viewBox="0 0 320 320" aria-hidden="true">
      <polygon className="radar-paper" points={pointsToString(skillAttributes.map((_, index) => getPoint(index, total)))} />
      <polygon className="radar-fill" points={pointsToString(points)} />
      {skillAttributes.map((_, index) => {
        const point = getPoint(index, total);
        return <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} />;
      })}
    </svg>
  );
}

function AttributeTags({ project }: { project: Project }) {
  return (
    <div className="tag-row">
      {project.attributes.map((attribute) => (
        <span className="tag" key={`${project.id}-${attribute.id}`}>
          {getAttributeById(attribute.id).displayName}
        </span>
      ))}
    </div>
  );
}

export function PortfolioApp() {
  const [activeSkillId, setActiveSkillId] = useState<SkillAttributeId>("frontend");
  const [activeFilter, setActiveFilter] = useState<SkillAttributeId | "all">("all");

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
      <header className="topbar">
        <a className="logo" href="#top">
          CRAFTSMAN.DEV
        </a>
        <nav aria-label="Primary">
          <a href="#top">Home</a>
          <a href="#matrix">Skills</a>
          <a href="#archive">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="hire" href="mailto:hello@example.com">
          Contact
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="ticket">FULL-STACK WEB ENGINEER</span>
            <h1>
              使い続けられるWebアプリを<span>仕立てる。</span>
            </h1>
            <p>
              UI実装、設計、改善を横断しながら、採用担当者にもエンジニアにも伝わる形で経験を整理するポートフォリオ。
              古着とレコードの質感を、情報構造と技術領域の見せ方に接続します。
            </p>
            <div className="hero-actions">
              <a className="btn btn-yellow" href="#archive">
                View Projects
              </a>
              <a className="btn btn-dark" href="#matrix">
                Skill Matrix
              </a>
            </div>
          </div>

          <div className="turntable" aria-label="Skill radar preview">
            <div className="slipmat" />
            <div className="record">
              <div className="record-shine" />
              <div className="label-card">
                <HeroRadar />
                <span className="spindle" />
              </div>
            </div>
            {skillAttributes.slice(0, 6).map((attribute, index) => (
              <span className={`axis axis-${index + 1}`} key={attribute.id}>
                {attribute.label}
              </span>
            ))}
          </div>
        </section>

        <section className="section recent">
          <div className="archive-head">
            <h2>Recent Patches</h2>
            <a href="#archive">View Archive</a>
          </div>
          <div className="patch-grid">
            <article className="featured-patch">
              <span className="pin-label">FEATURED</span>
              <div>
                <h3>{featuredProject.title}</h3>
                <p>{featuredProject.description}</p>
              </div>
              <div className="mini-tags">
                {featuredProject.techTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
            <article className="small-patch">
              <span className="material-dot" />
              <h3>{supportingProject.title}</h3>
              <p>{supportingProject.description}</p>
              <div className="mini-tags">
                {supportingProject.techTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="matrix" className="section matrix-grid">
          <aside className="skill-spindle">
            <div className="panel-title">
              <span>SPINDLE 10</span>
              <h2>Skill Matrix</h2>
            </div>
            <RadarChart activeId={activeSkillId} onSelect={setActiveSkillId} />
            <div className="skill-tabs">
              {skillAttributes.map((attribute) => (
                <button
                  className={activeSkillId === attribute.id ? "chip active" : "chip"}
                  key={attribute.id}
                  type="button"
                  onClick={() => setActiveSkillId(attribute.id)}
                >
                  {attribute.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="field-notes">
            <div className="section-head">
              <span>FIELD NOTES</span>
              <h2>Field Notes</h2>
              <p>
                スコアは経験データから集計します。経験ありは1.0、キャッチアップ中は0.5として扱い、
                最大値は設定で変更できるようにしています。
              </p>
            </div>
            <div className="denim-patch">
              <span className="patch-label">{activeSkill.displayName}</span>
              <div className="attribute-hangtag">{activeSkill.garmentPart}</div>
              <p>{activeSkill.description}</p>
              <div className="score-badge">
                <span>{getSkillScore(activeSkill.id).toFixed(1)}</span>
                <small>/ {maxRadarScore}</small>
              </div>
              <div className="stack-list">
                {activeSkill.stack.map((item) => (
                  <div className="stack-row" key={item.name}>
                    <span>{item.name}</span>
                    <span className="track">
                      <span className="fill" style={{ width: `${item.level}%` }} />
                    </span>
                    <span>{item.level}</span>
                  </div>
                ))}
              </div>
              <div className="contribution-list">
                {activeProjects.map((project) => (
                  <span key={project.id}>{project.title}</span>
                ))}
              </div>
            </div>

            <div className="care-label">
              <span className="care-icon">⌁</span>
              <h3>Care Instructions</h3>
              <dl>
                <div>
                  <dt>Material</dt>
                  <dd>Experience Data</dd>
                </div>
                <div>
                  <dt>Fit</dt>
                  <dd>Static Export</dd>
                </div>
                <div>
                  <dt>Maintenance</dt>
                  <dd>Update Data First</dd>
                </div>
                <div>
                  <dt>Warning</dt>
                  <dd>Do Not Fake Scores</dd>
                </div>
              </dl>
              <div className="barcode" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="archive" className="section archive">
          <div className="section-head centered">
            <span>PROJECT CRATE</span>
            <h2>Selected Works</h2>
            <p>
              実績や経験をレコードスリーブとして並べ、関係する技術領域でフィルタできる構成にしています。
            </p>
          </div>
          <div className="filter-row">
            <button
              className={activeFilter === "all" ? "chip active" : "chip"}
              type="button"
              onClick={() => setActiveFilter("all")}
            >
              ALL
            </button>
            {skillAttributes.map((attribute) => (
              <button
                className={activeFilter === attribute.id ? "chip active" : "chip"}
                key={attribute.id}
                type="button"
                onClick={() => setActiveFilter(attribute.id)}
              >
                {attribute.label}
              </button>
            ))}
          </div>
          <div className="crate">
            {filteredProjects.map((project) => (
              <article className="sleeve" key={project.id}>
                <div className="cover-art" data-code={project.coverCode} />
                <div className="sleeve-inner">
                  <span className="ticket">{project.role}</span>
                  <div className="attribute-hangtag sleeve-tag">
                    {project.attributes.map((attribute) => getAttributeById(attribute.id).label).join(" / ")}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>{project.period}</span>
                    <span>{project.techTags.join(" / ")}</span>
                  </div>
                  <AttributeTags project={project} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about-layout">
          <div className="portrait-card">
            <span className="issue-label">ISSUE 01</span>
            <div className="portrait-art" aria-hidden="true" />
            <div className="portrait-meta">
              <span>VOL. XLII</span>
              <span>ANALOG CODEWORKS</span>
            </div>
          </div>
          <div className="liner-notes">
            <span className="small-label">LINER NOTES</span>
            <h2>
              The Articulate <span>Craftsman.</span>
            </h2>
            <div className="note-card">
              <p>
                Webアプリを、ただ動くものではなく、使われながら改善できるものとして作ることを重視しています。
                画面の手触り、データの持ち方、リリース後の運用までをひと続きの品質として扱います。
              </p>
              <p>
                古着の縫い目やレコードの溝のように、細部には作り手の判断が残ります。
                このサイトでは、その判断をスキルと経験の両方から読める形にします。
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-band">
          <div>
            <span className="small-label">CONTACT</span>
            <h2>採用・相談・技術の話はこちらから。</h2>
          </div>
          <div className="contact-actions">
            <a className="btn btn-yellow" href="mailto:hello@example.com">
              Email
            </a>
            <a className="btn btn-dark" href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn btn-dark" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© ANALOG CODEWORKS / STATIC EXPORT</span>
        <span>NEXT.JS / REACT / TYPESCRIPT</span>
      </footer>
    </>
  );
}
