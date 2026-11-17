import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  projects,
  getProjectById,
  getAttributeById,
} from "@/lib/portfolio-data";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { ProjectArtwork } from "@/components/portfolio/ProjectArtwork";
import { pageClass, ticketClass, h2Class } from "@/components/portfolio/styles";
type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectById((await params).id);
  return {
    title: project
      ? `${project.title} | Chuchu`
      : "実績が見つかりません | Chuchu",
    description: project?.description,
  };
}
export default async function ProjectPage({ params }: Props) {
  const project = getProjectById((await params).id);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <Header />
      <main id="main-content" className={`${pageClass} pb-16`}>
        <nav
          aria-label="パンくずリスト"
          className="flex flex-wrap items-center gap-3 py-6 text-[10px] text-[var(--muted)]"
        >
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects/" className="hover:underline">
            実績一覧
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <article>
          <header className="py-8 md:py-12">
            <p className={ticketClass}>
              {project.coverCode} — {project.period}
            </p>
            <h1 className="mt-5 max-w-4xl text-[clamp(30px,4.6vw,64px)] font-semibold leading-[1.4] tracking-[-.06em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--muted)]">
              {project.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.techTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[var(--line)] px-3 py-1 text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <ProjectArtwork kind={project.artwork} detail />
          <div className="grid gap-12 py-12 md:grid-cols-[.65fr_2fr]">
            <aside>
              <p className={ticketClass}>/ 取り組みの概要</p>
              <dl className="mt-5 space-y-5 text-xs">
                <div>
                  <dt className="text-[var(--muted)]">役割</dt>
                  <dd className="mt-1">{project.role}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">期間</dt>
                  <dd className="mt-1">{project.period}</dd>
                </div>
              </dl>
            </aside>
            <div className="space-y-10">
              {[
                ["01 / 課題", "何を解くか。", project.problem],
                ["02 / アプローチ", "どう、かたちにするか。", project.approach],
                ["03 / 取り組み", "何を大切にしたか。", project.result],
              ].map(([label, title, copy]) => (
                <section key={label}>
                  <p className={ticketClass}>{label}</p>
                  <h2 className={`${h2Class} mt-2 !text-2xl`}>{title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--muted)]">
                    {copy}
                  </p>
                </section>
              ))}
              <section className="border-t border-[var(--line)] pt-8">
                <h2 className="text-xl font-semibold tracking-[-.04em]">
                  この取り組みから。
                </h2>
                <ul className="mt-4 list-inside list-disc space-y-3 text-xs leading-7 text-[var(--muted)]">
                  {project.learnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="border-t border-[var(--line)] pt-8">
                <h2 className="text-xl font-semibold tracking-[-.04em]">
                  経験した領域。
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.attributes.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap justify-between gap-2 border-b border-[var(--line)] py-3 text-xs"
                    >
                      <span>{getAttributeById(item.id).displayName}</span>
                      <span className="text-[10px] text-[var(--muted)]">
                        {item.level === "experienced"
                          ? "経験あり / 1"
                          : "キャッチアップ中 / 0.5"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
        <nav
          aria-label="ほかの実績"
          className="mt-6 grid items-center gap-6 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
        >
          <Link
            href="/projects/"
            className="flex min-h-11 items-center text-xs hover:underline"
          >
            ← 実績一覧に戻る
          </Link>
          <Link
            href={`/projects/${next.id}/`}
            className="text-sm hover:underline"
          >
            <span className="mb-2 block text-[9px] text-[var(--muted)]">
              NEXT PROJECT
            </span>
            {next.title} ↗
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
