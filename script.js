const skills = {
  frontend: {
    label: "フロントエンド",
    part: "ジャケットの前身頃",
    score: 86,
    text: "見た目、操作感、状態管理をまとめて仕立てる領域。UIの密度と使いやすさを両立する役割。",
    stack: [
      ["React / Next", 88],
      ["TypeScript", 84],
      ["UI Design", 78]
    ]
  },
  backend: {
    label: "バックエンド",
    part: "襟と裏地",
    score: 78,
    text: "API、認証、ドメインロジックを支える裏側。表から見えない品質を服の裏地として表現。",
    stack: [
      ["API Design", 82],
      ["Node / Go", 74],
      ["Auth", 72]
    ]
  },
  database: {
    label: "DB",
    part: "ポケット",
    score: 72,
    text: "必要な情報を取り出しやすく収める領域。ポケットのように、構造と取り回しを重視。",
    stack: [
      ["Schema", 76],
      ["Query", 72],
      ["Migration", 68]
    ]
  },
  infra: {
    label: "インフラ",
    part: "裾とステッチ",
    score: 69,
    text: "サービスが立ち続ける土台。裾の処理や縫製のように、崩れにくさを支える。",
    stack: [
      ["Cloud", 70],
      ["Monitoring", 66],
      ["IaC", 62]
    ]
  },
  cicd: {
    label: "CI/CD",
    part: "ボタンとリベット",
    score: 74,
    text: "変更を小さく確実に届ける仕組み。レコードの針が溝を追うように、品質ゲートを通す。",
    stack: [
      ["GitHub Actions", 80],
      ["Test Flow", 72],
      ["Deploy", 70]
    ]
  }
};

const skillOrder = ["frontend", "backend", "database", "infra", "cicd"];
const basePoints = [
  [150, 24],
  [270, 112],
  [224, 254],
  [76, 254],
  [30, 112]
];
const center = [150, 150];

let activeSkill = "frontend";
let activeFilter = "all";
let experiences = [
  {
    title: "レコード在庫の管理ダッシュボード",
    desc: "盤質、価格、入荷日、視聴ログをまとめて確認できる管理画面の想定案件。",
    attrs: ["frontend", "database", "backend"]
  },
  {
    title: "古着ECの検索体験改善",
    desc: "サイズ、年代、素材、コンディションから商品を探しやすくする検索UIとAPI設計。",
    attrs: ["frontend", "backend", "database"]
  },
  {
    title: "デプロイ導線の整備",
    desc: "レビュー、テスト、プレビュー環境、リリースをつなげるCI/CDの改善。",
    attrs: ["infra", "cicd", "backend"]
  }
];

const radarShape = document.querySelector("#radar-shape");
const radarDots = document.querySelector("#radar-dots");
const skillDetail = document.querySelector("#skill-detail");
const attributeInputs = document.querySelector("#attribute-inputs");
const filterBar = document.querySelector("#filter-bar");
const experienceList = document.querySelector("#experience-list");
const experienceForm = document.querySelector("#experience-form");

function getRadarPoint(index, score) {
  const [x, y] = basePoints[index];
  const ratio = score / 100;
  return [
    center[0] + (x - center[0]) * ratio,
    center[1] + (y - center[1]) * ratio
  ];
}

function renderRadar() {
  const points = skillOrder.map((key, index) => getRadarPoint(index, skills[key].score));
  radarShape.setAttribute("points", points.map((point) => point.join(",")).join(" "));
  radarDots.innerHTML = points
    .map(([x, y], index) => `<circle class="radar-dot" data-skill="${skillOrder[index]}" cx="${x}" cy="${y}" r="6"></circle>`)
    .join("");

  radarDots.querySelectorAll(".radar-dot").forEach((dot) => {
    dot.addEventListener("click", () => setActiveSkill(dot.dataset.skill));
  });
}

function renderSkillDetail() {
  const skill = skills[activeSkill];
  skillDetail.innerHTML = `
    <p class="kicker">${skill.part}</p>
    <h3>${skill.label}</h3>
    <p>${skill.text}</p>
    <div class="skill-meter">
      ${skill.stack
        .map(
          ([name, value]) => `
            <div class="meter-row">
              <span>${name}</span>
              <span class="meter-track"><span class="meter-fill" style="width: ${value}%"></span></span>
              <span>${value}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function setActiveSkill(key) {
  activeSkill = key;
  document.querySelectorAll(".skill-pin").forEach((button) => {
    button.classList.toggle("active", button.dataset.skill === key);
  });
  renderSkillDetail();
}

function renderAttributeInputs() {
  attributeInputs.innerHTML = skillOrder
    .map(
      (key, index) => `
        <label class="check-pill">
          <input type="checkbox" name="attr" value="${key}" ${index < 3 ? "checked" : ""}>
          ${skills[key].label}
        </label>
      `
    )
    .join("");
}

function renderFilters() {
  const filters = ["all", ...skillOrder];
  filterBar.innerHTML = filters
    .map((key) => {
      const label = key === "all" ? "All" : skills[key].label;
      return `<button class="filter-chip ${activeFilter === key ? "active" : ""}" data-filter="${key}">${label}</button>`;
    })
    .join("");

  filterBar.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderExperiences();
    });
  });
}

function renderExperiences() {
  const visible = activeFilter === "all"
    ? experiences
    : experiences.filter((experience) => experience.attrs.includes(activeFilter));

  experienceList.innerHTML = visible
    .map(
      (experience) => `
        <article class="experience-card">
          <h3>${experience.title}</h3>
          <p>${experience.desc}</p>
          <div class="tag-row">
            ${experience.attrs.map((attr) => `<span class="tag">${skills[attr].label}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function handleSubmit(event) {
  event.preventDefault();
  const attrs = [...experienceForm.querySelectorAll('input[name="attr"]:checked')].map((input) => input.value);
  const title = document.querySelector("#exp-title").value.trim();
  const desc = document.querySelector("#exp-desc").value.trim();

  if (!title || !desc || attrs.length === 0) {
    return;
  }

  experiences = [{ title, desc, attrs }, ...experiences];
  activeFilter = "all";
  renderFilters();
  renderExperiences();
}

document.querySelectorAll(".skill-pin").forEach((button) => {
  button.addEventListener("click", () => setActiveSkill(button.dataset.skill));
});

experienceForm.addEventListener("submit", handleSubmit);

renderRadar();
renderSkillDetail();
renderAttributeInputs();
renderFilters();
renderExperiences();
