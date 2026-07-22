# Hero レコード盤 CSS をコンポーネント境界へ寄せる

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

この ExecPlan は `.agent/PLANS.md` に従って管理する。この計画は `issue-3-css-refactor` ブランチで作業し、実装 PR は既存の Hero レーダー修正 PR `#9` の head branch である `issue-3-radar-fix-clean` を base にする stacked PR として扱う。

## Purpose / Big Picture

Hero のレコード盤レーダーは見た目の複雑さが高く、現在は `app/globals.css` に Hero 専用の class selector が多く集まっている。プロジェクト方針では `app/globals.css` を Tailwind import、CSS 変数、`html`、`body`、フォーム要素などの全体共通スタイルに限定し、セクションやコンポーネント固有の見た目は React コンポーネント側の Tailwind utility class または必要最小限の局所 CSS に寄せることになっている。

この変更では、Hero レコード盤にだけ使われている CSS を `components/portfolio/HeroTurntable.module.css` へ移し、`app/globals.css` の責務を小さくする。変更後もユーザーから見た挙動は変えない。PC では hover と focus/click によってレーダーが表示され、スマホでは tap toggle と外側 tap close が維持される。確認は `npm run typecheck`、`npm run build`、代表 viewport での目視またはブラウザ確認で行う。

## Progress

- [x] (2026-05-28 JST) `issue-3-radar-fix-clean` から `issue-3-css-refactor` ブランチを作成した。
- [x] (2026-05-28 JST) `app/globals.css`、`components/portfolio/HeroTurntable.client.tsx`、`components/portfolio/SkillMatrix.client.tsx`、`docs/requirements.md` を調査した。
- [x] (2026-05-28 JST) Hero 専用 class が `HeroTurntable.client.tsx` からのみ参照されていることを確認した。
- [x] (2026-05-28 JST) 実装前の変更方針をこの ExecPlan に記録した。
- [x] (2026-06-02 JST) `components/portfolio/HeroTurntable.module.css` を作成し、Hero 専用 CSS を移した。
- [x] (2026-06-02 JST) `HeroTurntable.client.tsx` を CSS Module import と `styles.*` 参照へ更新した。
- [x] (2026-06-02 JST) `app/globals.css` から Hero 専用 CSS を削除し、全体共通 CSS と今回対象外の既存装飾 CSS だけを残した。
- [x] (2026-06-02 JST) `npm run typecheck`、`npm run build`、Playwright による desktop/mobile 確認を実行した。

## Surprises & Discoveries

- Observation: Hero レコード盤用の class selector は `components/portfolio/HeroTurntable.client.tsx` からのみ参照されている。
  Evidence: `rg "record-grooves|record-shine|hero-turntable|record-center-label|record-radar-surface|hero-radar|radar-paper|radar-fill|hero-axis-caption|record-spindle" -n app components lib docs` の結果は `app/globals.css` と `components/portfolio/HeroTurntable.client.tsx` に閉じていた。

- Observation: `app/globals.css` には Hero 以外にも Skill Matrix とページ装飾の class selector が残っている。
  Evidence: `.matrix-radar`、`.skill-polygon`、`.svg-button`、`.point` は `components/portfolio/SkillMatrix.client.tsx` から参照され、`.denim-texture`、`.barcode` などはページ装飾として使われている。

- Observation: `components/portfolio/HeroTurntable.client.tsx` はすでに outside tap close の `matchMedia` state を持たない形になっている。
  Evidence: 現在の `HeroTurntable()` は `isHeroRadarOpen` と `buttonRef` だけを持ち、open 中だけ passive な `pointerdown` listener を張る。

- Observation: このセッションでは in-app browser の `iab` backend を取得できなかったため、画面確認は Playwright に切り替える必要があった。
  Evidence: browser runtime setup は `Browser is not available: iab` を返した。

- Observation: mobile viewport では Hero レコード盤がファーストビュー外にあり、初回の tap 検証は対象に届いていなかった。
  Evidence: `hero-mobile-open.png` の初回出力では Hero の上部しか写っておらず、`aria-pressed` も変化しなかった。`scrollIntoViewIfNeeded()` 後の再実行では `false -> true -> false -> true -> false` を確認できた。

## Decision Log

- Decision: CSS リファクタは `issue-3-radar-fix-clean` から切った `issue-3-css-refactor` で進める。
  Rationale: 今回整理したい CSS は PR `#9` の Hero レーダー修正差分に依存している。`main` から切ると同じ selector 周辺で衝突しやすく、PR `#9` に直接積むとスマホ操作修正と構造整理が混ざる。
  Date/Author: 2026-05-28 / Codex

- Decision: 今回の実装対象は Hero レコード盤 CSS に限定する。
  Rationale: `app/globals.css` には Skill Matrix やページ装飾の CSS も残っているが、それらまで同時に動かすとレビュー範囲が広がる。PR `#9` に積む変更としては、Hero 専用 CSS の移動が最小で効果が高い。
  Date/Author: 2026-05-28 / Codex

