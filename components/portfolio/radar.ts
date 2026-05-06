import type { CSSProperties } from "react";

export const radarCenter = 160;
export const radarRadius = 136;
export const heroRadarRadius = 118;
export const radarRingRatios = [0.25, 0.5, 0.75, 1] as const;

export type RadarPoint = {
  x: number;
  y: number;
};

export function getPoint(index: number, total: number, ratio = 1, pointRadius = radarRadius) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    x: radarCenter + Math.cos(angle) * pointRadius * ratio,
    y: radarCenter + Math.sin(angle) * pointRadius * ratio
  };
}

export function pointsToString(points: RadarPoint[]) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

export function getHeroAxisStyle(index: number, total: number): CSSProperties {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    left: `${50 + Math.cos(angle) * 37}%`,
    top: `${50 + Math.sin(angle) * 37}%`
  };
}

export function buildRadarGeometry<TItem extends { id: string }>({
  items,
  getScore,
  maxScore,
  pointRadius = radarRadius,
  labelRatio = 1.14,
  ringRatios = radarRingRatios
}: {
  items: readonly TItem[];
  getScore: (item: TItem) => number;
  maxScore: number;
  pointRadius?: number;
  labelRatio?: number;
  ringRatios?: readonly number[];
}) {
  const total = items.length;
  const rings = ringRatios.map((ratio) => {
    const points = items.map((_, index) => getPoint(index, total, ratio, pointRadius));

    return {
      ratio,
      points,
      pointsString: pointsToString(points)
    };
  });
  const axes = items.map((item, index) => ({
    item,
    point: getPoint(index, total, 1, pointRadius)
  }));
  const scorePoints = items.map((item, index) => {
    const ratio = Math.min(getScore(item) / maxScore, 1);

    return {
      item,
      ratio,
      point: getPoint(index, total, ratio, pointRadius),
      labelPoint: getPoint(index, total, labelRatio, pointRadius)
    };
  });

  return {
    total,
    rings,
    axes,
    scorePoints,
    outerPointsString: pointsToString(axes.map((axis) => axis.point)),
    scorePointsString: pointsToString(scorePoints.map((scorePoint) => scorePoint.point))
  };
}
