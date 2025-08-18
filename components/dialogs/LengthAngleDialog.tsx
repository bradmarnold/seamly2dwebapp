'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { pointAtLengthAngle } from '@/lib/geometry';

interface LengthAngleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LengthAngleDialog({ isOpen, onClose }: LengthAngleDialogProps) {
  const [name, setName] = useState('');
  const [basePointId, setBasePointId] = useState('');
  const [length, setLength] = useState('10');
  const [angle, setAngle] = useState('0');
  
  const { points, addPoint } = useStore();

  const handleCreate = () => {
    if (!name || !basePointId) return;

    const basePoint = points[basePointId];
    if (!basePoint) return;

    // Evaluate expressions using measurements
    const lengthValue = parseFloat(length);
    const angleValue = parseFloat(angle);
    
    // TODO: Add expression evaluation with measurements
    
    const newPoint = pointAtLengthAngle(basePoint, lengthValue, angleValue);
    
    addPoint({
      name,
      x: newPoint.x,
      y: newPoint.y,
      constraint: {
        type: 'length_angle',
        basePoint: basePointId,
        length: lengthValue,
        angle: angleValue,
      },
    });

    setName('');
    setLength('10');
    setAngle('0');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Point at Length and Angle</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Point Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., A1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Base Point</label>
            <select
              value={basePointId}
              onChange={(e) => setBasePointId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select base point</option>
              {Object.entries(points).map(([id, point]) => (
                <option key={id} value={id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Length</label>
            <input
              type="text"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g., 10 or bust/4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use numbers or measurement expressions
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Angle (degrees)</label>
            <input
              type="text"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="e.g., 0, 90, 45"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              0° = right, 90° = up, 180° = left, 270° = down
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={!name || !basePointId}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}