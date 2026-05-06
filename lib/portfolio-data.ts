export const skillAttributeIds = [
  "requirements",
  "architecture",
  "frontend",
  "backend",
  "data",
  "quality",
  "security",
  "performance",
  "delivery",
  "operations"
] as const;

export type SkillAttributeId = (typeof skillAttributeIds)[number];
export type ExperienceLevel = "experienced" | "learning";

export type SkillAttribute = {
  id: SkillAttributeId;
  label: string;
  displayName: string;
  shortName: string;
  garmentPart: string;
  description: string;
  stack: Array<{
    name: string;
    level: number;
  }>;
};

export type Project = {
  id: string;
  title: string;
  role: string;
  period: string;
  category: "work" | "personal" | "learning";
  description: string;
  problem: string;
  approach: string;
  result: string;
  attributes: Array<{
    id: SkillAttributeId;
    level: ExperienceLevel;
  }>;
  techTags: string[];
  featured?: boolean;
  featuredOrder?: number;
  coverCode: string;
  highlights: string[];
  learnings: string[];
};

export const skillAttributes: SkillAttribute[] = [
  {
    id: "requirements",
    label: "REQ",
    displayName: "要件定義・課題整理",
    shortName: "要件",
    garmentPart: "Care label / 取扱表示",
    description:
      "何を作るべきかを決める領域。課題ヒアリング、要求整理、仕様化、優先度付け、スコープ調整を扱う。",
    stack: [
      { name: "課題整理", level: 82 },
      { name: "仕様化", level: 78 },
      { name: "優先度設計", level: 72 }
    ]
  },
  {
    id: "architecture",
    label: "ARCH",
    displayName: "アーキテクチャ設計",
    shortName: "設計",
    garmentPart: "Pattern / 型紙",
    description:
      "全体をどう作るかを決める領域。システム分割、技術選定、非機能要件、拡張性、トレードオフ判断を扱う。",
    stack: [
      { name: "技術選定", level: 76 },
      { name: "責務分割", level: 74 },
      { name: "非機能設計", level: 68 }
    ]
  },
  {
    id: "frontend",
    label: "FRONT",
    displayName: "フロントエンド",
    shortName: "画面",
    garmentPart: "Jacket front / 見える面",
    description:
      "ユーザーが直接触る画面を作る領域。UI実装、状態管理、フォーム、アクセシビリティ、レスポンシブ対応を扱う。",
    stack: [
      { name: "React / Next.js", level: 88 },
      { name: "TypeScript", level: 84 },
      { name: "UI実装", level: 86 }
    ]
  },
  {
    id: "backend",
    label: "BACK",
    displayName: "バックエンド",
    shortName: "API",
    garmentPart: "Lining / 裏地",
    description:
      "画面の裏側で動く処理を作る領域。API、認証認可、業務ロジック、バッチ、外部サービス連携を扱う。",
    stack: [
      { name: "API設計", level: 78 },
      { name: "ドメインロジック", level: 74 },
      { name: "外部連携", level: 70 }
    ]
  },
  {
    id: "data",
    label: "DATA",
    displayName: "データ設計・モデリング",
    shortName: "データ",
    garmentPart: "Pocket / 収納",
    description:
      "データをどう持ち、どう取り出すかを設計する領域。DB設計、スキーマ、クエリ、インデックス、マイグレーションを扱う。",
    stack: [
      { name: "スキーマ設計", level: 76 },
      { name: "PostgreSQL", level: 72 },
      { name: "マイグレーション", level: 70 }
    ]
  },
  {
    id: "quality",
    label: "QA",
    displayName: "品質保証・テスト",
    shortName: "品質",
    garmentPart: "Stitch / 縫い目",
    description:
      "壊れにくさと確認しやすさを作る領域。単体テスト、結合テスト、E2E、レビュー、テストしやすい設計を扱う。",
    stack: [
      { name: "単体テスト", level: 74 },
      { name: "E2E", level: 68 },
      { name: "レビュー設計", level: 76 }
    ]
  },
  {
    id: "security",
    label: "SEC",
    displayName: "セキュリティ",
    shortName: "安全",
    garmentPart: "Rivet / 留め具",
    description:
      "安全に使える状態を作る領域。認証認可、権限設計、入力検証、秘密情報管理、脆弱性対策を扱う。",
    stack: [
      { name: "認証認可", level: 68 },
      { name: "入力検証", level: 72 },
      { name: "秘密情報管理", level: 64 }
    ]
  },
  {
    id: "performance",
    label: "PERF",
    displayName: "パフォーマンス改善",
    shortName: "速度",
    garmentPart: "Groove / 溝",
    description:
      "速く、重くなりにくくする領域。表示速度、APIレスポンス、DBクエリ、キャッシュ、負荷対策を扱う。",
    stack: [
      { name: "表示速度", level: 76 },
      { name: "キャッシュ", level: 68 },
      { name: "クエリ改善", level: 66 }
    ]
  },
  {
    id: "delivery",
    label: "SHIP",
    displayName: "インフラ・デリバリー",
    shortName: "配送",
    garmentPart: "Hem / 裾",
    description:
      "作ったものを環境に載せて届ける領域。クラウド、CI/CD、デプロイ、環境構築、リリースフローを扱う。",
    stack: [
      { name: "CI/CD", level: 78 },
      { name: "クラウド", level: 70 },
      { name: "デプロイ設計", level: 74 }
    ]
  },
  {
    id: "operations",
    label: "OPS",
    displayName: "運用・改善",
    shortName: "運用",
    garmentPart: "Repair tag / リペアタグ",
    description:
      "リリース後に育て続ける領域。障害対応、ログ確認、保守、問い合わせ対応、継続的改善を扱う。",
    stack: [
      { name: "ログ確認", level: 70 },
      { name: "保守改善", level: 76 },
      { name: "障害対応", level: 62 }
    ]
  }
];

