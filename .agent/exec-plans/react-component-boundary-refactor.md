# React コンポーネント境界を整理し、Client Component を縮小する

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This plan is stored as one Markdown file under `.agent/exec-plans/`, following the repository-specific placement rule for ExecPlans. This plan follows the ExecPlan rules in `.agent/PLANS.md`.

## Purpose / Big Picture

この変更の目的は、ポートフォリオ画面の React 実装を、Next.js App Router と React の保守しやすい形へ寄せることです。変更前は `components/PortfolioApp.tsx` が 450 行の巨大な Client Component で、ヘッダー、ヒーロー、実績カード、スキルマトリクス、プロジェクト一覧、About、Contact、Footer、状態管理、レーダー座標計算、共通 className が同じファイルに混ざっていました。

変更後は、静的に描画できるセクションを Server Component として分け、ユーザー操作で状態が変わる部分だけを小さな Client Component にします。ユーザー視点では見た目と操作は同じままですが、今後セクション追加、文言変更、カード追加、フィルタ改修を行うときに、対象ファイルを見つけやすくなります。動作していることは `npm run typecheck` と `npm run build` が成功し、トップページが静的ページとしてビルドされることで確認します。

この ExecPlan は、すでに完了した 2026-05-06 の作業内容を後から再開できる形で記録するものです。次の作業者は、この計画と現在の working tree だけを見れば、何が変更され、なぜその形になったのかを理解できます。

## Progress

- [x] (2026-05-06 JST) React/Next.js best practices 観点で `components/PortfolioApp.tsx`, `lib/portfolio-data.ts`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `package.json` を調査した。
- [x] (2026-05-06 JST) `components/PortfolioApp.tsx` が 450 行の巨大 Client Component であり、状態を持たないセクションまでクライアントバンドル対象になっていることを確認した。
- [x] (2026-05-06 JST) 優先度 1 から 3 として、Client Component 境界の縮小、セクション単位の分割、繰り返し UI の部品化を実装対象に決めた。
- [x] (2026-05-06 JST) `components/portfolio/` ディレクトリを作成し、共通 style helper、共通 UI、レーダー計算 helper を追加した。
- [x] (2026-05-06 JST) `Header`, `HeroSection`, `RecentPatchesSection`, `AboutSection`, `ContactSection`, `Footer` を Server Component として切り出した。
- [x] (2026-05-06 JST) `HeroTurntable.client.tsx`, `SkillMatrix.client.tsx`, `ProjectArchive.client.tsx` を Client Component として切り出し、`useState` と `useMemo` を必要な範囲に閉じ込めた。
- [x] (2026-05-06 JST) `Ticket`, `ButtonLink`, `ChipButton`, `TechTagList`, `AttributeTags`, `ProjectCard` 相当の繰り返し UI を分離した。
- [x] (2026-05-06 JST) `components/PortfolioApp.tsx` を `"use client"` なしの薄い composition component に置き換えた。
- [x] (2026-05-06 JST) `npm run typecheck`, `npm run build`, `git diff --check` を実行し、すべて成功した。
- [x] (2026-05-06 JST) この ExecPlan を `.agent/exec-plans/react-component-boundary-refactor.md` に作成した。

## Surprises & Discoveries

- Observation: React 実装は想定より小さく、実質的な画面実装は `components/PortfolioApp.tsx` に集中していた。
  Evidence: `wc -l components/PortfolioApp.tsx lib/portfolio-data.ts app/globals.css app/page.tsx app/layout.tsx` showed `450 components/PortfolioApp.tsx`, `292 lib/portfolio-data.ts`, `313 app/globals.css`, `5 app/page.tsx`, and `28 app/layout.tsx`.

- Observation: 型レベルの破損は作業前から存在しなかった。
  Evidence: `npm run typecheck` completed with `tsc --noEmit` and no errors before the refactor.

- Observation: Server/Client 境界を分けた後も production build は成功し、トップページは static route として生成された。
  Evidence: `npm run build` completed successfully and printed `○ / 7.54 kB 110 kB` with `○ (Static) prerendered as static content`.

- Observation: `useState`, `useMemo`, and `"use client"` are now limited to three files under `components/portfolio/`.
  Evidence: `rg -n "useState|useMemo|\"use client\"" components/PortfolioApp.tsx components/portfolio` returns matches only in `HeroTurntable.client.tsx`, `SkillMatrix.client.tsx`, and `ProjectArchive.client.tsx`.

