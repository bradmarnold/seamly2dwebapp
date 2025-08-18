'use client';

import { useStore } from '@/lib/store';
import { STANDARD_MEASUREMENTS } from '@/lib/measurements';

export default function MeasurementsPanel() {
  const { measurements, activeMeasurementFile } = useStore();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Measurements</h3>
        <a 
          href="/measurements"
          className="btn text-sm"
        >
          Manage Files
        </a>
      </div>
      
      {activeMeasurementFile ? (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800">
            Active: {activeMeasurementFile}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-800">
            No measurement file active
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Object.keys(measurements).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📐</div>
            <p className="mb-2">No measurements loaded</p>
            <a href="/measurements" className="btn-primary text-sm">
              Load Measurements
            </a>
          </div>
        ) : (
          Object.entries(measurements).map(([name, value]) => (
            <div key={name} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs text-gray-600">
                  {STANDARD_MEASUREMENTS[name as keyof typeof STANDARD_MEASUREMENTS] || name}
                </div>
              </div>
              <div className="font-mono text-sm">
                {value.toFixed(1)}
              </div>
            </div>
          ))
        )}
      </div>

      {Object.keys(measurements).length > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Usage</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Use measurement names in expressions:</p>
            <div className="font-mono text-xs bg-white p-2 rounded border">
              <div>bust/4 + 2</div>
              <div>waist * 1.1</div>
              <div>(bust + 5) / 2</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}