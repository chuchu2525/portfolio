"use client";
import { useEffect, useState } from "react";
const targets = [
  ["top", "自己紹介"],
  ["projects", "実績"],
  ["about", "考え方"],
  ["journey", "経歴"],
  ["capabilities", "専門領域"],
  ["contact", "連絡先"],
] as const;
export function SectionMeter() {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    let frame = 0;
    function measure() {
      frame = 0;
      let id: string = "top";
      for (const [key] of targets) {
        const node = document.getElementById(key);
        if (node && node.getBoundingClientRect().top <= 180) id = key;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      )
        id = "contact";
      setActive(id);
    }
    function scroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <nav
      aria-label="目盛りからセクションへ移動"
      className="fixed right-1 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex"
    >
      {targets.map(([id, label], i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`${label}へ移動`}
          aria-current={active === id ? "location" : undefined}
          className="group flex h-8 w-11 items-center justify-end px-2"
        >
          <span
            className={`h-px transition-[width,background] ${active === id ? "w-6 bg-[var(--ink)]" : "w-2 bg-[#999] group-hover:w-5"}`}
          />
          <span className="sr-only">0{i + 1}</span>
        </a>
      ))}
      <span
        className="mr-2 mt-3 text-[9px] [writing-mode:vertical-rl]"
        aria-hidden="true"
      >
        0{targets.findIndex(([id]) => id === active) + 1} /{" "}
        {targets.find(([id]) => id === active)?.[1]}
      </span>
    </nav>
  );
}