## Decision Log

- Decision: `PortfolioApp` から `"use client"` を外し、ページ全体の組み立て役だけにする。
  Rationale: ヘッダー、静的本文、Recent Patches、About、Contact、Footer はブラウザ側 state を必要としないため、Client Component に含める理由がない。Next.js App Router では、状態や event handler が必要な部分だけを Client Component にした方が、責務とバンドル境界が明確になる。
  Date/Author: 2026-05-06 / Codex

- Decision: Client Component は `HeroTurntable.client.tsx`, `SkillMatrix.client.tsx`, `ProjectArchive.client.tsx` の 3 つに限定する。
  Rationale: 現時点でユーザー操作による状態変更が必要なのは、ヒーローのレーダー開閉、スキル選択、プロジェクトフィルタだけである。ファイル名に `.client.tsx` を入れることで、どこがクライアント実行されるかを見つけやすくする。
  Date/Author: 2026-05-06 / Codex

- Decision: セクションは `components/portfolio/` 配下へ分割する。
  Rationale: この repository は単一ページのポートフォリオであり、トップページ固有の部品を `components/portfolio/` にまとめると、汎用 UI とページ固有 UI の境界がわかりやすい。`components/PortfolioApp.tsx` はページを読む順番を示す index のような役割にする。
  Date/Author: 2026-05-06 / Codex

- Decision: 共通 UI は過剰に抽象化せず、繰り返しが明確なものだけ切り出す。
  Rationale: 今回の目標は 1 から 3 の実装であり、データ selector の Map 化やレーダー計算の完全共通化は次の優先度に残してよい。`Ticket`, `ButtonLink`, `ChipButton`, `TechTagList`, `AttributeTags` は重複が明確なので先に切り出した。
  Date/Author: 2026-05-06 / Codex

- Decision: 見た目の className は大きく変更しない。
  Rationale: 今回の依頼はコンポーネント分割と React best practices 寄せであり、デザイン変更ではない。既存の Tailwind className を維持することで、視覚差分のリスクを下げる。
  Date/Author: 2026-05-06 / Codex

## Outcomes & Retrospective

`components/PortfolioApp.tsx` は 450 行の巨大 Client Component から 25 行の Server Component になった。ページは `Header`, `HeroSection`, `RecentPatchesSection`, `SkillMatrix`, `ProjectArchive`, `AboutSection`, `ContactSection`, `Footer` の順に組み立てられるため、画面構造が読みやすくなった。

状態を持つ処理は `components/portfolio/HeroTurntable.client.tsx`, `components/portfolio/SkillMatrix.client.tsx`, `components/portfolio/ProjectArchive.client.tsx` に閉じた。静的なセクションは Server Component として残るため、React/Next.js の境界として自然な形に近づいた。

残っている改善は、`lib/portfolio-data.ts` の検索関数を Map ベースの selector にすること、`SkillMatrix.client.tsx` 内のレーダー描画と Field Notes 表示をさらに小分けにすること、ブラウザで desktop/mobile の実画面確認を行うことです。今回はユーザー指定どおり 1 から 3 までに限定した。

## Context and Orientation

この repository は Next.js App Router, React 19, TypeScript で作られたポートフォリオサイトです。トップページは `app/page.tsx` が `components/PortfolioApp.tsx` を返すことで表示されます。データは `lib/portfolio-data.ts` にあり、スキル属性、プロジェクト、スコア計算関数がまとまっています。全体 CSS は `app/globals.css` です。

Client Component とは、ファイル先頭に `"use client"` があり、ブラウザ上で React state や click handler を使える component のことです。Server Component とは、Next.js App Router の標準で、サーバー側またはビルド時に描画される component のことです。Server Component は `useState` や `onClick` などのブラウザ操作用 API を直接使えませんが、静的な markup やデータ表示には向いています。

変更前の `components/PortfolioApp.tsx` は `"use client"` を持ち、`useState` と `useMemo` を使っていました。そのため、同じファイル内にある静的セクションまで Client Component の一部になっていました。今回の変更では、状態を必要とする部分だけを `.client.tsx` に移し、残りを通常の `.tsx` component として分割しました。

