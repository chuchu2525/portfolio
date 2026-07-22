# Hero レコード盤レーダーのモバイル操作を修正する

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

この ExecPlan は `./.agent/PLANS.md` に従って管理する。

## Purpose / Big Picture

トップページ先頭の Hero にあるレコード盤レーダーは、PC では hover で自然に見られるが、スマホでは tap 後に見た目が戻らないことがある。この作業では、対象を Skill Matrix ではなく Hero のレコード盤 UI に限定し、desktop は hover preview のみ、mobile は tap で開閉できるようにする。

変更後、PC ユーザーは hover で一時表示できる。スマホユーザーは 1 回 tap でレーダーを開き、もう 1 回 tap または外側 tap で閉じられる。これにより「タップすると戻らなくなる」状態を避けつつ、スマホでもレーダーを見られる。

## Progress

- [x] (2026-05-25 JST) Hero レコード盤と Skill Matrix を切り分け、今回の対象が Hero レコード盤であることを確認した。
- [x] (2026-05-25 JST) 現状の問題が `:hover` と `data-radar-open` の見た目条件混在にあることを確認した。
- [x] (2026-05-26 JST) 一度 long press 案を試したが、操作性が期待と合わないため採用しない判断に変更した。
- [x] (2026-05-26 JST) 当初方針を desktop は hover + click、mobile は tap toggle + outside tap close とした。
- [x] (2026-05-26 JST) `origin/main` から clean branch `issue-3-radar-fix-clean` を作成した。
- [x] (2026-05-26 JST) clean branch に Hero 関連の最終差分だけを適用し、テスト自動化コミットを PR から除外する状態にした。
- [x] (2026-05-26 JST) clean branch で `npm run typecheck` と `npm run build` が成功することを確認した。
- [x] (2026-05-26 JST) clean branch を commit / push し、Hero レーダー専用 PR `#9` を作成した。
- [x] (2026-05-26 JST) 旧 PR `#8` を close した。
- [x] (2026-05-28 JST) outside tap close の実装から `matchMedia` 購読 state を削除し、open 中だけ `pointerdown` listener を張る形に簡素化した。
- [x] (2026-05-28 JST) Playwright で mobile viewport の tap toggle と outside tap close を確認した。
- [x] (2026-06-07 JST) 仕様を見直し、desktop の mouse click では toggle しない形へ更新した。

## Surprises & Discoveries

- Observation: `issue-3-radar-fix` はローカル `main` から切られていたため、`origin/main` にはない `テスト自動化と品質チェックを追加` コミットが PR に混ざった。
  Evidence: `git log --oneline origin/main..issue-3-radar-fix` に `7b9e071 テスト自動化と品質チェックを追加` が含まれていた。

- Observation: `origin/main` には Playwright / Vitest の実行基盤がまだない。
  Evidence: `origin/main` の `package.json` は `dev`, `build`, `start`, `typecheck` のみを持つ。

- Observation: mobile の hover 残りを避けるには、CSS の `:hover` ルールを `@media (hover: hover) and (pointer: fine)` に閉じる必要がある。
  Evidence: 従来の CSS は `.hero-turntable:hover` と `.hero-turntable[data-radar-open="true"]` を同じ見た目条件として扱っていた。

- Observation: outside tap close には `matchMedia` を state として購読する必要はない。
  Evidence: open 中だけ `pointerdown` listener を張り、`event.pointerType === "mouse"` を除外すれば、mobile/tablet の外側 tap を閉じる用途を満たせる。

- Observation: desktop の click toggle を残すと、hover preview のみを期待する current spec とズレる。
  Evidence: 2026-06-07 JST 時点で `onPointerDown` 側で `event.pointerType === "mouse"` を除外する実装へ変更した。

## Decision Log

- Decision: clean branch は `origin/main` から作成する。
  Rationale: PR は今回レビューしたい Hero レーダー修正だけを含めるべきで、テスト自動化コミットを混ぜないため。
  Date/Author: 2026-05-26 / Codex

- Decision: mobile は long press ではなく tap toggle にする。
  Rationale: long press はスクロール、標準メニュー、押下時間しきい値と競合しやすく、ユーザーからも tap 切り替えの方がよいという判断が出たため。
  Date/Author: 2026-05-26 / Codex

- Decision: desktop は hover preview のみとし、mouse click では toggle しない。
  Rationale: current spec では PC で hover だけ見えればよく、固定表示の click 挙動は不要と判断したため。
  Date/Author: 2026-06-07 / Codex

- Decision: clean PR には `e2e/home.spec.ts` を含めない。
  Rationale: `origin/main` には Playwright 基盤がないため、今回の Hero 修正 PR に E2E 基盤を混ぜると再びスコープが広がるため。
  Date/Author: 2026-05-26 / Codex

- Decision: outside tap close は `isHeroRadarOpen` だけを状態として持ち、pointer 種別はイベント時に判定する。
  Rationale: `matchMedia` の購読 state を持つと effect と render が増えるため。今回必要なのは、開いている間だけ外側の touch/pen pointer を拾って閉じることに限定できる。
  Date/Author: 2026-05-28 / Codex

## Outcomes & Retrospective

