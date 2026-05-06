import { ButtonLink, Ticket } from "./shared";
import { HeroTurntable } from "./HeroTurntable.client";

export function HeroSection() {
  return (
    <section className="relative grid min-h-[calc(100vh-84px)] grid-cols-1 items-center gap-[clamp(28px,5vw,72px)] border-x border-dashed border-[rgba(189,194,255,0.25)] px-[clamp(18px,5vw,72px)] py-[clamp(48px,7vw,96px)] [background:linear-gradient(90deg,rgba(26,35,126,0.95),rgba(26,35,126,0.82)),repeating-linear-gradient(45deg,rgba(255,255,255,0.025)_0_2px,transparent_2px_5px)] before:absolute before:inset-y-0 before:left-[5.2vw] before:border-l before:border-dashed before:border-[rgba(189,194,255,0.32)] after:absolute after:inset-y-0 after:right-[5.2vw] after:border-l after:border-dashed after:border-[rgba(189,194,255,0.32)] md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)]">
      <div className="relative z-10 max-w-[760px]">
        <Ticket>FULL-STACK WEB ENGINEER</Ticket>
        <h1 className="my-6 max-w-[780px] font-serif text-[clamp(40px,6.4vw,88px)] leading-[0.98] tracking-normal text-[var(--text)] [text-shadow:3px_3px_0_rgba(0,0,0,0.42)]">
          課題を解決する、<span className="block italic text-[var(--yellow)]">利益をあげるエンジニア</span>
        </h1>
        <p className="m-0 max-w-[660px] border-l-[5px] border-[var(--yellow)] bg-[rgba(9,9,13,0.26)] py-3 pr-0 pl-5 text-base leading-8 text-[var(--muted)] sm:text-lg">
          UI実装、設計、改善を横断しながら、採用担当者にもエンジニアにも伝わる形で経験を整理するポートフォリオ。
          古着とレコードの質感を、情報構造と技術領域の見せ方に接続します。
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <ButtonLink href="#matrix" tone="yellow">Skill Matrix</ButtonLink>
          <ButtonLink href="#projects" tone="dark">View Projects</ButtonLink>
        </div>
      </div>

      <HeroTurntable />
    </section>
  );
}
