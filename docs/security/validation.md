# 初期CIの検証記録と導入手順

## 検証範囲

対象は `chuchu2525/glaucus`。PR #13の先端 `0020708` を土台としたCI改善である。2026-10-30に着手し、2026-11-02にローカル検証を完了した。既存PRの先端、main、GitHub設定はこの作業では変更していない。

ローカルテスト成功は、GitHubで実際にマージが阻止されることや、企業導入が完了したことの証明ではない。ここでは両者を分ける。

## 実行結果

| 検証 | コマンド・条件 | 結果 |
| --- | --- | --- |
| 依存取得 | `npm ci --ignore-scripts --offline --cache /private/tmp/portfolio-npm-cache` | 47パッケージ追加、依存スクリプトを実行せず成功 |
| 型チェック | `npm run typecheck` | 成功 |
| 本番ビルド | `npm run build` | 成功、9ページ生成 |
| 脆弱性監査 | `npm audit --package-lock-only --ignore-scripts --audit-level=high`（一時キャッシュ、取得再試行・タイムアウト指定） | `found 0 vulnerabilities` |
| 検査処理の実験 | `python3 -m unittest discover -s tests/security -v` | 10件成功。内部で複数の失敗・取消・スキップを試行 |
| Actions構文 | `actionlint -shellcheck= -pyflakes=` | v1.7.12で成功。ShellCheck・Pyflakesは未実行 |
| 差分の空白検査 | `git diff --check` | 成功 |

実行環境はmacOS、Node v22.23.4、npm 10.9.9、Python 3.8.20。LinuxのGitHub runnerでの実行は未確認。依存取得は最初にサンドボックスのネットワーク制限で失敗した後、権限拡張による取得と一時キャッシュからの再インストールで検証した。

actionlintは公式 `rhysd/actionlint` のv1.7.12リリースからdarwin_arm64バイナリを取得し、同じ公式リリースのchecksumsファイルとのSHA-256一致を確認した。一時領域に置き、プロジェクト依存には追加していない。この照合はリリース元自体の侵害への対策ではない。

## 負の実験で確認したこと

`tests/security/test_security.py` はワークフロー内のgateのPythonコードそのものを実行する。別に書いた同じ処理だけをテストしてはいない。CIのbuild・audit・security-testsのいずれかがfailure、cancelled、skipped、欠損なら失敗する。OSVはPRでscan-pr、push・schedule・merge_groupでscan-scheduledを要求し、reportの成功も要求する。

レポートでは、ファイル欠損、空ファイル、不正JSON、不正なネスト、矛盾するスキャン結果を失敗させる。検出なしを検査総数0件と表示しない。重複の除外、HTMLや表の行を挿入する入力のエスケープ、サマリー最大100件も検証した。

OSVの再利用PRワークフローは内部でGITHUB_BASE_REFを使う。merge_groupでこのPR用の前提に依存しないよう、マージキューは全体スキャンに振り分けた。ただしキューを有効にしたGitHub上での実証は残っている。

レポートのcontinue-on-errorは脆弱性検出時にもJSONを読むために残す。スキャン失敗かつ検出なし、結果の欠損・不正はサマリー処理で失敗する。検出がある失敗と、部分的JSONを残す内部障害はレポートのoutcomeだけでは完全に区別できないため、合否判定は独立した再利用スキャンの成功も必須とする。再利用先の内部障害・通信障害の実証は未完了。

## 未適用の外部設定

2026-10-30の読取りでは、Dependabot security updatesはdisabled、auto-mergeはfalse、mainのrulesetはレビュー1件を要求するが必須ステータスチェックがない。管理者のalways bypassが存在する。secret scanningとpush protectionはenabledだった。後日適用するときは、必ず再取得してから差分を反映する。

確認用の読取りコマンドは以下。`gh` は権限のあるアカウントでログインしておく。404は存在しない・権限不足などの可能性があるため、無条件に「安全」「設定済み」と解釈しない。

```sh
gh api repos/chuchu2525/portfolio --jq '{allow_auto_merge,security_and_analysis}'
gh api repos/chuchu2525/portfolio/vulnerability-alerts --include
gh api repos/chuchu2525/portfolio/automated-security-fixes
gh api repos/chuchu2525/portfolio/rulesets
gh api repos/chuchu2525/portfolio/rulesets/15972424
gh api repos/chuchu2525/portfolio/rules/branches/main
```

## リモート導入後に行う手順

1. このブランチをpushしてPRを作成する。PR #13には既存の依存更新と初期設定があるため、先にマージする場合はこのブランチの差分を再確認する。このブランチからまとめて導入する場合はPR #13との重複を整理する。
2. PR上でCI gateとOSV gateが実行されることを確認する。Code scanning/SARIF権限やOSVのJSON形式をLinux runnerで実証する。ワークフローは未検証の変更として人がレビューする。
3. mainへの導入を済ませ、新規の正常PRでも両gateが成功することを確認する。GitHub側のチェック名と提供元アプリIDを実際のcheck-runsから取得する。
4. 既存rulesetのレビュー規則を維持して、CI gateとOSV gateをGitHub Actions提供元に限定した必須チェックへ追加する。strictな最新状態の要求またはmerge queueを企業の運用に合わせて設定する。管理者迂回は通常利用せず、企業では緊急権限の管理に置き換える。
5. Dependabot alertsとsecurity updatesを有効化する。自動マージは無効を維持する。設定の読取り結果を再取得し、導入前後の差分を記録する。
6. 一時PRで、既知の脆弱な依存の追加と検査の強制失敗を試す。管理者迂回を使わない利用者でマージ不能になることを確かめ、実験PRはマージせず閉じる。脆弱な依存のinstall scriptを実行しない。
7. Dependabot PR・fork PRで秘密情報なしに検査が動くことを確認する。merge queueを使う環境ではキューでも実験する。定期検査の失敗通知を実際に受信し、停止監視を設定する。

リモート導入完了の証跡には、対象コミットSHA、実行URL、チェック結果、設定の読取り結果、通常権限でのマージ拒否、担当者と時刻を残す。ローカルの結果でこれらを代用しない。

## 残る制約と次の独立した変更

初期CIは直接のAction参照をSHA固定しているが、OSVの内部コンテナはタグ参照であり、再利用先の取得物・runnerまで不変としたわけではない。依存のinstall scriptを止めてもビルドは依存コードを実行する。GitHub上の実PR、外部サービス障害、組織権限の検証は未実施である。

次の段階は案件の重複防止・期限管理・期限付き例外・主要動作テスト。それを独立して検証した後、秘密情報のない隔離環境でLLM修正を実験する。SBOMと実際のVercel配布物の来歴、企業の共通ワークフロー強制、監査ログの外部保存はさらに後続の変更で扱う。