export const projects: Project[] = [
  {
    id: "analog-commerce",
    title: "Analog E-Commerce",
    role: "Full-stack Engineer",
    period: "2025",
    category: "work",
    description:
      "古着とヴィンテージオーディオを扱うEC体験。検索、商品属性、決済、在庫導線をひとつの触れるUIとして設計。",
    problem:
      "商品属性が複雑で、探しやすさと購入導線の両立が難しい状態を整理する必要があった。",
    approach:
      "商品分類、検索条件、決済までの流れを一続きの体験として見直し、UIとデータ構造の両方から設計した。",
    result:
      "商品を探す、比較する、購入する流れを明確にし、実装と改善を続けやすいEC基盤として整理した。",
    attributes: [
      { id: "requirements", level: "experienced" },
      { id: "frontend", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "data", level: "experienced" },
      { id: "performance", level: "learning" }
    ],
    techTags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    featured: true,
    featuredOrder: 1,
    coverCode: "Next.js / Stripe",
    highlights: ["商品属性の整理", "検索体験の改善", "決済導線の設計"],
    learnings: ["UIだけでなく、検索条件とデータ設計を一緒に整える重要性", "購入導線は画面遷移よりも迷いの少なさで評価すること"]
  },
  {
    id: "denimdb-migrator",
    title: "DenimDB Migrator",
    role: "Systems Architect",
    period: "2024",
    category: "work",
    description:
      "商品、在庫、サイズ表記の移行を安全に行うためのデータ移行とロールバック設計。",
    problem:
      "サイズ表記や在庫履歴が複雑で、移行失敗時の戻し方や検証手順が曖昧になりやすかった。",
    approach:
      "移行処理を段階に分け、検証ログとロールバック手順を同時に設計して、失敗時に追跡できる状態を作った。",
    result:
      "移行作業の確認ポイントが明確になり、データ変更を安全に進めるための運用手順まで含めて整備した。",
    attributes: [
      { id: "architecture", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "data", level: "experienced" },
      { id: "quality", level: "experienced" },
      { id: "delivery", level: "learning" }
    ],
    techTags: ["Go", "PostgreSQL", "GitHub Actions"],
    featured: true,
    featuredOrder: 2,
    coverCode: "DB / CI",
    highlights: ["移行手順の分割", "ロールバック生成", "検証ログの整備"],
    learnings: ["データ移行は実装よりも検証可能性が重要になること", "ロールバック設計は後付けではなく移行設計と同時に考えること"]
  },
  {
    id: "telemetry-9",
    title: "Telemetry 9",
    role: "Platform Engineer",
    period: "2024",
    category: "work",
    description:
      "分散サービスの状態、デプロイ履歴、障害兆候をレコード溝のような時系列で読める監視ダッシュボード。",
    problem:
      "障害兆候、デプロイ履歴、サービス状態が分散していて、運用時に状況判断へ時間がかかっていた。",
    approach:
      "時系列で状態変化を読めるダッシュボードに集約し、原因調査に必要な情報へ短い導線で到達できるようにした。",
    result:
      "運用時の確認順序が整理され、障害兆候の把握とデプロイ影響の確認を進めやすくした。",
    attributes: [
      { id: "frontend", level: "experienced" },
      { id: "performance", level: "experienced" },
      { id: "delivery", level: "experienced" },
      { id: "operations", level: "experienced" },
      { id: "security", level: "learning" }
    ],
    techTags: ["React", "D3", "AWS", "Observability"],
    featured: true,
    featuredOrder: 3,
    coverCode: "D3 / Infra",
    highlights: ["時系列UI", "障害兆候の可視化", "運用導線の短縮"],
    learnings: ["運用UIは情報量よりも確認順序の設計が効くこと", "監視データは見せ方次第でチームの判断速度を変えられること"]
  },
  {
    id: "care-label-auth",
    title: "Care Label Auth",
    role: "Backend Engineer",
    period: "2023",
    category: "work",
    description:
      "権限、入力検証、監査ログをケアラベルのように明文化し、管理画面の認証認可を整理した経験。",
    problem:
      "管理画面の権限や入力検証のルールが散らばり、仕様確認と実装判断に時間がかかっていた。",
    approach:
      "権限表、入力検証、監査ログをひとまとまりの仕様として整理し、実装時に参照しやすい形へ落とし込んだ。",
    result:
      "認証認可まわりの判断基準が明確になり、レビューや保守で確認すべきポイントを揃えやすくした。",
    attributes: [
      { id: "requirements", level: "learning" },
      { id: "backend", level: "experienced" },
      { id: "security", level: "experienced" },
      { id: "quality", level: "learning" },
      { id: "operations", level: "learning" }
    ],
    techTags: ["Auth", "API", "Audit Log"],
    coverCode: "Auth / API",
    highlights: ["権限表の整理", "入力検証", "監査ログ"],
    learnings: ["セキュリティ要件はコードだけでなく仕様として読める状態が必要なこと", "監査ログは後から足すより業務フローと一緒に設計すること"]
  }
];

