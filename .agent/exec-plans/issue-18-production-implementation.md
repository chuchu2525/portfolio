# 採用デザインをNext.jsの本番画面へ実装

## Purpose / Big Picture

採用済みのHTMLだけでなく、Next.jsのホーム・実績一覧・詳細が日本語の白黒黄デザインで動く状態にする。利用者は実績を探し、詳細と関連経験を読み、目盛りから各章へ移動できる。過去モックと比較用HTMLは保持する。この計画は .agent/PLANS.md に従って更新する。

## Progress

- [x] 2026-11-17: 現行コンポーネント・実績データ・静的出力構成と採用モックを確認。
- [x] 2026-11-17: 本番実装を要件正本へ反映。
- [x] データと共通スタイル、静的なコンポーネントを実装。
- [x] ホームの章ナビ・図版、実績一覧・詳細、経験表示を実装。
- [x] 型チェック・ビルド・データ集計・ブラウザ導線を確認。
- [x] PR #19へ反映する実装差分・確認結果・説明を準備。コミットとリモート反映はこの記録を含めて実施する。

## Context and Orientation

app/page.tsx は components/PortfolioApp.tsx を表示。components/portfolio にホームの各セクション、一覧、スキル表示がある。lib/portfolio-data.ts が実績と10属性・集計の正本。採用モックは prototypes/issue-18-design-review.html のRauno寄り・3件配置。画像は references/issue-18/cafeteria.jpg を public/images へ最適化して使用する。app/globals.css は基本変数とリセット、一般的な見た目はTailwind、複雑な図版のみCSS Modulesに分ける。

## Decision Log

2026-11-17: ページ本体と静的図版はServer Components、章の現在地・ポインター反応・絞り込み・スキル選択のみClient Componentsとする。モックの設定バー・資料・レビュー機能は製品画面に表示しない。採用画像の4実績を編集可能な草稿データとして移し、公開範囲を断定した外部リンクや数値成果を補わない。専門領域6項目の要約と、詳細の10属性は別の役割とする。

## Surprises & Discoveries

既存READMEは静的出力を説明しているが、next.config.ts は画像のunoptimizedのみ。実装ではoutput: exportと静的パラメータを揃えてビルド検証する。既存データとスタックの百分率はサンプルであり、新UIでは根拠のないレベル百分率を表示しない。npm ciは既存ロックの@emnapi/runtime不整合で失敗したため、lockのみを再解決してからクリーンインストールを完了。新規ランタイム依存は追加していない。開発サーバーとビルドを同時実行すると.nextの競合が起きたため、開発サーバーを止めて再ビルドし、静的なoutを配信して検証した。

## Milestones / Plan of Work

まず実績・プロフィール・専門領域をlibのデータに整理し、共通アイコンと図版、明色のスタイルを用意する。次に既存セクションを採用構成へ置き換え、章ナビと図版の反応を小さなクライアント部品へ分離する。最後に一覧・詳細を揃え、10属性の経験表示を任意で開ける補助UIとして実装する。

## Concrete Steps

作業ディレクトリはリポジトリルート。npm run typecheck と npm run build を実行する。開発確認はOrcaターミナルで npm run dev -- --hostname 127.0.0.1 --port 18767 を起動し、Orcaブラウザで確認する。生成されたoutの各詳細HTMLと404も確認する。

## Validation and Acceptance

375/768/1440pxで日本語と図版がはみ出さず、ホームが採用モックの構成になる。目盛りから実績へ移動し現在地が更新される。3件のカードと連携実績から正しい詳細へ進める。一覧の技術・属性・検索と空状態、詳細から一覧への戻り、10属性の経験の切替を確認。集計は経験あり1.0・キャッチアップ中0.5で、全属性をデータから導出する。モバイルとreduced-motionで追従演出を止める。不要な依存は追加しない。

## Idempotence and Recovery

過去モックは編集しない。新しい画像は別名に保存し、参照素材を上書きしない。本番データ・コンポーネント変更はこのブランチにまとめる。起動済みのサーバーはOrcaターミナルのハンドルで管理し、他作業のプロセスを止めない。

## Interfaces and Dependencies

Next.js 15 / React 19 / TypeScript / Tailwind 4を継続。Projectは表示用の短い説明と図版種別を持つ。実績とjourneyをlibから読む。静的な紹介・判断軸・専門領域はServer Componentsに置く。SectionMeterとHeroVisualはイベントをクリーンアップし、ブラウザAPIをSSR時に読まない。next/imageは既存のunoptimized設定に合わせる。

## Artifacts and Notes

npm testは3件成功。1/0.5の集計、10領域の索引、実績ID整合性、最大値変更と10軸レーダーを確認。npm run typecheck成功。npm run build成功し、ホーム・一覧・4詳細・404を静的出力。生成HTML内の142件の内部リンク・アセット参照についてファイルの存在を確認。

Orcaで http://127.0.0.1:18767/ の本番ビルドを確認。375/768/1440pxで表示確認し、375pxのscrollWidthは375、はみ出し要素0。タブレットの図版は幅を制限して調整。画像読み込み成功、各ページh1とホームのアンカー整合性を確認。検索RAGは1件、未知の検索語は0件、リセット4件。フロントエンドはOneViewのみ、業務との複合条件は0件。4件の詳細へ順に遷移し一覧への戻りを確認。全10スキルボタンで見出しとaria-pressedが更新。目盛りで実績へ移動し、表示が02 / 実績になることをスクリーンショットで確認。ホーム・一覧・詳細のブラウザコンソールエラー0。ポインター追従はfine pointerかつreduced-motionなしの場合のみ。タッチ時とreduced-motionのCSSを確認。

確認画像はdocs/screenshots/issue-18/desktop.png、mobile.png、projects.png。Orcaターミナルterm_5d6c9e7f-b510-4685-9d54-ea3e0d79dd14でoutを配信している。過去モック・参照素材・index.htmlは今回の実装で変更していない。

## Outcomes & Retrospective

採用デザインを実際のReact画面へ反映し、静的な全主要ルートで操作できる状態になった。比較モックと本番UIを分離し、旧案は保持した。実績・経歴は採用資料の草稿を移したもので、事実確認済みと誤認させる数値成果・未確認の連絡先は追加していない。公開用原稿の確定は別の作業。本計画の実装・検証は完了。リモート反映の結果はPR #19のコミット履歴で確認する。
