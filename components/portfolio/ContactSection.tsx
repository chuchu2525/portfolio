import { ButtonLink } from "./shared";
import { cn, sectionClass } from "./styles";

export function ContactSection() {
  return (
    <section id="contact" className={cn(sectionClass, "mx-auto grid max-w-[1240px] gap-8 lg:flex lg:items-end lg:justify-between")}>
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[var(--yellow)]">CONTACT</span>
        <h2 className="mt-4 mb-0 max-w-[760px] font-serif text-4xl leading-tight tracking-normal sm:text-6xl">コード、経歴、採用導線をまとめています。</h2>
      </div>
      <div className="flex flex-wrap gap-3.5 lg:justify-end">
        <ButtonLink href="https://github.com/" tone="yellow" external>GitHub</ButtonLink>
        <ButtonLink href="https://www.linkedin.com/" tone="dark" external>LinkedIn</ButtonLink>
        <ButtonLink href="https://www.wantedly.com/" tone="dark" external>Wantedly</ButtonLink>
      </div>
    </section>
  );
}
