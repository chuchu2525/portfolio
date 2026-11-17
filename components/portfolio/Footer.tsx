import Link from "next/link";
import { pageClass } from "./styles";
export function Footer() {
  return (
    <footer
      className={`${pageClass} flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-6 text-[10px] text-[var(--muted)]`}
    >
      <span>© {new Date().getFullYear()} Chuchu</span>
      <span>考えて、つくって、よくしていく。</span>
      <Link
        href="/#top"
        className="inline-flex min-h-11 items-center gap-4 hover:text-[var(--ink)]"
      >
        ページの先頭へ <span aria-hidden="true">↑</span>
      </Link>
    </footer>
  );
}
