export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const navLinkClass =
  "border-b-2 border-transparent py-1 hover:border-[var(--rust)] hover:text-[var(--yellow)] focus-visible:border-[var(--rust)] focus-visible:text-[var(--yellow)]";
export const ticketClass =
  "inline-flex w-fit border border-dashed border-[rgba(255,178,182,0.65)] bg-[var(--rust)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--rust-soft)]";
export const sectionClass = "px-[clamp(18px,5vw,72px)] py-[clamp(70px,9vw,124px)]";
export const sectionHeadClass = "grid gap-3.5";
export const sectionEyebrowClass = ticketClass;
export const h2Class = "m-0 font-serif text-4xl leading-tight tracking-normal sm:text-5xl lg:text-6xl";
export const paragraphClass = "m-0 max-w-[720px] text-base leading-8 text-[var(--muted)] sm:text-lg";

const chipBaseClass = "min-h-8 cursor-pointer rounded border px-3 text-[11px] font-bold tracking-[0.1em]";
const chipIdleClass = "border-[var(--line)] bg-[#242424] text-[var(--text)]";
const chipActiveClass = "border-[#574400] bg-[var(--yellow)] text-[#241a00]";

export function chipClass(active: boolean) {
  return cn(chipBaseClass, active ? chipActiveClass : chipIdleClass);
}

export function buttonLinkClass(tone: "yellow" | "dark") {
  return cn(
    "inline-flex min-h-[50px] cursor-pointer items-center justify-center rounded-lg border px-6 text-[13px] font-bold tracking-[0.12em]",
    tone === "yellow"
      ? "border-[#574400] bg-linear-to-b from-[#ffe580] to-[var(--yellow)] text-[#241a00] shadow-[inset_0_1px_rgba(255,255,255,0.6),0_5px_0_rgba(0,0,0,0.38)]"
      : "border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-[inset_0_1px_rgba(255,255,255,0.08)]"
  );
}
