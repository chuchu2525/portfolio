import { cn, sectionClass } from "./styles";

export function AboutSection() {
  return (
    <section id="about" className={cn(sectionClass, "about-texture mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[clamp(34px,6vw,72px)] lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)]")}>
      <div className="relative border-2 border-[var(--line)] bg-[var(--panel-hi)] p-4 shadow-[14px_14px_0_var(--denim)]">
        <span className="absolute top-0 right-0 z-[1] translate-x-4 -translate-y-1/2 border-2 border-[#241a00] bg-[var(--yellow)] px-3 py-1.5 text-xs font-bold tracking-[0.1em] text-[#241a00]">ISSUE 01</span>
        <div className="portrait-art aspect-[3/4]" aria-hidden="true" />
        <div className="mt-3.5 flex justify-between gap-3.5 border-t-2 border-[var(--line)] pt-3 text-[11px] font-bold tracking-[0.1em] text-[var(--muted)]">
          <span>PROFILE</span>
          <span>YUU&apos;S ROOM</span>
        </div>
      </div>
      <div className="grid gap-5">
        <span className="text-xs font-bold tracking-[0.2em] text-[var(--yellow)]">PROFILE / LINER NOTES</span>
        <h2 className="m-0 font-serif text-5xl leading-none tracking-normal sm:text-7xl">
          yuu <span className="italic text-[var(--yellow)]">Full-stack Web Engineer.</span>
        </h2>
        <div className="relative border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[8px_8px_0_#050505,8px_8px_0_2px_var(--line)] before:absolute before:top-8 before:left-[-13px] before:size-6 before:rounded-full before:border-2 before:border-[var(--bg)] before:bg-[var(--yellow)]">
          <p className="m-0 text-base leading-8 text-[var(--muted)] sm:text-lg">
            要件整理、UI実装、バックエンド、データ設計、運用改善までを横断し、
            課題解決と事業成果につながるWebアプリケーションを作ることを重視しています。
          </p>
          <p className="mt-4 mb-0 text-base leading-8 text-[var(--muted)] sm:text-lg">
            古着の縫い目やレコードの溝のように、細部には作り手の判断が残ります。
            このサイトでは、その判断をスキル属性と代表実績の両方から読める形にします。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["課題整理", "実装", "運用改善"].map((label) => (
              <span className="border border-[var(--line)] bg-[var(--panel-hi)] px-3 py-2 text-center text-xs font-bold tracking-[0.12em] text-[var(--yellow)]" key={label}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