- Decision: Hero の複雑な装飾 CSS は Tailwind utility へ無理に分解せず、CSS Module へ移す。
  Rationale: レコード盤の溝、shine、中心ラベル、レーダー surface、SVG 内部要素、hover media query、`data-radar-open` 条件は selector と疑似要素を使う方が読みやすい。`docs/requirements.md` は複雑な装飾について必要最小限の CSS class 併用を許容している。
  Date/Author: 2026-05-28 / Codex

- Decision: Hero の回転 animation は `motion-safe-spin` のような分離 class にせず、`.grooves` selector に内包して reduced motion も同じ module 内で扱う。
  Rationale: 現在の DOM は `record-grooves motion-safe-spin` の 2 class で animation を成立させているが、Hero でしか使っていない。CSS Module 化に合わせて `grooves` が背景と animation の両方を持つ方が class 設計が単純になる。
  Date/Author: 2026-05-28 / Codex

## Outcomes & Retrospective

`HeroTurntable` 専用 CSS は `components/portfolio/HeroTurntable.module.css` へ移動し、`app/globals.css` から Hero 固有 selector と `slow-spin` / `.motion-safe-spin` を削除した。`components/portfolio/HeroTurntable.client.tsx` は `cn()` と CSS Module class を組み合わせる形に更新し、公開 API や interaction state は変えていない。

検証では `npm run typecheck` と `npm run build` が成功した。Playwright の mobile 検証では `aria-pressed` が `false -> true -> false -> true -> false` で遷移し、外側 tap close も維持されていた。desktop screenshot では hover 時のレーダー表示、mobile screenshot では open 時のレーダー面とラベル表示を確認した。

## Context and Orientation

このリポジトリは Next.js App Router、React、TypeScript、Tailwind CSS を使う静的ポートフォリオサイトである。`docs/requirements.md` のスタイリング方針では、`app/globals.css` は全体共通スタイルに限定し、コンポーネント固有の見た目は React コンポーネント側の Tailwind utility class を原則とする。ただし、レコード盤、レーダー、縫い目、ラベルのような複雑な装飾は、可読性を優先して必要最小限の CSS class や inline style を併用してよい。

`components/portfolio/HeroTurntable.client.tsx` はトップページ Hero のレコード盤型 button を描画する client component である。client component とは、ブラウザ上で state や event handler を使う React component のことで、このファイルは `"use client"` によって client component として扱われる。Hero レコード盤は `data-radar-open` 属性で開閉状態を DOM に出し、CSS がその属性を見てレーダー面、中心ラベル、caption の表示状態を変えている。

`app/globals.css` は現在、Tailwind import、CSS 変数、全体要素スタイルに加えて、Hero レコード盤、Skill Matrix、ページ装飾の class selector をまとめて持っている。今回移動する候補は `.hero-turntable`、`.record-grooves`、`.record-shine`、`.record-center-label`、`.record-label-top`、`.record-label-bottom`、`.record-radar-surface`、`.hero-radar`、`.hero-radar-ring`、`.radar-paper`、`.radar-fill`、`.record-spindle`、`.hero-axis-caption`、`slow-spin`、`.motion-safe-spin` である。実装では `motion-safe-spin` を残さず、`grooves` selector の中へ animation を吸収する。

CSS Module とは、`HeroTurntable.module.css` のように component と近い場所へ置く CSS ファイルで、import した `styles` object を通じて class 名を参照する仕組みである。Next.js は CSS Module を標準で扱える。CSS Module を使うと class 名は build 時に一意化されるため、Hero 固有の selector が他の画面へ漏れにくい。

## Plan of Work

最初に `components/portfolio/HeroTurntable.module.css` を追加する。この file へ、Hero レコード盤に閉じた selector を移す。global class 名ではなく、CSS Module の local class 名として `turntable`、`grooves`、`shine`、`centerLabel`、`labelTop`、`labelBottom`、`radarSurface`、`radar`、`radarRing`、`radarPaper`、`radarFill`、`spindle`、`axisCaption` などに整理する。class 名は DOM の意味に合わせ、既存の見た目が変わらないよう properties は原則そのまま移す。回転 animation と reduced motion は `grooves` と module 内の `@media (prefers-reduced-motion: reduce)` に閉じる。

次に `components/portfolio/HeroTurntable.client.tsx` を更新する。`import styles from "./HeroTurntable.module.css";` を追加し、既存の global class 名を `styles.*` に置き換える。Tailwind utility class は `cn()` helper または template literal を使って CSS Module class と結合する。すでに `components/portfolio/styles.ts` に `cn()` があるため、新しい helper は作らず `cn` を import して使う。SVG 内の `className` も `styles.radar`、`styles.radarRing`、`styles.radarPaper`、`styles.radarFill` に置き換える。

`app/globals.css` から Hero 専用 selector と Hero 専用 animation を削除する。`@import`、`@source`、`:root`、`html`、`body`、`a`、`button/input/textarea`、`button`、既存の Skill Matrix とページ装飾 CSS は残す。Skill Matrix の `.matrix-radar` なども将来的には CSS Module 化候補だが、今回の PR では触らない。

