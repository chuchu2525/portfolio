# レーダーのスマホ操作仕様を調査して修正方針を定める

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

`/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/.agent/PLANS.md` に従って、このドキュメントを更新し続ける。

## Purpose / Big Picture

この調査の目的は、トップページの最初にある Hero のレコード盤レーダーが PC とスマホで現在どう振る舞っているかを正確に整理し、スマホで「タップすると戻らなくなる」問題に対する修正方針を、実装前に合意できる形へ落とし込むことです。今回の主対象は Skill Matrix ではなく、ページ先頭のレコード盤 UI です。Skill Matrix は比較対象としてだけ確認し、問題の中心がどこかを切り分けます。

この作業の完了条件は、現状仕様の整理、問題の原因整理、候補方針の比較、推奨方針、要件反映候補、そしてそれらを説明する Mermaid 図が揃っていることです。この turn では実装は行いません。

## Progress

- [x] (2026-05-25 06:22 JST) 要件書、レーダー関連実装、既存テストの位置を特定した。
- [x] (2026-05-25 06:22 JST) `HeroTurntable.client.tsx` と `SkillMatrix.client.tsx` を読み、PC とスマホで入力の意味がズレている可能性を確認した。
- [x] (2026-05-25 06:38 JST) `issue-3-rader-fix` ブランチを作成した。
- [x] (2026-05-25 06:49 JST) Playwright で desktop 1440px と mobile 390px の Hero / Skill Matrix 操作を再現し、状態と見た目の差を記録した。
- [x] (2026-05-25 06:52 JST) 調査結果をもとに、PC とスマホそれぞれの現状仕様を文章と Mermaid 図で整理する材料を揃えた。
- [x] (2026-05-25 06:52 JST) 修正方針の候補を比較し、推奨案と非推奨案を明示できる状態にした。
- [x] (2026-05-25 06:59 JST) ユーザー補足に合わせて、対象が Skill Matrix ではなく Hero の先頭レコード盤レーダーであることを plan に明記した。
- [x] (2026-05-26 00:08 JST) Hero レーダーの状態遷移図、候補方針の比較、推奨案を plan に追記した。
- [x] (2026-05-26 00:11 JST) ユーザー要望に合わせて、mobile 方針を「タップで保持」ではなく「長押しで一時表示」へ更新した。
- [x] (2026-05-26 08:34 JST) `HeroTurntable.client.tsx` を long press 実装へ更新し、mobile では長押し中だけ preview が開くようにした。
- [x] (2026-05-26 08:34 JST) Playwright の Home E2E を desktop click と mobile long press に分けて更新した。
- [x] (2026-05-26 08:34 JST) `npm test` と `npm run test:e2e` を実行し、unit/component 21件、Playwright 40件が通過することを確認した。

## Surprises & Discoveries

- Observation: `docs/requirements.md` には「クリック / タップした属性の説明を右側、またはモバイルでは下に出す」とあるが、選択解除や一時表示の終了条件は書かれていない。
  Evidence: `docs/requirements.md` の Skill Matrix セクション UI/UX 方針。

- Observation: Hero のレコード盤は `hover` と `tap` を同じ見た目状態に寄せている。
  Evidence: `components/portfolio/HeroTurntable.client.tsx` の `isHeroRadarOpen` と `app/globals.css` の `.hero-turntable:hover`, `.hero-turntable[data-radar-open="true"]` の共通スタイル。

- Observation: desktop では hover を外すと見た目は閉じるが、click 後は `aria-pressed="true"` のまま hover を外しても見た目が閉じない。
  Evidence: Playwright 観察で `after_click_mouse_out` が `pressed: "true"` かつ `opacity: "1"`。

- Observation: mobile では Hero を 1 回 tap すると `aria-pressed="true"` になり、外側を tap しても `aria-pressed` も見た目も戻らない。
  Evidence: Playwright 観察で `after_outside_tap` が `pressed: "true"` かつ `opacity: "1"`。

- Observation: mobile では Hero を 2 回目に tap すると `aria-pressed` は `false` へ戻るが、見た目は開いたまま残ることがある。
  Evidence: Playwright 観察で `after_second_tap` が `pressed: "false"` かつ `opacity: "1"`。別観察では、この時点の `document.activeElement` は button のままで、別リンクを tap すると `opacity: "0"` に戻った。

- Observation: Skill Matrix は desktop / mobile ともに「常に 1 属性選択」の single-select であり、外側 tap で未選択へ戻る仕様ではない。
  Evidence: `SkillMatrix.client.tsx` の初期値が `frontend` で、Playwright 観察でも mobile で QA を選択後、外側 tap をしても QA 表示が維持された。

