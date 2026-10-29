# セキュリティ運用の設計と初期CIを実証する


このExecPlanは `.agent/PLANS.md` に従って維持する。Progress、Surprises & Discoveries、Decision Log、Outcomes & Retrospectiveは作業とともに更新する。

## Purpose / Big Picture


ポートフォリオを実験台に、企業へ展開できる脆弱性対応の設計と最初の検査基盤を作る。本計画の実装対象は設計と初期CIまで。LLM自動修正や成果物の配布保証は後続の独立した実験とし、未実装と明記する。脆弱性や検査障害が成功へ変換されず、必須チェックでマージを止められることを観察する。

## Progress


- [x] (2026-10-30 JST) main相当の作業ブランチへPR #13の0020708をfast-forwardで取り込み、既存の設定を確認した。
- [x] (2026-10-30 JST) 要件と全体設計、段階別の合格条件を作成した。
- [ ] 初期CIの修正、レポート・gateの検証処理と負のテストを実装する。
- [ ] ローカル検証と証跡を記録してコミットする。
- [ ] リモート導入後、必須チェックとDependabot設定を適用し、実際のPRで阻止を検証する。

## Surprises & Discoveries


作業場所はOrcaの `glaucus` ワークツリー、ブランチは `chuchu2525/glaucus`。開始時はmainのf25a533で `.github` がなかったため、PR #13の先端0020708を取り込んだ。PR #13自体は更新していない。

既存レポートはOSV JSONのresultsから検査総数を数えていた。以前の実行では103依存を読み取ってもresultsが空になり、総数0と表示される。検出対象の件数として表示し直す。

2026-10-30の読取り確認ではallow_auto_merge=false、Dependabot security updates=disabled、mainのrulesetにrequired_status_checksがない。Dependabotのpull_requestイベントでは書込みトークンを前提にできず、既存の自動マージはその制約にも対応していない。

OSV Action v2.5.0の公式SHAは8deb546fdb875b9996d27d4950be7312dac076a1。内部のdocker imageはタグ参照で、呼出し元のSHA固定だけではコンテナまで不変にならない。

## Decision Log


2026-10-30 / Codex: 既存PRの設定を現在の作業ブランチへ取り込み、原本を直接変更せず設計と修正をコミットする。既存PRに載せ直す場合と後続PRにする場合の両方に差分を分けられるため。

2026-10-30 / Codex: 初期段階では自動マージ用ワークフローを撤去する。主要動作テストと権限設計が未完であり、patchや開発依存という分類だけでは安全性を判断できないため。人のレビューは維持する。

2026-10-30 / Codex: 外部設定の強制は、新しいチェックの実行をGitHubで確認してから行う。存在しない必須チェックを先に設定して通常の変更を停止させない。今回はpush依頼がないため、ローカル検証と適用手順の準備までを先行する。

## Outcomes & Retrospective


設計を作成済み。初期CIの実装・実証は進行中。企業利用可能という宣言はまだ行わない。

## Context and Orientation


Next.jsとnpmのリポジトリ。依存はpackage.jsonとpackage-lock.json、検査は.github/workflows/ci.ymlとosv-scanner.yml、更新PRは.github/dependabot.ymlにある。gateとは複数の検査結果を集約し、必要な検査が全て成功した時だけ成功するジョブを指す。SBOMは依存部品表、来歴はビルドと成果物の対応記録であり、どちらも本計画では将来の要件を設計する。

## Plan of Work / Milestones


第一段階ではdocs/requirements.mdを正本として目的を反映し、docs/security/architecture.mdに脅威、信頼境界、対応期限、例外、LLM権限、配布と横展開の合格条件を書く。レビューできる設計としてコミットする。

第二段階では.github/workflows/ci.ymlをSHA固定し、checkoutの資格情報を保持せず、ビルド依存をignore-scriptsで取得する。npm auditはlockfileだけを検査する。merge_groupを追加し、セキュリティ用テストとCI gateを設ける。osv-scanner.ymlも直接の参照をSHA固定し、全体検査を日次にし、検出対象数を表示する厳密なレポート処理とOSV gateを設ける。自動マージ定義は撤去する。

第三段階ではPython標準ライブラリのunittestで、成功・検出あり・欠損・不正データ・取消・スキップを実験する。Actionの構文検査とnpmの型チェック・ビルドも行う。ローカル検証をdocs/security/validation.mdに記録し、GitHubでしか確かめられない事項を分離する。

第四段階はリモート導入後の実験。mainへワークフローを導入して実行チェック名を確認し、GitHub rulesetへCI gateとOSV gateを必須として登録する。Dependabot alerts・security updatesを有効化し、読取りで再確認する。脆弱な依存を追加した一時PR、検査障害の一時PR、通常PR、Dependabot PR、fork PRで結果を記録し、実験PRをマージせず閉じる。merge queueは有効にする企業で追加実験する。この段階の未実施を明記する。

## Concrete Steps


作業ディレクトリはリポジトリroot。初期状態はgit status --short --branchで確認する。ローカル検証は次のコマンドで行う。

    python3 -m unittest discover -s tests/security -v
    npm ci --ignore-scripts
    npm run typecheck
    npm run build
    npm audit --package-lock-only --ignore-scripts --audit-level=high
    git diff --check

Action構文検査にはactionlintを使用する。取得する場合は公式リリースとchecksumを照合し、インストール場所は一時領域に限定する。検査処理の署名・データ形式は実装後にInterfacesへ記録する。外部設定の適用手順はdocs/security/validation.mdに記す。

## Validation and Acceptance


ローカルではテストが全件成功し、正常JSONは読み取れ、不正なレポートが成功へ変換されない。gateへの失敗・取消・スキップ入力を与えると非ゼロ終了になる。型チェックとビルドが成功し、監査でhigh以上がないことを確認する。既知の脆弱性が増えて失敗した場合は検出結果を記録して修正し、検査を弱めない。

GitHubでの合格は、CI gateとOSV gateが実PRで報告され、通常権限の利用者が失敗時にマージできないこと。ローカルの合成テストだけでその合格を主張しない。脆弱なパッケージを本番ブランチに入れず、一時PRでのみ確認する。

## Idempotence and Recovery


テストは一時ファイルだけを使い、ネットワークに依存しない。変更は機能ごとにコミットする。GitHub設定は適用前の読取り結果を保存し、既存レビュー規則を上書きしない。実験用PRはマージせず閉じる。失敗時にcontinue-on-errorやポリシーの緩和で通さない。

## Artifacts and Notes


公式GitHub APIでcheckout v4.2.2、setup-node v4.4.0、OSV v2.5.0、upload-artifact v4.6.2のコミットSHAを照合した。検証結果はdocs/security/validation.mdへ追加する。ユーザーは適宜コミットを承認済みであり、コミットは日本語・フッターなし。pushは未依頼。

## Interfaces and Dependencies


レポートとgateの検証はscripts/security/配下のPython標準ライブラリのみで実装する。テストはtests/security/。レポート処理はJSONファイルを入力にサマリーを出力し、不正形式は非ゼロ終了する。gateはGitHub needsのJSONと必須ジョブ名を入力に取り、列挙したジョブがすべてsuccessの場合だけ0で終了する。レポートの出力を合否の根拠にすることと、OSVの脆弱性判定は区別する。

更新履歴: 2026-10-30 初版。合意した全体方針と初期CIの実装範囲、リモート導入後の検証を分離した。
