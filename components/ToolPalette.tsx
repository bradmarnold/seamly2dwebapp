'use client';

import { useStore } from '@/lib/store';

const tools = [
  { id: 'select', icon: '🔽', title: 'Select' },
  { id: 'move', icon: '✋', title: 'Move' },
  { id: 'pan', icon: '🤏', title: 'Pan' },
  { id: 'measure', icon: '📏', title: 'Measure' },
  { id: 'separator', icon: '—', title: '' },
  { id: 'point_length_angle', icon: '📍', title: 'Point L∠' },
  { id: 'point_on_line', icon: '⚈', title: 'Point on Line' },
  { id: 'perpendicular', icon: '⊥', title: 'Perpendicular' },
  { id: 'parallel', icon: '∥', title: 'Parallel' },
  { id: 'intersection', icon: '⨯', title: 'Intersection' },
  { id: 'point_from_line', icon: '📐', title: 'From Line by Angle' },
  { id: 'point_on_arc', icon: '◐', title: 'Point on Arc' },
  { id: 'midpoint', icon: '⚬', title: 'Midpoint' },
  { id: 'separator2', icon: '—', title: '' },
  { id: 'line', icon: '📏', title: 'Line' },
  { id: 'arc_center_start_end', icon: '◗', title: 'Arc C-S-E' },
  { id: 'arc_radius', icon: '○', title: 'Arc by Radius' },
  { id: 'spline', icon: '〰️', title: 'Spline' },
  { id: 'separator3', icon: '—', title: '' },
  { id: 'trace_piece', icon: '🧩', title: 'Trace Piece' },
  { id: 'add_notch', icon: '▼', title: 'Add Notch' },
  { id: 'add_label', icon: '🏷️', title: 'Add Label' },
  { id: 'grainline', icon: '⟷', title: 'Grainline' },
];

export default function ToolPalette() {
  const { tool, setTool } = useStore();

  return (
    <div className="flex flex-col items-center py-2">
      {tools.map((toolItem) => {
        if (toolItem.id.startsWith('separator')) {
          return (
            <div key={toolItem.id} className="w-8 h-px bg-gray-300 my-2" />
          );
        }

        return (
          <button
            key={toolItem.id}
            className={`tool-button mb-1 ${tool === toolItem.id ? 'active' : ''}`}
            title={toolItem.title}
            onClick={() => setTool(toolItem.id)}
          >
            <span className="text-lg">{toolItem.icon}</span>
          </button>
        );
      })}
    </div>
  );
}