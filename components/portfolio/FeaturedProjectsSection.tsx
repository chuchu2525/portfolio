import { featuredProjects } from "@/lib/portfolio-data";
import { ProjectCard } from "./ProjectCard";
import { ButtonLink } from "./shared";
import { cn, h2Class, paragraphClass, sectionClass, sectionEyebrowClass, sectionHeadClass } from "./styles";

export function FeaturedProjectsSection() {
  return (
    <section id="projects" className={cn(sectionClass, "border-y border-[#252525] bg-[#101010]")}>
      <div className={cn(sectionHeadClass, "mx-auto mb-8 max-w-[900px] justify-items-center text-center")}>
        <span className={sectionEyebrowClass}>FEATURED PROJECTS</span>
        <h2 className={h2Class}>Selected Works</h2>
        <p className={paragraphClass}>
          Skill Matrix で見せた強みの根拠として、代表実績を3件に絞って並べます。
          各カードでは、解決した課題、役割、技術、成果を短く確認できます。
        </p>
      </div>
      <div className="relative mx-auto grid w-[min(1240px,100%)] grid-cols-1 gap-6 border-b-[34px] border-[#151515] bg-[linear-gradient(90deg,#161616,#303030_4%,#151515_9%,#151515_91%,#303030_96%,#161616)] p-8 pb-14 shadow-[inset_0_-14px_22px_rgba(0,0,0,0.9)] lg:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} priority={index === 0} project={project} />
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-[1240px] flex-wrap items-center justify-between gap-4">
        <p className="m-0 max-w-[720px] text-sm leading-7 text-[var(--muted)]">
          もっと見たい場合は、全件一覧で属性や技術タグから探せます。
        </p>
        <ButtonLink href="/projects" tone="yellow">View Project Archive</ButtonLink>
      </div>
    </section>
  );
}
