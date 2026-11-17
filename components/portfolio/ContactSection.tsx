import Link from "next/link";
import { Icon } from "./Icon";
import { sectionClass, h2Class, ticketClass } from "./styles";
export function ContactSection() {
  return (
    <section
      id="contact"
      className={`${sectionClass} relative grid gap-10 overflow-hidden md:grid-cols-[.9fr_1fr_1fr]`}
      aria-labelledby="contact-heading"
    >
      <div>
        <p className={ticketClass}>/ 連絡先</p>
        <h2 id="contact-heading" className={`${h2Class} mt-3`}>
          一緒に、
          <br />
          つくりませんか
          <span className="ml-2 inline-block size-3 rounded-full bg-[var(--yellow)]" />
        </h2>
      </div>
      <div className="flex flex-col items-start justify-center gap-3">
        <a
          href="https://github.com/chuchu2525"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-6 border-b border-[var(--ink)] text-xs"
        >
          GitHubで活動を見る
          <Icon name="arrow" className="!size-4" />
          <span className="sr-only">（新しいタブ）</span>
        </a>
        <Link
          href="/projects/"
          className="flex min-h-11 items-center gap-6 text-xs hover:underline"
        >
          これまでの実績を見る <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <p className="self-center text-xs leading-7 text-[var(--muted)]">
        日本を拠点に。
        <br />
        AI・ソフトウェア・プロダクトの話を。
        <br />
        使う人にとって、役に立つものをつくりたい。
      </p>
    </section>
  );
}
