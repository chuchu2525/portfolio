import { sectionClass, h2Class, ticketClass } from "./styles";
export function AboutSection() {
  return (
    <section
      id="about"
      className={`${sectionClass} grid gap-10 md:grid-cols-[.9fr_2fr]`}
      aria-labelledby="about-heading"
    >
      <div>
        <p className={ticketClass}>/ 大切にしていること</p>
        <h2 id="about-heading" className={`${h2Class} mt-2`}>
          つくるときの、
          <br />
          判断軸。
        </h2>
        <p className="mt-4 text-xs leading-7 text-[var(--muted)]">
          AIとソフトウェアで、
          <br />
          課題を使えるかたちにする。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-7 gap-y-10">
        {[
          ["役に立つ。", "実際の課題を解き、価値につなげる。"],
          ["確かめられる。", "評価の指標を決め、データで改善する。"],
          ["安全に使える。", "セキュリティと、運用の信頼性まで。"],
          ["迷わず使える。", "仕組みも体験も、できるだけシンプルに。"],
        ].map(([title, copy], i) => (
          <article key={title}>
            <span className="font-mono text-[10px] text-[var(--muted)]">
              0{i + 1}
            </span>
            <h3 className="mt-3 text-[22px] font-semibold tracking-[-.05em]">
              {title}
            </h3>
            <p className="mt-2 max-w-48 text-xs leading-7 text-[var(--muted)]">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
