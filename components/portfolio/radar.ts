import type { CSSProperties } from "react";

export const radarCenter = 160;
export const radarRadius = 136;
export const heroRadarRadius = 118;

export function getPoint(index: number, total: number, ratio = 1, pointRadius = radarRadius) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    x: radarCenter + Math.cos(angle) * pointRadius * ratio,
    y: radarCenter + Math.sin(angle) * pointRadius * ratio
  };
}

export function pointsToString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

export function getHeroAxisStyle(index: number, total: number): CSSProperties {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    left: `${50 + Math.cos(angle) * 37}%`,
    top: `${50 + Math.sin(angle) * 37}%`
  };
}
