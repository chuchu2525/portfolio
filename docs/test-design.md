# テスト設計書

このドキュメントは、`docs/requirements.md` と現在の Next.js / React / TypeScript 実装を前提にしたテスト設計です。現時点ではテスト実装までは行わず、何をどの粒度で確認するかを定義します。

## 1. 目的

このポートフォリオサイトのテスト目的は、単に壊れていないことを確認することではなく、採用担当者とエンジニアが短時間で情報を理解できる状態を保つことです。

特に守りたい品質は以下です。

- 要件で定義した情報が欠落せず表示される
- スキルレーダーのスコアが経験データから正しく集計される
- スキル選択、プロジェクト絞り込み、ヒーローレコードの開閉が期待通り動く
- モバイル、タブレット、デスクトップで文章やUIが破綻しない
- キーボード操作、スクリーンリーダー向けの意味付け、コントラスト、フォーカス表示が大きく崩れない
- 静的サイトとしてビルドでき、Lighthouseで重大な問題を出さない

## 2. 品質基準の考え方

### 2.1 WCAG 2.2 AA 相当とは

WCAG は Web Content Accessibility Guidelines の略で、Webコンテンツをアクセシブルにするための国際的なガイドラインです。WCAG 2.2 は「知覚可能」「操作可能」「理解可能」「堅牢」の4原則と、テスト可能な達成基準で構成されています。

このプロジェクトでは、`WCAG 2.2 AA 相当` を品質目標として扱います。これは「正式な適合宣言を出す」という意味ではありません。個人ポートフォリオとして、主要な利用者がマウス以外でも読み進められ、支援技術にも大きく壊れた構造を渡さないことを目指す、という実用的な基準です。

自動テストで検出できる範囲は限られます。例えば `alt` 欠落、フォームラベル欠落、明らかなARIA不整合は検出しやすい一方で、文章が分かりやすいか、フォーカス順が文脈として自然か、装飾が情報理解を邪魔していないかは人間の確認が必要です。

### 2.2 対象ブラウザと画面幅

標準確認対象は以下です。

- Chrome
- Safari
- Firefox
- mobile: 390px
- tablet: 768px
- desktop: 1440px

Safari は実機または macOS 上の手動確認を基本にします。Playwright による自動E2Eでは Chromium / Firefox / WebKit を使い、ブラウザ差分の大きな崩れを検出します。

## 3. テスト戦略

Next.js の公式ドキュメントでは、Unit、Component、Integration、E2E、Snapshot などのテスト種別が整理されています。このサイトでは、静的ポートフォリオであること、現在の主要ロジックがデータ集計とUI切り替えであることを踏まえ、以下の構成を採用します。

| 層 | 目的 | 主な対象 | 推奨ツール | 実行タイミング |
| --- | --- | --- | --- | --- |
| 型チェック | 型の破綻、データ構造の破綻を防ぐ | `*.ts`, `*.tsx` | `tsc --noEmit` | 開発中、PR、CI |
| 静的解析 | React / Next.js / Core Web Vitals に関わる実装ミスを防ぐ | React、Next.js設定、hooks | ESLint + `eslint-config-next/core-web-vitals` | PR、CI |
| ユニットテスト | 純粋関数とデータ集計の正しさを保証する | `lib/portfolio-data.ts`, radar helper | Vitest または Jest | 開発中、PR、CI |
| コンポーネントテスト | ユーザー視点で表示とUI状態を確認する | `PortfolioApp` と `components/portfolio/*` の主要UI | Testing Library | 開発中、PR、CI |
| E2Eテスト | 実ブラウザで主要導線を確認する | トップページ全体 | Playwright | PR、CI、リリース前 |
| アクセシビリティ確認 | 自動検出 + キーボード手動確認で主要問題を防ぐ | 全ページ、主要UI | axe, Playwright, 手動 | PR、リリース前 |
| ビジュアル確認 | レイアウト崩れ、テキストはみ出し、装飾過多を確認する | 390/768/1440px | Playwright screenshot | リリース前、UI変更時 |
| パフォーマンス確認 | 静的サイトとして重くなりすぎないことを確認する | Home | Lighthouse CI | リリース前、CI |
| ビルド確認 | 静的エクスポート可能性を保証する | Next.js build | `npm run build` | PR、CI |

