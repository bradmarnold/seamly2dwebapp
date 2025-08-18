/**
 * Geometric operations for Seamly2D pattern drafting
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Calculate distance between two points
 */
export function distance(a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points (in radians)
 */
export function angle(a: Vec2, b: Vec2): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/**
 * Convert polar coordinates to cartesian
 */
export function polar(center: Vec2, angle: number, distance: number): Vec2 {
  return {
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance
  };
}

/**
 * Calculate point on a line at given parameter t (0 = start, 1 = end)
 */
export function pointOnLine(a: Vec2, b: Vec2, t: number): Vec2 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}

/**
 * Calculate point on a cubic Bezier curve at parameter t
 */
export function pointOnBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const u = 1 - t;
  const u2 = u * u;
  const u3 = u2 * u;
  const t2 = t * t;
  const t3 = t2 * t;
  
  return {
    x: u3 * p0.x + 3 * u2 * t * p1.x + 3 * u * t2 * p2.x + t3 * p3.x,
    y: u3 * p0.y + 3 * u2 * t * p1.y + 3 * u * t2 * p2.y + t3 * p3.y
  };
}

/**
 * Calculate approximate length of a cubic Bezier curve using adaptive sampling
 */
export function bezierLength(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, steps: number = 100): number {
  let length = 0;
  let prevPoint = p0;
  
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const point = pointOnBezier(p0, p1, p2, p3, t);
    length += distance(prevPoint, point);
    prevPoint = point;
  }
  
  return length;
}

/**
 * Create a parallel line offset from the original line
 */
export function parallelLine(a: Vec2, b: Vec2, offset: number): { start: Vec2; end: Vec2 } {
  const lineAngle = angle(a, b);
  const perpAngle = lineAngle + Math.PI / 2;
  
  const offsetVec = {
    x: Math.cos(perpAngle) * offset,
    y: Math.sin(perpAngle) * offset
  };
  
  return {
    start: { x: a.x + offsetVec.x, y: a.y + offsetVec.y },
    end: { x: b.x + offsetVec.x, y: b.y + offsetVec.y }
  };
}

/**
 * Calculate perpendicular from a point to a line
 */
export function perpendicularFromPoint(point: Vec2, lineA: Vec2, lineB: Vec2): Vec2 {
  const A = lineB.x - lineA.x;
  const B = lineB.y - lineA.y;
  const C = point.x - lineA.x;
  const D = point.y - lineA.y;
  
  const dot = A * C + B * D;
  const len_sq = A * A + B * B;
  
  if (len_sq === 0) return lineA; // degenerate line
  
  const param = dot / len_sq;
  
  return {
    x: lineA.x + param * A,
    y: lineA.y + param * B
  };
}

/**
 * Calculate intersection of two lines
 */
export function lineIntersection(
  a1: Vec2, a2: Vec2, 
  b1: Vec2, b2: Vec2
): Vec2 | null {
  const denom = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);
  
  if (Math.abs(denom) < 1e-10) {
    return null; // Lines are parallel
  }
  
  const t = ((a1.x - b1.x) * (b1.y - b2.y) - (a1.y - b1.y) * (b1.x - b2.x)) / denom;
  
  return {
    x: a1.x + t * (a2.x - a1.x),
    y: a1.y + t * (a2.y - a1.y)
  };
}

/**
 * Rotate a point around a center by given angle (in radians)
 */
export function rotatePoint(point: Vec2, center: Vec2, angle: number): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
  };
}

/**
 * Mirror a point across a line defined by two points
 */
export function mirrorPoint(point: Vec2, lineA: Vec2, lineB: Vec2): Vec2 {
  // Get the perpendicular foot
  const foot = perpendicularFromPoint(point, lineA, lineB);
  
  // Mirror by extending the same distance on the other side
  return {
    x: 2 * foot.x - point.x,
    y: 2 * foot.y - point.y
  };
}

/**
 * Create an offset path for seam allowance (simplified version)
 */
export function offsetPath(points: Vec2[], offset: number, closed: boolean = false): Vec2[] {
  if (points.length < 2) return points;
  
  const result: Vec2[] = [];
  const len = points.length;
  
  for (let i = 0; i < len; i++) {
    const prev = points[i === 0 ? (closed ? len - 1 : 0) : i - 1];
    const curr = points[i];
    const next = points[i === len - 1 ? (closed ? 0 : len - 1) : i + 1];
    
    if (i === 0 && !closed) {
      // First point - just offset perpendicular to first segment
      const perpAngle = angle(curr, next) + Math.PI / 2;
      result.push({
        x: curr.x + Math.cos(perpAngle) * offset,
        y: curr.y + Math.sin(perpAngle) * offset
      });
    } else if (i === len - 1 && !closed) {
      // Last point - just offset perpendicular to last segment
      const perpAngle = angle(prev, curr) + Math.PI / 2;
      result.push({
        x: curr.x + Math.cos(perpAngle) * offset,
        y: curr.y + Math.sin(perpAngle) * offset
      });
    } else {
      // Middle point - calculate miter join
      const angle1 = angle(prev, curr);
      const angle2 = angle(curr, next);
      const avgAngle = (angle1 + angle2) / 2;
      const perpAngle = avgAngle + Math.PI / 2;
      
      // Simple miter join - could be improved with proper miter limit
      const miterFactor = 1 / Math.cos((angle2 - angle1) / 2);
      const effectiveOffset = offset * miterFactor;
      
      result.push({
        x: curr.x + Math.cos(perpAngle) * effectiveOffset,
        y: curr.y + Math.sin(perpAngle) * effectiveOffset
      });
    }
  }
  
  return result;
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Normalize angle to 0-2π range
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
}