- Observation: 現在の Hero 実装には long press を扱う処理がなく、`pointerdown` / `pointerup` / `pointercancel` / 移動量での判定もない。
  Evidence: `components/portfolio/HeroTurntable.client.tsx` は `onClick` だけで state を切り替えている。

- Observation: long press 実装後は mobile-chrome の Playwright で、pointerdown から 320ms 後に `data-radar-open="true"`、pointerup 後に `data-radar-open="false"` へ戻ることを確認できた。
  Evidence: `e2e/home.spec.ts` の mobile long press テストが green。

## Decision Log

- Decision: issue の本文確認は行わず、ユーザーが示した問題認識とローカルコードを正として進める。
  Rationale: ユーザーが issue 参照を不要と明示したため。いま必要なのは実装より先に現状把握と仕様整理である。
  Date/Author: 2026-05-25 / Codex

- Decision: この turn ではコード実装を行わず、調査と方針提案に限定する。
  Rationale: ユーザーが「まだ実装しないで」と指定しているため。
  Date/Author: 2026-05-25 / Codex

- Decision: `docs/requirements.md` への反映提案は外し、今回の調査結果と修正方針は ExecPlan 側に集約する。
  Rationale: ユーザーが requirements は使わなくてよいと明示したため。
  Date/Author: 2026-05-25 / Codex

- Decision: 実装候補の中では、Hero を mobile で「保持される toggle UI」ではなく「一時表示または Skill Matrix への導線」として扱う案を第一候補にする。
  Rationale: Hero はページ先頭の導入演出であり、詳細選択の主役は Skill Matrix 側にある。mobile で toggle を保持し続ける設計は、hover のない環境と相性が悪く、close 条件も増えて不安定になりやすい。
  Date/Author: 2026-05-26 / Codex

- Decision: mobile の第一候補は「長押し中だけ Hero レーダーを一時表示する」案に更新する。
  Rationale: ユーザーは mobile でも Hero レーダー自体は見たいが、tap で戻れなくなる挙動は望んでいない。long press の一時表示なら「見られる」と「保持されない」を両立しやすい。
  Date/Author: 2026-05-26 / Codex

## Outcomes & Retrospective

実装前の調査で確認した問題の中心は、Skill Matrix ではなく Hero のレコード盤レーダーだった。mobile では、`onClick` による toggle と CSS の `:hover` / open state 共有が組み合わさり、「戻れない」「閉じたはずなのに閉じて見えない」という体験を生んでいた。

この計画に沿って、Hero を mobile で stateful toggle にせず、long press の momentary preview に切り替えた。desktop の click toggle は維持しつつ、mobile では長押し中だけ preview が開き、指を離すと閉じるようになった。`npm test` は 21 件 passing、`npm run test:e2e` は 40 件 passing、4 件 skip で完了した。

## Context and Orientation

この repository は Next.js App Router と React を使うポートフォリオサイトで、トップページの組み立ては `components/PortfolioApp.tsx` から始まる。今回の主対象は Hero セクション内のレコード盤 UI で、実装は `components/portfolio/HeroTurntable.client.tsx` にある。これはページ先頭にある最初のレーダーであり、ユーザーが言う「レコードの方」を指す。比較対象として Skill Matrix セクションの選択 UI も確認するが、そちらは主対象ではない。

Hero は `button` 要素ひとつ全体で構成され、`isHeroRadarOpen` という真偽値を click で反転している。CSS は `app/globals.css` にあり、hover、focus-visible、data 属性による open を同じスタイルで扱っている。そのため、PC では hover が主、スマホでは tap による toggle が主になっている。現状には long press を区別する入力処理は存在しない。

Skill Matrix は SVG 上の各点を `role="button"` の `g` 要素として扱い、`onClick` と keyboard の Enter/Space で `activeSkillId` を切り替える。ここでは「閉じる」状態はなく、常にどれか 1 属性が選ばれる。初期状態は `frontend` である。

`docs/requirements.md` は Skill Matrix を「経験の根拠へ入るナビゲーション UI」と定義しているが、Hero 側のレーダーに対しては「Hero 内で過度に完結させない」とある。この差が、Hero のタップ体験を恒久 toggle にするべきか、一時 reveal にするべきかの判断材料になる。

## Plan of Work

