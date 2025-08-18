/**
 * Expression parser for Seamly2D pattern drafting
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Parser } from 'expr-eval';

export type Unit = 'mm' | 'cm' | 'in';

const parser = new Parser();

/**
 * Unit conversion table (all values to mm)
 */
const UNIT_TO_MM: Record<Unit, number> = {
  mm: 1,
  cm: 10,
  in: 25.4
};

/**
 * Parse and evaluate a mathematical expression with unit support
 */
export function parseExpression(
  expression: string,
  measurements: Record<string, number> = {},
  variables: Record<string, number> = {},
  defaultUnit: Unit = 'mm'
): number {
  try {
    // Clean up the expression
    let processed = expression.trim();
    
    // Replace measurement names with their values
    // Sort by length (longest first) to avoid partial replacements
    const sortedMeasurements = Object.keys(measurements).sort((a, b) => b.length - a.length);
    for (const key of sortedMeasurements) {
      const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'g');
      processed = processed.replace(regex, measurements[key].toString());
    }
    
    // Replace variable names with their values
    const sortedVariables = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const key of sortedVariables) {
      const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'g');
      processed = processed.replace(regex, variables[key].toString());
    }
    
    // Handle unit conversions
    processed = processUnits(processed, defaultUnit);
    
    // Parse and evaluate the expression
    const expr = parser.parse(processed);
    const result = expr.evaluate();
    
    return typeof result === 'number' ? result : 0;
  } catch (error) {
    console.error('Failed to parse expression:', expression, error);
    return 0;
  }
}

/**
 * Process unit conversions in the expression
 */
function processUnits(expression: string, defaultUnit: Unit): string {
  // Pattern to match numbers followed by units
  const unitPattern = /(\d+(?:\.\d+)?)\s*(mm|cm|in)\b/g;
  
  return expression.replace(unitPattern, (match, number, unit) => {
    const value = parseFloat(number);
    const unitFactor = UNIT_TO_MM[unit as Unit];
    const defaultFactor = UNIT_TO_MM[defaultUnit];
    
    // Convert to default unit
    const converted = (value * unitFactor) / defaultFactor;
    return converted.toString();
  });
}

/**
 * Escape special characters for use in regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate that an expression is safe to evaluate
 */
export function validateExpression(expression: string): boolean {
  try {
    // Check for forbidden patterns that could be dangerous
    const forbidden = [
      /eval\s*\(/,
      /Function\s*\(/,
      /constructor/,
      /prototype/,
      /__proto__/,
      /\.\s*\w+\s*\(/,  // method calls
      /\[\s*['"`]/,     // bracket notation
    ];
    
    for (const pattern of forbidden) {
      if (pattern.test(expression)) {
        return false;
      }
    }
    
    // Try parsing - expr-eval will reject most dangerous constructs
    parser.parse(expression);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract measurement names referenced in an expression
 */
export function extractMeasurementNames(
  expression: string,
  measurementNames: string[]
): string[] {
  const found: string[] = [];
  
  // Sort by length (longest first) to match longer names first
  const sortedNames = measurementNames.sort((a, b) => b.length - a.length);
  
  for (const name of sortedNames) {
    const regex = new RegExp(`\\b${escapeRegExp(name)}\\b`);
    if (regex.test(expression)) {
      found.push(name);
    }
  }
  
  return found;
}

/**
 * Convert between units
 */
export function convertUnit(value: number, fromUnit: Unit, toUnit: Unit): number {
  if (fromUnit === toUnit) return value;
  
  // Convert to mm first, then to target unit
  const mmValue = value * UNIT_TO_MM[fromUnit];
  return mmValue / UNIT_TO_MM[toUnit];
}

/**
 * Format a number with unit for display
 */
export function formatWithUnit(value: number, unit: Unit, precision: number = 2): string {
  return `${value.toFixed(precision)}${unit}`;
}

/**
 * Common mathematical functions that can be used in expressions
 */
export const MATH_FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sqrt: Math.sqrt,
  pow: Math.pow,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  min: Math.min,
  max: Math.max,
  pi: Math.PI,
  e: Math.E,
};

/**
 * Add math functions to the parser
 */
export function setupMathFunctions(): void {
  Object.entries(MATH_FUNCTIONS).forEach(([name, func]) => {
    parser.functions[name] = func;
  });
}