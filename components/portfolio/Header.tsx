import { navLinkClass } from "./styles";

export function Header() {
  return (
    <header className="sticky top-0 z-50 grid min-h-[66px] grid-cols-1 items-center gap-7 border-b-2 border-dashed border-[rgba(189,194,255,0.35)] px-[clamp(18px,4vw,48px)] shadow-[0_4px_0_rgba(0,0,0,0.35)] [background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent),var(--denim)] sm:min-h-[84px] sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
      <a className="font-serif text-2xl font-extrabold italic text-[var(--yellow)] shadow-black [text-shadow:2px_2px_0_#020202]" href="/">
        YUU&apos;s room
      </a>
      <nav className="hidden gap-[clamp(14px,2.6vw,30px)] font-serif text-[19px] lg:flex" aria-label="Primary">
        <a className={navLinkClass} href="/">Home</a>
        <a className={navLinkClass} href="/#matrix">Skills</a>
        <a className={navLinkClass} href="/#projects">Projects</a>
        <a className={navLinkClass} href="/#about">Profile</a>
        <a className={navLinkClass} href="/#contact">Contact</a>
      </nav>
      <a className="hidden min-h-9 items-center justify-center justify-self-end rounded-full border border-[#493b00] bg-linear-to-b from-[#ffe279] to-[var(--yellow)] px-6 text-xs font-bold tracking-[0.18em] text-[#241a00] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_rgba(0,0,0,0.4)] sm:inline-flex" href="/#contact">
        Contact
      </a>
    </header>
  );
}
