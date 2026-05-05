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
  description: string;
  attributes: Array<{
    id: SkillAttributeId;
    level: ExperienceLevel;
  }>;
  techTags: string[];
  featured?: boolean;
  coverCode: string;
  highlights: string[];
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
    description:
      "古着とヴィンテージオーディオを扱うEC体験。検索、商品属性、決済、在庫導線をひとつの触れるUIとして設計。",
    attributes: [
      { id: "requirements", level: "experienced" },
      { id: "frontend", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "data", level: "experienced" },
      { id: "performance", level: "learning" }
    ],
    techTags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    featured: true,
    coverCode: "Next.js / Stripe",
    highlights: ["商品属性の整理", "検索体験の改善", "決済導線の設計"]
  },
  {
    id: "denimdb-migrator",
    title: "DenimDB Migrator",
    role: "Systems Architect",
    period: "2024",
    description:
      "商品、在庫、サイズ表記の移行を安全に行うためのデータ移行とロールバック設計。",
    attributes: [
      { id: "architecture", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "data", level: "experienced" },
      { id: "quality", level: "experienced" },
      { id: "delivery", level: "learning" }
    ],
    techTags: ["Go", "PostgreSQL", "GitHub Actions"],
    coverCode: "DB / CI",
    highlights: ["移行手順の分割", "ロールバック生成", "検証ログの整備"]
  },
  {
    id: "telemetry-9",
    title: "Telemetry 9",
    role: "Platform Engineer",
    period: "2024",
    description:
      "分散サービスの状態、デプロイ履歴、障害兆候をレコード溝のような時系列で読める監視ダッシュボード。",
    attributes: [
      { id: "frontend", level: "experienced" },
      { id: "performance", level: "experienced" },
      { id: "delivery", level: "experienced" },
      { id: "operations", level: "experienced" },
      { id: "security", level: "learning" }
    ],
    techTags: ["React", "D3", "AWS", "Observability"],
    coverCode: "D3 / Infra",
    highlights: ["時系列UI", "障害兆候の可視化", "運用導線の短縮"]
  },
  {
    id: "care-label-auth",
    title: "Care Label Auth",
    role: "Backend Engineer",
    period: "2023",
    description:
      "権限、入力検証、監査ログをケアラベルのように明文化し、管理画面の認証認可を整理した経験。",
    attributes: [
      { id: "requirements", level: "learning" },
      { id: "backend", level: "experienced" },
      { id: "security", level: "experienced" },
      { id: "quality", level: "learning" },
      { id: "operations", level: "learning" }
    ],
    techTags: ["Auth", "API", "Audit Log"],
    coverCode: "Auth / API",
    highlights: ["権限表の整理", "入力検証", "監査ログ"]
  }
];

export const maxRadarScore = 3;

export function scoreContribution(level: ExperienceLevel) {
  return level === "experienced" ? 1 : 0.5;
}

export function getSkillScore(id: SkillAttributeId) {
  return projects.reduce((total, project) => {
    const found = project.attributes.find((attribute) => attribute.id === id);
    return found ? total + scoreContribution(found.level) : total;
  }, 0);
}

export function getAttributeById(id: SkillAttributeId) {
  const attribute = skillAttributes.find((item) => item.id === id);

  if (!attribute) {
    throw new Error(`Unknown skill attribute: ${id}`);
  }

  return attribute;
}

export function getContributingProjects(id: SkillAttributeId) {
  return projects.filter((project) =>
    project.attributes.some((attribute) => attribute.id === id)
  );
}
