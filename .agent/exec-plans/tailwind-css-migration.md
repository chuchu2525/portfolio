# Tailwind CSS へ移行し、global CSS の責務を整理する

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This plan is stored as one Markdown file under `.agent/exec-plans/`, following the repository-specific placement rule for ExecPlans. This plan also follows the ExecPlan rules in `.agent/PLANS.md`.

## Purpose / Big Picture

この変更の目的は、Next.js App Router のポートフォリオサイトで Tailwind CSS を正式に使い、`app/globals.css` が画面固有スタイルを大量に抱えている状態を解消することです。変更後は、全体共通の theme token と base style だけを `app/globals.css` に残し、`components/PortfolioApp.tsx` の見た目は Tailwind utility class を中心に表現します。

ユーザー視点では、古着とレコードをモチーフにした既存の見た目を維持しながら、今後の UI 追加や調整を Tailwind の className で素早く行えるようになります。動いていることは、`npm run typecheck` と `npm run build` が成功し、`npm run dev` で表示したトップページの hero、スキルレーダー、project archive、about、contact が崩れていないことで確認します。

## Progress

- [x] (2026-05-05 JST) `AGENTS.md` を読み直し、`docs/requirements.md` が要件の正本であること、主軸デザインが `prototypes/v2` であること、雑な機能開発や大規模リファクタリングでは ExecPlan を使うことを確認した。
- [x] (2026-05-05 JST) 現在の repository が Tailwind をまだ使っていないことを確認した。`package.json` に `tailwindcss` と `@tailwindcss/postcss` はなく、`app/globals.css` に `@import "tailwindcss";` もない。
- [x] (2026-05-05 JST) `docs/requirements.md` が working tree に存在することを確認した。
- [x] (2026-05-05 JST) Tailwind 移行 ExecPlan を、規約ファイルではなく `.agent/exec-plans/tailwind-css-migration.md` に作成した。
- [ ] Tailwind 採用方針を `docs/requirements.md` に追記する。
- [ ] Tailwind 依存関係と PostCSS 設定を追加する。
- [ ] `app/globals.css` を Tailwind import と global base のみに縮小する。
- [ ] `components/PortfolioApp.tsx` の既存 className を Tailwind utility class へ段階的に移行する。
- [ ] 複雑な装飾、疑似要素、keyframes の扱いを最小限の CSS または inline style に整理する。
- [ ] 型チェック、production build、ローカル表示で検証する。

## Surprises & Discoveries

- Observation: 現在の working tree には、この計画作成前から `app/globals.css`, `app/layout.tsx`, `components/PortfolioApp.tsx` の未コミット変更がある。
  Evidence: `git status --short` shows `M app/globals.css`, `M app/layout.tsx`, and `M components/PortfolioApp.tsx`.

- Observation: `docs/requirements.md` は `AGENTS.md` で正本とされており、現在は repository に存在している。
  Evidence: `sed -n '1,120p' docs/requirements.md` displays the requirements draft beginning with `# ポートフォリオサイト要件ドラフト`.

- Observation: この repository の ExecPlan は `.agent/exec-plans/` 配下に 1 計画 1 ファイルで置く必要がある。
  Evidence: User clarified the repository-specific placement rule on 2026-05-05.

## Decision Log

- Decision: Tailwind CSS を採用し、CSS Modules への全面移行は行わない。
  Rationale: ユーザーが Tailwind 利用を明示したため。Next.js 15 では Tailwind と PostCSS の組み合わせが自然で、コンポーネント単位の見た目は utility class で表現できる。
  Date/Author: 2026-05-05 / Codex

- Decision: `app/globals.css` は全体共通だけに限定する。
  Rationale: global CSS は全ルートへ副作用を持つ。ページ固有の `.hero`, `.topbar`, `.sleeve` などを置き続けると、ページ追加時に名前衝突や予期しない上書きが起きやすい。
  Date/Author: 2026-05-05 / Codex