export const maxRadarScore = 3;
export const featuredProjects = projects
  .filter((project) => project.featured)
  .slice()
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
  .slice(0, 3);

export type ProjectFilterId = SkillAttributeId | "all";

export function scoreContribution(level: ExperienceLevel) {
  return level === "experienced" ? 1 : 0.5;
}

export const attributeById = new Map<SkillAttributeId, SkillAttribute>(
  skillAttributes.map((attribute) => [attribute.id, attribute])
);

export const projectById = new Map<string, Project>(
  projects.map((project) => [project.id, project])
);

function buildSkillScoreById() {
  const scores = new Map<SkillAttributeId, number>(
    skillAttributeIds.map((id) => [id, 0] as const)
  );

  for (const project of projects) {
    for (const attribute of project.attributes) {
      scores.set(attribute.id, (scores.get(attribute.id) ?? 0) + scoreContribution(attribute.level));
    }
  }

  return scores;
}

function buildProjectsBySkillAttributeId() {
  const index = new Map<SkillAttributeId, Project[]>(
    skillAttributeIds.map((id) => [id, [] as Project[]] as const)
  );

  for (const project of projects) {
    for (const attribute of project.attributes) {
      index.get(attribute.id)?.push(project);
    }
  }

  return index;
}

export const skillScoreById = buildSkillScoreById();
export const projectsBySkillAttributeId = buildProjectsBySkillAttributeId();

export function getSkillScore(id: SkillAttributeId) {
  return skillScoreById.get(id) ?? 0;
}

export function getAttributeById(id: SkillAttributeId) {
  const attribute = attributeById.get(id);

  if (!attribute) {
    throw new Error(`Unknown skill attribute: ${id}`);
  }

  return attribute;
}

export function getContributingProjects(id: SkillAttributeId) {
  return projectsBySkillAttributeId.get(id) ?? [];
}

export function getProjectsBySkillAttribute(id: ProjectFilterId) {
  return id === "all" ? projects : getContributingProjects(id);
}

export function getProjectById(id: string) {
  return projectById.get(id);
}
