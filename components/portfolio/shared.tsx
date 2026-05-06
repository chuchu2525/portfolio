import { getAttributeById, type Project } from "@/lib/portfolio-data";
import { buttonLinkClass, chipClass, ticketClass } from "./styles";

const tagClass =
  "inline-flex min-h-7 items-center rounded-full border border-[var(--line)] bg-[#303030] px-2.5 text-[11px] font-bold before:mr-2 before:block before:size-[7px] before:rounded-full before:bg-[var(--yellow)]";
const smallTagClass =
  "inline-flex min-h-7 items-center rounded border border-[var(--line)] bg-[var(--panel-hi)] px-2 text-[11px]";

export function Ticket({ children }: { children: React.ReactNode }) {
  return <span className={ticketClass}>{children}</span>;
}

export function ButtonLink({
  children,
  href,
  tone,
  external = false
}: {
  children: React.ReactNode;
  href: string;
  tone: "yellow" | "dark";
  external?: boolean;
}) {
  return (
    <a className={buttonLinkClass(tone)} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

export function ChipButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={chipClass(active)} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export function TechTagList({ tags }: { tags: string[] }) {
  return (
    <div className="relative z-[1] mt-7 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span className={smallTagClass} key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export function AttributeTags({ project }: { project: Project }) {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {project.attributes.map((attribute) => (
        <span className={tagClass} key={`${project.id}-${attribute.id}`}>
          {getAttributeById(attribute.id).displayName}
        </span>
      ))}
    </div>
  );
}
