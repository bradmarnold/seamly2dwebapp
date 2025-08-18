'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { pointOnLine } from '@/lib/geometry';

interface PointOnLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PointOnLineDialog({ isOpen, onClose }: PointOnLineDialogProps) {
  const [name, setName] = useState('');
  const [lineStartId, setLineStartId] = useState('');
  const [lineEndId, setLineEndId] = useState('');
  const [distance, setDistance] = useState('5');
  
  const { points, addPoint } = useStore();

  const handleCreate = () => {
    if (!name || !lineStartId || !lineEndId) return;

    const startPoint = points[lineStartId];
    const endPoint = points[lineEndId];
    if (!startPoint || !endPoint) return;

    // Evaluate distance expression
    const distanceValue = parseFloat(distance) || 0;
    
    const newPoint = pointOnLine(startPoint, endPoint, distanceValue);
    
    addPoint({
      name,
      x: newPoint.x,
      y: newPoint.y,
      constraint: {
        type: 'point_on_line',
        lineStart: lineStartId,
        lineEnd: lineEndId,
        distance: distanceValue,
      },
    });

    setName('');
    setDistance('5');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Point on Line</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Point Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., A2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Line Start Point</label>
            <select
              value={lineStartId}
              onChange={(e) => setLineStartId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select start point</option>
              {Object.entries(points).map(([id, point]) => (
                <option key={id} value={id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Line End Point</label>
            <select
              value={lineEndId}
              onChange={(e) => setLineEndId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select end point</option>
              {Object.entries(points).map(([id, point]) => (
                <option key={id} value={id} disabled={id === lineStartId}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Distance from Start</label>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g., 5 or bust/8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Distance along the line from the start point
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
            disabled={!name || !lineStartId || !lineEndId}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}