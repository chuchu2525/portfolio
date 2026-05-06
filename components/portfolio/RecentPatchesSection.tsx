import { projects } from "@/lib/portfolio-data";
import { sectionClass, cn } from "./styles";
import { TechTagList } from "./shared";

export function RecentPatchesSection() {
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const supportingProject = projects.find((project) => !project.featured) ?? projects[1];

  return (
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
          <TechTagList tags={featuredProject.techTags} />
        </article>
        <article className="relative grid min-h-[300px] content-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_18px_34px_rgba(0,0,0,0.32)] before:pointer-events-none before:absolute before:inset-2.5 before:rounded-md before:border-2 before:border-dashed before:border-[rgba(189,194,255,0.25)]">
          <span className="material-dot-art relative z-[1] mb-5 size-13 rounded-full border border-[var(--line)]" />
          <h3 className="relative z-[1] m-0 mb-3 font-serif text-3xl tracking-normal text-[var(--yellow)]">{supportingProject.title}</h3>
          <p className="relative z-[1] m-0 leading-7 text-[var(--muted)]">{supportingProject.description}</p>
          <TechTagList tags={supportingProject.techTags} />
        </article>
      </div>
    </section>
  );
}
