'use client';

import { useRef, useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import PointDialog from './dialogs/PointDialog';
import LengthAngleDialog from './dialogs/LengthAngleDialog';
import PointOnLineDialog from './dialogs/PointOnLineDialog';

export default function DraftingCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -200, y: -200, width: 400, height: 400 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showPointDialog, setShowPointDialog] = useState(false);
  const [showLengthAngleDialog, setShowLengthAngleDialog] = useState(false);
  const [showPointOnLineDialog, setShowPointOnLineDialog] = useState(false);
  const [contextMenuPoint, setContextMenuPoint] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  const {
    points,
    segments,
    selectedPoints,
    tool,
    setSelectedPoints,
    addPoint,
  } = useStore();

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((screenX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((screenY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    return { x, y };
  }, [viewBox]);

  // Convert world coordinates to screen coordinates
  // const worldToScreen = useCallback((worldX: number, worldY: number) => {
  //   if (!svgRef.current) return { x: 0, y: 0 };
  //   const rect = svgRef.current.getBoundingClientRect();
  //   const x = ((worldX - viewBox.x) / viewBox.width) * rect.width + rect.left;
  //   const y = ((worldY - viewBox.y) / viewBox.height) * rect.height + rect.top;
  //   return { x, y };
  // }, [viewBox]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && tool === 'pan')) {
      // Middle mouse or pan tool
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      const worldDx = (dx / svgRef.current!.getBoundingClientRect().width) * viewBox.width;
      const worldDy = (dy / svgRef.current!.getBoundingClientRect().height) * viewBox.height;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - worldDx,
        y: prev.y - worldDy,
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  // Handle wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.1, Math.min(10, scale * delta));
    
    // Zoom centered on mouse position
    const mouseWorld = screenToWorld(e.clientX, e.clientY);
    const scaleFactor = newScale / scale;
    
    setViewBox(prev => ({
      x: mouseWorld.x - (mouseWorld.x - prev.x) * scaleFactor,
      y: mouseWorld.y - (mouseWorld.y - prev.y) * scaleFactor,
      width: prev.width * scaleFactor,
      height: prev.height * scaleFactor,
    }));
    
    setScale(newScale);
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const worldPos = screenToWorld(e.clientX, e.clientY);
    
    // Close context menu
    setContextMenuPoint(null);
    
    switch (tool) {
      case 'point_base':
        // Create a new base point at the click location
        addPoint({
          name: `A${Object.keys(points).length + 1}`,
          x: Math.round(worldPos.x),
          y: Math.round(worldPos.y),
        });
        break;
      case 'point_length_angle':
        setShowLengthAngleDialog(true);
        break;
      case 'point_on_line':
        setShowPointOnLineDialog(true);
        break;
      default:
        // Clear selection for other tools
        setSelectedPoints([]);
        break;
    }
  };

  // Handle point click
  const handlePointClick = (pointId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (tool === 'select') {
      if (e.ctrlKey || e.metaKey) {
        // Add to selection
        if (selectedPoints.includes(pointId)) {
          setSelectedPoints(selectedPoints.filter(id => id !== pointId));
        } else {
          setSelectedPoints([...selectedPoints, pointId]);
        }
      } else {
        // Single selection
        setSelectedPoints([pointId]);
      }
    }
  };

  // Handle point right click
  const handlePointRightClick = (pointId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPoint(pointId);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Render grid
  const renderGrid = () => {
    const gridSize = 20; // Grid spacing in world units
    const lines = [];
    
    // Vertical lines
    const startX = Math.floor(viewBox.x / gridSize) * gridSize;
    const endX = viewBox.x + viewBox.width;
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <line
          key={`v${x}`}
          x1={x}
          y1={viewBox.y}
          x2={x}
          y2={viewBox.y + viewBox.height}
          className="grid-stroke"
          strokeWidth="0.5"
        />
      );
    }
    
    // Horizontal lines
    const startY = Math.floor(viewBox.y / gridSize) * gridSize;
    const endY = viewBox.y + viewBox.height;
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <line
          key={`h${y}`}
          x1={viewBox.x}
          y1={y}
          x2={viewBox.x + viewBox.width}
          y2={y}
          className="grid-stroke"
          strokeWidth="0.5"
        />
      );
    }
    
    return lines;
  };

  // Render points
  const renderPoints = () => {
    return Object.entries(points).map(([id, point]) => (
      <g key={id}>
        <circle
          cx={point.x}
          cy={point.y}
          r="3"
          fill={selectedPoints.includes(id) ? "rgb(var(--selection-color))" : "rgb(var(--construction-color))"}
          stroke="white"
          strokeWidth="1"
          className="cursor-pointer"
          onClick={(e) => handlePointClick(id, e)}
          onContextMenu={(e) => handlePointRightClick(id, e)}
        />
        <text
          x={point.x + 5}
          y={point.y - 5}
          className="text-xs fill-current text-secondary"
          pointerEvents="none"
        >
          {point.name}
        </text>
      </g>
    ));
  };

  // Render segments
  const renderSegments = () => {
    return Object.entries(segments).map(([id, segment]) => {
      if (segment.type === 'line') {
        const startPoint = points[segment.a];
        const endPoint = points[segment.b];
        if (!startPoint || !endPoint) return null;
        
        return (
          <line
            key={id}
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            className="construction-stroke"
            strokeWidth="1.5"
            fill="none"
          />
        );
      } else if (segment.type === 'arc') {
        const centerPoint = points[segment.center];
        const startPoint = points[segment.start];
        const endPoint = points[segment.end];
        if (!centerPoint || !startPoint || !endPoint) return null;
        
        const radius = Math.sqrt(
          Math.pow(startPoint.x - centerPoint.x, 2) + 
          Math.pow(startPoint.y - centerPoint.y, 2)
        );
        
        // Calculate arc flags for SVG path
        const startAngle = Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x);
        const endAngle = Math.atan2(endPoint.y - centerPoint.y, endPoint.x - centerPoint.x);
        
        let deltaAngle = endAngle - startAngle;
        if (!segment.ccw && deltaAngle < 0) deltaAngle += 2 * Math.PI;
        if (segment.ccw && deltaAngle > 0) deltaAngle -= 2 * Math.PI;
        
        const largeArcFlag = Math.abs(deltaAngle) > Math.PI ? 1 : 0;
        const sweepFlag = segment.ccw ? 0 : 1;
        
        return (
          <path
            key={id}
            d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}`}
            className="curve-stroke"
            strokeWidth="1.5"
            fill="none"
          />
        );
      }
      
      return null;
    });
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full canvas-bg cursor-crosshair"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      >
        {/* Grid */}
        <g className="opacity-50">
          {renderGrid()}
        </g>
        
        {/* Segments */}
        <g>
          {renderSegments()}
        </g>
        
        {/* Points */}
        <g>
          {renderPoints()}
        </g>
      </svg>

      {/* Context Menu */}
      {contextMenuPoint && (
        <div
          className="fixed bg-white border border-gray-300 rounded-md shadow-lg py-1 z-20"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => {
              setShowPointDialog(true);
              setContextMenuPoint(null);
            }}
          >
            Edit Point
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => {
              // Delete point
              setContextMenuPoint(null);
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Dialogs */}
      <PointDialog
        isOpen={showPointDialog}
        onClose={() => setShowPointDialog(false)}
        pointId={contextMenuPoint}
      />
      
      <LengthAngleDialog
        isOpen={showLengthAngleDialog}
        onClose={() => setShowLengthAngleDialog(false)}
      />
      
      <PointOnLineDialog
        isOpen={showPointOnLineDialog}
        onClose={() => setShowPointOnLineDialog(false)}
      />
    </div>
  );
}