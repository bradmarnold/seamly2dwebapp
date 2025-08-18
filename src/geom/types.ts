/**
 * Core geometric types for Seamly2D pattern drafting
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type Unit = 'mm' | 'cm' | 'in';

export type Pt = { 
  id: string; 
  x: number; 
  y: number; 
  lock?: boolean;
  name?: string;
};

export type Seg = { 
  id: string; 
  a: string; 
  b: string; 
  kind: 'line' | 'bezier' | 'arc'; 
  data?: unknown;
  name?: string;
};

export type Path = { 
  id: string; 
  segs: string[]; 
  closed: boolean;
  name?: string;
};

export type Piece = { 
  id: string; 
  name: string; 
  outline: string; 
  allowance: number; 
  notches: Array<{
    pos: number; 
    type: 'V' | 'T' | 'U';
    id: string;
  }>; 
  grain: {
    angle: number;
  }; 
  cut: {
    qty: number; 
    mirror: boolean;
  }; 
  label?: {
    name: string; 
    size?: string; 
    date?: string;
  };
};

export type Measurements = Record<string, number>;

export interface DraftState {
  unit: Unit;
  pts: Record<string, Pt>;
  segs: Record<string, Seg>;
  paths: Record<string, Path>;
  pieces: Record<string, Piece>;
  measurements: Measurements;
}