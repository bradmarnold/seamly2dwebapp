'use client';

import { useStore } from '@/lib/store';

export default function PropertiesPanel() {
  const { selectedPoints, selectedSegments, selectedPieces, points, segments, pieces } = useStore();

  const renderPointProperties = (pointId: string) => {
    const point = points[pointId];
    if (!point) return null;

    return (
      <div key={pointId} className="border border-gray-200 rounded-lg p-3 mb-3">
        <h4 className="font-medium text-gray-800 mb-2">Point: {point.name}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">X:</span>
            <span className="ml-2 font-mono">{point.x.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Y:</span>
            <span className="ml-2 font-mono">{point.y.toFixed(2)}</span>
          </div>
        </div>
        
        {point.constraint && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600 mb-1">Construction:</div>
            {point.constraint.type === 'length_angle' && (
              <div className="text-sm">
                <div>Base: {points[point.constraint.basePoint]?.name}</div>
                <div>Length: {point.constraint.length}</div>
                <div>Angle: {point.constraint.angle}°</div>
              </div>
            )}
            {point.constraint.type === 'point_on_line' && (
              <div className="text-sm">
                <div>Line: {points[point.constraint.lineStart]?.name} - {points[point.constraint.lineEnd]?.name}</div>
                <div>Distance: {point.constraint.distance}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSegmentProperties = (segmentId: string) => {
    const segment = segments[segmentId];
    if (!segment) return null;

    return (
      <div key={segmentId} className="border border-gray-200 rounded-lg p-3 mb-3">
        <h4 className="font-medium text-gray-800 mb-2">
          {segment.type === 'line' ? 'Line' : segment.type === 'arc' ? 'Arc' : 'Spline'}
        </h4>
        
        {segment.type === 'line' && (
          <div className="text-sm">
            <div>Start: {points[segment.a]?.name}</div>
            <div>End: {points[segment.b]?.name}</div>
            {points[segment.a] && points[segment.b] && (
              <div className="mt-1 text-gray-600">
                Length: {Math.sqrt(
                  Math.pow(points[segment.b].x - points[segment.a].x, 2) +
                  Math.pow(points[segment.b].y - points[segment.a].y, 2)
                ).toFixed(2)}
              </div>
            )}
          </div>
        )}
        
        {segment.type === 'arc' && (
          <div className="text-sm">
            <div>Center: {points[segment.center]?.name}</div>
            <div>Start: {points[segment.start]?.name}</div>
            <div>End: {points[segment.end]?.name}</div>
            <div>Direction: {segment.ccw ? 'CCW' : 'CW'}</div>
            {points[segment.center] && points[segment.start] && (
              <div className="mt-1 text-gray-600">
                Radius: {Math.sqrt(
                  Math.pow(points[segment.start].x - points[segment.center].x, 2) +
                  Math.pow(points[segment.start].y - points[segment.center].y, 2)
                ).toFixed(2)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPieceProperties = (pieceId: string) => {
    const piece = pieces[pieceId];
    if (!piece) return null;

    return (
      <div key={pieceId} className="border border-gray-200 rounded-lg p-3 mb-3">
        <h4 className="font-medium text-gray-800 mb-2">Piece: {piece.name}</h4>
        <div className="text-sm">
          <div>Contour segments: {piece.contour.length}</div>
          <div>Notches: {piece.notches.length}</div>
          <div>Labels: {piece.labels.length}</div>
          
          {piece.seamAllowance && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-gray-600 mb-1">Seam Allowance:</div>
              <div>Amount: {piece.seamAllowance.amount}</div>
              <div>Join: {piece.seamAllowance.joins}</div>
            </div>
          )}
          
          {piece.grainline && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-gray-600 mb-1">Grainline:</div>
              <div>Start: ({piece.grainline.start.x.toFixed(1)}, {piece.grainline.start.y.toFixed(1)})</div>
              <div>End: ({piece.grainline.end.x.toFixed(1)}, {piece.grainline.end.y.toFixed(1)})</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedPoints.length === 0 && selectedSegments.length === 0 && selectedPieces.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Properties</h3>
        <div className="text-center text-gray-500 py-8">
          <div className="text-2xl mb-2">📋</div>
          <p>Select points, segments, or pieces to view their properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      
      <div className="space-y-3">
        {selectedPoints.map(renderPointProperties)}
        {selectedSegments.map(renderSegmentProperties)}
        {selectedPieces.map(renderPieceProperties)}
      </div>
      
      {(selectedPoints.length > 1 || selectedSegments.length > 1 || selectedPieces.length > 1) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">Multiple Selection</h4>
          <div className="text-sm text-blue-700">
            <div>Points: {selectedPoints.length}</div>
            <div>Segments: {selectedSegments.length}</div>
            <div>Pieces: {selectedPieces.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}