`prefers-reduced-motion` は Hero module 内で `.grooves` の animation を止める形にする。global の `html { scroll-behavior: auto; }` は全体共通なので `app/globals.css` に残す。

最後に検証する。`npm run typecheck` と `npm run build` を実行し、CSS Module import と Next.js build が通ることを確認する。可能なら dev server を起動して 390px、768px、1440px の代表幅で Hero を確認し、レコード盤、中心ラベル、レーダー面、axis caption の表示が実装前と同等であることを見る。PC hover、focus、click toggle、mobile tap toggle、outside tap close の動作が変わらないことを acceptance とする。

## Concrete Steps

作業ディレクトリは `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio`。

現在のブランチを確認する。

    git status --short --branch

期待する状態は `## issue-3-css-refactor` である。未追跡の `playwright-report/`、`test-results/`、`te.md` があっても、この CSS リファクタの commit には含めない。

Hero 専用 CSS の参照状況を確認する。

    rg "record-grooves|record-shine|hero-turntable|record-center-label|record-radar-surface|hero-radar|radar-paper|radar-fill|hero-axis-caption|record-spindle" -n app components lib docs

`components/portfolio/HeroTurntable.module.css` を作成し、`app/globals.css` から Hero 専用 CSS を移す。`HeroTurntable.client.tsx` では `styles` と `cn` を import して className を組み立てる。

差分を確認する。

    git diff -- app/globals.css components/portfolio/HeroTurntable.client.tsx components/portfolio/HeroTurntable.module.css

型検査と build を実行する。

    npm run typecheck
    npm run build

必要に応じて dev server を起動してブラウザ確認する。

    npm run dev

## Validation and Acceptance

`npm run typecheck` が成功すること。成功時は TypeScript の error が出ず、command が exit code 0 で終わる。

`npm run build` が成功すること。Next.js の build が CSS Module を処理でき、static export 前提の production build が通る。

ブラウザ確認では、トップページ Hero のレコード盤が実装前と同じ見た目で表示されること。PC 幅では hover でレーダーが表示され、hover を外すと固定表示していない限り戻る。click すると `aria-pressed` と `data-radar-open` が切り替わり、レーダー表示が固定される。keyboard focus では focus ring とレーダー表示が確認できる。mobile 幅では tap で開閉し、開いた状態で Hero 外を tap すると閉じる。

`app/globals.css` の acceptance は、Hero 固有 selector と Hero 専用 animation が残っていないことである。具体的には、実装後に次の検索を行い、`app/globals.css` から該当が出ないことを確認する。

    rg "hero-turntable|record-grooves|record-shine|record-center-label|record-label-top|record-label-bottom|record-radar-surface|hero-radar|hero-radar-ring|radar-paper|radar-fill|hero-axis-caption|record-spindle|slow-spin|motion-safe-spin" app/globals.css

## Idempotence and Recovery

この作業は CSS と className の移動であり、データ変更や破壊的操作を含まない。途中で見た目が崩れた場合は、`git diff` で `app/globals.css` から移した property と `HeroTurntable.module.css` の property を照合し、漏れた selector を戻す。未追跡の `playwright-report/`、`test-results/`、`te.md` は今回の作業に含めない。

branch を作り直す場合は、`issue-3-radar-fix-clean` に戻ってから `issue-3-css-refactor` を再作成する。ただし既存 branch の削除は破壊的操作なので、必要になった場合はユーザーに確認してから行う。

## Artifacts and Notes

調査時点の branch 状態:

    ## issue-3-radar-fix-clean...origin/main [ahead 3]
    ?? playwright-report/
    ?? te.md
    ?? test-results/

ブランチ作成後:

    Switched to a new branch 'issue-3-css-refactor'

関連する要件:

    docs/requirements.md:
    - app/globals.css は Tailwind import、CSS変数、html、body、フォーム要素などの全体共通スタイルに限定する
    - セクションやコンポーネント固有の見た目は、原則として React コンポーネント側の Tailwind utility class で表現する
    - レコード盤、レーダー、縫い目、ラベルなどの複雑な装飾は、可読性を優先し、必要最小限の CSS class や inline style を併用してよい

## Interfaces and Dependencies

`components/portfolio/HeroTurntable.client.tsx` は引き続き `HeroTurntable()` を export する。外部 API は変えない。内部で `styles` object を import し、CSS Module の class 名を参照する。

`components/portfolio/HeroTurntable.module.css` は Hero レコード盤専用の CSS を持つ。親 button の local class は `turntable` とし、`button[data-radar-open="true"]` と `:focus-visible` を使って子要素の見た目を変える。hover は `@media (hover: hover) and (pointer: fine)` の中に閉じる。

`app/globals.css` は Tailwind import、source 指定、CSS 変数、全体 element style、Skill Matrix とページ装飾の既存 selector を残す。Hero 専用 selector は残さない。

変更履歴:

- 2026-05-28: `issue-3-css-refactor` ブランチで調査と実装前方針を作成した。実装コードはまだ変更していない。
- 2026-06-02: CSS Module 化、`globals.css` の整理、typecheck/build/Playwright 検証結果を反映した。