- Decision: レコード盤、レーダー、疑似要素、複雑な gradient は、無理にすべて Tailwind utility へ変換しない。
  Rationale: Tailwind の arbitrary value だけで複雑な装飾を JSX に詰め込むと可読性が落ちる。見た目の核になる特殊表現は、必要最小限の CSS class、CSS variable、または inline style として残すほうが保守しやすい。
  Date/Author: 2026-05-05 / Codex

- Decision: 実装より先に `docs/requirements.md` へ Tailwind 採用方針を反映する。
  Rationale: `AGENTS.md` に、会話で要件が固まったらまず `docs/requirements.md` に反映する、とあるため。
  Date/Author: 2026-05-05 / Codex

- Decision: この計画は `.agent/exec-plans/tailwind-css-migration.md` に置き、`.agent/PLANS.md` には置かない。
  Rationale: repository-specific rule requires one ExecPlan per Markdown file under `.agent/exec-plans/`. `.agent/PLANS.md` is the guidance document, not the location for individual plans.
  Date/Author: 2026-05-05 / Codex

## Outcomes & Retrospective

まだ実装は開始していない。このセクションは、Tailwind 導入、CSS 責務整理、表示検証が終わった時点で、達成したこと、残った課題、次に改善すべき点を追記する。

## Context and Orientation

この repository は、古着とレコードをモチーフにしたエンジニア向けポートフォリオサイトのプロトタイプである。主な要件は `docs/requirements.md` に書かれており、今後の主軸デザインは `prototypes/v2` である。実装は Next.js 15, React 19, TypeScript を使っている。

主要な画面は `app/page.tsx` から `components/PortfolioApp.tsx` を描画する形になっている。`app/layout.tsx` は `app/globals.css` を import しており、この import 位置は Next.js App Router の基本に合っている。

ここでいう global CSS とは、アプリ全体のすべての route に効く CSS のことを指す。たとえば `:root` の色変数、`body` の背景、`a` の基本表示、`button` や `input` の font inheritance などが該当する。逆に、`.hero`, `.topbar`, `.turntable`, `.sleeve`, `.denim-patch` のような特定画面の部品だけに必要な見た目は、global CSS に置くと副作用が大きい。

Tailwind utility class とは、`flex`, `grid`, `px-6`, `text-sm`, `bg-[var(--bg)]` のように、CSS property の小さな単位を JSX の `className` に直接書く方式である。この計画では、余白、色、grid/flex、typography、border、shadow、responsive behavior を Tailwind utility class へ移す。

## Plan of Work

最初に `docs/requirements.md` を更新し、スタイリング方針として Tailwind CSS を採用すること、`app/globals.css` は全体共通の base と token に限定すること、複雑な装飾だけ最小限の CSS として残せることを追記する。これはコード変更ではなく、要件の正本を最新化する作業である。

次に Tailwind を導入する。`package.json` に `tailwindcss` と `@tailwindcss/postcss` を dev dependency として追加し、repository root に `postcss.config.mjs` を作る。`app/globals.css` の先頭には `@import "tailwindcss";` を置く。

その後、`app/globals.css` を縮小する。残すものは `@import "tailwindcss";`, `:root` の theme token、`html`, `body`, `a`, `button`, `input`, `textarea` の base style、全体に影響してよい reduced motion 設定だけにする。画面固有の class selector は原則として削除する。

`components/PortfolioApp.tsx` はセクション単位で Tailwind 化する。順序は topbar、hero、record/radar、skills matrix、archive、about、contact/footer とする。繰り返し出る見た目は、`ButtonLink`, `Chip`, `Tag`, `SectionHead` のような小さな React component または className 定数で整理する。`@apply` は多用しない。Tailwind の利点が薄れ、CSS 側に責務が戻りやすいためである。

レコード盤、レーダー、スリーブ、ケアラベルなどの複雑な装飾は、まず Tailwind で自然に表現できる部分を移す。疑似要素、複雑な repeating gradient、keyframes など、JSX に入れると読みにくくなる部分だけ、少数の専用 CSS class として `app/globals.css` に残すか、コンポーネント近くの小さな CSS に分ける。最終判断は可読性と見た目維持を基準にする。

## Concrete Steps

すべての command は repository root `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio` で実行する。

まず現在の状態を確認する。

    git status --short
    git diff --stat

