# Issue #18 画像参照の日本語モック

## 参照元と方針

参照元は [Issue #18](https://github.com/chuchu2525/portfolio/issues/18) に添付された2枚の画像。取得したPNG原本は `reference-1` と `reference-2`、HTMLへの埋め込み用JPEGは `reference-1.jpg` と `reference-2.jpg`。画像1は4件カードと縦の判断軸、画像2は要約バー、実績3件＋連携実績の横長枠、横に並ぶ4つの判断軸が主な違い。

以前のヴィンテージ・季節感・Raunoの横送りを今回のデザインに持ち込まない。白・黒・鮮やかな黄色、大きな見出し、半透明のAIパネル、細い軌道線、実績を中心にした情報の順序を参照した。ブラウザの枠は参考画像の表示枠として解釈し、サイト自体には再現していない。

## 成果物

`prototypes/issue-18-design-review.html` は画像・スタイル・スクリプトを埋め込んだ単一HTML。画像2の構成を初期表示とし、上部から画像1の4カード構成へ切替可能。ナビ・見出し・本文・操作は日本語。Chuchu、技術名、プロジェクト名などの固有名詞は原語を使用する。

肩書き・経歴・実績は参考画像をもとにした確認前の仮文言。実際の担当範囲や成果は確定していない。参考画像内のメールアドレスやプロフィールURLは未確認のためコピーしていない。GitHubは会話内で確認済みのchuchu2525へのリンク。実績UIと検出枠はHTML/CSS/SVGの説明用モックであり、実製品の画面や検証結果ではない。

## 写真素材

built-in imagegenを使用。生成原本は `cafeteria.png`、HTMLへ埋め込むJPEGは `cafeteria.jpg`。架空の飲食店のイメージで、実際の研究用データではない。黄色の検出枠はCSSで重ねた模式表現であり、推論処理を実行していない。

### 使用したプロンプト

A single wide landscape black-and-white photograph, viewed from a high corner-mounted ceiling camera looking diagonally down at an ordinary modern Japanese cafeteria or small restaurant. 7 to 10 adult patrons seated at light rectangular tables with black chairs, about 6 tables in view, a clear central aisle, concrete floor, soft daylight from side windows. Quiet documentary architectural photograph, realistic proportions, sharp recognizable human upper bodies and seats, no close up faces. Camera wide angle like computer vision research dataset, clean professional and naturally lit. Strict monochrome grayscale, no color at all, no bounding boxes, no text, no labels, no UI, no watermark. The image is a thumbnail background for a portfolio project about seat occupancy estimation; it is a fictional demonstration, not a real data capture. Composition 3:2 with people distributed left, middle and right.

## 確認

375px、768px、1440pxと2構成の6組合せで、横はみ出しと主要見出し・本文の切れを検出しなかった。構成ごとのカード数、要約バーの表示切替も確認。4実績の詳細が開閉でき、閉じた後にページがスクロール可能な状態へ戻る。参照画像2枚の表示と、その画面から構成を切替できること、レビュー文章への日本語入力反映とlocalStorage保存を確認。

参照画像は非表示ダイアログ内で遅延読み込みするため、開いた直後の同期的なdecode要求は完了前に失敗することがあった。描画後に両画像の自然幅1122pxと実画面で正常な表示を確認した。ブラウザコンソールには実行エラーなし。正式な適合宣言や実績内容の事実確認は今回の画面設計に含まない。

## 2026-11-17: 基本案を残してRaunoらしさを追加

ユーザーが基本案を評価したため、セクション順序・日本語・白黒と黄色・AIの図版は維持。現行Raunoで観察した大きな文字の段差と目盛りを採り入れ、背景を淡いグレー、実績を枠に囲われないポスター風に整理した。目盛りは各章への実際のリンクで、現在地も示す。ヒーローの図版はポインターに小さく反応し、カードはホバー時に少し浮く。タッチ端末と動きを減らす設定では変形しない。強制的なスクロール移動や全画面横送りは採用していない。

上部の「調整後 / Rauno寄り」「元の案」で比較できる。12通りのスタイル・配置・画面幅で横はみ出しと主要テキストの切れなし。章ナビの移動と現在地、ポインター反応・復帰、実績詳細、レビュー文章へのスタイル反映を確認。