新しいファイル構成は次の通りです。`components/PortfolioApp.tsx` は全体の composition だけを行います。`components/portfolio/Header.tsx`, `HeroSection.tsx`, `RecentPatchesSection.tsx`, `AboutSection.tsx`, `ContactSection.tsx`, `Footer.tsx` は静的セクションです。`components/portfolio/HeroTurntable.client.tsx`, `SkillMatrix.client.tsx`, `ProjectArchive.client.tsx` は状態を持つ client island です。`components/portfolio/shared.tsx` は小さな共通 UI、`styles.ts` は className helper、`radar.ts` はレーダー座標計算 helper です。

## Plan of Work

最初に現状調査として、`components/PortfolioApp.tsx` の行数、`"use client"` の有無、`useState` と `useMemo` の使用箇所、`lib/portfolio-data.ts` のデータ構造を確認する。これにより、どの部分を client island に残すべきかを判断する。

次に共通 helper を作る。`components/portfolio/styles.ts` には `cn`, `chipClass`, `buttonLinkClass` と共通 className 定数を置く。`components/portfolio/shared.tsx` には `Ticket`, `ButtonLink`, `ChipButton`, `TechTagList`, `AttributeTags` を置く。`components/portfolio/radar.ts` には `getPoint`, `pointsToString`, `getHeroAxisStyle` とレーダー寸法定数を置く。

その後、静的セクションを Server Component として分ける。`Header`, `HeroSection`, `RecentPatchesSection`, `AboutSection`, `ContactSection`, `Footer` を作り、既存 JSX を見た目を変えずに移す。`HeroSection` は `HeroTurntable` を呼び出すだけで、自身は state を持たない。

続いて client island を作る。`HeroTurntable.client.tsx` は `isHeroRadarOpen` の state と `HeroRadar` を持つ。`SkillMatrix.client.tsx` は `activeSkillId` と関連プロジェクト表示を持つ。`ProjectArchive.client.tsx` は `activeFilter` とフィルタ済みプロジェクト表示を持つ。

最後に `components/PortfolioApp.tsx` を薄く書き換え、`Header`, `HeroSection`, `RecentPatchesSection`, `SkillMatrix`, `ProjectArchive`, `AboutSection`, `ContactSection`, `Footer` を順番に返す。`app/page.tsx` は既存のまま `PortfolioApp` を返すため変更不要である。

## Concrete Steps

すべての command は repository root `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio` で実行する。

調査時に実行した command は次の通りです。

    rg --files
    sed -n '1,260p' components/PortfolioApp.tsx
    sed -n '261,620p' components/PortfolioApp.tsx
    sed -n '1,260p' lib/portfolio-data.ts
    sed -n '1,220p' app/page.tsx
    sed -n '1,220p' app/layout.tsx
    sed -n '1,260p' app/globals.css
    cat package.json
    wc -l components/PortfolioApp.tsx lib/portfolio-data.ts app/globals.css app/page.tsx app/layout.tsx
    rg -n "useMemo|useState|useEffect|map\\(|find\\(|filter\\(|sort\\(|new Map|\\\"use client\\\"|className=\\\"|function " components lib app

実装時に作成した directory は次の通りです。

    mkdir -p components/portfolio

追加したファイルは次の通りです。

    components/portfolio/styles.ts
    components/portfolio/shared.tsx
    components/portfolio/radar.ts
    components/portfolio/Header.tsx
    components/portfolio/HeroSection.tsx
    components/portfolio/RecentPatchesSection.tsx
    components/portfolio/AboutSection.tsx
    components/portfolio/ContactSection.tsx
    components/portfolio/Footer.tsx
    components/portfolio/HeroTurntable.client.tsx
    components/portfolio/SkillMatrix.client.tsx
    components/portfolio/ProjectArchive.client.tsx

書き換えたファイルは次の通りです。

    components/PortfolioApp.tsx

検証時に実行した command は次の通りです。

    npm run typecheck
    npm run build
    git diff --check
    rg -n "useState|useMemo|\\\"use client\\\"" components/PortfolioApp.tsx components/portfolio

## Validation and Acceptance

`npm run typecheck` が成功することを必須にする。成功時は `tsc --noEmit` がエラーなしで終了する。

`npm run build` が成功することを必須にする。成功時は Next.js が production build を完了し、`Route (app)` に `/` が static route として表示される。

`git diff --check` が何も出力せず終了することを必須にする。これは trailing whitespace や patch 適用上の基本的な問題がないことを示す。

構造上の acceptance は、`rg -n "useState|useMemo|\"use client\"" components/PortfolioApp.tsx components/portfolio` を実行したときに、`"use client"` と state hook の使用が `HeroTurntable.client.tsx`, `SkillMatrix.client.tsx`, `ProjectArchive.client.tsx` に限定されていることです。