## 4. ツール選定

### 4.1 Vitest か Jest

現状は Next.js 15 / React 19 / TypeScript の構成です。Next.js 公式では Jest と Vitest の両方が案内されています。ユニットテストの中心が純粋関数とReactコンポーネントであるため、起動が軽く設定も比較的簡単な Vitest を第一候補にします。

ただし、Next.js 固有の変換や設定に強く寄せたい場合は Jest + `next/jest` を選んでもよいです。どちらを選んでも、Testing Library の基本方針は変えません。

推奨:

- 第一候補: Vitest + Testing Library
- Next.js公式例に寄せる場合: Jest + `next/jest` + Testing Library

### 4.2 Testing Library

Testing Library は「テストが実際の利用に近いほど信頼性が高い」という考え方を持ちます。このプロジェクトでも、CSS class や内部状態ではなく、見出し、リンク、ボタン、ラベル、表示テキストなど、ユーザーが触れる単位で検証します。

優先するクエリ:

- `getByRole`
- `getByLabelText`
- `getByText`
- `getByAltText`
- 最後の手段として `getByTestId`

### 4.3 Playwright

E2E は Playwright を採用します。Playwright はアクセシブルロールやラベルに基づくロケータを推奨しており、このサイトのアクセシビリティ改善と相性が良いです。

方針:

- `page.getByRole()` を第一候補にする
- CSS selector 依存を避ける
- `locator.first()` や `nth()` は、対象を一意にできない場合の最後の手段にする
- クリック後は `toHaveText`, `toBeVisible`, `toHaveAttribute` などのWebアサーションで状態を待つ

### 4.4 axe

アクセシビリティ自動チェックには axe を使います。ただし axe は全てのWCAG項目を保証するものではありません。自動チェックは初期検出、手動チェックは最終判断として使います。

### 4.5 Lighthouse CI

Lighthouse CI は、Lighthouse の結果をCIに組み込み、パフォーマンスやアクセシビリティの退行を見つけるために使います。最初から厳しい失敗条件にすると開発が止まりやすいため、初期は警告中心、デザインとアセットが固まった段階でしきい値を厳しくします。

## 5. テスト対象と優先度

### 5.1 優先度 P0

P0 は、壊れるとサイトの目的を満たせなくなる項目です。

| 対象 | 確認内容 | テスト層 |
| --- | --- | --- |
| Home | 肩書き、メインコピー、主要CTAが表示される | コンポーネント / E2E |
| Skills | 10属性が表示される | ユニット / コンポーネント / E2E |
| スコア集計 | `experienced = 1.0`, `learning = 0.5` で合計される | ユニット |
| Skill Matrix | 属性を選ぶと説明、スコア、関連プロジェクトが切り替わる | コンポーネント / E2E |
| Projects | `ALL` と属性フィルタで表示プロジェクトが変わる | コンポーネント / E2E |
| Contact | メール、GitHub、LinkedIn 導線が存在する | コンポーネント / E2E |
| 静的ビルド | `output: "export"` 前提でビルドできる | ビルド |
| 代表画面幅 | 390/768/1440px で主要テキストが読める | E2E / 手動 |

### 5.2 優先度 P1

P1 は、品質や信頼性に強く効く項目です。

