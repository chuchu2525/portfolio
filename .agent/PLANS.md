# Codex Execution Plans（ExecPlans）

このドキュメントは、実行計画（"ExecPlan"）の要件を説明するものです。ExecPlan とは、coding agent が動作する機能やシステム変更を実装するために従える設計ドキュメントです。読み手はこのリポジトリについて完全な初心者だと考えてください。読み手が持っているのは、現在の working tree と、あなたが提供する単一の ExecPlan ファイルだけです。過去の計画に関する記憶も、外部コンテキストもありません。

## ExecPlans と PLANS.md の使い方

実行可能な仕様（ExecPlan）を書くときは、PLANS.md に _厳密に_ 従ってください。PLANS.md がコンテキストにない場合は、ファイル全体を読み直して記憶を更新してください。正確な仕様を作るために、ソース資料を丁寧に読み、必要に応じて何度も読み返してください。仕様を作成するときは、スケルトンから始め、調査を進めながら肉付けしてください。

実行可能な仕様（ExecPlan）を実装するときは、ユーザーに「次のステップ」を尋ねないでください。そのまま次のマイルストーンへ進んでください。すべてのセクションを最新の状態に保ち、作業を止めるたびにリスト項目を追加または分割して、完了した進捗と次に行うことを明確に記録してください。曖昧さは自律的に解消し、こまめに commit してください。

実行可能な仕様（ExecPlan）について議論するときは、後から参照できるように、判断を仕様内のログに記録してください。仕様への変更がなぜ行われたのかが曖昧でない状態にしてください。ExecPlans は生きたドキュメントであり、常に _ExecPlan だけ_ から再開できる状態でなければなりません。他の作業や記憶に依存してはいけません。

難しい要件や大きな未知要素を含む設計を調査するときは、マイルストーンを使って proof of concept や「toy implementation」などを実装し、ユーザーの提案が実現可能かどうかを検証してください。ライブラリのソースコードを探す、または取得して読み込み、深く調査し、より本格的な実装の指針となる prototype を含めてください。

## Requirements

交渉不可の要件:

- すべての ExecPlan は完全に自己完結していなければなりません。自己完結とは、現在の形のままで、初心者が成功するために必要な知識と手順がすべて含まれていることを意味します。
- すべての ExecPlan は生きたドキュメントです。貢献者は、進捗が出たとき、発見があったとき、設計上の判断が確定したときに、それを反映して更新する必要があります。各改訂後も、自己完結性を保たなければなりません。
- すべての ExecPlan は、この repo について事前知識のない完全な初心者でも、その機能を end-to-end で実装できるようにしなければなりません。
- すべての ExecPlan は、「定義を満たすためのコード変更」にとどまらず、実際に動作していることを示せる振る舞いを生み出さなければなりません。
- すべての ExecPlan は、専門用語を平易な言葉で定義しなければなりません。定義できないなら、その用語を使わないでください。

目的と意図を最初に置いてください。まず、ユーザーの視点から見てこの作業がなぜ重要なのかを数文で説明します。この変更後に、以前はできなかった何ができるようになるのか、そしてそれが動いていることをどう確認できるのかを書いてください。そのうえで、結果を達成するための正確な手順を案内してください。何を編集するのか、何を実行するのか、何が観察できるはずなのかを含めます。

ExecPlan を実行する agent は、ファイル一覧の確認、ファイルの読み取り、検索、プロジェクトの実行、テストの実行ができます。しかし、過去のコンテキストを知りませんし、以前のマイルストーンからあなたの意図を推測することもできません。依存している前提はすべて繰り返し明記してください。外部のブログやドキュメントを参照させないでください。必要な知識があるなら、自分の言葉で plan の中に埋め込んでください。ExecPlan が過去の ExecPlan を土台にしており、そのファイルが repo に checked in されている場合は、それを参照として組み込んでください。そうでない場合は、その過去の plan から必要なコンテキストをすべて含める必要があります。

## Formatting

フォーマットと外枠は単純かつ厳格です。各 ExecPlan は、`md` ラベル付きの単一の fenced code block でなければなりません。つまり triple backticks で始まり、triple backticks で終わります。ExecPlan の中に追加の triple-backtick code fences をネストしないでください。コマンド、transcript、diff、code を示す必要がある場合は、その単一の fence の中でインデントされたブロックとして提示してください。ExecPlan の code fence を意図せず閉じてしまわないように、code fences ではなくインデントを使って明確にしてください。各見出しの後には空行を 2 つ入れ、`#` や `##` などの正しい syntax を使ってください。

Markdown（.md）ファイルに ExecPlan を書き込む場合で、そのファイルの内容が単一の ExecPlan のみであるなら、triple backticks は省略してください。

平易な prose で書いてください。リストよりも文を優先してください。簡潔にすると意味が不明確になる場合を除き、checklist、table、長い列挙は避けてください。checklist は `Progress` セクションでのみ許可され、そこでは必須です。Narrative sections は prose-first のままにしてください。

