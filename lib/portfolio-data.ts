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
  "operations",
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
  artwork: "rag" | "vision" | "notebook" | "automation";
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
      { name: "優先度設計", level: 72 },
    ],
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
      { name: "非機能設計", level: 68 },
    ],
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
      { name: "UI実装", level: 86 },
    ],
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
      { name: "外部連携", level: 70 },
    ],
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
      { name: "マイグレーション", level: 70 },
    ],
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
      { name: "レビュー設計", level: 76 },
    ],
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
      { name: "秘密情報管理", level: 64 },
    ],
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
      { name: "クエリ改善", level: 66 },
    ],
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
      { name: "デプロイ設計", level: 74 },
    ],
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
      { name: "障害対応", level: 62 },
    ],
  },
];

// 採用したIssue #18の画面案をもとにした掲載原稿。公開前に本人による事実確認を行う。
export const projects: Project[] = [
  {
    id: "rag-asset-assistant",
    title: "社内資産管理のためのRAGチャットボット",
    role: "AIシステム開発",
    period: "2024–2025",
    category: "work",
    description:
      "散らばった社内情報を、必要なときに。検索と対話で、知識にたどり着く仕組み。",
    problem:
      "社内の資産情報やドキュメントが分散し、必要な情報を見つけるまでに手間がかかる。",
    approach:
      "情報を検索するRAGの構成を検討し、回答の根拠を辿れる対話体験を設計。Recall・MRR・nDCGを使い、検索の品質を確かめる。",
    result:
      "検索・回答・評価をひとつの流れとして整理。使う人が情報の根拠を確認できることを重視した。",
    attributes: [
      { id: "requirements", level: "experienced" },
      { id: "architecture", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "data", level: "experienced" },
      { id: "quality", level: "experienced" },
      { id: "security", level: "learning" },
    ],
    techTags: ["Python", "RAG", "検索評価", "Graph RAG"],
    featured: true,
    featuredOrder: 1,
    coverCode: "01 / RAG",
    artwork: "rag",
    highlights: ["社内情報の検索と対話", "根拠を辿れる回答", "検索品質の評価"],
    learnings: [
      "回答だけでなく、検索段階から品質を確かめる。",
      "情報の出典を示し、利用者が判断できる体験にする。",
    ],
  },
  {
    id: "restaurant-seat-intelligence",
    title: "画像から捉える、飲食店の座席利用",
    role: "大学での研究",
    period: "2021–2023",
    category: "learning",
    description:
      "人の検出と追跡から、座席の利用状況を可視化。画像認識を、現場を知る手がかりに。",
    problem:
      "飲食店の座席がどのように使われているかを、人の動きと結びつけて捉えたい。",
    approach:
      "YOLOv5による検出、ByteTrackによる追跡、OpenPoseによる姿勢推定を組み合わせ、座席利用を把握する方法を研究。",
    result:
      "画像から人の動きと座席の関係を読み取るための検討を進めた。検出と追跡のつながりを重視した。",
    attributes: [
      { id: "requirements", level: "learning" },
      { id: "data", level: "experienced" },
      { id: "quality", level: "experienced" },
      { id: "performance", level: "learning" },
    ],
    techTags: ["Python", "YOLOv5", "ByteTrack", "OpenPose"],
    featured: true,
    featuredOrder: 2,
    coverCode: "02 / VISION",
    artwork: "vision",
    highlights: ["人の検出・追跡", "姿勢推定", "座席利用の可視化"],
    learnings: [
      "検出精度と追跡の安定性を分けて考える。",
      "実際の利用場面を想定して評価する。",
    ],
  },
  {
    id: "oneview-oss",
    title: "OneView OSS",
    role: "個人開発・OSS",
    period: "2024",
    category: "personal",
    description:
      "情報を、ひとつの見通しへ。日々の確認を軽くするWebアプリケーション。",
    problem: "複数の情報を行き来する際に、確認の流れが途切れてしまう。",
    approach:
      "必要な情報を一覧できる画面と、詳細に進める導線を設計。Next.jsとTypeScriptを使って実装する。",
    result:
      "一覧から詳細まで、迷わず情報を確認できる構成を検討した。小さく作り、改善を続ける。",
    attributes: [
      { id: "architecture", level: "experienced" },
      { id: "frontend", level: "experienced" },
      { id: "backend", level: "learning" },
      { id: "performance", level: "learning" },
      { id: "delivery", level: "experienced" },
    ],
    techTags: ["Next.js", "TypeScript", "OSS"],
    featured: true,
    featuredOrder: 3,
    coverCode: "03 / WEB APP",
    artwork: "notebook",
    highlights: ["情報を見渡すUI", "一覧と詳細の導線", "継続的な改善"],
    learnings: [
      "最初に情報の優先順位を決める。",
      "使いながら改善できる小さな単位で実装する。",
    ],
  },
  {
    id: "mattermost-jira-automation",
    title: "Mattermost × Jira 業務連携の自動化",
    role: "業務自動化",
    period: "2024",
    category: "personal",
    description:
      "チャットからタスクへ。繰り返す作業をつなぎ、仕事の流れをなめらかに。",
    problem:
      "チャットとタスク管理を行き来する転記作業が、日々の業務に発生する。",
    approach:
      "MattermostとJiraのAPIを連携し、通知からタスク管理につながるワークフローを設計する。",
    result: "手作業でつないでいた業務を、追跡できる処理の流れとして整理した。",
    attributes: [
      { id: "requirements", level: "experienced" },
      { id: "backend", level: "experienced" },
      { id: "security", level: "learning" },
      { id: "delivery", level: "learning" },
      { id: "operations", level: "experienced" },
    ],
    techTags: ["Python", "AWS", "Automation"],
    coverCode: "04 / AUTOMATION",
    artwork: "automation",
    highlights: [
      "チャットとタスクの連携",
      "APIを使った自動化",
      "運用を見据えた処理",
    ],
    learnings: [
      "失敗時の確認方法もワークフローに含める。",
      "小さな繰り返し作業から自動化を始める。",
    ],
  },
];

export const journey = [
  {
    period: "2021–2023",
    title: "大学での研究",
    description: "画像認識を使い、飲食店の人や座席の利用状況を捉える研究。",
  },
  {
    period: "2023",
    title: "AI SaaSでのインターン",
    description: "プロダクトの中で、RAGや検索評価の考え方を学び、検討。",
  },
  {
    period: "2023–現在",
    title: "SIerでのAIシステム開発",
    description: "社内資産管理を支えるAIチャットボットの開発と、検索の改善。",
  },
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
  skillAttributes.map((attribute) => [attribute.id, attribute]),
);

export const projectById = new Map<string, Project>(
  projects.map((project) => [project.id, project]),
);

function buildSkillScoreById() {
  const scores = new Map<SkillAttributeId, number>(
    skillAttributeIds.map((id) => [id, 0] as const),
  );

  for (const project of projects) {
    for (const attribute of project.attributes) {
      scores.set(
        attribute.id,
        (scores.get(attribute.id) ?? 0) + scoreContribution(attribute.level),
      );
    }
  }

  return scores;
}

function buildProjectsBySkillAttributeId() {
  const index = new Map<SkillAttributeId, Project[]>(
    skillAttributeIds.map((id) => [id, [] as Project[]] as const),
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