| 対象 | 確認内容 | テスト層 |
| --- | --- | --- |
| レーダーSVG | 属性数に応じて点と軸が生成される | ユニット / コンポーネント |
| ヒーローレコード | クリックで `aria-pressed` が切り替わる | コンポーネント / E2E |
| キーボード操作 | レーダー上のボタンが Enter / Space で操作できる | コンポーネント / E2E |
| アニメーション抑制 | `prefers-reduced-motion` で回転が抑制される | E2E / 手動 |
| アクセシブル名 | ボタン、リンク、SVGに意味のある名前がある | コンポーネント / axe |
| Lighthouse | Performance / Accessibility / Best Practices / SEO が大きく悪化しない | Lighthouse CI |

### 5.3 優先度 P2

P2 は、将来の拡張時に効く項目です。

| 対象 | 確認内容 | テスト層 |
| --- | --- | --- |
| データ整合性 | `Project.attributes[].id` が `skillAttributeIds` に存在する | ユニット |
| 表示順 | Skills とProjectsの表示順がデータ順に従う | ユニット / コンポーネント |
| 詳細ページ追加時 | 動的ルート、OGP、パンくず、戻り導線 | E2E |
| 外部リンク | `target="_blank"` に `rel="noreferrer"` がある | 静的解析 / コンポーネント |
| 画像 | 重要画像に代替テキストまたは装飾扱いの意図がある | axe / 手動 |

## 6. ユニットテスト設計

### 6.1 `lib/portfolio-data.ts`

対象関数:

- `scoreContribution`
- `getSkillScore`
- `getAttributeById`
- `getContributingProjects`

テストケース:

| ID | 対象 | 前提 | 期待結果 |
| --- | --- | --- | --- |
| UT-001 | `scoreContribution` | `experienced` | `1` を返す |
| UT-002 | `scoreContribution` | `learning` | `0.5` を返す |
| UT-003 | `getSkillScore` | `frontend` | 対象属性を持つプロジェクトの寄与値合計を返す |
| UT-004 | `getSkillScore` | 対象属性なし | `0` 相当の結果になる設計を確認する |
| UT-005 | `getAttributeById` | 存在するID | 対象属性を返す |
| UT-006 | `getAttributeById` | 存在しないID | `Unknown skill attribute` を含むエラーを投げる |
| UT-007 | `getContributingProjects` | `quality` | `quality` 属性を持つプロジェクトだけ返す |
| UT-008 | データ整合性 | 全 `projects` | 全属性IDが `skillAttributeIds` に含まれる |
| UT-009 | データ整合性 | 全 `skillAttributes` | ID重複がない |
| UT-010 | データ整合性 | 全 `projects` | project ID重複がない |

### 6.2 `components/portfolio/radar.ts`

レーダー座標計算は `components/portfolio/radar.ts` をテスト対象にします。UIコンポーネント側では、この helper の結果を使って属性数に応じた点、軸、ラベルが描画されることを確認します。

テストケース:

| ID | 対象 | 前提 | 期待結果 |
| --- | --- | --- | --- |
| UT-011 | `getPoint` | index 0, total 10, ratio 1 | 中心上方向の座標を返す |
| UT-012 | `getPoint` | ratio 0 | 中心座標を返す |
| UT-013 | `getPoint` | 任意の index | 中心から半径以内の座標になる |
| UT-014 | `pointsToString` | 複数座標 | 小数1桁の `x,y` 文字列をスペース区切りで返す |
| UT-015 | `getHeroAxisStyle` | index 0 | `left` / `top` が `%` 文字列で返る |

## 7. コンポーネントテスト設計

Testing Library を使い、内部実装ではなくユーザーが見えるふるまいを検証します。単一の `PortfolioApp` 全体テストだけに寄せると失敗時の原因が分かりにくいため、基本はセクション別コンポーネントを薄くテストし、最後に `PortfolioApp` で結合表示を確認します。

### 7.1 初期表示