## Guidelines

自己完結性と平易な言葉が最優先です。普通の英語ではない語句（"daemon"、"middleware"、"RPC gateway"、"filter graph" など）を導入する場合は、すぐに定義し、それがこの repository でどのように現れるのかを説明してください。たとえば、どのファイルやコマンドに現れるのかを名前で示します。「以前定義したとおり」や「architecture doc によると」と言わないでください。たとえ繰り返しになっても、必要な説明はここに含めてください。

よくある失敗を避けてください。未定義の jargon に依存しないでください。結果としてコードは compile するが意味のある動作をしない、というほど狭く機能の表面だけを記述しないでください。重要な判断を読み手に委ねないでください。曖昧さがある場合は、plan の中で解消し、なぜその選択をしたのかを説明してください。ユーザーに見える効果は十分に説明し、偶発的な実装詳細は必要以上に細かく指定しない、という方向に寄せてください。

観察可能な結果を plan の軸にしてください。実装後にユーザーが何をできるのか、実行すべきコマンド、見るべき出力を明記してください。Acceptance は、内部属性ではなく、人間が確認できる振る舞いとして表現してください。たとえば、「HealthCheck struct を追加した」ではなく、「server を起動したあと、[http://localhost:8080/health](http://localhost:8080/health) にアクセスすると HTTP 200 と body OK が返る」のように書いてください。変更が内部的なものである場合でも、その影響をどう示せるかを説明してください。たとえば、変更前は失敗し変更後は成功する test を実行する、または新しい振る舞いを使う scenario を示す、などです。

repository context を明示してください。repository root からの完全な相対 path でファイル名を書き、function や module を正確に名指しし、新しいファイルをどこに作るべきか説明してください。複数の領域に触れる場合は、それらがどう関係しているのかを説明する短い orientation paragraph を含め、初心者が自信を持って移動できるようにしてください。コマンドを実行する場合は、working directory と正確な command line を示してください。結果が環境に依存する場合は、前提を述べ、合理的な代替案があれば示してください。

冪等で安全にしてください。手順は、何度実行しても損傷や drift を起こさないように書いてください。途中で失敗しうる手順がある場合は、retry や適応方法を含めてください。migration や破壊的操作が必要な場合は、backup や安全な fallback を明記してください。可能な限り、追加的で testable な変更を好み、段階的に検証できるようにしてください。

Validation は任意ではありません。test の実行方法、該当する場合は system の起動方法、そして有用な動作をどう観察するかを含めてください。新機能や新しい capabilities については、包括的な testing を説明してください。成功と失敗を初心者が見分けられるように、期待される出力や error message を含めてください。可能であれば、compilation を超えて変更の効果を証明する方法を示してください。たとえば、小さな end-to-end scenario、CLI invocation、HTTP request/response transcript などです。プロジェクトの toolchain に適した正確な test command と、その結果をどう解釈するかを書いてください。

証拠を記録してください。手順によって terminal output、短い diff、logs が生成される場合は、それらを単一の fenced block 内にインデントされた example として含めてください。成功を証明するものに絞り、簡潔にしてください。patch を含める必要がある場合は、大きな blob を貼り付けるよりも、file-scoped diff や小さな excerpt を優先してください。読み手が手順に従って再現できる形にしてください。

## Milestones

Milestones は物語であり、官僚的な手続きではありません。作業を milestones に分ける場合は、それぞれの冒頭に短い paragraph を置いてください。そこでは、その milestone の範囲、完了時に新しく存在するもの、実行するコマンド、期待される acceptance を説明します。読みやすい story として保ってください。つまり、goal、work、result、proof です。Progress と milestones は別物です。milestones は物語を語り、progress は細かな作業を tracking します。両方が必須です。簡潔さのためだけに milestone を省略しないでください。将来の実装に重要となる可能性のある詳細を省かないでください。

各 milestone は独立して検証可能であり、execution plan 全体の目標を段階的に実装するものでなければなりません。

## Living plans and design decisions

- ExecPlans は生きたドキュメントです。重要な design decisions を行ったら、その決定と、その背景にある考えの両方を記録するよう plan を更新してください。すべての判断は `Decision Log` セクションに記録してください。
- ExecPlans には、`Progress` セクション、`Surprises & Discoveries` セクション、`Decision Log`、`Outcomes & Retrospective` セクションを含め、維持しなければなりません。これらは任意ではありません。
- optimizer behavior、performance tradeoffs、予期しない bugs、inverse/unapply semantics など、アプローチに影響した発見があった場合は、`Surprises & Discoveries` セクションに記録してください。短い evidence snippet、特に test output が理想です。
- 実装中に方針転換した場合は、理由を `Decision Log` に記録し、その影響を `Progress` に反映してください。Plans は自分の checklist であると同時に、次の contributor のための guide でもあります。
- major task または plan 全体の完了時には、`Outcomes & Retrospective` に entry を書き、達成したこと、残っていること、学んだことを要約してください。

# Prototyping milestones and parallel implementations

大きな変更のリスクを下げるために明示的な prototyping milestones を含めることは許容され、しばしば推奨されます。例としては、依存関係に low-level operator を追加して実現可能性を検証する、optimizer effects を測定しながら 2 つの composition order を探索する、といったものがあります。Prototypes は追加的かつ testable にしてください。範囲を “prototyping” と明確に label し、実行方法と観察すべき結果を説明し、prototype を正式実装に昇格させる基準、または破棄する基準を示してください。

tests を passing に保ちながら、追加的な code changes の後に削除を行う形を優先してください。Parallel implementations、たとえば migration 中に古い path と並行して adapter を維持することは、risk を下げたり、巨大な migration の途中でも tests を通し続けられるようにする場合には問題ありません。両方の path をどう検証するか、そして片方を tests とともに安全に retire する方法を説明してください。複数の新しい libraries や feature areas に取り組む場合は、それぞれの feasibility を互いに独立して評価する spikes を作ることを検討してください。外部 library が期待どおりに動作し、必要な features を isolation された状態で実装できることを証明してください。

## Skeleton of a Good ExecPlan

```
# <短く、action-oriented な説明>

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If PLANS.md file is checked into the repo, reference the path to that file here from the repository root and note that this document must be maintained in accordance with PLANS.md.

## Purpose / Big Picture

この変更によって何が得られるのか、そしてそれが動作していることをどう確認できるのかを数文で説明する。可能になる user-visible behavior を述べる。

## Progress

granular steps を要約するために、checkbox 付きの list を使う。作業を止めるたびに、ここに必ず記録する。必要なら、部分的に完了した task を「done」と「remaining」に分割する。このセクションは常に実際の現在状態を反映していなければならない。

- [x] (2025-10-01 13:00Z) 完了済み step の例。
- [ ] 未完了 step の例。
- [ ] 部分的に完了した step の例（completed: X; remaining: Y）。

進捗速度を測れるように timestamps を使う。

## Surprises & Discoveries

実装中に発見した予期しない behavior、bugs、optimizations、insights を記録する。簡潔な evidence を示す。

- Observation: …
  Evidence: …

## Decision Log

作業中に行ったすべての判断を、次の形式で記録する。

- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective

major milestone または completion 時点で、outcomes、gaps、lessons learned を要約する。結果を当初の purpose と比較する。

## Context and Orientation

読み手が何も知らない前提で、この task に関連する現在の状態を説明する。重要な files と modules を repository-relative path で名指しする。使う non-obvious term を定義する。prior plans を参照しない。

## Plan of Work

edits と additions の順序を prose で説明する。各 edit について、file と location（function、module）を名指しし、何を挿入または変更するかを書く。具体的かつ最小限に保つ。

## Concrete Steps

実行する正確な commands と、その working directory を示す。command が output を生成する場合は、比較できるよう短い expected transcript を示す。このセクションは作業が進むにつれて更新しなければならない。

## Validation and Acceptance

system を起動または実行して確認する方法と、観察すべきことを説明する。acceptance は具体的な inputs と outputs を含む behavior として表現する。tests が関係する場合は、「run <project’s test command> and expect <N> passed; the new test <name> fails before the change and passes after>」のように書く。

## Idempotence and Recovery

手順を安全に繰り返せる場合はそう書く。リスクのある step がある場合は、安全な retry または rollback path を示す。完了後に environment を clean に保つ。

## Artifacts and Notes

最も重要な transcripts、diffs、snippets を、インデントされた examples として含める。成功を証明するものに絞り、簡潔に保つ。

## Interfaces and Dependencies

Prescriptive に書く。使う libraries、modules、services を名指しし、それを使う理由を示す。milestone 終了時に存在すべき types、traits/interfaces、function signatures を指定する。`crate::module::function` や `package.submodule.Interface` のような安定した names と paths を優先する。例:

In crates/foo/planner.rs, define:

    pub trait Planner {
        fn plan(&self, observed: &Observed) -> Vec<Action>;
    }
```

上記の guidance に従えば、単一の stateless agent、または人間の初心者が ExecPlan を最初から最後まで読み、動作し観察可能な結果を生み出せます。これが基準です。SELF-CONTAINED、SELF-SUFFICIENT、NOVICE-GUIDING、OUTCOME-FOCUSED であること。

plan を改訂するときは、変更内容がすべてのセクションに包括的に反映されていることを確認してください。living document sections も含みます。そして、plan の末尾に変更内容とその理由を説明する note を書いてください。ExecPlans は、ほぼすべてについて「何を」だけでなく「なぜ」を説明しなければなりません。

## リポジトリ固有の配置ルール

このリポジトリの ExecPlan は、必ず `.agent/exec-plans/` 配下に 1 計画 1 ファイルの Markdown として作成してください。これ以外の場所には作成しないでください。
