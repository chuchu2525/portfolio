import { journey } from "@/lib/portfolio-data";
import { sectionClass, h2Class, ticketClass } from "./styles";
export function JourneySection() {
  return (
    <section
      id="journey"
      className={`${sectionClass} grid gap-10 md:grid-cols-[.9fr_2fr]`}
      aria-labelledby="journey-heading"
    >
      <div>
        <p className={ticketClass}>/ 経歴</p>
        <h2 id="journey-heading" className={`${h2Class} mt-2`}>
          これまでの歩み。
        </h2>
        <p className="mt-4 text-xs text-[var(--muted)]">
          研究から、実際に使われる仕組みへ。
        </p>
      </div>
      <div>
        {journey.map((item, i) => (
          <article
            key={item.title}
            className="relative border-l border-[var(--line)] pb-9 pl-7 last:pb-0"
          >
            <span
              className={`absolute -left-[4px] top-2 size-[7px] rounded-full ${i === 2 ? "bg-[var(--yellow)] ring-1 ring-[var(--ink)]" : "bg-[var(--ink)]"}`}
              aria-hidden="true"
            />
            <p className="font-mono text-[10px] text-[var(--muted)]">
              {item.period}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-.04em]">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-7 text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
