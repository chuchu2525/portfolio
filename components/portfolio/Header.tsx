import Link from "next/link";
import { pageClass, navLinkClass } from "./styles";
export function Header() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute -top-20 left-5 z-50 bg-white p-3 focus:top-2"
      >
        本文へ移動
      </a>
      <header
        className={`${pageClass} flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5 md:py-7`}
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5"
          aria-label="Chuchu ホーム"
        >
          <strong className="text-[22px] font-semibold tracking-[-.06em]">
            Chuchu
          </strong>
          <i
            className="size-2 rounded-full bg-[var(--yellow)]"
            aria-hidden="true"
          />
          <span className="text-xs">/ AIエンジニア</span>
        </Link>
        <nav className="flex gap-6 sm:gap-9" aria-label="メインナビゲーション">
          {[
            ["projects", "実績"],
            ["about", "考え方"],
            ["journey", "経歴"],
            ["contact", "連絡先"],
          ].map(([id, label]) => (
            <Link key={id} href={`/#${id}`} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