旧 PR ではテスト自動化コミットが混ざり、レビュー範囲が不明確になった。clean branch では `origin/main` を起点にし、Hero レコード盤の実装と CSS のみに絞ることで、PR の目的を「Hero レーダーのスマホ操作修正」に戻した。

最終仕様は、desktop が hover preview のみ、mobile が tap toggle と outside tap close である。hover スタイルは fine pointer に限定し、mobile では `data-radar-open` による表示だけで開閉する。outside tap close は open 中だけ `window` の `pointerdown` を監視し、mouse pointer は対象外にする。

## Context and Orientation

対象ファイルは `components/portfolio/HeroTurntable.client.tsx` と `components/portfolio/HeroTurntable.module.css` である。`HeroTurntable.client.tsx` は Hero のレコード盤 button を描画し、`data-radar-open` を使ってレーダー表示状態を CSS へ渡している。`HeroTurntable.module.css` はレコード盤、中心ラベル、レーダー表示面、caption の見た目をコンポーネント内に閉じて制御している。

Skill Matrix は `components/portfolio/SkillMatrix.client.tsx` にあり、今回の修正対象ではない。Skill Matrix は常に 1 属性を選択する navigation UI で、Hero のレコード盤 preview とは責務が違う。

## Plan of Work

`origin/main` から clean branch を切り、旧ブランチから `components/portfolio/HeroTurntable.client.tsx` と Hero レコード盤用 CSS の最終差分だけを持ってくる。`e2e/home.spec.ts` や package 周辺のテスト自動化ファイルは含めない。

`HeroTurntable.client.tsx` では、touch/pen の `pointerdown` と keyboard 操作で `isHeroRadarOpen` を toggle する。`isHeroRadarOpen` が true の間だけ window の `pointerdown` を passive listener として監視し、mouse pointer は無視する。button 外の touch/pen pointer を検知したら close する。

`HeroTurntable.module.css` では、hover 表示を `@media (hover: hover) and (pointer: fine)` に限定する。`data-radar-open="true"` と `focus-visible` の表示は維持する。これにより PC hover は残しつつ、mobile で hover 相当の見た目が残る状態を避ける。

## Concrete Steps

作業ディレクトリは `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio`。

clean branch を作成する。

    git checkout -b issue-3-radar-fix-clean origin/main

必要なファイルだけ旧ブランチから持ってくる。

    git checkout issue-3-rader-fix -- app/globals.css components/portfolio/HeroTurntable.client.tsx .agent/exec-plans/issue-3-rader-fix.md

差分が Hero 関連ファイルとこの ExecPlan に限定されていることを確認する。

    git diff --name-status origin/main

検証する。

    npm run typecheck
    npm run build

mobile viewport の tap 挙動を Playwright で確認する。初期状態は `data-radar-open="false"`、レコード tap で `true`、外側 tap で `false`、再 tap で `true`、同一ボタン tap で `false` になることを確認する。

commit して push し、PR を作る。

    git add app/globals.css components/portfolio/HeroTurntable.client.tsx .agent/exec-plans/issue-3-rader-fix.md
    git commit -m "Heroレーダーのスマホ操作を修正"
    git push origin issue-3-radar-fix-clean

## Validation and Acceptance

`npm run typecheck` が成功すること。`npm run build` が成功すること。`origin/main` からの差分が Hero 関連ファイルとこの ExecPlan に限定されていること。

動作仕様として、desktop では hover 中にレーダーが表示され、mouse click では `aria-pressed` と `data-radar-open` は切り替わらない。mobile では tap で開閉し、開いた状態で Hero 外を tap すると閉じる。Playwright では mobile viewport で `false -> true -> false -> true -> false` の状態遷移と console error なしを確認する。

## Idempotence and Recovery

clean branch は `origin/main` から作り直せる。旧ブランチ `issue-3-rader-fix` はそのまま残し、必要なファイルの参照元としてだけ使う。未追跡の `te.md` や生成された test output は commit に含めない。

## Artifacts and Notes

現在の意図した PR 差分:

    .agent/exec-plans/issue-3-rader-fix.md
    app/globals.css
    components/portfolio/HeroTurntable.client.tsx

旧 PR `#8` はテスト自動化コミットを含むため、新しい clean PR 作成後に close する。

## Interfaces and Dependencies

`components/portfolio/HeroTurntable.client.tsx` は `HeroTurntable()` を export する。追加する状態は `isHeroRadarOpen: boolean` で、DOM 参照として `buttonRef: HTMLButtonElement | null` を持つ。button は `aria-pressed={isHeroRadarOpen}` と `data-radar-open={isHeroRadarOpen}` を持つ。

`components/portfolio/HeroTurntable.module.css` では、`.turntable:hover ...` の表示ルールを `@media (hover: hover) and (pointer: fine)` の内側に置く。`.turntable[data-radar-open="true"] ...` は touch/pen と keyboard による open state として残す。

変更履歴:

- 2026-05-26: clean branch 用に ExecPlan を最終仕様へ整理し直した。
- 2026-05-28: outside tap close の実装簡素化と Playwright 確認結果を反映した。
- 2026-06-07: desktop の mouse click を無効化した current spec に合わせて文面を更新した。
