import assert from "node:assert/strict";
import test from "node:test";
import { projects, featuredProjects, skillAttributes, skillAttributeIds, scoreContribution, getSkillScore, getContributingProjects, getProjectById, maxRadarScore } from "../lib/portfolio-data.ts";
import { buildRadarGeometry } from "../components/portfolio/radar.ts";

test("経験は1、キャッチアップ中は0.5で全10領域を集計する", () => {
  assert.equal(scoreContribution("experienced"), 1);
  assert.equal(scoreContribution("learning"), .5);
  assert.equal(skillAttributeIds.length, 10);
  assert.equal(getSkillScore("backend"), 2.5);
  assert.equal(getSkillScore("requirements"), 2.5);
  assert.equal(getSkillScore("security"), 1);
  for (const id of skillAttributeIds) {
    const expected = projects.flatMap(p => p.attributes).filter(a => a.id === id).reduce((sum,a) => sum + scoreContribution(a.level),0);
    assert.equal(getSkillScore(id), expected);
    assert.ok(Number.isFinite(maxRadarScore) && maxRadarScore > 0);
    assert.deepEqual(getContributingProjects(id).map(p => p.id), projects.filter(p => p.attributes.some(a => a.id === id)).map(p => p.id));
  }
});

test("すべての実績に一意の詳細IDと有効な領域を持ち、代表実績は3件", () => {
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  assert.equal(featuredProjects.length, 3);
  for (const project of projects) {
    assert.equal(getProjectById(project.id), project);
    assert.equal(new Set(project.attributes.map(a => a.id)).size, project.attributes.length);
    for (const attr of project.attributes) assert.ok(skillAttributeIds.includes(attr.id));
  }
  assert.equal(getProjectById("missing-project"), undefined);
});

test("レーダーは10軸を導出し、変更可能な最大値で正規化する", () => {
  const geometry = buildRadarGeometry({items:skillAttributes,getScore:() => 2,maxScore:8});
  assert.equal(geometry.total, 10);
  assert.equal(geometry.axes.length, 10);
  assert.ok(geometry.scorePoints.every(p => p.ratio === .25));
  const capped = buildRadarGeometry({items:skillAttributes,getScore:() => 10,maxScore:4});
  assert.ok(capped.scorePoints.every(p => p.ratio === 1));
});
