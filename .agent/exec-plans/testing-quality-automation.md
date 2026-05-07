# テストと品質自動化の実装

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows `.agent/PLANS.md`. It is self-contained so a contributor can resume from this file with only the current repository checkout.

## Purpose / Big Picture

この作業は、`docs/test-design.md` にまとめたテスト設計を、実際に実行できる品質ゲートへ落とし込むものです。完了後、開発者は `npm run test` でデータ集計とReact UIの主要挙動を確認でき、`npm run test:e2e` で実ブラウザの主要導線を確認でき、`npm run security:zap` と `npm run lhci` の足場でリリース前のセキュリティとパフォーマンス確認を始められます。

このリポジトリは Next.js App Router、React、TypeScript、Tailwind CSS を使う静的ポートフォリオです。現在の主なアプリケーションコードは `app/`、`components/`、`lib/portfolio-data.ts` にあります。テスト対象は、経験データからスキルスコアを集計するロジック、レーダー座標計算、Homeの主要セクション、Skill Matrix、Project Archive、Contact導線です。

## Progress

- [x] (2026-05-06 21:20 JST) 現行構成、`docs/test-design.md`、`.agent/PLANS.md`、主要コンポーネントを確認した。
- [x] (2026-05-06 21:33 JST) Vitest と Testing Library の設定、ユニットテスト、コンポーネントテストを追加した。
- [x] (2026-05-06 21:33 JST) Playwright と axe のE2Eテストを追加した。
- [x] (2026-05-06 21:33 JST) Lighthouse CI と OWASP ZAP Baseline Scan の設定とスクリプトを追加した。
- [x] (2026-05-07 00:16 JST) `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build`、`npm run test:e2e` を実行し、すべて通過した。`npm run security:zap` は `ZAP_TARGET_URL` 未指定時に明確なエラーを返すことを確認した。

## Surprises & Discoveries

- Observation: 作業開始時点で `te.md` が未追跡ファイルとして存在する。
  Evidence: `git status --short` showed `?? te.md`.
- Observation: `docs/test-design.md` はすでに ZAP Baseline Scan まで含む設計になっている。
  Evidence: `rg -n "OWASP|ZAP" docs/test-design.md` finds the vulnerability diagnosis section.
- Observation: トップページは `FeaturedProjectsSection` を表示し、全件Archiveは `/projects` に分かれている。
  Evidence: `components/PortfolioApp.tsx` imports `FeaturedProjectsSection`; `app/projects/page.tsx` renders `ProjectArchive`.
- Observation: `npm run test` initially failed before running tests because `jsdom@27` pulled an ESM-only dependency through a CommonJS path in this Node environment.
  Evidence: Vitest reported `require() of ES Module ... @csstools/css-calc/dist/index.mjs not supported` from `@asamuzakjp/css-color`.
- Observation: `npm run lint` caught Next internal navigation anchors and React Compiler memoization preservation issues.
  Evidence: ESLint reported `@next/next/no-html-link-for-pages` in `components/portfolio/Header.tsx` and `react-hooks/preserve-manual-memoization` in `components/portfolio/SkillMatrix.client.tsx`.
- Observation: Playwright axe checks found two real accessibility issues: footer text contrast and focusable radar controls nested inside an SVG exposed as `role="img"`.
  Evidence: E2E output reported `color-contrast` for `footer > span` and `nested-interactive` for `.matrix-radar`.
- Observation: Full cross-browser E2E is heavy enough that Firefox/WebKit can hit the default 30s timeout on this local machine.
  Evidence: `npm run test:e2e` reached 32 passing tests but timed out in WebKit accessibility and Firefox detail navigation.
- Observation: Archive のフィルタ操作と詳細ページ表示を同じテスト内でクライアント遷移させると、WebKitで別ナビゲーションと競合することがあった。
  Evidence: WebKit reported navigation to `/projects/care-label-auth` interrupted by navigation to `/projects`.
- Observation: Final validation passed after splitting the Archive link check and detail page check into separate observations.
  Evidence: `npm run test:e2e` reported `40 passed (54.5s)`.

## Decision Log

- Decision: ユニット/コンポーネントテストは Vitest + Testing Library を採用する。
  Rationale: `docs/test-design.md` の第一候補であり、純粋関数とReactコンポーネント中心のこのリポジトリでは起動が軽く扱いやすい。
  Date/Author: 2026-05-06 / Codex
