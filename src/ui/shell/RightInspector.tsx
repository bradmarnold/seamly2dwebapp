/**
 * RightInspector component - properties and settings panel like Seamly2D
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

type InspectorTab = 'selection' | 'piece' | 'measurements';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SelectionPanelProps {}

function SelectionPanel({}: SelectionPanelProps) {
  const { selectedPoints, selectedSegments, points, segments } = useStore();
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">Selection</h3>
      
      {selectedPoints.length === 0 && selectedSegments.length === 0 ? (
        <p className="text-sm text-gray-500">No items selected</p>
      ) : (
        <div className="space-y-3">
          {selectedPoints.map(pointId => {
            const point = points[pointId];
            if (!point) return null;
            
            return (
              <div key={pointId} className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-sm mb-2">Point: {point.name || pointId}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">X</label>
                    <input
                      type="number"
                      value={point.x}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      onChange={(e) => {
                        // TODO: Update point position
                        console.log('Update X:', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Y</label>
                    <input
                      type="number"
                      value={point.y}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      onChange={(e) => {
                        // TODO: Update point position
                        console.log('Update Y:', e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={point.name || ''}
                    placeholder="Point name"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    onChange={(e) => {
                      // TODO: Update point name
                      console.log('Update name:', e.target.value);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={point.lock || false}
                      className="mr-2"
                      onChange={(e) => {
                        // TODO: Update point lock
                        console.log('Update lock:', e.target.checked);
                      }}
                    />
                    <span className="text-xs text-gray-600">Lock position</span>
                  </label>
                </div>
              </div>
            );
          })}
          
          {selectedSegments.map(segmentId => {
            const segment = segments[segmentId];
            if (!segment) return null;
            
            return (
              <div key={segmentId} className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-sm mb-2">
                  {segment.type}: {segment.name || segmentId}
                </h4>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={segment.name || ''}
                    placeholder="Segment name"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    onChange={(e) => {
                      // TODO: Update segment name
                      console.log('Update segment name:', e.target.value);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PiecePanelProps {}

function PiecePanel({}: PiecePanelProps) {
  const { pieces, selectedPieces } = useStore();
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">Piece</h3>
      
      {selectedPieces.length === 0 ? (
        <p className="text-sm text-gray-500">No piece selected</p>
      ) : (
        <div className="space-y-4">
          {selectedPieces.map(pieceId => {
            const piece = pieces[pieceId];
            if (!piece) return null;
            
            return (
              <div key={pieceId} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Piece Name</label>
                  <input
                    type="text"
                    value={piece.name}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    onChange={(e) => {
                      // TODO: Update piece name
                      console.log('Update piece name:', e.target.value);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Allowance (mm)</label>
                  <input
                    type="number"
                    value={piece.seamAllowance?.amount || 0}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    onChange={(e) => {
                      // TODO: Update allowance
                      console.log('Update allowance:', e.target.value);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Grainline</label>
                  <div className="text-xs text-gray-500">
                    {piece.grainline ? 'Set' : 'Not set'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cut Quantity</label>
                    <input
                      type="number"
                      value={1}
                      min="1"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      onChange={(e) => {
                        // TODO: Update cut quantity
                        console.log('Update cut qty:', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="flex items-center mt-5">
                      <input
                        type="checkbox"
                        checked={false}
                        className="mr-2"
                        onChange={(e) => {
                          // TODO: Update cut mirror
                          console.log('Update cut mirror:', e.target.checked);
                        }}
                      />
                      <span className="text-xs text-gray-600">Mirror</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Label Text</label>
                  <input
                    type="text"
                    value={piece.labels[0]?.text || ''}
                    placeholder="Label text"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    onChange={(e) => {
                      // TODO: Update label text
                      console.log('Update label text:', e.target.value);
                    }}
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-xs text-gray-700 mb-2">Notches</h4>
                  {piece.notches.length === 0 ? (
                    <p className="text-xs text-gray-500">No notches</p>
                  ) : (
                    <div className="space-y-2">
                      {piece.notches.map((notch, index) => (
                        <div key={notch.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <span className="text-xs">Position: {notch.position.t.toFixed(2)}</span>
                          <select
                            value={notch.type}
                            className="text-xs border border-gray-300 rounded px-1 py-0.5"
                            onChange={(e) => {
                              // TODO: Update notch type
                              console.log('Update notch type:', e.target.value);
                            }}
                          >
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triangle">Triangle</option>
                          </select>
                          <button
                            className="text-xs text-red-600 hover:text-red-800"
                            onClick={() => {
                              // TODO: Remove notch
                              console.log('Remove notch:', index);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className="mt-2 w-full py-1 px-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    onClick={() => {
                      // TODO: Add notch
                      console.log('Add notch');
                    }}
                  >
                    Add Notch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MeasurementsPanelProps {}

function MeasurementsPanel({}: MeasurementsPanelProps) {
  const { measurements, activeMeasurementFile } = useStore();
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">Measurements</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Active File:</span>
          <span className="text-xs font-medium">
            {activeMeasurementFile || 'None'}
          </span>
        </div>
        
        <button
          className="w-full py-2 px-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          onClick={() => {
            window.location.href = '/measurements/';
          }}
        >
          Open Measurements
        </button>
      </div>
      
      {Object.keys(measurements).length > 0 && (
        <div>
          <h4 className="font-medium text-xs text-gray-700 mb-2">Current Values</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {Object.entries(measurements).map(([name, value]) => (
              <div key={name} className="flex justify-between text-xs">
                <span className="text-gray-600">{name}:</span>
                <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RightInspector() {
  const [activeTab, setActiveTab] = useState<InspectorTab>('selection');

  const tabs = [
    { id: 'selection' as const, label: 'Selection', component: SelectionPanel },
    { id: 'piece' as const, label: 'Piece', component: PiecePanel },
    { id: 'measurements' as const, label: 'Measurements', component: MeasurementsPanel },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) => {
          if (activeTab === tab.id) {
            const Component = tab.component;
            return <Component key={tab.id} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}