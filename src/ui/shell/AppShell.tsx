/**
 * AppShell component - main application shell that mirrors Seamly2D's layout
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import LeftToolbox from './LeftToolbox';
import RightInspector from './RightInspector';
import StatusBar from './StatusBar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Top menubar/toolbar */}
      <TopBar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left toolbox */}
        <div className="w-16 bg-gray-100 border-r border-gray-300 flex-shrink-0">
          <LeftToolbox />
        </div>
        
        {/* Center canvas */}
        <div className="flex-1 relative bg-white">
          {children}
        </div>
        
        {/* Right inspector */}
        <div className="w-80 bg-gray-50 border-l border-gray-300 flex-shrink-0">
          <RightInspector />
        </div>
      </div>
      
      {/* Bottom status bar */}
      <StatusBar />
    </div>
  );
}