/**
 * Layout settings for pattern piece arrangements
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type PaperFormat = 'Letter' | 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'Custom';
export type Unit = 'mm' | 'cm' | 'in';

export interface PaperSize {
  width: number;
  height: number;
  unit: Unit;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LayoutSettings {
  // Paper format
  paperFormat: PaperFormat;
  paperSize: PaperSize;
  
  // Margins
  margins: Margins;
  
  // Gap settings
  gapWidth: number;
  gapX2: boolean; // Double gap width
  
  // Shift/offset
  shiftLength: number;
  shiftUnit: Unit;
  
  // Rotation
  rotateWorkpiece: boolean;
  rotateBy90: boolean;
  
  // Arrangement rules
  arrangementRule: 'three_groups' | 'two_groups' | 'descending_area';
  
  // Auto features
  autoCropUnusedLength: boolean;
  unitePages: boolean;
  divideIntoStrips: boolean;
  stripsMultiplier: number;
  
  // Scale and precision
  scale: number; // 100 = 100%
  showTestSquare: boolean; // 100mm test square
}

// Standard paper sizes in millimeters
export const PAPER_SIZES: Record<PaperFormat, PaperSize> = {
  Letter: { width: 215.9, height: 279.4, unit: 'mm' },
  A4: { width: 210, height: 297, unit: 'mm' },
  A3: { width: 297, height: 420, unit: 'mm' },
  A2: { width: 420, height: 594, unit: 'mm' },
  A1: { width: 594, height: 841, unit: 'mm' },
  A0: { width: 841, height: 1189, unit: 'mm' },
  Custom: { width: 210, height: 297, unit: 'mm' },
};

export function createDefaultLayoutSettings(): LayoutSettings {
  return {
    paperFormat: 'Letter',
    paperSize: PAPER_SIZES.Letter,
    margins: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    gapWidth: 5,
    gapX2: false,
    shiftLength: 0,
    shiftUnit: 'mm',
    rotateWorkpiece: true,
    rotateBy90: true,
    arrangementRule: 'descending_area',
    autoCropUnusedLength: true,
    unitePages: false,
    divideIntoStrips: false,
    stripsMultiplier: 1,
    scale: 100,
    showTestSquare: true,
  };
}

export function convertToMM(value: number, unit: Unit): number {
  switch (unit) {
    case 'mm': return value;
    case 'cm': return value * 10;
    case 'in': return value * 25.4;
    default: return value;
  }
}

export function convertFromMM(value: number, unit: Unit): number {
  switch (unit) {
    case 'mm': return value;
    case 'cm': return value / 10;
    case 'in': return value / 25.4;
    default: return value;
  }
}