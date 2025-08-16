'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

interface TopBarProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export default function TopBar({ onToggleTheme, isDarkMode }: TopBarProps) {
  const [showTutorials, setShowTutorials] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const { exportProject, importProject, newProject } = useStore();

  const handleExport = () => {
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          importProject(data);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tutorials = [
    'Basic Bodice',
    'Simple Sleeve', 
    'A-Line Skirt',
    'Straight Pants'
  ];

  return (
    <div className="h-12 bg-primary border-b border-primary flex items-center px-4">
      {/* Brand */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-primary">Seamly2D</h1>
        
        {/* Login Button (stub) */}
        <button className="btn">
          Login
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-4 ml-8">
        {/* Tutorials Dropdown */}
        <div className="relative">
          <button 
            className="btn"
            onClick={() => setShowTutorials(!showTutorials)}
          >
            Tutorials ▼
          </button>
          {showTutorials && (
            <div className="absolute top-full left-0 mt-1 bg-primary border border-primary rounded-md shadow-lg z-10 w-48">
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial}
                  className="block w-full text-left px-4 py-2 hover:bg-secondary text-primary"
                  onClick={() => {
                    console.log('Load tutorial:', tutorial);
                    setShowTutorials(false);
                  }}
                >
                  {tutorial}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File Menu */}
        <div className="relative">
          <button 
            className="btn"
            onClick={() => setShowFile(!showFile)}
          >
            File ▼
          </button>
          {showFile && (
            <div className="absolute top-full left-0 mt-1 bg-primary border border-primary rounded-md shadow-lg z-10 w-32">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-secondary text-primary"
                onClick={() => {
                  newProject();
                  setShowFile(false);
                }}
              >
                New
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-secondary text-primary"
                onClick={() => {
                  handleImport();
                  setShowFile(false);
                }}
              >
                Open
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-secondary text-primary"
                onClick={() => {
                  handleExport();
                  setShowFile(false);
                }}
              >
                Save
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-secondary text-primary"
                onClick={() => {
                  console.log('Export options');
                  setShowFile(false);
                }}
              >
                Export
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <button className="btn" onClick={onToggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Help */}
        <button className="btn">
          Help
        </button>
      </div>

      {/* Right side - Status */}
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-sm text-secondary">
          Ready
        </span>
      </div>
    </div>
  );
}