了解。実装前に、現状と変更後の差分を図で整理します。

**現状**
今はデータ取得・集計・レーダー座標生成が、表示コンポーネント側にやや散っています。

```mermaid
flowchart TD
  A["lib/portfolio-data.ts<br/>projects / skillAttributes"] --> B["SkillMatrix.client.tsx"]
  A --> C["HeroTurntable.client.tsx"]
  A --> D["ProjectArchive.client.tsx"]
  A --> E["ProjectCard.tsx / project detail"]

  B --> B1["getSkillScore(id)<br/>projects.reduce + attributes.find"]
  B --> B2["getContributingProjects(id)<br/>projects.filter"]
  B --> B3["getAttributeById(id)<br/>skillAttributes.find"]
  B --> B4["getPoint / pointsToString<br/>レーダー座標をその場で組み立て"]

  C --> C1["getSkillScore(id)<br/>projects.reduce + attributes.find"]
  C --> C2["getPoint / pointsToString<br/>Hero用レーダーをその場で組み立て"]

  D --> D1["projects.filter<br/>属性フィルタをコンポーネント内で実行"]

  E --> E1["getAttributeById(id)<br/>表示のたびに find"]
```

つまり、データは `lib/portfolio-data.ts` にあるけど、派生データの作り方が UI 側にも残っています。

**現状の SkillMatrix の流れ**

```mermaid
sequenceDiagram
  participant User as ユーザー
  participant SkillMatrix as SkillMatrix.client.tsx
  participant Data as lib/portfolio-data.ts
  participant Radar as radar.ts

  User->>SkillMatrix: FRONT / QA などのチップをクリック
  SkillMatrix->>SkillMatrix: activeSkillId を更新
  SkillMatrix->>Data: getAttributeById(activeSkillId)
  Data-->>SkillMatrix: skillAttribute
  SkillMatrix->>Data: getSkillScore(activeSkillId)
  Data->>Data: projects.reduce + attributes.find
  Data-->>SkillMatrix: score
  SkillMatrix->>Data: getContributingProjects(activeSkillId)
  Data->>Data: projects.filter + attributes.some
  Data-->>SkillMatrix: related projects
  SkillMatrix->>Radar: getPoint を複数回呼ぶ
  Radar-->>SkillMatrix: SVG座標
  SkillMatrix-->>User: Field Notes / Radar / Evidence を再描画
```

問題は、毎回壊れるほど重いわけではないです。ただ、責務としては `SkillMatrix` が「表示」だけでなく「データ検索」「スコア集計」「レーダー形状の組み立て」も持っています。

**変更後の狙い**
変更後は、`lib/portfolio-data.ts` が「検索済み・集計済みの入口」を持ち、`radar.ts` が「レーダー形状をまとめて作る入口」を持つ形にします。

```mermaid
flowchart TD
  A["lib/portfolio-data.ts<br/>raw data"] --> A1["attributeById<br/>Map"]
  A --> A2["projectById<br/>Map"]
  A --> A3["skillScoreById<br/>Map"]
  A --> A4["projectsBySkillAttributeId<br/>Map"]

  A1 --> S["selectors<br/>getAttributeById / getProjectById"]
  A2 --> S
  A3 --> S
  A4 --> S

  S --> B["SkillMatrix.client.tsx"]
  S --> C["HeroTurntable.client.tsx"]
  S --> D["ProjectArchive.client.tsx"]
  S --> E["ProjectCard.tsx / project detail"]

  R["components/portfolio/radar.ts<br/>buildRadarGeometry"] --> B
  R --> C
```

UI 側は「どのデータを表示するか」を呼び出すだけに寄せます。

**変更後の SkillMatrix の流れ**

```mermaid
sequenceDiagram
  participant User as ユーザー
  participant SkillMatrix as SkillMatrix.client.tsx
  participant Data as lib/portfolio-data.ts
  participant Radar as radar.ts

  User->>SkillMatrix: FRONT / QA などのチップをクリック
  SkillMatrix->>SkillMatrix: activeSkillId を更新

  SkillMatrix->>Data: getAttributeById(activeSkillId)
  Data-->>SkillMatrix: Map から skillAttribute

  SkillMatrix->>Data: getSkillScore(activeSkillId)
  Data-->>SkillMatrix: Map から score

  SkillMatrix->>Data: getContributingProjects(activeSkillId)
  Data-->>SkillMatrix: Map から related projects

  SkillMatrix->>Radar: buildRadarGeometry(...)
  Radar-->>SkillMatrix: rings / axes / scorePoints / labelPoints

  SkillMatrix-->>User: Field Notes / Radar / Evidence を再描画
```

