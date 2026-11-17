import Link from "next/link";
import type { Project } from "@/lib/portfolio-data";
import { ProjectArtwork } from "./ProjectArtwork";
import { Icon } from "./Icon";
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="min-w-0">
      <Link
        href={`/projects/${project.id}/`}
        className="group block"
        aria-label={`${project.title}の詳細を見る`}
      >
        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[.08em] text-[var(--muted)]">
          <span>{project.coverCode}</span>
          <span>{project.period}</span>
        </div>
        <ProjectArtwork kind={project.artwork} />
        <div className="pt-5">
          <h3 className="flex items-start justify-between gap-3 text-[21px] font-semibold leading-[1.5] tracking-[-.055em]">
            <span>{project.title}</span>
            <Icon
              name="arrow"
              className="mt-1 !size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </h3>
          <p className="mt-2 text-xs leading-7 text-[var(--muted)]">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--line)] px-2 py-0.5 text-[9px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