| ID | 対象 | 操作 | 期待結果 |
| --- | --- | --- | --- |
| CT-001 | `Header` | render | `YUU's room` と Primary navigation が存在する |
| CT-002 | `HeroSection` | render | メインコピー、`View Projects`, `Skill Matrix` が表示される |
| CT-003 | `RecentPatchesSection` | render | featured project と supporting project が表示される |
| CT-004 | `SkillMatrix` | render | 10個の属性チップが表示される |
| CT-005 | `SkillMatrix` | render | 初期選択の `フロントエンド` 説明とスコアが表示される |
| CT-006 | `ProjectArchive` | render | `ALL` と全属性フィルタが表示される |
| CT-007 | `AboutSection` / `ContactSection` | render | About本文と連絡導線が表示される |
| CT-008 | `PortfolioApp` | render | Header、Hero、Recent Patches、Skill Matrix、Selected Works、About、Contact、Footer が一通り表示される |

### 7.2 インタラクション

| ID | 対象 | 操作 | 期待結果 |
| --- | --- | --- | --- |
| CT-009 | `HeroTurntable` | レコードボタンをクリック | `aria-pressed` が `false` から `true` に変わる |
| CT-010 | `SkillMatrix` | `QA` をクリック | Field Notes が `品質保証・テスト` に切り替わる |
| CT-011 | `SkillMatrix` | レーダー上の属性をクリック | 対応するField Notesに切り替わる |
| CT-012 | `SkillMatrix` | レーダー属性にフォーカスして Enter | 対応するField Notesに切り替わる |
| CT-013 | `ProjectArchive` | `SEC` をクリック | セキュリティ属性を持つプロジェクトだけ表示される |
| CT-014 | `ProjectArchive` | `ALL` をクリック | 全プロジェクトが表示される |

### 7.3 アクセシビリティ寄りの確認

| ID | 対象 | 確認内容 | 期待結果 |
| --- | --- | --- | --- |
| CT-015 | Navigation | `getByRole("navigation", { name: "Primary" })` | navが取得できる |
| CT-016 | Hero record | `getByRole("button", { name: "スキルレーダーを表示" })` | ボタンとして取得できる |
| CT-017 | Radar SVG | `role="img"` | `Skill radar` として取得できる |
| CT-018 | Contact links | link role | Email / GitHub / LinkedIn が取得できる |

## 8. E2Eテスト設計

Playwright では実ブラウザ上で、主要な閲覧導線を検証します。

### 8.1 Smoke

| ID | シナリオ | 操作 | 期待結果 |
| --- | --- | --- | --- |
| E2E-001 | トップページ表示 | `/` にアクセス | h1 と主要CTAが表示される |
| E2E-002 | セクション移動 | `Skill Matrix` をクリック | `#matrix` 付近に移動し、見出しが表示される |
| E2E-003 | Projects移動 | `View Projects` をクリック | `Selected Works` が表示される |
| E2E-004 | Contact導線 | `Email` リンクを確認 | `mailto:` が設定されている |

### 8.2 Skill Matrix

| ID | シナリオ | 操作 | 期待結果 |
| --- | --- | --- | --- |
| E2E-005 | 属性切り替え | `QA` をクリック | `品質保証・テスト` と関連プロジェクトが表示される |
| E2E-006 | レーダー操作 | レーダー上の属性をクリック | Field Notes が切り替わる |
| E2E-007 | キーボード操作 | Tabで属性へ移動し Enter | Field Notes が切り替わる |

### 8.3 Project Archive

| ID | シナリオ | 操作 | 期待結果 |
| --- | --- | --- | --- |
| E2E-008 | フィルタ | `SEC` をクリック | `Care Label Auth` など該当プロジェクトが表示される |
| E2E-009 | フィルタ解除 | `ALL` をクリック | 全プロジェクトが表示される |
| E2E-010 | タグ表示 | プロジェクトカードを見る | 関連属性タグが表示される |

### 8.4 レスポンシブ