- Decision: E2Eは Playwright、アクセシビリティ自動チェックは `@axe-core/playwright` を使う。
  Rationale: Playwright の role-based locator と axe の自動チェックを組み合わせると、設計書のユーザー視点テストと WCAG 2.2 AA 相当の初期チェックを実装しやすい。
  Date/Author: 2026-05-06 / Codex
- Decision: OWASP ZAP は npm package ではなく Docker 実行スクリプトとして用意する。
  Rationale: ZAP公式の Baseline Scan は Docker image での実行が標準的で、リポジトリ側に重い依存を追加せずにCIや手元で使える。
  Date/Author: 2026-05-06 / Codex
- Decision: Skill Matrix のSVGコンテナから `role="img"` を外し、各軸の `role="button"` と `aria-label` をアクセシブル操作面として残す。
  Rationale: 画像ロールを持つSVGの中にフォーカス可能な操作要素があると、支援技術でネストしたインタラクティブ要素として扱われるため。
  Date/Author: 2026-05-06 / Codex
- Decision: E2EのProject Archiveテストでは、フィルタ後のカードリンク `href` と詳細ページの直接表示を別テストに分ける。
  Rationale: ユーザーに見える導線と詳細ページ生成の両方を検証しつつ、ブラウザごとのクライアント遷移タイミングに依存しない安定したテストにするため。
  Date/Author: 2026-05-07 / Codex

## Outcomes & Retrospective

テストと品質自動化の初期実装は完了した。`package.json` に `lint`、`test`、`test:watch`、`test:e2e`、`test:e2e:ui`、`lhci`、`security:zap` を追加し、Vitest、Testing Library、Playwright、axe、Lighthouse CI、OWASP ZAP Baseline Scan の足場を用意した。`__tests__/` に 21 件のユニット/コンポーネントテストを追加し、`e2e/` に 40 件のブラウザテストとアクセシビリティスモークテストを追加した。

検証結果は、`npm run typecheck` 成功、`npm run lint` 成功、`npm run test` で 21 passed、`npm run build` 成功、`npm run test:e2e` で 40 passed。`npm run security:zap` は `ZAP_TARGET_URL` 未指定時に意図通り使い方を表示して失敗する。Lighthouse CI は設定とscriptを追加済みだが、temporary public storage upload を伴うため、この実装ターンでは実行していない。

副次的に、Header の内部リンクを `next/link` に変更し、React Compiler の memoization 警告を避けるため不要な `useMemo` を外し、footer のコントラストと Skill Matrix のSVGアクセシビリティ構造を改善した。

## Context and Orientation

`package.json` には現在 `dev`、`build`、`start`、`typecheck` のみがある。テスト実装後は `lint`、`test`、`test:watch`、`test:e2e`、`test:e2e:ui`、`lhci`、`security:zap` を追加する。

`lib/portfolio-data.ts` はスキル属性、プロジェクト、集計関数を持つ。重要な関数は `scoreContribution`、`getSkillScore`、`getAttributeById`、`getContributingProjects`、`getProjectsBySkillAttribute`、`getProjectById` である。

`components/portfolio/radar.ts` はレーダーチャートの座標計算を持つ。重要な関数は `getPoint`、`pointsToString`、`getHeroAxisStyle`、`buildRadarGeometry` である。

`components/portfolio/*.tsx` はUIセクションに分割されている。`HeroTurntable.client.tsx` はクリックで `aria-pressed` を切り替える。`SkillMatrix.client.tsx` は属性チップとSVG上のボタンでField Notesを切り替える。`ProjectArchive.client.tsx` は属性でプロジェクトを絞り込む。

`E2E` は end-to-end test の略で、ブラウザを起動してユーザー操作に近い形でアプリ全体を確認するテストである。`a11y` は accessibility の略で、キーボード操作や支援技術で使いやすいかを確認する品質観点である。`ZAP Baseline Scan` は OWASP ZAP が対象URLを巡回して、受動的にセキュリティ設定不備を探す診断である。受動的とは、フォーム攻撃などの破壊的なリクエストを送らず、通常のレスポンスを観察する方式を指す。

## Plan of Work

最初にテストツールを devDependencies に追加する。必要な依存は Vitest、jsdom、Testing Library、Playwright、axe、ESLint、Lighthouse CI である。依存追加後、`vitest.config.ts` と `vitest.setup.ts` を作成し、Reactコンポーネントテストが `jsdom` 上で動くようにする。

