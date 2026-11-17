import Link from "next/link";
import { featuredProjects, projects } from "@/lib/portfolio-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectArtwork } from "./ProjectArtwork";
import { Icon } from "./Icon";
import { sectionClass, sectionHeadClass, h2Class, ticketClass } from "./styles";
export function FeaturedProjectsSection() {
  const integration = projects.find((p) => p.artwork === "automation")!;
  return (
    <section
      id="projects"
      className={sectionClass}
      aria-labelledby="projects-heading"
    >
      <div className={sectionHeadClass}>
        <div>
          <p className={ticketClass}>/ 取り組んできたこと</p>
          <h2 id="projects-heading" className={`${h2Class} mt-2`}>
            課題から、かたちへ。
          </h2>
        </div>
        <Link
          href="/projects/"
          className="flex min-h-11 items-center gap-7 text-xs hover:underline"
        >
          すべての実績 <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="grid gap-x-7 gap-y-10 md:grid-cols-3">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <Link
        href={`/projects/${integration.id}/`}
        className="group mt-9 grid items-center gap-5 border-t border-[var(--line)] pt-6 sm:grid-cols-[220px_1fr_auto]"
      >
        <ProjectArtwork kind="automation" />
        <div>
          <p className={ticketClass}>04 / AUTOMATION</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-.04em]">
            {integration.title}
          </h3>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {integration.description}
          </p>
          <p className="mt-3 text-[10px] text-[var(--muted)]">
            Python / AWS / API連携
          </p>
        </div>
        <Icon name="arrow" className="hidden sm:block" />
      </Link>
    </section>
  );
}
