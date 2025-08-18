'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

interface PointDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pointId: string | null;
}

export default function PointDialog({ isOpen, onClose, pointId }: PointDialogProps) {
  const [name, setName] = useState('');
  const [x, setX] = useState('0');
  const [y, setY] = useState('0');
  
  const { points, updatePoint } = useStore();

  useEffect(() => {
    if (isOpen && pointId && points[pointId]) {
      const point = points[pointId];
      setName(point.name);
      setX(point.x.toString());
      setY(point.y.toString());
    }
  }, [isOpen, pointId, points]);

  const handleSave = () => {
    if (pointId) {
      updatePoint(pointId, {
        name,
        x: parseFloat(x) || 0,
        y: parseFloat(y) || 0,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Edit Point</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X</label>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y</label>
              <input
                type="number"
                value={y}
                onChange={(e) => setY(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}