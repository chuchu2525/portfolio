# 初期CIの検証記録と導入手順

## 検証範囲

対象は `chuchu2525/glaucus`。PR #13の先端 `0020708` を土台としたCI改善である。2026-10-30に着手し、2026-11-02にローカル検証を完了した。その後PR #14を作成し、CI成功の確認後に必須チェックとDependabotを有効化した。既存PR #13の先端とmainは変更していない。

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

## 外部設定の導入前の状態

2026-10-30の読取りでは、Dependabot security updatesはdisabled、auto-mergeはfalse、mainのrulesetはレビュー1件を要求するが必須ステータスチェックがない。管理者のalways bypassが存在する。secret scanningとpush protectionはenabledだった。後日適用するときは、必ず再取得してから差分を反映する。

## GitHub上で確認した結果と適用済み設定

2026-11-02、担当Codexがユーザーの継続指示に従って [PR #14](https://github.com/chuchu2525/portfolio/pull/14) を作成した。対象コミット `4d12671d25fccb42c644b2f45290c8725113d3ad` の [CI実行](https://github.com/chuchu2525/portfolio/actions/runs/41329287464) と [OSV実行](https://github.com/chuchu2525/portfolio/actions/runs/41329287716) は成功した。build・audit・security control tests・OSV report・scan-pr・両gateの成功をAPIで確認した。scan-scheduledのスキップはPRイベントに対して意図した結果である。

check-runs APIでCI gateとOSV gateの提供元がGitHub Actions（app ID 15368）であることを確認してから、既存のProtect main（ruleset ID 15972424）へ両チェックを追加した。提供元を同アプリに限定し、strict_required_status_checks_policy=trueとした。レビュー1件・古い承認の無効化など既存規則は維持した。APIで再読取りし、enforcement=activeと両必須チェックを確認した。

mainへ先にマージする当初の順序を変更し、実際に成功したチェックがあるPR #14を導入経路として、マージ前に必須化した。これにより、mainへの導入前に古いPRが検査を経ずにマージされることを防ぐ。新しいgateを持たないPR #13などは、PR #14の変更を取り込むまで通常権限ではマージできない。管理者のalways bypassは既存のまま残っており、その権限での迂回は防いでいない。

Dependabot vulnerability-alertsへPUT、automated-security-fixesへPUTを実行した。再読取りでアラートの確認APIが成功し、security fixesがenabled=true・paused=false、repositoryのdependabot_security_updatesがenabledであることを確認した。auto-merge=false、secret scanningとpush protection=enabledも維持している。

PR #14はOPEN、REVIEW_REQUIRED、mergeStateStatus=BLOCKEDである。レビューを迂回したマージはしていない。これは正常PRがレビュー待ちである観測であり、脆弱性・検査障害を持つ実PRの拒否を実証した結果ではない。

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

1. PR #14でCIは成功済み。人がワークフローと設計をレビューし、mainへ導入する。PR #13と重複するため、導入後に重複PRを整理する。
2. Linux runnerでのPR検査・Code scanning/SARIFアップロード・OSVレポート生成は確認済み。変更後の先端でもCI成功を確認する。
3. mainへの導入後、新規の正常PRでも両gateが成功することを確認する。日次検査とmainへのpush検査も実証する。
4. 必須チェックは提供元を限定して設定済み。管理者迂回は通常利用せず、企業では緊急権限の管理に置き換える。
5. Dependabot alerts・security updatesは有効化して再読取り済み。実際のアラートと修正PR生成・通知受信を確認する。自動マージは無効を維持する。
6. 一時PRで、既知の脆弱な依存の追加と検査の強制失敗を試す。管理者迂回を使わない利用者でマージ不能になることを確かめ、実験PRはマージせず閉じる。脆弱な依存のinstall scriptを実行しない。
7. Dependabot PR・fork PRで秘密情報なしに検査が動くことを確認する。merge queueを使う環境ではキューでも実験する。定期検査の失敗通知を実際に受信し、停止監視を設定する。

リモート導入完了の証跡には、対象コミットSHA、実行URL、チェック結果、設定の読取り結果、通常権限でのマージ拒否、担当者と時刻を残す。ローカルの結果でこれらを代用しない。

## 残る制約と次の独立した変更

初期CIは直接のAction参照をSHA固定しているが、OSVの内部コンテナはタグ参照であり、再利用先の取得物・runnerまで不変としたわけではない。依存のinstall scriptを止めてもビルドは依存コードを実行する。GitHub上の正常PRは検証したが、脆弱性・外部サービス障害を持つ実PR、fork・Dependabot PR、マージキュー、組織権限の検証は未実施である。

次の段階は案件の重複防止・期限管理・期限付き例外・主要動作テスト。それを独立して検証した後、秘密情報のない隔離環境でLLM修正を実験する。SBOMと実際のVercel配布物の来歴、企業の共通ワークフロー強制、監査ログの外部保存はさらに後続の変更で扱う。
