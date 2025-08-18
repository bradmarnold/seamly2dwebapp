/**
 * LeftToolbox component - tool palette like Seamly2D
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import {
  SelectIcon,
  PointIcon,
  LineIcon,
  CurveIcon,
  ArcIcon,
  MirrorIcon,
  RotateIcon,
  PieceIcon,
  NotchIcon,
  GrainlineIcon,
  AllowanceIcon,
  PanIcon,
} from '../icons/ToolIcons';

const toolGroups = [
  {
    name: 'Selection',
    tools: [
      { id: 'select', icon: SelectIcon, title: 'Select (V)', shortcut: 'V' },
      { id: 'move', icon: SelectIcon, title: 'Move', shortcut: '' },
      { id: 'pan', icon: PanIcon, title: 'Pan', shortcut: '' },
    ]
  },
  {
    name: 'Point',
    tools: [
      { id: 'point_base', icon: PointIcon, title: 'Base Point (P)', shortcut: 'P' },
      { id: 'point_length_angle', icon: PointIcon, title: 'Point at Length and Angle', shortcut: '' },
      { id: 'point_along_line', icon: PointIcon, title: 'Point Along Line', shortcut: '' },
      { id: 'point_along_arc', icon: PointIcon, title: 'Point Along Arc', shortcut: '' },
      { id: 'point_intersection', icon: PointIcon, title: 'Point at Intersection', shortcut: '' },
      { id: 'point_perpendicular', icon: PointIcon, title: 'Point on Perpendicular', shortcut: '' },
    ]
  },
  {
    name: 'Line',
    tools: [
      { id: 'line_points', icon: LineIcon, title: 'Line Between Points (L)', shortcut: 'L' },
      { id: 'line_perpendicular', icon: LineIcon, title: 'Perpendicular Line', shortcut: '' },
      { id: 'line_parallel', icon: LineIcon, title: 'Parallel Line', shortcut: '' },
      { id: 'line_tangent', icon: LineIcon, title: 'Tangent Line', shortcut: '' },
    ]
  },
  {
    name: 'Curve',
    tools: [
      { id: 'curve_bezier', icon: CurveIcon, title: 'Cubic Bezier Curve (C)', shortcut: 'C' },
      { id: 'curve_spline', icon: CurveIcon, title: 'Spline', shortcut: '' },
    ]
  },
  {
    name: 'Arc',
    tools: [
      { id: 'arc_center_angles', icon: ArcIcon, title: 'Arc by Center and Angles (A)', shortcut: 'A' },
      { id: 'arc_radius', icon: ArcIcon, title: 'Arc by Radius', shortcut: '' },
      { id: 'arc_points', icon: ArcIcon, title: 'Arc Through Points', shortcut: '' },
    ]
  },
  {
    name: 'Operations',
    tools: [
      { id: 'mirror', icon: MirrorIcon, title: 'Mirror (M)', shortcut: 'M' },
      { id: 'rotate', icon: RotateIcon, title: 'Rotate (R)', shortcut: 'R' },
      { id: 'move_vector', icon: SelectIcon, title: 'Move by Vector', shortcut: '' },
      { id: 'intersect', icon: PointIcon, title: 'Intersect', shortcut: '' },
    ]
  },
  {
    name: 'Piece',
    tools: [
      { id: 'extract_piece', icon: PieceIcon, title: 'Extract Piece', shortcut: '' },
      { id: 'add_notch', icon: NotchIcon, title: 'Add Notch (N)', shortcut: 'N' },
      { id: 'set_grain', icon: GrainlineIcon, title: 'Set Grainline (G)', shortcut: 'G' },
      { id: 'allowance', icon: AllowanceIcon, title: 'Set Allowance (O)', shortcut: 'O' },
    ]
  },
];

export default function LeftToolbox() {
  const { tool, setTool } = useStore();

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const shortcutMap: Record<string, string> = {
        'v': 'select',
        'p': 'point_base',
        'l': 'line_points',
        'c': 'curve_bezier',
        'a': 'arc_center_angles',
        'm': 'mirror',
        'r': 'rotate',
        'n': 'add_notch',
        'g': 'set_grain',
        'o': 'allowance',
      };

      const toolId = shortcutMap[e.key.toLowerCase()];
      if (toolId) {
        e.preventDefault();
        setTool(toolId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool]);

  return (
    <div className="h-full flex flex-col py-2 overflow-y-auto">
      {toolGroups.map((group, groupIndex) => (
        <div key={group.name} className="mb-4">
          {/* Group separator */}
          {groupIndex > 0 && (
            <div className="w-8 h-px bg-gray-400 mx-auto mb-2" />
          )}
          
          {/* Tools in group */}
          <div className="flex flex-col items-center space-y-1">
            {group.tools.map((toolItem) => {
              const IconComponent = toolItem.icon;
              return (
                <button
                  key={toolItem.id}
                  className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
                    tool === toolItem.id 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title={toolItem.title}
                  onClick={() => setTool(toolItem.id)}
                >
                  <IconComponent size={16} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}