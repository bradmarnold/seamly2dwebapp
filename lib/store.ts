import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Core geometric types
export interface Point {
  id: string;
  name: string;
  x: number;
  y: number;
  constraint?: Constraint;
}

export interface Line {
  type: 'line';
  id: string;
  a: string; // point id
  b: string; // point id
}

export interface Arc {
  type: 'arc';
  id: string;
  center: string; // point id
  start: string; // point id
  end: string; // point id
  ccw: boolean;
}

export interface Spline {
  type: 'spline';
  id: string;
  points: string[]; // control point ids
}

export type Segment = Line | Arc | Spline;

// Constraint types for point construction
export interface LengthAngleConstraint {
  type: 'length_angle';
  basePoint: string;
  length: number;
  angle: number; // degrees
}

export interface PointOnLineConstraint {
  type: 'point_on_line';
  lineStart: string;
  lineEnd: string;
  distance: number;
}

export interface PerpendicularConstraint {
  type: 'perpendicular';
  basePoint: string;
  lineStart: string;
  lineEnd: string;
  distance: number;
}

export interface ParallelConstraint {
  type: 'parallel';
  basePoint: string;
  lineStart: string;
  lineEnd: string;
  distance: number;
}

export interface IntersectionConstraint {
  type: 'intersection';
  line1Start?: string;
  line1End?: string;
  line2Start?: string;
  line2End?: string;
  arc1?: string;
  arc2?: string;
}

export type Constraint = 
  | LengthAngleConstraint 
  | PointOnLineConstraint 
  | PerpendicularConstraint
  | ParallelConstraint
  | IntersectionConstraint;

// Piece definition
export interface Piece {
  id: string;
  name: string;
  contour: string[]; // segment ids in order
  seamAllowance?: {
    amount: number;
    joins: 'miter' | 'round' | 'bevel';
  };
  notches: Array<{
    id: string;
    position: { segmentId: string; t: number }; // t is parameter along segment
    type: 'single' | 'double' | 'triangle';
  }>;
  grainline?: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  labels: Array<{
    id: string;
    text: string;
    position: { x: number; y: number };
    rotation: number;
  }>;
}

// Block represents a complete pattern construction
export interface Block {
  id: string;
  name: string;
  units: 'cm' | 'in';
  pointIds: string[];
}

// Undo/Redo action
export interface Action {
  type: string;
  data: unknown;
  timestamp: number;
}

// Main store state
export interface StoreState {
  // Core data
  points: Record<string, Point>;
  segments: Record<string, Segment>;
  pieces: Record<string, Piece>;
  blocks: Record<string, Block>;
  
  // Current active items
  activeBlock: string | null;
  selectedPoints: string[];
  selectedSegments: string[];
  selectedPieces: string[];
  
  // Measurements
  measurements: Record<string, number>;
  activeMeasurementFile: string | null;
  
  // UI state
  tool: string;
  showGrid: boolean;
  snapToGrid: boolean;
  snapToPoints: boolean;
  
  // Undo/Redo
  history: Action[];
  historyIndex: number;
  
  // Actions
  addPoint: (point: Omit<Point, 'id'>) => string;
  updatePoint: (id: string, updates: Partial<Point>) => void;
  deletePoint: (id: string) => void;
  
  addSegment: (segment: Omit<Segment, 'id'>) => string;
  updateSegment: (id: string, updates: Partial<Segment>) => void;
  deleteSegment: (id: string) => void;
  
  addPiece: (piece: Omit<Piece, 'id'>) => string;
  updatePiece: (id: string, updates: Partial<Piece>) => void;
  deletePiece: (id: string) => void;
  
  setSelectedPoints: (ids: string[]) => void;
  setSelectedSegments: (ids: string[]) => void;
  setSelectedPieces: (ids: string[]) => void;
  
  setTool: (tool: string) => void;
  setMeasurements: (measurements: Record<string, number>) => void;
  
  undo: () => void;
  redo: () => void;
  