要件を更新する。`docs/requirements.md` のデザイン方針または技術方針に、Tailwind 採用と global CSS の責務整理を追記する。

Tailwind の依存関係を追加する。

    npm install -D tailwindcss @tailwindcss/postcss

`postcss.config.mjs` を repository root に追加する。内容は Tailwind を PostCSS plugin として有効化する最小構成にする。

    export default {
      plugins: {
        "@tailwindcss/postcss": {}
      }
    };

`app/globals.css` の先頭に Tailwind import を追加し、global base だけに縮小する。

    @import "tailwindcss";

`components/PortfolioApp.tsx` をセクション単位で編集し、既存の global className を Tailwind utility class に置き換える。移行中は各セクションごとに `npm run typecheck` を実行できる状態を保つ。

最後に検証する。

    npm run typecheck
    npm run build
    npm run dev

`npm run dev` の起動後、ブラウザでトップページを表示し、hero、レコード盤、スキルレーダー、Recent Patches、Skill Matrix、Archive、About、Contact が視覚的に崩れていないことを確認する。

## Validation and Acceptance

`npm run typecheck` が成功することを必須にする。成功時は TypeScript compiler がエラーを出さずに終了する。

`npm run build` が成功することを必須にする。Tailwind または PostCSS の設定に問題がある場合、この command で CSS 処理のエラーが出る可能性が高い。

`npm run dev` でローカル起動し、トップページの主要セクションを目視確認する。受け入れ条件は、古着とレコードをモチーフにした既存の世界観が維持され、hero のレコード盤とスキルレーダーが表示され、project archive と about/contact が mobile と desktop の両方で読めることである。

ファイル構成としては、`package.json` に `tailwindcss` と `@tailwindcss/postcss` が入り、`postcss.config.mjs` が存在し、`app/globals.css` が global base 中心に縮小されていることを確認する。`components/PortfolioApp.tsx` は Tailwind className 中心になっていることを確認する。

## Idempotence and Recovery

作業前と各 milestone の後に `git status --short` を確認する。すでに存在する未コミット変更はユーザーまたは直前作業のものとして扱い、勝手に revert しない。

`npm install -D tailwindcss @tailwindcss/postcss` は、依存関係がすでに入っている場合は package manager が重複なく解決するため再実行できる。`postcss.config.mjs` がすでに存在する場合は上書きせず、中身を確認して Tailwind plugin だけを足す。

Tailwind 化の途中で表示が大きく崩れた場合は、セクション単位で差分を見直す。複雑な装飾を無理に utility class に変換している場合は、読みやすい最小 CSS に戻す。`git reset --hard` や `git checkout --` のような破壊的操作は使わない。

## Artifacts and Notes

この計画作成時点の重要な状態は次の通りである。

    git status --short
     M app/globals.css
     M app/layout.tsx
     M components/PortfolioApp.tsx

    package.json currently includes:
      next
      react
      react-dom
      typescript

    package.json does not currently include:
      tailwindcss
      @tailwindcss/postcss

`app/layout.tsx` が `import "./globals.css";` を持つこと自体は維持する。問題は import 位置ではなく、`app/globals.css` に画面固有スタイルを持たせすぎていることである。

## Interfaces and Dependencies

新しく使う dependency は `tailwindcss` と `@tailwindcss/postcss` である。`tailwindcss` は utility class から CSS を生成する styling engine である。`@tailwindcss/postcss` は Next.js の CSS build pipeline が Tailwind を処理できるようにする PostCSS plugin である。

新しく存在すべき file は `postcss.config.mjs` である。既存の `app/layout.tsx` は `import "./globals.css";` のままでよい。`app/globals.css` は Tailwind import と全体共通 base style の入口になる。`components/PortfolioApp.tsx` は Tailwind className を中心に持つ主要 UI component のままである。

改訂 note: 2026-05-05 に、この ExecPlan を `.agent/exec-plans/tailwind-css-migration.md` として作成した。理由は、ユーザーが Tailwind 採用を明示し、repository-specific rule が ExecPlan を `.agent/exec-plans/` 配下の 1 計画 1 Markdown ファイルに置くよう求めているためである。