| ID | 画面幅 | 確認内容 | 期待結果 |
| --- | --- | --- | --- |
| E2E-011 | 390px | h1、CTA、レコード、Skills、Projects | 横スクロールが出ず、主要テキストが読める |
| E2E-012 | 768px | Hero と各セクション | セクション間の余白とカード幅が破綻しない |
| E2E-013 | 1440px | 全体 | Hero、Skill Matrix、Projects が意図通り広がる |

## 9. アクセシビリティテスト設計

### 9.1 自動テスト

axe で検出する項目:

- landmark構造の重大な欠落
- ボタンやリンクのアクセシブル名欠落
- 画像代替テキストの欠落
- フォームラベル欠落
- ARIA属性の不整合
- 明らかなコントラスト不足

対象:

- `/`
- ヒーローレコード開状態
- Skill Matrix で複数属性を選択した状態
- Projects で属性フィルタを適用した状態

### 9.2 手動確認

| ID | 観点 | 手順 | 合格基準 |
| --- | --- | --- | --- |
| A11Y-001 | キーボード到達性 | Tab / Shift+Tab で全操作要素を移動 | 操作不能な主要機能がない |
| A11Y-002 | フォーカス表示 | キーボードで各ボタン・リンクへ移動 | 現在位置が視覚的に分かる |
| A11Y-003 | フォーカス順 | Header から本文、Contact まで移動 | 読み順と大きく矛盾しない |
| A11Y-004 | No keyboard trap | レーダー、リンク、外部リンクを移動 | フォーカスが閉じ込められない |
| A11Y-005 | スクリーンリーダー意味 | VoiceOverなどで主要見出しとボタンを読む | 何の操作か理解できる |
| A11Y-006 | Motion | OSの視差効果/モーション軽減設定を有効化 | 不要な回転・点滅が抑制される |
| A11Y-007 | 装飾と情報 | レコード、ラベル、タグを確認 | 装飾が本文理解を邪魔しない |

## 10. ビジュアルテスト設計

ビジュアル確認では、厳密なピクセル一致よりも「破綻検出」を重視します。デザインの質感が強いサイトなので、小さな差分までCIで落とすと運用が重くなります。

確認対象:

- 390px / 768px / 1440px のスクリーンショット
- Hero first view
- Skill Matrix
- Selected Works
- Contact

確認観点:

- 横スクロールがない
- ボタン内テキストがはみ出さない
- 日本語の長い見出しがカードや画面端からはみ出さない
- レーダーラベルが読める
- カード内の黄色タグや装飾が本文を覆わない
- sticky header がフォーカス対象を隠さない
- モバイルでHeroが高すぎて次の情報に到達しづらくならない

## 11. パフォーマンステスト設計

このサイトは静的エクスポート前提のため、サーバーレスポンスよりも初期表示、画像、CSS、JS量を重視します。

### 11.1 Lighthouse 初期基準

初期は以下を目標にします。

| 指標 | 初期目標 | 備考 |
| --- | --- | --- |
| Performance | 80以上 | デザイン確定前は警告扱い |
| Accessibility | 90以上 | axeと手動確認も併用 |
| Best Practices | 90以上 | 外部リンク、画像、HTTPS前提 |
| SEO | 90以上 | title, description, OGP整備後 |

### 11.2 Core Web Vitals 観点

| 観点 | 主なリスク | 確認内容 |
| --- | --- | --- |
| LCP | Heroが重い、画像が大きい | Hero表示が遅くないか |
| CLS | フォント、画像、SVG周辺でズレる | 初期表示後に大きなレイアウト移動がないか |
| INP | JSが重い、クリック応答が遅い | レコード開閉やフィルタが遅くないか |

### 11.3 予算案

将来CIに入れる場合の初期予算案です。

- JS総量: 初期ロードで 200KB gzip 以下を目標
- 画像: Hero画像や装飾画像は必要サイズに圧縮
- Lighthouse Performance: 80未満で警告、70未満で失敗候補
- Accessibility: 90未満で失敗候補

## 12. CI設計

