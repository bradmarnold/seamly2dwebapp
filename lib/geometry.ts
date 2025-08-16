// import Decimal from 'decimal.js';

// Precision for geometric calculations
const EPS = 1e-9;

export interface Vector2D {
  x: number;
  y: number;
}

export interface Line2D {
  start: Vector2D;
  end: Vector2D;
}

export interface Arc2D {
  center: Vector2D;
  radius: number;
  startAngle: number; // radians
  endAngle: number;   // radians
  counterclockwise: boolean;
}

// Basic vector operations
export function vectorAdd(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vectorSubtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vectorScale(v: Vector2D, scale: number): Vector2D {
  return { x: v.x * scale, y: v.y * scale };
}

export function vectorLength(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vectorNormalize(v: Vector2D): Vector2D {
  const len = vectorLength(v);
  if (len < EPS) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function vectorDot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

export function vectorCross(a: Vector2D, b: Vector2D): number {
  return a.x * b.y - a.y * b.x;
}

// Distance between two points
export function distance(a: Vector2D, b: Vector2D): number {
  return vectorLength(vectorSubtract(b, a));
}

// Angle between two vectors in radians
export function angleBetween(a: Vector2D, b: Vector2D): number {
  const dot = vectorDot(vectorNormalize(a), vectorNormalize(b));
  return Math.acos(Math.max(-1, Math.min(1, dot)));
}

// Angle from positive X axis in radians
export function angleFromX(v: Vector2D): number {
  return Math.atan2(v.y, v.x);
}

// Normalize angle to [0, 2π)
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
}

// Convert degrees to radians
export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Convert radians to degrees
export function radiansToDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

// Point at distance and angle from base point
export function pointAtLengthAngle(base: Vector2D, length: number, angleInDegrees: number): Vector2D {
  const angle = degreesToRadians(angleInDegrees);
  return {
    x: base.x + length * Math.cos(angle),
    y: base.y + length * Math.sin(angle)
  };
}

// Point along line at specified distance from start
export function pointOnLine(start: Vector2D, end: Vector2D, distance: number): Vector2D {
  const direction = vectorNormalize(vectorSubtract(end, start));
  return vectorAdd(start, vectorScale(direction, distance));
}

// Perpendicular point at distance from line through a point
export function perpendicularPoint(point: Vector2D, lineStart: Vector2D, lineEnd: Vector2D, distance: number): Vector2D {
  const lineDir = vectorNormalize(vectorSubtract(lineEnd, lineStart));
  const perpDir = { x: -lineDir.y, y: lineDir.x }; // Rotate 90 degrees
  return vectorAdd(point, vectorScale(perpDir, distance));
}

// Parallel point at distance from line through a point
export function parallelPoint(point: Vector2D, lineStart: Vector2D, lineEnd: Vector2D, distance: number): Vector2D {
  const lineDir = vectorNormalize(vectorSubtract(lineEnd, lineStart));
  const perpDir = { x: -lineDir.y, y: lineDir.x }; // Perpendicular direction
  return vectorAdd(point, vectorScale(perpDir, distance));
}

// Line-line intersection
export function lineLineIntersection(line1: Line2D, line2: Line2D): Vector2D | null {
  const d1 = vectorSubtract(line1.end, line1.start);
  const d2 = vectorSubtract(line2.end, line2.start);
  const d3 = vectorSubtract(line1.start, line2.start);
  
  const cross = vectorCross(d1, d2);
  if (Math.abs(cross) < EPS) return null; // Lines are parallel
  
  const t1 = vectorCross(d3, d2) / cross;
  
  return vectorAdd(line1.start, vectorScale(d1, t1));
}

// Line-circle intersection
export function lineCircleIntersection(line: Line2D, center: Vector2D, radius: number): Vector2D[] {
  const d = vectorSubtract(line.end, line.start);
  const f = vectorSubtract(line.start, center);
  
  const a = vectorDot(d, d);
  const b = 2 * vectorDot(f, d);
  const c = vectorDot(f, f) - radius * radius;
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) return []; // No intersection
  
  const sqrt = Math.sqrt(discriminant);
  const t1 = (-b - sqrt) / (2 * a);
  const t2 = (-b + sqrt) / (2 * a);
  
  const points: Vector2D[] = [];
  if (t1 >= 0 && t1 <= 1) {
    points.push(vectorAdd(line.start, vectorScale(d, t1)));
  }
  if (t2 >= 0 && t2 <= 1 && Math.abs(t2 - t1) > EPS) {
    points.push(vectorAdd(line.start, vectorScale(d, t2)));
  }
  
  return points;
}

// Circle-circle intersection
export function circleCircleIntersection(center1: Vector2D, radius1: number, center2: Vector2D, radius2: number): Vector2D[] {
  const d = distance(center1, center2);
  
  // No intersection cases
  if (d > radius1 + radius2) return []; // Too far apart
  if (d < Math.abs(radius1 - radius2)) return []; // One circle inside the other
  if (d < EPS && Math.abs(radius1 - radius2) < EPS) return []; // Same circle
  
  const a = (radius1 * radius1 - radius2 * radius2 + d * d) / (2 * d);
  const h = Math.sqrt(radius1 * radius1 - a * a);
  
  const p2 = vectorAdd(center1, vectorScale(vectorNormalize(vectorSubtract(center2, center1)), a));
  
  if (Math.abs(h) < EPS) {
    // Single intersection point
    return [p2];
  }
  
  const direction = vectorNormalize(vectorSubtract(center2, center1));
  const perpendicular = { x: -direction.y, y: direction.x };
  
  return [
    vectorAdd(p2, vectorScale(perpendicular, h)),
    vectorSubtract(p2, vectorScale(perpendicular, h))
  ];
}

// Calculate SVG arc flags for drawing arcs
export function calculateArcFlags(center: Vector2D, start: Vector2D, end: Vector2D, counterclockwise: boolean): { largeArcFlag: number; sweepFlag: number } {
  const startAngle = angleFromX(vectorSubtract(start, center));
  const endAngle = angleFromX(vectorSubtract(end, center));
  
  let deltaAngle = endAngle - startAngle;
  if (counterclockwise) {
    if (deltaAngle > 0) deltaAngle -= 2 * Math.PI;
  } else {
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;
  }
  
  const largeArcFlag = Math.abs(deltaAngle) > Math.PI ? 1 : 0;
  const sweepFlag = counterclockwise ? 0 : 1;
  
  return { largeArcFlag, sweepFlag };
}

// Midpoint of two points
export function midpoint(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

// Point on arc at parameter t (0 = start, 1 = end)
export function pointOnArc(arc: Arc2D, t: number): Vector2D {
  const angle = arc.startAngle + t * (arc.endAngle - arc.startAngle);
  return {
    x: arc.center.x + arc.radius * Math.cos(angle),
    y: arc.center.y + arc.radius * Math.sin(angle)
  };
}

// Offset a line by a distance (for seam allowances)
export function offsetLine(line: Line2D, distance: number): Line2D {
  const direction = vectorNormalize(vectorSubtract(line.end, line.start));
  const offset = vectorScale({ x: -direction.y, y: direction.x }, distance);
  
  return {
    start: vectorAdd(line.start, offset),
    end: vectorAdd(line.end, offset)
  };
}

// Snap point to grid
export function snapToGrid(point: Vector2D, gridSize: number): Vector2D {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

// Check if point is near another point (for snapping)
export function isNearPoint(point: Vector2D, target: Vector2D, threshold: number = 10): boolean {
  return distance(point, target) < threshold;
}