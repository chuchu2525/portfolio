export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
export const pageClass =
  "mx-auto max-w-[1390px] px-[22px] md:px-[30px] xl:px-12";
export const navLinkClass =
  "flex min-h-11 items-center border-b border-transparent text-xs hover:border-current";
export const ticketClass =
  "text-[10px] font-medium uppercase tracking-[.14em] text-[var(--muted)]";
export const sectionClass = "border-t border-[var(--line)] py-16 md:py-20";
export const sectionHeadClass =
  "mb-8 flex flex-wrap items-end justify-between gap-5";
export const sectionEyebrowClass = ticketClass;
export const h2Class =
  "text-[28px] font-semibold leading-[1.3] tracking-[-.055em] md:text-[36px]";
export const paragraphClass = "max-w-xl text-sm leading-8 text-[var(--muted)]";
export function chipClass(active: boolean) {
  return cn(
    "min-h-10 border px-3 text-xs transition-colors",
    active
      ? "border-[var(--ink)] bg-[var(--ink)] text-white"
      : "border-[var(--line)] bg-transparent hover:bg-white",
  );
}
export function buttonLinkClass(tone: "yellow" | "dark") {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-6 border px-5 text-xs font-medium transition-colors",
    tone === "yellow"
      ? "border-transparent bg-[var(--yellow)] hover:border-[var(--ink)]"
      : "border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white",
  );
}