次に `__tests__/` を作り、`portfolio-data.test.ts`、`radar.test.ts`、`PortfolioApp.test.tsx` を追加する。テストはCSS classではなく role、label、visible text を使う。Next.js の `Link` は通常の anchor としてjsdomでレンダリングできるため特別なmockは不要にする。

その後 `playwright.config.ts` と `e2e/` を追加する。`webServer` で `npm run dev` を起動し、Chromium / Firefox / WebKit に対して主要導線を確認する。アクセシビリティは `@axe-core/playwright` でトップページを検査し、重大違反がないことを確認する。

最後に `.lighthouserc.json`、`.zap/rules.tsv`、`scripts/run-zap-baseline.mjs` を追加する。ZAPスクリプトは `ZAP_TARGET_URL` が指定されていない場合に分かりやすく失敗し、指定されている場合は `docker run ghcr.io/zaproxy/zaproxy:stable zap-baseline.py` を呼び出す。これにより、Dockerが使える環境では同じnpm scriptでZAP Baseline Scanを実行できる。

## Concrete Steps

Working directory is `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio`.

1. Add dependencies with npm:
   `npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react eslint eslint-config-next @playwright/test @axe-core/playwright @lhci/cli`

2. Edit `package.json` scripts to add:
   `lint`, `test`, `test:watch`, `test:e2e`, `test:e2e:ui`, `lhci`, `security:zap`.

3. Add config files:
   `vitest.config.ts`, `vitest.setup.ts`, `eslint.config.mjs`, `playwright.config.ts`, `.lighthouserc.json`, `.zap/rules.tsv`, `scripts/run-zap-baseline.mjs`.

4. Add tests under `__tests__/` and `e2e/`.

5. Run validation commands:
   `npm run typecheck`
   `npm run lint`
   `npm run test`
   `npm run build`
   `npm run test:e2e`

If Playwright browsers are not installed, run `npx playwright install` before `npm run test:e2e`. This may need network access and can be retried later in CI.

## Validation and Acceptance

Acceptance for the first milestone is that `npm run test` passes and reports unit/component tests covering `portfolio-data`, `radar`, `HeroTurntable`, `SkillMatrix`, `ProjectArchive`, and `PortfolioApp` behavior.

Acceptance for the second milestone is that `npm run test:e2e` can start the Next.js dev server and exercise Home, Skill Matrix, Project Archive, and axe checks. If browsers are missing in the local environment, the plan records that blocker and the exact install command.

Acceptance for the third milestone is that `npm run lhci` and `npm run security:zap` exist. `npm run security:zap` should fail with a clear message when `ZAP_TARGET_URL` is missing, and should run Docker when it is provided.

## Idempotence and Recovery

All edits are additive or configuration updates. Re-running tests is safe. Re-running `npm install` is safe and updates `package-lock.json` consistently. If a dependency install fails because of network restrictions, retry the same npm command with network approval. Do not remove or modify `te.md`, because it is an unrelated untracked file present before this plan.

If Playwright browser installation fails, keep the test files and config; CI or a later local run can execute `npx playwright install`. If ZAP Docker is unavailable locally, the npm script should still be present and explain required environment variables.

## Artifacts and Notes

Validation summary:

    npm run typecheck
    # success

    npm run lint
    # success

    npm run test
    # Test Files  3 passed (3)
    # Tests       21 passed (21)

    npm run build
    # Compiled successfully
    # Generated static pages (9/9)

    npm run test:e2e
    # 40 passed (54.5s)

    npm run security:zap
    # ZAP_TARGET_URL is required. Example: ZAP_TARGET_URL=https://example.com npm run security:zap

## Interfaces and Dependencies

`vitest.config.ts` must export a Vite/Vitest config using `@vitejs/plugin-react`, `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`, and an alias for `@` to the repository root.

`vitest.setup.ts` must import `@testing-library/jest-dom/vitest`.

`playwright.config.ts` must set `testDir: "./e2e"`, `baseURL: "http://127.0.0.1:3000"`, representative projects for Chromium / Firefox / WebKit, and a `webServer` command of `npm run dev -- --hostname 127.0.0.1`.

`scripts/run-zap-baseline.mjs` must read `ZAP_TARGET_URL`, optional `ZAP_REPORT_DIR`, and optional `ZAP_RULES_FILE`. It must call Docker with the official stable ZAP image and mount report/rules paths read-only where appropriate.

Revision note: Initial plan created before implementation to satisfy the repository ExecPlan workflow and to make the phased testing work resumable.

Revision note: Updated after implementation with validation results, accessibility discoveries, browser stability decisions, and final outcomes.
