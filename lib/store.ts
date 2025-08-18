import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { isStaticMode } from './basePath';
import type { Pt, Seg, Path, Piece, Unit, Measurements } from '../src/geom/types';

// Core geometric types - use the types from geom/types.ts and add compatibility
export interface Point extends Pt {
  name: string;
  constraint?: Constraint;
}

export interface Line extends Seg {
  type: 'line';
}

export interface Arc extends Seg {
  type: 'arc';
  center: string; // point id for center - maintain compatibility
  start: string;  // alias for 'a'
  end: string;    // alias for 'b'
  ccw?: boolean;
}

export interface Spline extends Seg {
  type: 'bezier';
  points: string[]; // control point ids - maintain compatibility
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

// Piece definition - extend the geom/types.ts Piece with additional properties
export interface PieceState extends Piece {
  contour: string[]; // segment ids in order
  seamAllowance?: {
    amount: number;
    joins: 'miter' | 'round' | 'bevel';
  };
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
  // Core data - using the types from geom/types.ts
  points: Record<string, Point>;
  segments: Record<string, Segment>;
  paths: Record<string, Path>;
  pieces: Record<string, PieceState>;
  blocks: Record<string, Block>;
  
  // Current active items
  activeBlock: string | null;
  activePieceId: string | null;
  selectedPoints: string[];
  selectedSegments: string[];
  selectedPieces: string[];
  
  // Measurements - using the types from geom/types.ts  
  measurements: Measurements;
  activeMeasurementFile: string | null;
  
  // Current drafting unit
  unit: Unit;
  
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
  
  addPath: (path: Omit<Path, 'id'>) => string;
  updatePath: (id: string, updates: Partial<Path>) => void;
  deletePath: (id: string) => void;
  
  addPiece: (piece: Omit<PieceState, 'id'>) => string;
  updatePiece: (id: string, updates: Partial<PieceState>) => void;
  deletePiece: (id: string) => void;
  
  createPiece: (name?: string) => string;
  setActivePiece: (id: string) => void;
  ensureDefaultPiece: () => void;
  
  setSelectedPoints: (ids: string[]) => void;
  setSelectedSegments: (ids: string[]) => void;
  setSelectedPieces: (ids: string[]) => void;
  
  setTool: (tool: string) => void;
  setMeasurements: (measurements: Measurements) => void;
  setUnit: (unit: Unit) => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Project management
  exportProject: () => string;
  importProject: (data: string) => void;
  newProject: () => void;
  