  // Project management
  exportProject: () => string;
  importProject: (data: string) => void;
  newProject: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<StoreState>()(
  immer((set, get) => ({
    // Initial state
    points: {},
    segments: {},
    pieces: {},
    blocks: {},
    
    activeBlock: null,
    selectedPoints: [],
    selectedSegments: [],
    selectedPieces: [],
    
    measurements: {},
    activeMeasurementFile: null,
    
    tool: 'select',
    showGrid: true,
    snapToGrid: true,
    snapToPoints: true,
    
    history: [],
    historyIndex: -1,
    
    // Actions
    addPoint: (point) => {
      const id = generateId();
      set((state) => {
        state.points[id] = { ...point, id };
      });
      return id;
    },
    
    updatePoint: (id, updates) => {
      set((state) => {
        if (state.points[id]) {
          Object.assign(state.points[id], updates);
        }
      });
    },
    
    deletePoint: (id) => {
      set((state) => {
        delete state.points[id];
        // Remove from selections
        state.selectedPoints = state.selectedPoints.filter(pid => pid !== id);
        // TODO: Remove dependent segments and constraints
      });
    },
    
    addSegment: (segment) => {
      const id = generateId();
      set((state) => {
        state.segments[id] = { ...segment, id } as Segment;
      });
      return id;
    },
    
    updateSegment: (id, updates) => {
      set((state) => {
        if (state.segments[id]) {
          Object.assign(state.segments[id], updates);
        }
      });
    },
    
    deleteSegment: (id) => {
      set((state) => {
        delete state.segments[id];
        state.selectedSegments = state.selectedSegments.filter(sid => sid !== id);
      });
    },
    
    addPiece: (piece) => {
      const id = generateId();
      set((state) => {
        state.pieces[id] = { ...piece, id };
      });
      return id;
    },
    
    updatePiece: (id, updates) => {
      set((state) => {
        if (state.pieces[id]) {
          Object.assign(state.pieces[id], updates);
        }
      });
    },
    
    deletePiece: (id) => {
      set((state) => {
        delete state.pieces[id];
        state.selectedPieces = state.selectedPieces.filter(pid => pid !== id);
      });
    },
    
    setSelectedPoints: (ids) => {
      set((state) => {
        state.selectedPoints = ids;
      });
    },
    
    setSelectedSegments: (ids) => {
      set((state) => {
        state.selectedSegments = ids;
      });
    },
    
    setSelectedPieces: (ids) => {
      set((state) => {
        state.selectedPieces = ids;
      });
    },
    
    setTool: (tool) => {
      set((state) => {
        state.tool = tool;
      });
    },
    
    setMeasurements: (measurements) => {
      set((state) => {
        state.measurements = measurements;
      });
    },
    
    undo: () => {
      // TODO: Implement undo functionality
    },
    
    redo: () => {
      // TODO: Implement redo functionality
    },
    
    exportProject: () => {
      const state = get();
      return JSON.stringify({
        points: state.points,
        segments: state.segments,
        pieces: state.pieces,
        blocks: state.blocks,
        measurements: state.measurements,
      }, null, 2);
    },
    
    importProject: (data) => {
      try {
        const parsed = JSON.parse(data);
        set((state) => {
          state.points = parsed.points || {};
          state.segments = parsed.segments || {};
          state.pieces = parsed.pieces || {};
          state.blocks = parsed.blocks || {};
          state.measurements = parsed.measurements || {};
          state.selectedPoints = [];
          state.selectedSegments = [];
          state.selectedPieces = [];
        });
      } catch (error) {
        console.error('Failed to import project:', error);
      }
    },
    
    newProject: () => {
      set((state) => {
        state.points = {};
        state.segments = {};
        state.pieces = {};
        state.blocks = {};
        state.selectedPoints = [];
        state.selectedSegments = [];
        state.selectedPieces = [];
        state.history = [];
        state.historyIndex = -1;
      });
    },
  }))
);