画面上の acceptance は、トップページの見た目と操作が変更前と同じであることです。ヒーローのレコード盤はクリックでレーダー表示状態を切り替えられ、Skill Matrix はチップやレーダー上の点で選択スキルを変えられ、Selected Works は属性チップでプロジェクトをフィルタできます。

## Idempotence and Recovery

この変更はファイル追加と JSX 移動が中心で、データ migration や破壊的操作はありません。何度検証 command を実行しても working tree を壊しません。

作業をやり直す場合は、`components/PortfolioApp.tsx` を全体 composition のみに保ち、state を持つ UI を `.client.tsx` に置く方針を維持します。`git reset --hard` や `git checkout --` のような破壊的操作は使いません。既存の未コミット変更がある場合は、ユーザーまたは以前の作業によるものとして扱い、無関係な差分を勝手に戻しません。

もし build が Server/Client 境界のエラーを出した場合は、event handler や `useState` を Server Component に残していないかを確認します。`onClick`, `onKeyDown`, `useState`, `useMemo` が必要な component は `.client.tsx` に移します。ただし、Server Component から Client Component を import して描画すること自体は Next.js App Router で許可されています。

## Artifacts and Notes

作業前の主要な測定結果は次の通りです。

    wc -l components/PortfolioApp.tsx lib/portfolio-data.ts app/globals.css app/page.tsx app/layout.tsx
         450 components/PortfolioApp.tsx
         292 lib/portfolio-data.ts
         313 app/globals.css
           5 app/page.tsx
          28 app/layout.tsx
        1088 total

作業後の主要 component 行数は次の通りです。

    wc -l components/PortfolioApp.tsx components/portfolio/*.tsx components/portfolio/*.ts
          25 components/PortfolioApp.tsx
          32 components/portfolio/AboutSection.tsx
          18 components/portfolio/ContactSection.tsx
           8 components/portfolio/Footer.tsx
          21 components/portfolio/Header.tsx
          25 components/portfolio/HeroSection.tsx
          71 components/portfolio/HeroTurntable.client.tsx
          68 components/portfolio/ProjectArchive.client.tsx
          34 components/portfolio/RecentPatchesSection.tsx
         157 components/portfolio/SkillMatrix.client.tsx
          69 components/portfolio/shared.tsx
          27 components/portfolio/radar.ts
          30 components/portfolio/styles.ts
         585 total

検証結果は次の通りです。

    npm run typecheck
    > yuukun-portfolio@0.1.0 typecheck
    > tsc --noEmit

    npm run build
    > yuukun-portfolio@0.1.0 build
    > next build
    ✓ Compiled successfully
    ✓ Generating static pages (4/4)
    ○ / 7.54 kB 110 kB

    git diff --check
    no output

## Interfaces and Dependencies

新しい外部 dependency はありません。既存の `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@tailwindcss/postcss` をそのまま使います。

`components/PortfolioApp.tsx` は次の component を import して順番に描画します。

    Header
    HeroSection
    RecentPatchesSection
    SkillMatrix
    ProjectArchive
    AboutSection
    ContactSection
    Footer

`components/portfolio/shared.tsx` は、共通 UI として次の exported functions を持ちます。

    Ticket({ children }: { children: React.ReactNode })
    ButtonLink({ children, href, tone, external })
    ChipButton({ active, children, onClick })
    TechTagList({ tags }: { tags: string[] })
    AttributeTags({ project }: { project: Project })

`components/portfolio/radar.ts` は、レーダー描画用に次の exported values と functions を持ちます。

    radarCenter
    radarRadius
    heroRadarRadius
    getPoint(index, total, ratio, pointRadius)
    pointsToString(points)
    getHeroAxisStyle(index, total)

`components/portfolio/*.client.tsx` の 3 ファイルだけが browser-side state を持ちます。`HeroTurntable.client.tsx` は `isHeroRadarOpen`、`SkillMatrix.client.tsx` は `activeSkillId`、`ProjectArchive.client.tsx` は `activeFilter` を管理します。

改訂 note: 2026-05-06 に、この ExecPlan を完了済み作業の記録として作成した。理由は、ユーザーが「何したかドキュメント exec plans として書いといて」と依頼し、この repository の配置ルールが `.agent/exec-plans/` 配下の 1 計画 1 Markdown ファイルを求めているためである。
