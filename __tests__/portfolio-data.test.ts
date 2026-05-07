import { describe, expect, it } from "vitest";
import {
  getAttributeById,
  getContributingProjects,
  getProjectById,
  getProjectsBySkillAttribute,
  getSkillScore,
  projects,
  scoreContribution,
  skillAttributeIds,
  skillAttributes,
  type SkillAttributeId
} from "@/lib/portfolio-data";

describe("portfolio data scoring", () => {
  it("maps experience levels to score contributions", () => {
    expect(scoreContribution("experienced")).toBe(1);
    expect(scoreContribution("learning")).toBe(0.5);
  });

  it("aggregates skill scores from project attributes", () => {
    expect(getSkillScore("frontend")).toBe(2);
    expect(getSkillScore("quality")).toBe(1.5);
    expect(getSkillScore("security")).toBe(1.5);
  });

  it("returns contributing projects for a skill attribute", () => {
    expect(getContributingProjects("quality").map((project) => project.id)).toEqual([
      "denimdb-migrator",
      "care-label-auth"
    ]);
  });

  it("filters projects by skill attribute or returns all projects", () => {
    expect(getProjectsBySkillAttribute("all")).toHaveLength(projects.length);
    expect(getProjectsBySkillAttribute("security").map((project) => project.id)).toEqual([
      "telemetry-9",
      "care-label-auth"
    ]);
  });

  it("throws a useful error for an unknown attribute id", () => {
    expect(() => getAttributeById("unknown" as SkillAttributeId)).toThrow(
      "Unknown skill attribute: unknown"
    );
  });

  it("finds projects by id", () => {
    expect(getProjectById("analog-commerce")?.title).toBe("Analog E-Commerce");
    expect(getProjectById("missing")).toBeUndefined();
  });
});

describe("portfolio data integrity", () => {
  it("has unique skill attribute ids", () => {
    expect(new Set(skillAttributes.map((attribute) => attribute.id)).size).toBe(skillAttributes.length);
  });

  it("has unique project ids", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
  });

  it("only references defined skill attribute ids", () => {
    const definedIds = new Set(skillAttributeIds);
    const referencedIds = projects.flatMap((project) => project.attributes.map((attribute) => attribute.id));

    expect(referencedIds.every((id) => definedIds.has(id))).toBe(true);
  });
});
