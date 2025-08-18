/**
 * TopBar component - main menubar and toolbar like Seamly2D
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { isStaticMode } from '@/lib/basePath';

interface TopBarProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export default function TopBar({ onToggleTheme, isDarkMode }: TopBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { 
    exportProject, 
    importProject, 
    newProject, 
    loadFromLocalStorage,
    undo,
    redo,
    canUndo,
    canRedo
  } = useStore();
  const staticMode = isStaticMode();

  useEffect(() => {
    if (staticMode) {
      loadFromLocalStorage();
    }
  }, [staticMode, loadFromLocalStorage]);

  const handleExport = useCallback(() => {
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportProject]);

  const handleImport = useCallback(() => {
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
  }, [importProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            } else {
              e.preventDefault();
              undo();
            }
            break;
          case 'n':
            e.preventDefault();
            newProject();
            break;
          case 's':
            e.preventDefault();
            handleExport();
            break;
          case 'o':
            e.preventDefault();
            handleImport();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [undo, redo, newProject, handleExport, handleImport]);

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: newProject },
        { label: 'Open', shortcut: 'Ctrl+O', action: handleImport },
        { label: 'Save', shortcut: 'Ctrl+S', action: handleExport },
        { label: 'Sync', shortcut: '', action: () => console.log('Sync') },
        { label: '---', shortcut: '', action: undefined },
        { label: 'Export PDF', shortcut: '', action: () => console.log('Export PDF') },
        { label: 'Export SVG', shortcut: '', action: () => console.log('Export SVG') },
        { label: 'Export DXF', shortcut: '', action: () => console.log('Export DXF') },
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: undo, disabled: !canUndo },
        { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: redo, disabled: !canRedo },
        { label: '---', shortcut: '', action: undefined },
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
      ]
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Zoom In', shortcut: '+', action: () => console.log('Zoom In') },
        { label: 'Zoom Out', shortcut: '-', action: () => console.log('Zoom Out') },
        { label: 'Fit', shortcut: 'F', action: () => console.log('Fit') },
        { label: '---', shortcut: '', action: undefined },
        { label: 'Dark Mode', shortcut: '', action: onToggleTheme },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { label: 'Point Tool', shortcut: 'P', action: () => console.log('Point') },
        { label: 'Line Tool', shortcut: 'L', action: () => console.log('Line') },
        { label: 'Curve Tool', shortcut: 'C', action: () => console.log('Curve') },
        { label: 'Arc Tool', shortcut: 'A', action: () => console.log('Arc') },
      ]
    },
    {
      id: 'measurements',
      label: 'Measurements',
      items: [
        { label: 'Open Measurements', shortcut: '', action: () => window.location.href = '/measurements/' },
        { label: 'New Individual', shortcut: '', action: () => console.log('New Individual') },
        { label: 'New Multisize', shortcut: '', action: () => console.log('New Multisize') },
      ]
    },
    {
      id: 'history',
      label: 'History',
      items: [
        { label: 'Previous', shortcut: '', action: () => console.log('Previous') },
        { label: 'Selected', shortcut: '', action: () => console.log('Selected') },
      ]
    },
    {
      id: 'utilities',
      label: 'Utilities',
      items: [
        { label: 'Calculator', shortcut: '', action: () => console.log('Calculator') },
        { label: 'Preferences', shortcut: '', action: () => console.log('Preferences') },
      ]
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: 'Tutorial', shortcut: '', action: () => console.log('Tutorial') },
        { label: 'About', shortcut: '', action: () => console.log('About') },
      ]
    }
  ];

  const commonActions = [
    { icon: '📄', label: 'New', shortcut: 'Ctrl+N', action: newProject },
    { icon: '📂', label: 'Open', shortcut: 'Ctrl+O', action: handleImport },
    { icon: '💾', label: 'Save', shortcut: 'Ctrl+S', action: handleExport },
    { icon: '🔄', label: 'Sync', shortcut: '', action: () => console.log('Sync') },
    { icon: '|', label: '', shortcut: '', action: () => {} }, // separator
    { icon: '📐', label: 'Draft', shortcut: '', action: () => console.log('Draft') },
    { icon: '🧩', label: 'Piece', shortcut: '', action: () => console.log('Piece') },
    { icon: '📋', label: 'Layout', shortcut: '', action: () => console.log('Layout') },
    { icon: '|', label: '', shortcut: '', action: () => {} }, // separator
    { icon: '↶', label: 'Undo', shortcut: 'Ctrl+Z', action: undo, disabled: !canUndo },
    { icon: '↷', label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: redo, disabled: !canRedo },
    { icon: '|', label: '', shortcut: '', action: () => {} }, // separator
    { icon: '🔍+', label: 'Zoom In', shortcut: '+', action: () => console.log('Zoom In') },
    { icon: '🔍-', label: 'Zoom Out', shortcut: '-', action: () => console.log('Zoom Out') },
    { icon: '⤢', label: 'Fit', shortcut: 'F', action: () => console.log('Fit') },
    { icon: '|', label: '', shortcut: '', action: () => {} }, // separator
    { icon: '←', label: 'Previous', shortcut: '', action: () => console.log('Previous') },
    { icon: '✓', label: 'Selected', shortcut: '', action: () => console.log('Selected') },
    { icon: '□', label: 'Area', shortcut: '', action: () => console.log('Area') },
    { icon: '🤏', label: 'Pan', shortcut: '', action: () => console.log('Pan') },
  ];

  return (
    <div className="h-12 bg-gray-200 border-b border-gray-300 flex items-center">
      {/* Menu bar */}
      <div className="flex items-center">
        {menuItems.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              className={`px-3 py-2 text-sm hover:bg-gray-300 ${
                activeMenu === menu.id ? 'bg-gray-300' : ''
              }`}
              onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
            >
              {menu.label}
            </button>
            
            {activeMenu === menu.id && (
              <div className="absolute top-full left-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 min-w-48">
                {menu.items.map((item, index) => {
                  if (item.label === '---') {
                    return <div key={index} className="border-t border-gray-200 my-1" />;
                  }
                  
                  return (
                    <button
                      key={index}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 flex justify-between ${
                        item.disabled ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                      disabled={item.disabled}
                      onClick={() => {
                        if (!item.disabled && item.action) {
                          item.action();
                          setActiveMenu(null);
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-gray-500 text-xs">{item.shortcut}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center ml-4 space-x-1">
        {commonActions.map((action, index) => {
          if (action.icon === '|') {
            return <div key={index} className="w-px h-6 bg-gray-400 mx-1" />;
          }
          
          return (
            <button
              key={index}
              className={`p-1.5 text-lg hover:bg-gray-300 rounded ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
              disabled={action.disabled}
              onClick={action.action}
            >
              {action.icon}
            </button>
          );
        })}
      </div>

      {/* Right side - theme toggle */}
      <div className="ml-auto pr-4">
        <button
          className="p-1.5 text-lg hover:bg-gray-300 rounded"
          onClick={onToggleTheme}
          title="Toggle Theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}