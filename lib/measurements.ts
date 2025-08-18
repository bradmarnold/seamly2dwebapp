import { Parser } from 'expr-eval';

// Standard measurement names used in pattern drafting
export const STANDARD_MEASUREMENTS = {
  // Torso measurements
  'bust': 'Bust circumference',
  'waist': 'Waist circumference', 
  'hip': 'Hip circumference',
  'chest': 'Chest circumference',
  'under_bust': 'Under bust circumference',
  'waist_to_hip': 'Waist to hip length',
  'waist_to_bust': 'Waist to bust length',
  'shoulder_width': 'Shoulder width',
  'back_width': 'Back width',
  'front_width': 'Front width',
  
  // Arm measurements
  'arm_length': 'Arm length',
  'bicep': 'Bicep circumference',
  'wrist': 'Wrist circumference',
  'shoulder_tip_to_wrist': 'Shoulder tip to wrist',
  'armpit_to_wrist': 'Armpit to wrist',
  
  // Leg measurements
  'leg_length': 'Leg length',
  'thigh': 'Thigh circumference',
  'knee': 'Knee circumference',
  'calf': 'Calf circumference',
  'ankle': 'Ankle circumference',
  'inseam': 'Inseam length',
  'outseam': 'Outseam length',
  
  // Heights and lengths
  'height': 'Total height',
  'neck_to_waist_front': 'Neck to waist front',
  'neck_to_waist_back': 'Neck to waist back',
  'shoulder_slope': 'Shoulder slope',
  'neck_circumference': 'Neck circumference',
} as const;

export type MeasurementName = keyof typeof STANDARD_MEASUREMENTS;

export interface MeasurementFile {
  id: string;
  name: string;
  type: 'individual' | 'multisize';
  units: 'cm' | 'in';
  measurements: Record<string, number>;
  description?: string;
  created: string;
  modified: string;
}

export interface MeasurementValue {
  name: string;
  value: number;
  unit: 'cm' | 'in';
  description?: string;
}

// Parse .vit file (individual measurements)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function parseVitFile(_xmlContent: string): MeasurementFile {
  // TODO: Implement XML parsing using fast-xml-parser
  // This is a stub implementation
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Parsed VIT File',
    type: 'individual',
    units: 'cm',
    measurements: {},
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };
}

// Parse .vst file (multisize measurements)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function parseVstFile(_xmlContent: string): MeasurementFile {
  // TODO: Implement XML parsing using fast-xml-parser
  // This is a stub implementation
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Parsed VST File',
    type: 'multisize',
    units: 'cm', 
    measurements: {},
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };
}

// Evaluate measurement expressions
const parser = new Parser();

export function evaluateExpression(expression: string, measurements: Record<string, number>): number {
  try {
    // Replace measurement names with values
    let processedExpression = expression;
    
    // Sort by length (longest first) to avoid partial replacements
    const sortedKeys = Object.keys(measurements).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processedExpression = processedExpression.replace(regex, measurements[key].toString());
    }
    
    const expr = parser.parse(processedExpression);
    return expr.evaluate();
  } catch (error) {
    console.error('Failed to evaluate expression:', expression, error);
    return 0;
  }
}

// Convert between units
export function convertUnits(value: number, fromUnit: 'cm' | 'in', toUnit: 'cm' | 'in'): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'cm' && toUnit === 'in') {
    return value / 2.54;
  } else if (fromUnit === 'in' && toUnit === 'cm') {
    return value * 2.54;
  }
  
  return value;
}

// Create a default measurement file
export function createDefaultMeasurements(units: 'cm' | 'in' = 'cm'): MeasurementFile {
  const defaultValues = units === 'cm' ? {
    bust: 96,
    waist: 76,
    hip: 102,
    chest: 92,
    shoulder_width: 42,
    arm_length: 60,
    height: 170,
    neck_to_waist_front: 43,
    neck_to_waist_back: 45,
  } : {
    bust: 38,
    waist: 30,
    hip: 40,
    chest: 36,
    shoulder_width: 16.5,
    arm_length: 24,
    height: 67,
    neck_to_waist_front: 17,
    neck_to_waist_back: 18,
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Default Measurements',
    type: 'individual',
    units,
    measurements: defaultValues,
    description: 'Default measurement set',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };
}

// Local storage helpers for measurement files
const STORAGE_KEY = 'seamly2d_measurement_files';

export function saveMeasurementFiles(files: MeasurementFile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Failed to save measurement files:', error);
  }
}

export function loadMeasurementFiles(): MeasurementFile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load measurement files:', error);
  }
  
  // Return default measurements if nothing saved
  return [createDefaultMeasurements()];
}

export function getMeasurementDescription(name: string): string {
  return STANDARD_MEASUREMENTS[name as MeasurementName] || name;
}