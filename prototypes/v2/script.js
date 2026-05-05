const attributes = {
  frontend: {
    label: "FRONT",
    display: "フロント",
    score: 88,
    part: "Jacket front / 見える面",
    text: "UI、状態管理、操作密度をまとめて仕立てる領域。服の前身頃のように、最初に触れられる品質を担う。",
    stack: [["React / Next.js", 88], ["TypeScript", 84], ["Design Systems", 78]]
  },
  backend: {
    label: "BACK",
    display: "バックエンド",
    score: 78,
    part: "Lining / 裏地",
    text: "API、認証、ドメインロジックを支える裏側。表から見えない強度を作る。",
    stack: [["API Design", 82], ["Node / Go", 75], ["Auth / Queue", 70]]
  },
  database: {
    label: "DB",
    display: "DB",
    score: 72,
    part: "Pocket / 収納",
    text: "データの形、検索性、移行を扱う。ポケットの配置のように、必要な情報を取り出しやすくする。",
    stack: [["Schema", 78], ["PostgreSQL", 74], ["Migration", 66]]
  },
  infra: {
    label: "INFRA",
    display: "インフラ",
    score: 70,
    part: "Hem / 土台",
    text: "環境、監視、運用を支える領域。裾や縫い代のように、全体が崩れないための処理。",
    stack: [["Cloud", 72], ["Monitoring", 68], ["IaC", 64]]
  },
  cicd: {
    label: "CI/CD",
    display: "CI/CD",
    score: 76,
    part: "Rivet / 留め具",
    text: "テスト、レビュー、リリースの導線を固定する。小さな変更を確実に通すためのリベット。",
    stack: [["GitHub Actions", 82], ["Preview Deploy", 72], ["Test Gate", 74]]
  }
};

let attrOrder = ["frontend", "backend", "database", "infra", "cicd"];
let activeAttr = "frontend";
let activeFilter = "all";
let projects = [
  {
    title: "Analog E-Commerce",
    role: "Lead Frontend Engineer",
    desc: "古着とヴィンテージオーディオを扱うEC体験。検索、商品属性、決済、在庫導線をひとつの触れるUIとして設計。",
    attrs: ["frontend", "backend", "database"],
    code: "Next.js / Stripe"
  },
  {
    title: "DenimDB Migrator",
    role: "Systems Architect",
    desc: "商品、在庫、サイズ表記の移行を安全に行うためのデータ移行とロールバック設計。",
    attrs: ["database", "backend", "cicd"],
    code: "DB / CI"
  },
  {
    title: "Telemetry 9",
    role: "Platform Engineer",
    desc: "分散サービスの状態、デプロイ履歴、障害兆候をレコード溝のような時系列で読める監視ダッシュボード。",
    attrs: ["infra", "cicd", "frontend"],
    code: "D3 / Infra"
  }
];

const center = [160, 160];
const outer = [
  [160, 24],
  [289, 118],
  [240, 270],
  [80, 270],
  [31, 118]
];

const axisLines = document.querySelector("#axis-lines");
const skillPolygon = document.querySelector("#skill-polygon");
const skillPoints = document.querySelector("#skill-points");
const skillTabs = document.querySelector("#skill-tabs");
const activeSkillTitle = document.querySelector("#active-skill-title");
const activeSkillPart = document.querySelector("#active-skill-part");
const activeSkillText = document.querySelector("#active-skill-text");
const activeSkillStack = document.querySelector("#active-skill-stack");
const filterRow = document.querySelector("#filter-row");
const projectCrate = document.querySelector("#project-crate");
const attributeChecks = document.querySelector("#attribute-checks");
const experienceForm = document.querySelector("#experience-form");
const attributeEditorList = document.querySelector("#attribute-editor-list");

function pointFor(index, score) {
  const [x, y] = outer[index];
  const ratio = score / 100;
  return [center[0] + (x - center[0]) * ratio, center[1] + (y - center[1]) * ratio];
}

function renderRadar() {
  axisLines.innerHTML = outer
    .map(([x, y]) => `<line x1="160" y1="160" x2="${x}" y2="${y}"></line>`)
    .join("");

  const points = attrOrder.map((key, index) => pointFor(index, attributes[key].score));
  skillPolygon.setAttribute("points", points.map((point) => point.join(",")).join(" "));
  skillPoints.innerHTML = points
    .map(([x, y], index) => `<circle class="point" data-key="${attrOrder[index]}" cx="${x}" cy="${y}" r="6"></circle>`)
    .join("");

  skillPoints.querySelectorAll(".point").forEach((point) => {
    point.addEventListener("click", () => setActiveAttr(point.dataset.key));
  });
}