まず、現在の仕様をコードから整理する。`HeroTurntable.client.tsx` の state 制御と `app/globals.css` の hover/open スタイルを対応づけ、先頭レコード盤レーダーの入力と見た目の関係を明確にする。Skill Matrix は「別のレーダー系 UI だが今回の主対象ではない」ことを確認する範囲にとどめる。

次に、ローカルの開発サーバーを起動して desktop 幅と mobile 幅で実際に操作し、Hero と Skill Matrix を分けて観察する。ここでは、PC では hover で何が起き、click で何が保持されるか、スマホでは tap 後にどう見えるか、別の場所を触ると戻るかを確認する。

その後、現状を「入力」「内部状態」「画面の見え方」「解除条件」の 4 観点でまとめる。Hero は toggle 型として記述し、スマホで戻れない原因を切り分ける。Skill Matrix は別物として短く比較し、今回の問題の外に置く。

最後に、修正方針を比較する。候補には、Hero を mobile では long press の momentary 表示へ寄せる案、Hero を toggle のまま明示的 close を足す案、Hero 自体を非インタラクティブ装飾へ戻す案を含める。結論は Hero レーダーに対する推奨案として示す。

実装に進むときは、まず Hero の責務を固定する。ここでいう責務とは「何を操作させたい UI なのか」である。もし Hero が preview なら、mobile では保持 state を捨て、long press 中だけ見せる。もし Hero 自体を操作 UI として残すなら、toggle / close / focus / outside tap の全部を明示的に制御し、CSS の hover 依存を減らす。どちらの方向に進むかを曖昧にしたままコードを直すと、症状だけ消して別の入力バグを残しやすい。

## Concrete Steps

作業ディレクトリは `/Users/nagahamayuu/Documents/Projects/yuukun-portfolio` を使う。

まず関連ファイルを読む。

    rg -n "radar|touch|hover|tap|Skill Matrix|Hero" components app docs __tests__ -S
    sed -n '1,220p' components/portfolio/HeroTurntable.client.tsx
    sed -n '1,260p' components/portfolio/SkillMatrix.client.tsx
    sed -n '1,320p' app/globals.css
    sed -n '250,320p' docs/requirements.md

次にローカルサーバーを起動し、browser plugin で desktop と mobile を観察する。

    npm run dev
    browser で http://127.0.0.1:3000 を開く
    desktop 幅で Hero と Skill Matrix を操作する
    mobile 幅へ切り替えて同じ操作を行う

最後に調査結果をこの plan と最終報告へまとめる。`docs/requirements.md` は更新しない。

## Validation and Acceptance

この調査の受け入れ条件はコードのテスト成功ではなく、観察結果の一貫性である。最低限、次を説明できる必要がある。

1. PC で Hero レーダーは hover と click でどう振る舞うか。
2. スマホで Hero レーダーは tap 後にどう振る舞い、なぜ「戻らない」と感じるか。
3. mobile の改善案として long press がどの state を担当し、tap とどう役割分担するかを説明できるか。
4. 修正対象が Hero レーダーであり、Skill Matrix ではないと説明できるか。
5. 推奨方針を採ると、ユーザー操作がどう改善されるか。

## Idempotence and Recovery

この調査は読み取り中心であり、繰り返しても安全である。ローカルサーバー起動は再実行可能で、既存ポートが使用中なら既存プロセスを確認して再利用する。ブラウザ確認で一時的な UI state が残っても、ページ再読み込みで初期状態へ戻せる。

## Artifacts and Notes

現時点での重要メモ:

    HeroTurntable.client.tsx
      - button 全体の onClick で isHeroRadarOpen を toggle
      - mobile 専用条件分岐なし

    SkillMatrix.client.tsx
      - activeSkillId は常に 1 つ
      - 初期値は frontend
      - SVG 点または chip で対象を切替

現在の状態遷移の要約:

    PC の Hero
      - 初期状態では閉じている
      - hover 中だけレーダーが見える
      - click すると open state が保持される
      - クリック後は hover を外しても見た目が維持される

    mobile の Hero
      - 初期状態では閉じている
      - 1 回目の tap で open state が保持される
      - 外側 tap では close されない
      - 2 回目の tap で state は false に戻っても、見た目が残る場合がある
      - 別のリンクや要素へ focus が移ると閉じて見える

想定する修正後の状態遷移:

    mobile の Hero
      - 通常 tap では open state を保持しない
      - 一定時間の長押しで preview を開く
      - 指を離したら閉じる
      - スクロール開始、移動量超過、pointer cancel でも閉じる
      - つまり「見たい時だけ押して見る」UI にする