**レーダー整理の差分**
現状は `SkillMatrix` と `HeroTurntable` が似た計算を別々に持っています。

```mermaid
flowchart LR
  subgraph Current["現状"]
    A["SkillMatrix"] --> A1["ring pointsを作る"]
    A --> A2["axis pointsを作る"]
    A --> A3["score pointsを作る"]
    A --> A4["label pointsを作る"]

    B["HeroTurntable"] --> B1["ring pointsを作る"]
    B --> B2["axis pointsを作る"]
    B --> B3["score pointsを作る"]
  end

  subgraph After["変更後"]
    C["SkillMatrix"] --> R["buildRadarGeometry"]
    D["HeroTurntable"] --> R
    R --> R1["rings"]
    R --> R2["axes"]
    R --> R3["scorePoints"]
    R --> R4["labelPoints"]
  end
```

ここでやりたいのは、描画の見た目を変えることではなく、「多角形レーダーの形状を作る処理」を1箇所に寄せることです。

**データ検索整理の差分**

```mermaid
flowchart TD
  subgraph Current["現状"]
    C1["getAttributeById"] --> C1a["skillAttributes.find"]
    C2["getProjectById"] --> C2a["projects.find"]
    C3["getSkillScore"] --> C3a["projects.reduce"]
    C3a --> C3b["project.attributes.find"]
    C4["getContributingProjects"] --> C4a["projects.filter"]
  end

  subgraph After["変更後"]
    A["module load時に一度だけ index 作成"]
    A --> M1["attributeById: Map"]
    A --> M2["projectById: Map"]
    A --> M3["skillScoreById: Map"]
    A --> M4["projectsBySkillAttributeId: Map"]

    M1 --> F1["getAttributeById"]
    M2 --> F2["getProjectById"]
    M3 --> F3["getSkillScore"]
    M4 --> F4["getContributingProjects"]
  end
```

現状でもデータ量が少ないので速度問題は小さいです。ただし今後プロジェクトや属性が増えるなら、検索・集計の責務を `lib/portfolio-data.ts` に閉じ込めておく方が安全です。

**作業単位**

```mermaid
flowchart TD
  S["開始: 現状は build/typecheck OK"] --> P1["Step 1<br/>portfolio-data に Map/index を追加"]
  P1 --> V1["typecheck"]
  V1 --> P2["Step 2<br/>ProjectArchive を selector 経由に変更"]
  P2 --> V2["typecheck"]
  V2 --> P3["Step 3<br/>radar.ts に buildRadarGeometry を追加"]
  P3 --> P4["Step 4<br/>SkillMatrix / HeroTurntable を差し替え"]
  P4 --> V3["typecheck + build"]
  V3 --> E["完了"]
```

**重要な判断**
この変更では UI デザインや情報設計は触りません。`Project` 型や表示文言も原則そのままです。

触る予定:

- [lib/portfolio-data.ts](/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/lib/portfolio-data.ts)
- [components/portfolio/radar.ts](/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/components/portfolio/radar.ts)
- [components/portfolio/SkillMatrix.client.tsx](/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/components/portfolio/SkillMatrix.client.tsx)
- [components/portfolio/HeroTurntable.client.tsx](/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/components/portfolio/HeroTurntable.client.tsx)
- [components/portfolio/ProjectArchive.client.tsx](/Users/nagahamayuu/Documents/Projects/yuukun-portfolio/components/portfolio/ProjectArchive.client.tsx)

触らない予定:

- 見た目の Tailwind class
- `/projects/[id]` のページ構成
- 実績データの中身
- スキル属性の定義

要するに次の作業は、「表示はそのまま、データ取得とレーダー形状生成の責務を UI から外す」リファクタです。