function renderSkillTabs() {
  skillTabs.innerHTML = attrOrder
    .map((key) => `<button class="chip ${activeAttr === key ? "active" : ""}" data-key="${key}">${attributes[key].label}</button>`)
    .join("");

  skillTabs.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => setActiveAttr(button.dataset.key));
  });
}

function renderActiveSkill() {
  const attr = attributes[activeAttr];
  activeSkillTitle.textContent = attr.display;
  activeSkillPart.textContent = attr.part;
  activeSkillText.textContent = attr.text;
  activeSkillStack.innerHTML = attr.stack
    .map(([name, value]) => `
      <div class="stack-row">
        <span>${name}</span>
        <span class="track"><span class="fill" style="width:${value}%"></span></span>
        <span>${value}</span>
      </div>
    `)
    .join("");
}

function setActiveAttr(key) {
  activeAttr = key;
  renderSkillTabs();
  renderActiveSkill();
}

function renderFilters() {
  const filterKeys = ["all", ...attrOrder];
  filterRow.innerHTML = filterKeys
    .map((key) => `<button class="chip ${activeFilter === key ? "active" : ""}" data-filter="${key}">${key === "all" ? "ALL" : attributes[key].label}</button>`)
    .join("");

  filterRow.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function renderProjects() {
  const visible = activeFilter === "all" ? projects : projects.filter((project) => project.attrs.includes(activeFilter));
  projectCrate.innerHTML = visible
    .map((project) => `
      <article class="sleeve">
        <div class="cover-art" data-code="${project.code}"></div>
        <div class="sleeve-inner">
          <span class="ticket">${project.role}</span>
          <div class="attribute-hangtag sleeve-tag">${project.attrs.map((key) => attributes[key].label).join(" / ")}</div>
          <h3>${project.title}</h3>
          <p>${project.desc}</p>
          <div class="tag-row">
            ${project.attrs.map((key) => `<span class="tag">${attributes[key].display}</span>`).join("")}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderAttributeChecks() {
  attributeChecks.innerHTML = attrOrder
    .map((key, index) => `
      <label class="check">
        <input type="checkbox" name="attrs" value="${key}" ${index < 3 ? "checked" : ""}>
        ${attributes[key].display}
      </label>
    `)
    .join("");
}

function renderAttributeEditor() {
  attributeEditorList.innerHTML = attrOrder
    .map((key) => `
      <div class="attr-row" data-key="${key}">
        <label>
          表示名
          <input class="name-input" value="${attributes[key].display}">
        </label>
        <label>
          スコア
          <input class="score-input" type="range" min="35" max="100" value="${attributes[key].score}">
        </label>
        <span class="score">${attributes[key].score}</span>
      </div>
    `)
    .join("");

  attributeEditorList.querySelectorAll(".attr-row").forEach((row) => {
    const key = row.dataset.key;
    const nameInput = row.querySelector(".name-input");
    const scoreInput = row.querySelector(".score-input");
    const score = row.querySelector(".score");

    nameInput.addEventListener("input", () => {
      attributes[key].display = nameInput.value || attributes[key].label;
      renderActiveSkill();
      renderFilters();
      renderAttributeChecks();
      renderProjects();
    });

    scoreInput.addEventListener("input", () => {
      attributes[key].score = Number(scoreInput.value);
      score.textContent = scoreInput.value;
      renderRadar();
    });
  });
}

experienceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const attrs = [...experienceForm.querySelectorAll('input[name="attrs"]:checked')].map((input) => input.value);
  const title = document.querySelector("#title-input").value.trim();
  const role = document.querySelector("#role-input").value.trim();
  const desc = document.querySelector("#desc-input").value.trim();

  if (!title || !role || !desc || attrs.length === 0) return;

  projects = [{ title, role, desc, attrs, code: attrs.map((key) => attributes[key].label).join(" / ") }, ...projects];
  activeFilter = "all";
  renderFilters();
  renderProjects();
});

renderRadar();
renderSkillTabs();
renderActiveSkill();
renderFilters();
renderProjects();
renderAttributeChecks();
renderAttributeEditor();
