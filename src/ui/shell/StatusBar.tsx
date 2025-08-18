/**
 * StatusBar component - status information like Seamly2D
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function StatusBar() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const zoom = 100; // Mock zoom value
  const { 
    selectedPoints, 
    selectedSegments, 
    selectedPieces,
    showGrid,
    snapToGrid,
    snapToPoints,
    tool
  } = useStore();

  // Mock cursor tracking - in real implementation this would come from canvas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen coordinates to world coordinates
      // This is a placeholder - real implementation would use canvas transform
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const selectedCount = selectedPoints.length + selectedSegments.length + selectedPieces.length;
  
  const snapMode = () => {
    const modes = [];
    if (snapToGrid) modes.push('Grid');
    if (snapToPoints) modes.push('Points');
    return modes.length > 0 ? modes.join(', ') : 'None';
  };

  return (
    <div className="h-6 bg-gray-200 border-t border-gray-300 flex items-center px-4 text-xs text-gray-600">
      {/* Left side - cursor position and unit */}
      <div className="flex items-center space-x-4">
        <span>
          X: {cursorPos.x.toFixed(1)}mm
        </span>
        <span>
          Y: {cursorPos.y.toFixed(1)}mm
        </span>
        <span className="text-gray-400">|</span>
        <span>Unit: mm</span>
      </div>

      {/* Middle - snap mode and current tool */}
      <div className="flex items-center space-x-4 ml-8">
        <span>
          Snap: {snapMode()}
        </span>
        <span className="text-gray-400">|</span>
        <span>
          Tool: {tool.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        {showGrid && (
          <>
            <span className="text-gray-400">|</span>
            <span>Grid: On</span>
          </>
        )}
      </div>

      {/* Right side - zoom and selection count */}
      <div className="ml-auto flex items-center space-x-4">
        <span>
          Selected: {selectedCount}
        </span>
        <span className="text-gray-400">|</span>
        <span>
          Zoom: {zoom}%
        </span>
      </div>
    </div>
  );
}