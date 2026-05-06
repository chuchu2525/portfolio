import Link from "next/link";
import { getAttributeById, type Project } from "@/lib/portfolio-data";
import { AttributeTags, Ticket } from "./shared";
import { cn } from "./styles";

export function ProjectCard({
  project,
  priority = false
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative min-h-[430px] overflow-hidden border-2 border-[var(--line)] bg-[var(--panel)] shadow-[0_18px_28px_rgba(0,0,0,0.42)]",
        priority && "lg:min-h-[500px]"
      )}
    >
      <div className="record-sleeve-art absolute top-4 left-1/2 z-0 aspect-square w-[62%] -translate-x-1/2 rounded-full transition-transform duration-300 group-hover:-translate-y-7 group-hover:rotate-[15deg]" />
      <div className="cover-art absolute inset-x-4 top-4 h-[150px] border border-[var(--line)]" data-code={project.coverCode}>
        <span className="absolute top-3 right-3 border border-[rgba(255,178,182,0.4)] bg-[var(--rust)] px-2 py-1.5 text-[10px] font-bold text-[var(--rust-soft)]">
          {project.coverCode}
        </span>
      </div>
      <div className="relative z-[1] grid min-h-[inherit] content-end bg-linear-to-b from-transparent from-30% to-[rgba(32,32,32,0.98)] to-60% p-5">
        <Ticket>{project.role}</Ticket>
        <div className="relative top-auto right-auto mb-6 block w-[min(100%,220px)] rotate-1 border border-[var(--yellow-2)] bg-[#ffe08a] px-3 pt-6 pb-3 text-center text-[10px] leading-5 font-bold text-[#5d4900] shadow-[5px_7px_0_rgba(0,0,0,0.25)] before:absolute before:top-[-8px] before:left-1/2 before:size-3.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-[#5d4900] before:bg-[var(--bg)] sm:absolute sm:top-5 sm:right-4 sm:w-[122px] sm:rotate-[3deg]">
          {project.attributes.map((attribute) => getAttributeById(attribute.id).label).join(" / ")}
        </div>
        <h3 className="m-0 mb-2.5 max-w-full font-serif text-[29px] tracking-normal text-[#dfe1ff] sm:max-w-[calc(100%-134px)]">
          {project.title}
        </h3>
        <p className="m-0 leading-7 text-[var(--muted)]">{project.problem}</p>
        <div className="mt-4 grid gap-2 border-l-4 border-[var(--yellow)] pl-4">
          <p className="m-0 text-sm leading-6 text-[var(--text)]">{project.result}</p>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold tracking-[0.08em] text-[var(--yellow)]">
          <span>{project.period}</span>
          <span>{project.techTags.join(" / ")}</span>
        </div>
        <AttributeTags project={project} />
        <Link
          className="mt-5 inline-flex w-fit border-b-2 border-[var(--yellow)] pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--yellow)]"
          href={`/projects/${project.id}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
