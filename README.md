# Yuukun Portfolio

エンジニア向けポートフォリオサイトの試作リポジトリです。

## 採用デザイン

2026-11-17に、[Issue #18の日本語モック](prototypes/issue-18-design-review.html) の「調整後 / Rauno寄り」を採用しました。白黒と黄色、大きな文字、目盛り状の章ナビ、実績を中心にした構成です。初期表示は要約バー・実績3件＋横長の連携実績です。

HTMLは画像・スタイル・JavaScriptを内包し、ブラウザで直接開けます。上部から「元の案」と2種類の実績配置を比較できます。画面設計の採用であり、本番のNext.js実装への反映と、職歴・実績文章の事実確認は後続作業です。

[モック一覧](index.html) / [過去案と採用状況](prototypes/README.md)

## ディレクトリ構成

- `app/`: Next.js App Router のページ、メタ情報、グローバルCSS
- `components/`: Reactコンポーネント
- `lib/portfolio-data.ts`: スキル属性、経験データ、レーダースコア集計ロジック
- `public/images/`: Next.js から配信する画像アセット
- `index.html`: 採用案と過去案の一覧
- `prototypes/issue-18-design-review.html`: 採用デザイン（日本語・Rauno寄り）
- `prototypes/issue-18-image-base.html`: Issue #18の調整前の画像ベース案
- `prototypes/issue-5-design-review.html`: 季節感のある3案とRauno参照D案
- `prototypes/issue-5-design-review-round1.html`: 初回の白・紙色・暗色3案
- `prototypes/v1/`: 最初に作成したモック
- `prototypes/v2/`: 従来の実装に対応する過去案
- `assets/images/`: 共通画像アセット
- `references/`: 参考UI、スクリーンショット、デザインメモ
- `docs/requirements.md`: 採用方針と要件の正本
- `README-en.md`: English README

## 開発

```bash
npm install
npm run dev
```

ローカルでは `http://localhost:3000` で確認できます。

型チェックと静的ビルド:

```bash
npm run typecheck
npm run build
```

Next.js は `output: "export"` にしているため、ビルド結果は静的サイトとして `out/` に書き出されます。

## 現在の進め方

実装の主軸は Next.js / React / TypeScript 版です。採用モックに沿った本番への反映は後続で行い、実データは `lib/portfolio-data.ts` を更新して画面に反映します。過去のモックは検討履歴として残します。

スキルレーダーは手入力スコアではなく、経験データの属性状態から集計します。

- 経験あり: `1.0`
- キャッチアップ中: `0.5`

## 次に決めたいこと

- 表示名、肩書き、プロフィール文
- 実際に載せるプロジェクトと経験データ
- GitHub、LinkedIn、メールなどの本番リンク
- プロジェクト詳細ページをどこまで作るか
