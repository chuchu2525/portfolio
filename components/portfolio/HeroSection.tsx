import { HeroVisual } from "./HeroVisual.client";
import { Icon } from "./Icon";
import s from "./PortfolioArtwork.module.css";
export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="grid items-center gap-1 pb-9 pt-5 md:min-h-[470px] md:grid-cols-[1.1fr_1fr] md:pb-14 md:pt-9"
    >
      <div className="relative z-10">
        <h1
          id="hero-heading"
          className="text-[clamp(64px,7vw,104px)] font-semibold leading-[1.06] tracking-[-.075em]"
        >
          Chuchu<span className="pl-3 font-extralight">/</span>
          <span className="mt-2 block pl-6 text-[.7em] tracking-[-.065em] lg:pl-12">
            AIエンジニア
          </span>
        </h1>
        <h2 className="mt-8 text-[clamp(19px,1.9vw,27px)] font-semibold tracking-[-.05em]">
          曖昧な課題を、使えるAIへ。
        </h2>
        <p className="mt-3 text-[13px] leading-7 text-[var(--muted)]">
          RAG・画像認識・自動化を軸に、
          <br />
          使う人に届く仕組みをつくっています。
        </p>
        <div className="mt-6 h-px w-9 bg-current" aria-hidden="true" />
      </div>
      <HeroVisual>
        <div className={s.scene}>
          <div className={s.sun} />
          <div className={s.glass} />
          <svg className={s.orbit} viewBox="0 0 500 370">
            <ellipse
              cx="250"
              cy="180"
              rx="232"
              ry="69"
              transform="rotate(-29 250 180)"
            />
            <circle cx="441" cy="73" r="3" />
            <ellipse
              cx="250"
              cy="180"
              rx="205"
              ry="82"
              transform="rotate(38 250 180)"
            />
          </svg>
          <div className={s.assistant}>
            <b>
              <Icon name="spark" className="!size-4" />
              AIアシスタント
            </b>
            <div className={s.query}>
              知りたいことを、聞いてみる。<span>↗</span>
            </div>
            <div className={s.caption}>SEARCH → UNDERSTAND → CREATE</div>
          </div>
          <div className={s.floating}>
            <div>
              <Icon name="layers" className="mx-auto !size-5" />
              <span />
            </div>
          </div>
          <span className={s.cross}>+</span>
        </div>
      </HeroVisual>
    </section>
  );
}
