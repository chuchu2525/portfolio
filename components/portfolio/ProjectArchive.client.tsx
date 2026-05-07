"use client";

import { useState } from "react";
import { getProjectsBySkillAttribute, skillAttributes, type ProjectFilterId } from "@/lib/portfolio-data";
import { ProjectCard } from "./ProjectCard";
import { ChipButton } from "./shared";
import { cn, h2Class, paragraphClass, sectionClass, sectionEyebrowClass, sectionHeadClass } from "./styles";

export function ProjectArchive() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");
  const filteredProjects = getProjectsBySkillAttribute(activeFilter);

  return (
    <section id="archive" className={cn(sectionClass, "border-y border-[#252525] bg-[#101010]")}>
      <div className={cn(sectionHeadClass, "mx-auto mb-8 max-w-[820px] justify-items-center text-center")}>
        <span className={sectionEyebrowClass}>PROJECT CRATE</span>
        <h2 className={h2Class}>Project Archive</h2>
        <p className={paragraphClass}>
          代表実績以外も含めて、経験をレコードスリーブとして並べます。関係する技術領域で絞り込みできます。
        </p>
      </div>
      <div className="mx-auto mb-8 flex flex-wrap justify-center gap-2">
        <ChipButton active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>ALL</ChipButton>
        {skillAttributes.map((attribute) => (
          <ChipButton active={activeFilter === attribute.id} key={attribute.id} onClick={() => setActiveFilter(attribute.id)}>
            {attribute.label}
          </ChipButton>
        ))}
      </div>
      <div className="relative mx-auto grid w-[min(1240px,100%)] grid-cols-1 gap-6 border-b-[34px] border-[#151515] bg-[linear-gradient(90deg,#161616,#303030_4%,#151515_9%,#151515_91%,#303030_96%,#161616)] p-8 pb-14 shadow-[inset_0_-14px_22px_rgba(0,0,0,0.9)] lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