### 12.1 Pull Request

PRで最低限実行するもの:

```bash
npm run typecheck
npm run build
```

テスト導入後に追加するもの:

```bash
npm run lint
npm run test
npm run test:e2e
```

### 12.2 Release前

リリース前に実行するもの:

- 型チェック
- lint
- ユニット / コンポーネントテスト
- Playwright E2E
- axe
- Lighthouse CI
- 390px / 768px / 1440px のスクリーンショット確認
- Safari 手動確認

## 13. テストデータ設計

現在は `lib/portfolio-data.ts` が単一のデータソースです。テストでは本番データそのものを検査するテストと、関数に小さなfixtureを渡すテストを分けます。

本番データ検査:

- 属性ID重複なし
- プロジェクトID重複なし
- 全プロジェクトに title / role / description / attributes / techTags がある
- 全 `attributes[].id` が定義済み
- `featured` は0件または1件にする
- `maxRadarScore` は0より大きい

fixture検査:

- `experienced` と `learning` が混在する場合の合計
- 属性が存在しない場合のエラー
- 対象属性を持たないプロジェクトが除外されること

## 14. リスクと対策

| リスク | 影響 | 対策 |
| --- | --- | --- |
| 装飾CSSが多く、見た目の退行に気づきにくい | モバイルで読めない、重なる | Playwright screenshot と手動確認を組み合わせる |
| SVGレーダーの操作が独自実装 | キーボードや支援技術で扱いづらい | role, aria-label, tabIndex, Enter/Space 操作をテストする |
| スキル属性が10個で表示密度が高い | ラベルが重なる、理解しづらい | 390/768/1440px の視認性チェックを必須にする |
| スコアが経験データ由来 | データ追加時に集計が壊れる | データ整合性テストと集計ユニットテストを入れる |
| 正式な実績データに差し替える予定 | コピーやリンクが壊れやすい | データ必須項目のテストを入れる |
| アクセシビリティ自動テストの限界 | 合格しても使いづらい可能性 | キーボード、VoiceOver、視認性の手動確認を残す |

## 15. 実装時の推奨ファイル構成

テスト実装に進む場合の候補です。

```text
__tests__/
  portfolio-data.test.ts
  radar.test.ts
  PortfolioApp.test.tsx
  Header.test.tsx
  HeroSection.test.tsx
  SkillMatrix.test.tsx
  ProjectArchive.test.tsx
e2e/
  home.spec.ts
  skill-matrix.spec.ts
  projects.spec.ts
  accessibility.spec.ts
playwright.config.ts
vitest.config.ts
vitest.setup.ts
eslint.config.mjs
lighthouserc.js
```

既存コードに合わせるなら、ユニットテストは対象ファイル横の `*.test.ts` に置いてもよいです。小規模な間は `__tests__/` に集約した方が全体像を把握しやすいです。

## 16. 受け入れ条件

初期テスト導入時の受け入れ条件:

- `npm run typecheck` が成功する
- `npm run build` が成功する
- スコア集計のユニットテストが成功する
- `PortfolioApp` の初期表示と主要インタラクションのコンポーネントテストが成功する
- Playwrightで Home / Skill Matrix / Projects の主要導線が成功する
- axe の重大違反が0件
- 390px / 768px / 1440px で主要テキストのはみ出しがない
- Lighthouse の Accessibility が90以上

## 17. 参考資料

- Next.js Testing: https://nextjs.org/docs/app/guides/testing
- Next.js ESLint: https://nextjs.org/docs/app/api-reference/config/eslint
- Testing Library Guiding Principles: https://testing-library.com/docs/guiding-principles/
- Testing Library Queries: https://testing-library.com/docs/queries/about
- Playwright Locators: https://playwright.dev/docs/locators
- WCAG 2.2: https://www.w3.org/TR/wcag/
- W3C WCAG Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- Lighthouse CI: https://web.dev/articles/lighthouse-ci