Mermaid 図:

    ```mermaid
    stateDiagram-v2
      [*] --> Closed
      Closed --> PreviewOpen: PC hover
      PreviewOpen --> Closed: hover out
      Closed --> LatchedOpen: PC click / mobile tap
      LatchedOpen --> LatchedOpen: mobile outside tap
      LatchedOpen --> VisuallyOpenButStateFalse: mobile second tap
      VisuallyOpenButStateFalse --> Closed: focus/hover条件が外れる
    ```

    ```mermaid
    stateDiagram-v2
      [*] --> Closed
      Closed --> Pressing: mobile pointerdown
      Pressing --> LongPressPreview: hold threshold reached
      Pressing --> Closed: pointerup before threshold
      LongPressPreview --> Closed: pointerup
      LongPressPreview --> Closed: pointercancel / scroll / move too far
    ```

候補方針の比較:

    案A: mobile では Hero を長押し中だけ一時表示し、保持 state を持たせない
      - 利点: hover のない環境に自然で、close 条件が単純になる
      - 利点: mobile でも Hero レーダー自体は見られる
      - 利点: Hero を導入演出、Skill Matrix を主操作面という役割分担に揃えやすい
      - 欠点: desktop と mobile で完全同一の操作モデルではなくなる
      - 欠点: 長押し時間、移動許容、スクロールとの競合を実装で丁寧に決める必要がある

    案B: Hero の toggle を維持し、outside tap close と focus 制御を追加する
      - 利点: desktop/mobile で同じ概念の UI にできる
      - 利点: 既存の aria-pressed 構造を活かしやすい
      - 欠点: hover, focus, click, outside tap の競合を解きほぐす必要があり、実装と検証が重くなる
      - 欠点: 「Hero で詳細操作をさせたいのか」が曖昧なまま残りやすい

    案C: Hero を完全に非インタラクティブ装飾へ戻し、タップで常に #matrix へ飛ばす
      - 利点: 不具合要因を大きく減らせる
      - 利点: 先頭画面の意味が明快になる
      - 欠点: レコード盤を触ったときの楽しさは減る
      - 欠点: desktop hover 演出を残す場合は設計を分ける必要がある

推奨案:

    案A を第一候補にする。具体的には、desktop は hover 中だけレーダー preview を見せるか、必要なら click で固定表示も残す。一方 mobile は Hero を「長押し中だけ見える preview」と定義し、tap で長く保持される toggle state を持たせない。こうすると、ユーザーが感じている「タップしたら戻らない」を設計ごと解消しつつ、mobile でも Hero レーダーを見られる。

    もし desktop と mobile を同じ state machine に揃えたい明確な理由があるなら案Bへ進んでよい。ただしその場合は、症状の修正ではなく Hero を本当に interactive widget として扱う覚悟が必要で、outside tap、Escape、focus loss、screen reader の読み上げ文言までセットで定義するべきである。

    long press を採る場合の実装メモとしては、`onClick` ではなく `pointerdown` でタイマーを開始し、一定時間を超えたら preview を開く。`pointerup`, `pointercancel`, 一定以上の移動、スクロール開始で preview を閉じる。ブラウザ標準の長押しメニューやテキスト選択が邪魔になる端末があるので、必要に応じて Hero 領域だけ `user-select: none` や `-webkit-touch-callout: none` を検討する。

## Interfaces and Dependencies

この調査で直接参照する主要インターフェースは次のとおりである。

`components/portfolio/HeroTurntable.client.tsx` では、`HeroTurntable()` が `isHeroRadarOpen: boolean` を持ち、button の `aria-pressed` と `data-radar-open` に反映する。

`components/portfolio/SkillMatrix.client.tsx` では、`SkillMatrix()` が `activeSkillId: SkillAttributeId` を持ち、`RadarChart` の `onSelect(id)` と chip button の click で切り替える。

`app/globals.css` では、`.hero-turntable:hover`, `.hero-turntable:focus-visible`, `.hero-turntable[data-radar-open="true"]` がほぼ同じ見た目変化を共有する。つまり hover と open state の視覚仕様が CSS 上で同列に扱われている。

変更履歴:

- 2026-05-25: 調査開始用の ExecPlan を新規作成。実装は含めず、現状把握と修正方針整理を目的にした。
- 2026-05-25: Playwright 観察結果を反映し、問題の中心が Hero 側であることと、mobile で `aria-pressed` と見た目が乖離することを追記した。
- 2026-05-26: Hero を long press preview 方式へ実装し、Playwright で desktop click と mobile long press の両方を確認した。
