import { SkillMatrix } from "./SkillMatrix.client";
import { Icon } from "./Icon";
import { sectionClass, h2Class, ticketClass } from "./styles";
const domains = [
  { name: "AIシステム", icon: "spark" },
  { name: "RAG", icon: "layers" },
  { name: "検索評価", icon: "search" },
  { name: "画像認識", icon: "camera" },
  { name: "業務自動化", icon: "bolt" },
  { name: "Webアプリ", icon: "web" },
] as const;
export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className={sectionClass}
      aria-labelledby="capabilities-heading"
    >
      <div className="grid gap-10 md:grid-cols-[.9fr_2fr]">
        <div>
          <p className={ticketClass}>/ 専門領域</p>
          <h2 id="capabilities-heading" className={`${h2Class} mt-2`}>
            できること。
          </h2>
          <p className="mt-4 text-xs leading-7 text-[var(--muted)]">
            課題に合わせて、
            <br />
            技術を組み合わせる。
          </p>
        </div>
        <div>
          <div className="grid grid-cols-2 border-l border-t border-[var(--line)] sm:grid-cols-3">
            {domains.map((item) => (
              <div
                className="flex min-h-24 items-center gap-3 border-b border-r border-[var(--line)] px-4 text-xs"
                key={item.name}
              >
                <Icon name={item.icon} />
                {item.name}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[11px] text-[var(--muted)]">
            {[
              "Python",
              "Next.js",
              "TypeScript",
              "Spring",
              "AWS",
              "MySQL",
              "OpenCV",
              "Docker",
              "GitHub Actions",
            ].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </div>
      <details className="mt-10 border-t border-[var(--line)] pt-5">
        <summary className="w-fit py-2 text-xs hover:underline">
          経験から見る、10のスキル領域
        </summary>
        <SkillMatrix />
      </details>
    </section>
  );
}
