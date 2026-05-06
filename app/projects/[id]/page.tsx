import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/portfolio/Footer";
import { Header } from "@/components/portfolio/Header";
import { AttributeTags, ButtonLink, Ticket } from "@/components/portfolio/shared";
import { cn, h2Class, paragraphClass, sectionClass, sectionEyebrowClass, sectionHeadClass } from "@/components/portfolio/styles";
import { getAttributeById, getProjectById, projects } from "@/lib/portfolio-data";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return {
      title: "Project Not Found | YUU's room"
    };
  }

  return {
    title: `${project.title} | YUU's room`,
    description: project.description
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />
      <main id="top">
        <section className={cn(sectionClass, "mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px]")}>
          <div className="grid gap-8">
            <div className={sectionHeadClass}>
              <span className={sectionEyebrowClass}>PROJECT DETAIL</span>
              <h1 className="m-0 font-serif text-[clamp(44px,7vw,92px)] leading-none tracking-normal text-[var(--text)]">
                {project.title}
              </h1>
              <p className={paragraphClass}>{project.description}</p>
            </div>

            <div className="grid gap-5 rounded border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[8px_8px_0_#050505,8px_8px_0_2px_var(--line)]">
              {[
                ["背景と課題", project.problem],
                ["担当範囲とアプローチ", project.approach],
                ["成果または工夫", project.result]
              ].map(([title, body]) => (
                <section className="grid gap-2 border-b border-[rgba(189,194,255,0.18)] pb-5 last:border-b-0 last:pb-0" key={title}>
                  <h2 className="m-0 font-serif text-3xl tracking-normal text-[var(--yellow)]">{title}</h2>
                  <p className="m-0 text-base leading-8 text-[var(--muted)]">{body}</p>
                </section>
              ))}
            </div>

            <section className="grid gap-4">
              <div className={sectionHeadClass}>
                <span className={sectionEyebrowClass}>LEARNINGS</span>
                <h2 className={h2Class}>What It Proves</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.learnings.map((learning) => (
                  <p className="m-0 border border-[var(--line)] bg-[var(--panel-hi)] p-4 text-sm leading-7 text-[var(--muted)]" key={learning}>
                    {learning}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="self-start border-2 border-[var(--line)] bg-[var(--panel-hi)] p-6 shadow-[14px_14px_0_var(--denim)]">
            <div className="cover-art relative mb-6 h-[190px] border border-[var(--line)]" data-code={project.coverCode}>
              <span className="absolute top-3 right-3 border border-[rgba(255,178,182,0.4)] bg-[var(--rust)] px-2 py-1.5 text-[10px] font-bold text-[var(--rust-soft)]">
                {project.coverCode}
              </span>
            </div>
            <div className="grid gap-4">
              <Ticket>{project.role}</Ticket>
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--yellow)]">Period</dt>
                  <dd className="m-0 mt-1 text-[var(--text)]">{project.period}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--yellow)]">Category</dt>
                  <dd className="m-0 mt-1 text-[var(--text)]">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--yellow)]">Tech</dt>
                  <dd className="m-0 mt-2 flex flex-wrap gap-2">
                    {project.techTags.map((tag) => (
                      <span className="rounded border border-[var(--line)] bg-[var(--panel)] px-2 py-1 text-xs" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
              <AttributeTags project={project} />
              <div className="grid gap-2">
                {project.attributes.map((attribute) => {
                  const item = getAttributeById(attribute.id);

                  return (
                    <div className="rounded border border-[var(--line)] bg-[var(--panel)] p-3" key={attribute.id}>
                      <div className="text-xs font-bold text-[var(--yellow)]">{item.displayName}</div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        {attribute.level === "experienced" ? "経験あり" : "キャッチアップ中"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <ButtonLink href="/projects" tone="dark">Back To Archive</ButtonLink>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
