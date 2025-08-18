'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import ToolPalette from '@/components/ToolPalette';
import DraftingCanvas from '@/components/DraftingCanvas';
import RightPanel from '@/components/RightPanel';

export default function DraftPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const tool = useStore(state => state.tool);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Top Bar */}
      <TopBar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tool Palette */}
        <div className="w-16 bg-secondary border-r border-primary flex-shrink-0">
          <ToolPalette />
        </div>
        
        {/* Center Canvas */}
        <div className="flex-1 relative bg-primary">
          <DraftingCanvas />
        </div>
        
        {/* Right Panel */}
        <div className="w-80 bg-secondary border-l border-primary flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}