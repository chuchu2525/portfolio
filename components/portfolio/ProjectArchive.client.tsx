"use client";
import { useState } from "react";
import {
  projects,
  skillAttributes,
  type ProjectFilterId,
} from "@/lib/portfolio-data";
import { ProjectCard } from "./ProjectCard";
import { ChipButton } from "./shared";
import { h2Class, ticketClass, sectionClass } from "./styles";
export function ProjectArchive() {
  const [query, setQuery] = useState("");
  const [attribute, setAttribute] = useState<ProjectFilterId>("all");
  const [category, setCategory] = useState("all");
  const normalized = query.trim().toLocaleLowerCase();
  const filtered = projects.filter(
    (p) =>
      (attribute === "all" || p.attributes.some((a) => a.id === attribute)) &&
      (category === "all" || p.category === category) &&
      [p.title, p.description, ...p.techTags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized),
  );
  function reset() {
    setQuery("");
    setAttribute("all");
    setCategory("all");
  }
  return (
    <section
      className={`${sectionClass} border-t-0 pt-10`}
      aria-labelledby="archive-heading"
    >
      <p className={ticketClass}>/ PROJECT ARCHIVE</p>
      <h1
        id="archive-heading"
        className={`${h2Class} mt-3 !text-[clamp(36px,5vw,64px)]`}
      >
        これまでの実績。
      </h1>
      <p className="mt-5 text-sm text-[var(--muted)]">
        課題、技術、取り組み方。ひとつずつ、詳しく。
      </p>
      <div className="my-9 border-y border-[var(--line)] py-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_210px]">
          <label className="text-xs">
            キーワード・技術で探す
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例：Python、RAG、Next.js"
              className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-transparent px-4 placeholder:text-[#777]"
            />
          </label>
          <label className="text-xs">
            取り組みの種類
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-transparent px-3"
            >
              <option value="all">すべての種類</option>
              <option value="work">業務</option>
              <option value="personal">個人開発</option>
              <option value="learning">研究・学習</option>
            </select>
          </label>
        </div>
        <fieldset className="mt-5">
          <legend className="mb-3 text-xs">経験した領域で絞り込む</legend>
          <div className="flex flex-wrap gap-2">
            <ChipButton
              active={attribute === "all"}
              onClick={() => setAttribute("all")}
            >
              すべて
            </ChipButton>
            {skillAttributes.map((a) => (
              <ChipButton
                key={a.id}
                active={attribute === a.id}
                onClick={() => setAttribute(a.id)}
              >
                {a.displayName}
              </ChipButton>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="mb-6 flex min-h-10 items-center justify-between">
        <p role="status" className="text-xs text-[var(--muted)]">
          {filtered.length}件 / 全{projects.length}件
        </p>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 px-2 text-xs underline"
        >
          条件をリセット
        </button>
      </div>
      <div className="grid gap-x-7 gap-y-12 md:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="border border-[var(--line)] px-6 py-16 text-center">
          <h2 className="text-lg font-medium">
            条件に合う実績が見つかりませんでした。
          </h2>
          <p className="mt-3 text-xs text-[var(--muted)]">
            キーワードや領域を変えてみてください。
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 min-h-11 border border-[var(--ink)] px-5 text-xs"
          >
            すべての実績を見る
          </button>
        </div>
      )}
    </section>
  );
}
