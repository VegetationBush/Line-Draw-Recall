export type Point = { x: number; y: number };

function catmullRom(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      0.5 *
      ((2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),

    y:
      0.5 *
      ((2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

type SplineFunction = (t: number) => Point;

export function createCatmullRomSpline(points: Point[]): SplineFunction {
  if (points.length < 4) {
    throw new Error("Need at least 4 points for optimal spline path");
  }

  return (t: number): Point => {
    const n = points.length;

    const scaled = t * (n - 1);
    const i = Math.floor(scaled);
    const localT = scaled - i;

    const p1 = points[Math.max(0, i)];
    const p2 = points[Math.min(n - 1, i + 1)];

    const p0 = points[Math.max(0, i - 1)];
    const p3 = points[Math.min(n - 1, i + 2)];

    return catmullRom(p0, p1, p2, p3, localT);
  };
}