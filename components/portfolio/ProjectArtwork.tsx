import Image from "next/image";
import type { Project } from "@/lib/portfolio-data";
import s from "./PortfolioArtwork.module.css";
export function ProjectArtwork({
  kind,
  detail = false,
}: {
  kind: Project["artwork"];
  detail?: boolean;
}) {
  return (
    <div className={detail ? s.detail : undefined} aria-hidden="true">
      <div className={`${s.art} ${s[kind]}`}>
        {kind === "rag" && (
          <>
            <div className={s.miniSun} />
            <div className={s.window}>
              <small>KNOWLEDGE / ASSISTANT</small>
              <b>必要な情報を、会話から。</b>
              <div className={s.bubble}>この資料はどこにありますか？</div>
              <div className={s.bubble}>関連する情報を見つけました。 ↗</div>
              <div className="mt-4 flex gap-2">
                <span className="h-1 w-16 bg-gray-300" />
                <span className="h-1 w-8 bg-gray-200" />
              </div>
            </div>
          </>
        )}
        {kind === "vision" && (
          <>
            <Image
              src="/images/restaurant-seats.jpg"
              alt=""
              fill
              sizes={
                detail
                  ? "(max-width: 768px) 100vw, 1100px"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              className={s.photo}
            />
            <i className={s.box} />
            <i className={`${s.box} ${s.boxTwo}`} />
            <span className={s.visionNote}>SEAT INTELLIGENCE / イメージ図</span>
          </>
        )}
        {kind === "notebook" && (
          <div className={s.book}>
            <small>OPEN SOURCE / WEB APP</small>
            <b>
              One
              <br />
              View.
            </b>
            <i />
          </div>
        )}
        {kind === "automation" && (
          <>
            <span className={s.service}>M</span>
            <span className={s.connector} />
            <span className={s.service}>J</span>
          </>
        )}
      </div>
    </div>
  );
}
