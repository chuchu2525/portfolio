# Yuukun Portfolio

古着とレコードをモチーフにした、エンジニア向けポートフォリオサイトの試作リポジトリです。

## ディレクトリ構成

- `app/`: Next.js App Router のページ、メタ情報、グローバルCSS
- `components/`: Reactコンポーネント
- `lib/portfolio-data.ts`: スキル属性、経験データ、レーダースコア集計ロジック
- `public/images/`: Next.js から配信する画像アセット
- `index.html`: 旧モック選択用の入口ページ
- `prototypes/v1/`: 最初に作成したモック
- `prototypes/v2/`: 現在のデザイン参照ベース
- `assets/images/`: 共通画像アセット
- `references/`: 参考UI、スクリーンショット、デザインメモ
- `docs/requirements.md`: v2をもとにした要件ドラフト
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

実装の主軸は Next.js / React / TypeScript 版です。`prototypes/v2` はデザイン参照として残し、実データは `lib/portfolio-data.ts` を更新して画面に反映します。

スキルレーダーは手入力スコアではなく、経験データの属性状態から集計します。

- 経験あり: `1.0`
- キャッチアップ中: `0.5`

## 次に決めたいこと

- 表示名、肩書き、プロフィール文
- 実際に載せるプロジェクトと経験データ
- GitHub、LinkedIn、メールなどの本番リンク
- プロジェクト詳細ページをどこまで作るか
