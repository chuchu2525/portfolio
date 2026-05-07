import { describe, expect, it } from "vitest";
import {
  buildRadarGeometry,
  getHeroAxisStyle,
  getPoint,
  pointsToString,
  radarCenter,
  radarRadius
} from "@/components/portfolio/radar";

describe("radar geometry helpers", () => {
  it("returns the top point for the first axis", () => {
    expect(getPoint(0, 10)).toEqual({
      x: radarCenter,
      y: radarCenter - radarRadius
    });
  });

  it("returns the center point when ratio is zero", () => {
    expect(getPoint(3, 10, 0)).toEqual({
      x: radarCenter,
      y: radarCenter
    });
  });

  it("formats points with one decimal place", () => {
    expect(pointsToString([{ x: 1, y: 2.345 }, { x: 10.99, y: 20 }])).toBe("1.0,2.3 11.0,20.0");
  });

  it("returns percentage styles for hero axis labels", () => {
    expect(getHeroAxisStyle(0, 10)).toEqual({
      left: "50%",
      top: "13%"
    });
  });

  it("builds rings, axes, score points, and caps score ratios", () => {
    const geometry = buildRadarGeometry({
      items: [{ id: "a" }, { id: "b" }, { id: "c" }],
      getScore: (item) => (item.id === "b" ? 4 : 1),
      maxScore: 2
    });

    expect(geometry.total).toBe(3);
    expect(geometry.rings).toHaveLength(4);
    expect(geometry.axes).toHaveLength(3);
    expect(geometry.scorePoints).toHaveLength(3);
    expect(geometry.scorePoints.find(({ item }) => item.id === "b")?.ratio).toBe(1);
    expect(geometry.outerPointsString).toContain(",");
    expect(geometry.scorePointsString).toContain(",");
  });
});
