'use client';

import { useState } from 'react';
import TutorialPanel from './TutorialPanel';
import PropertiesPanel from './PropertiesPanel';
import MeasurementsPanel from './MeasurementsPanel';

type TabType = 'tutorial' | 'properties' | 'measurements';

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('tutorial');

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 flex">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'tutorial'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('tutorial')}
        >
          Tutorial
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'properties'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'measurements'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'tutorial' && <TutorialPanel />}
        {activeTab === 'properties' && <PropertiesPanel />}
        {activeTab === 'measurements' && <MeasurementsPanel />}
      </div>
    </div>
  );
}