  // Static mode storage helpers
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const generateId = () => nanoid();

// Local storage key for static mode
const STORAGE_KEY = 'seamly2d-project-data';

// Helper to save state to localStorage in static mode
const saveToStorage = (state: StoreState) => {
  if (typeof window !== 'undefined' && isStaticMode()) {
    try {
      const dataToSave = {
        points: state.points,
        segments: state.segments,
        pieces: state.pieces,
        blocks: state.blocks,
        measurements: state.measurements,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
};

// Helper to load state from localStorage in static mode
const loadFromStorage = () => {
  if (typeof window !== 'undefined' && isStaticMode()) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
  return null;
};

export const useStore = create<StoreState>()(
  immer((set, get) => ({
    // Initial state
    points: {},
    segments: {},
    paths: {},
    pieces: {},
    blocks: {},
    
    activeBlock: null,
    activePieceId: null,
    selectedPoints: [],
    selectedSegments: [],
    selectedPieces: [],
    
    measurements: {},
    activeMeasurementFile: null,
    
    unit: 'mm' as Unit,
    
    tool: 'select',
    showGrid: true,
    snapToGrid: true,
    snapToPoints: true,
    
    history: [],
    historyIndex: -1,
    
    // Computed properties
    get canUndo() {
      const state = get();
      return state.historyIndex >= 0;
    },
    
    get canRedo() {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },
    
    // Actions
    addPoint: (point) => {
      const id = generateId();
      set((state) => {
        state.points[id] = { ...point, id };
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
      return id;
    },
    
    updatePoint: (id, updates) => {
      set((state) => {
        if (state.points[id]) {
          Object.assign(state.points[id], updates);
        }
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    deletePoint: (id) => {
      set((state) => {
        delete state.points[id];
        // Remove from selections
        state.selectedPoints = state.selectedPoints.filter(pid => pid !== id);
        // TODO: Remove dependent segments and constraints
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    addSegment: (segment) => {
      const id = generateId();
      set((state) => {
        state.segments[id] = { ...segment, id } as Segment;
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
      return id;
    },
    
    updateSegment: (id, updates) => {
      set((state) => {
        if (state.segments[id]) {
          Object.assign(state.segments[id], updates);
        }
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    deleteSegment: (id) => {
      set((state) => {
        delete state.segments[id];
        state.selectedSegments = state.selectedSegments.filter(sid => sid !== id);
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    addPath: (path) => {
      const id = generateId();
      set((state) => {
        state.paths[id] = { ...path, id };
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
      return id;
    },
    
    updatePath: (id, updates) => {
      set((state) => {
        if (state.paths[id]) {
          Object.assign(state.paths[id], updates);
        }
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    deletePath: (id) => {
      set((state) => {
        delete state.paths[id];
        // TODO: Remove from pieces that reference this path
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    addPiece: (piece) => {
      const id = generateId();
      set((state) => {
        state.pieces[id] = { ...piece, id };
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
      return id;
    },
    
    updatePiece: (id, updates) => {
      set((state) => {
        if (state.pieces[id]) {
          Object.assign(state.pieces[id], updates);
        }
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    deletePiece: (id) => {
      set((state) => {
        delete state.pieces[id];
        state.selectedPieces = state.selectedPieces.filter(pid => pid !== id);
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
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
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    setUnit: (unit) => {
      set((state) => {
        state.unit = unit;
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
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
        paths: state.paths,
        pieces: state.pieces,
        blocks: state.blocks,
        measurements: state.measurements,
        unit: state.unit,
        version: '1.0.0',
        exported: new Date().toISOString(),
      }, null, 2);
    },
    
    importProject: (data) => {
      try {
        const parsed = JSON.parse(data);
        set((state) => {
          state.points = parsed.points || {};
          state.segments = parsed.segments || {};
          state.paths = parsed.paths || {};
          state.pieces = parsed.pieces || {};
          state.blocks = parsed.blocks || {};
          state.measurements = parsed.measurements || {};
          state.unit = parsed.unit || 'mm';
          state.selectedPoints = [];
          state.selectedSegments = [];
          state.selectedPieces = [];
        });
        // Auto-save in static mode
        const state = get();
        saveToStorage(state);
      } catch (error) {
        console.error('Failed to import project:', error);
      }
    },
    
    newProject: () => {
      set((state) => {
        state.points = {};
        state.segments = {};
        state.paths = {};
        state.pieces = {};
        state.blocks = {};
        state.activePieceId = null;
        state.selectedPoints = [];
        state.selectedSegments = [];
        state.selectedPieces = [];
        state.history = [];
        state.historyIndex = -1;
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
    },
    
    
    createPiece: (name = `Piece ${Object.keys(get().pieces).length + 1}`) => {
      const id = generateId();
      const piece: PieceState = {
        id,
        name,
        outline: '', // Empty outline initially
        allowance: 10,
        notches: [],
        grain: { angle: 0 },
        cut: { qty: 1, mirror: false },
        contour: [],
        seamAllowance: { amount: 10, joins: 'miter' },
        labels: []
      };
      set((state) => {
        state.pieces[id] = piece;
        state.activePieceId = id;
        state.selectedPieces = [id]; // Also select the piece for the UI
      });
      // Auto-save in static mode
      const state = get();
      saveToStorage(state);
      return id;
    },
    
    setActivePiece: (id: string) => {
      set((state) => {
        if (state.pieces[id]) {
          state.activePieceId = id;
        }
      });
    },
    
    ensureDefaultPiece: () => {
      const state = get();
      const pieceIds = Object.keys(state.pieces);
      if (pieceIds.length === 0) {
        get().createPiece('Piece 1');
      } else if (!state.activePieceId) {
        set((state) => {
          state.activePieceId = pieceIds[0];
          state.selectedPieces = [pieceIds[0]]; // Also select for UI
        });
      }
    },

    saveToLocalStorage: () => {
      const state = get();
      saveToStorage(state);
    },
    
    loadFromLocalStorage: () => {
      const data = loadFromStorage();
      if (data) {
        set((state) => {
          state.points = data.points || {};
          state.segments = data.segments || {};
          state.paths = data.paths || {};
          state.pieces = data.pieces || {};
          state.blocks = data.blocks || {};
          state.measurements = data.measurements || {};
          state.unit = data.unit || 'mm';
        });
      }
    },
  }))
);