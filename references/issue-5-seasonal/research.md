# Issue #5 第2回: ヴィンテージ・季節感の調査

調査日: 2026-11-16。本人の好みはヴィンテージと季節感。第1回の黒は気取りすぎ、白は定型的、というフィードバックを受けた。今回の目的は本番実装ではなく、単一HTMLで新しい3方向を比較すること。

## 追加で確認した有名サイト

| サイト | 実際の確認 | 採用した観察 | 限界 |
| --- | --- | --- | --- |
| [北欧、暮らしの道具店](https://hokuohkurashi.com/) | 本文・PCスクリーンショット | 自然光の写真、日常の言葉、画像の下に置く説明、冬服など季節の題材。A案の写真と文章の分離に反映 | UX効果の実測ではなく、今回の美意識と日本語の編集方法の参照 |
| [UNIQLO LifeWear magazine](https://www.uniqlo.com/jp/ja/contents/lifewear-magazine/) | 本文・PCスクリーンショット | 大きな生活写真、季節号、誌面の見出し。B案の横長写真と大小の実績に反映 | 検索抽出は春夏、実画面は2026秋冬。実画面の観察を優先。動画とロゴは流用しない |
| [Apple 日本](https://www.apple.com/jp/) | 本文・PCスクリーンショット | 短い日本語の主題、ナビの明快さ、主行動を絞る。A案の見出しと導線に反映 | ヒーロー映像は黒いまま。映像の完成表示を確認したとは扱わない。白黒の配色は模倣しない |
| [Airbnb 日本](https://www.airbnb.jp/) | 本文・PC画面、料金案内を閉じた後の一覧まで | カテゴリ、写真、短い情報の順序が一貫した一覧。C案と実績絞り込みに反映 | 宿泊予約の検索や機能数をポートフォリオへ持ち込まない |
| [無印良品](https://www.muji.com/jp/ja/store) | 本文・実画面ともメンテナンス | 通常のUIは確認できなかったため採用根拠から除外 | ストアの過去の記憶や検索断片を現状の観察と混同しない |

## UX評価の裏付けと、こちらの判断を分ける

[BaymardのAirbnbケーススタディ](https://baymard.com/ux-benchmark/case-studies/airbnb) の公開部分を確認。ナビ、検索、一覧、絞り込み、詳細など要素ごとに評価されていることが分かる。総合スコアと詳細指摘は有料範囲で、確認していない。ケーススタディがあることを「全体が最高評価」の根拠としては扱わない。

第1回に確認した [NN/gのRecognition and Recall](https://www.nngroup.com/articles/recognition-and-recall/) を引き続き適用。ナビとスキルの選択肢を見える形にし、季節で名称を変えない。[NN/gのUXポートフォリオ構成](https://www.nngroup.com/articles/ux-design-portfolios/) は役割・課題・取り組みを伝える参考。ただしUX職に関する資料をエンジニア採用全般の実証としない。

有名サイトはそれだけでUXが優れているとは断定しない。今回の具体的な設計は、観察とユーザーの好みからの読み替えであり、ユーザーテストの結果ではない。

## デザインへの変換

A「季節のある部屋」は紹介と自然光の写真を左右に配置し、日常の言葉と実績をつなぐ。B「日々の編集室」は季刊誌のような見出し、横長の写真、大小の実績。C「デニムと日だまり」は洗いざらしの青、生成りの写真縁、規則的な一覧。

共通してナビは日本語、本文はゴシック、主要な見出しのみ明朝。紙の質感はごく薄いノイズのみ。常時回転、雪や落ち葉のアニメーション、理由のない大きな装飾は使わない。季節の比較では色・短い便り・月札と葉の意匠を変える。ナビ、実績データ、写真は共通。季節の自動切替はまだ提案していない。

## 生成画像

built-in imagegen を使用。本人の部屋の写真ではない。最終アセットは `listening-room.jpg`、生成した原本は `listening-room.png`。HTMLにはJPEGを埋め込んでおり、単一ファイルで表示できる。実績の画面図版はHTML/CSS/SVGで作ったデモであり、本物の実績スクリーンショットではない。

### 使用したプロンプト（原文）

Create a single landscape editorial photograph for a Japanese web engineer's personal portfolio about vintage clothing, vinyl records and the quiet rhythm of seasons. 3:2 composition. A real lived-in modest Japanese apartment listening corner, low honey oak cabinet and turntable with one black vinyl record, cream blank record sleeves leaning casually, an amber glass vase with a simple bare twig, folded faded indigo denim and oatmeal linen at left, a small warm ceramic coffee cup, subtly textured plaster wall. Soft lateral afternoon natural window light, delicate leaf shadows on wall, restrained film grain, muted cream, honey, washed indigo, moss and reddish brown. Not luxury, no maximalism, not a staged catalogue. Camera close, slight diagonal perspective, tactile and human, sophisticated analogue medium format magazine photography, no people, no text, no visible logos, no watermarks, no collage, no UI. Objects clustered in middle and lower frame; upper third quiet sunlit wall. Mood gently nostalgic, approachable and elegant.

## 追加: ユーザー指定のRauno参照案

[Rauno Freibergの現行サイト](https://rauno.me/) を2026-11-16に本文・PCスクリーンショット・375px・縦スクロール操作で確認した。初期画面はグレー背景に大きな自己紹介と黄色の円。スクロールで横へポスターが移り、次の作品は大きな文字とオレンジの円。上部には目盛り状の位置表示がある。[Craft](https://rauno.me/craft) も確認し、作品が視覚的なタイルで並ぶことを確認した（一部のメディアは読み込み途中のぼかし表示）。旧2022/2023版を現在の見た目と混同しない。

D「めくる作品集」は、この横並びのポスターと大きな文字、位置を示す目盛りを参照した。自作の自己紹介・代表実績3件・スキル・人物の6枚を作成。円は季節色のレコード盤に読み替え、温かい紙色と合わせた。参照先の本人の文章・作品・ロゴは使っていない。

操作は標準の横スクロールとscroll-snap、左右ボタン、目盛りの直接選択、左右キー。縦ホイールの横送りへの強制変換は採用せず、ナビから情報に直接進む経路も維持した。prefers-reduced-motionが有効な場合は滑らかなスクロールとホバー変形を止める。横送りの好みや採用担当者に適するかは今回のレビューで判断するもので、UX効果が実証済みとはしていない。
