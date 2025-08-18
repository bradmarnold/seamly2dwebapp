'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MeasurementFile, 
  loadMeasurementFiles, 
  saveMeasurementFiles, 
  createDefaultMeasurements,
  parseVitFile,
  parseVstFile,
  STANDARD_MEASUREMENTS 
} from '@/lib/measurements';
import { useStore } from '@/lib/store';

export default function MeasurementsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<MeasurementFile[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingFile, setEditingFile] = useState<MeasurementFile | null>(null);
  const { setMeasurements } = useStore();

  useEffect(() => {
    setFiles(loadMeasurementFiles());
  }, []);

  const handleNewFile = (name: string, units: 'cm' | 'in') => {
    const newFile = createDefaultMeasurements(units);
    newFile.name = name;
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    saveMeasurementFiles(updatedFiles);
    setShowNewDialog(false);
  };

  const handleSetActive = (file: MeasurementFile) => {
    setMeasurements(file.measurements);
    // Navigate back to draft page
    router.push('/draft/');
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    saveMeasurementFiles(updatedFiles);
  };

  const handleEditFile = (file: MeasurementFile) => {
    setEditingFile({ ...file });
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;
    
    const updatedFiles = files.map(f => 
      f.id === editingFile.id ? { ...editingFile, modified: new Date().toISOString() } : f
    );
    setFiles(updatedFiles);
    saveMeasurementFiles(updatedFiles);
    setEditingFile(null);
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.vit,.vst,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          
          try {
            let newFile: MeasurementFile;
            
            if (file.name.endsWith('.vit')) {
              newFile = parseVitFile(content);
              newFile.name = file.name.replace('.vit', '');
            } else if (file.name.endsWith('.vst')) {
              newFile = parseVstFile(content);
              newFile.name = file.name.replace('.vst', '');
            } else if (file.name.endsWith('.json')) {
              const parsed = JSON.parse(content);
              newFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name.replace('.json', ''),
                type: 'individual',
                units: 'cm',
                measurements: parsed.measurements || parsed,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
              };
            } else {
              throw new Error('Unsupported file format. Please use .vit, .vst, or .json files.');
            }
            
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            saveMeasurementFiles(updatedFiles);
          } catch (error) {
            alert('Failed to import file: ' + (error instanceof Error ? error.message : String(error)));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/draft')}
                className="btn"
              >
                ← Back to Draft
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Measurements</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleImportFile}
                className="btn"
              >
                Import File
              </button>
              <button 
                onClick={() => setShowNewDialog(true)}
                className="btn-primary"
              >
                New File
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Measurement Files</h2>
            
            {files.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">📐</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No measurement files</h3>
                <p className="text-gray-600 mb-4">Create a new file or import existing measurements</p>
                <button 
                  onClick={() => setShowNewDialog(true)}
                  className="btn-primary"
                >
                  Create First File
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {file.type} • {file.units} • {Object.keys(file.measurements).length} measurements
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Modified: {new Date(file.modified).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleSetActive(file)}
                          className="btn-primary text-sm"
                        >
                          Use in Draft
                        </button>
                        <button 
                          onClick={() => handleEditFile(file)}
                          className="btn text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="btn text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3">About Measurements</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Measurement files contain body measurements used in pattern drafting.</p>
                <p>You can create custom measurements or import standard .vit/.vst files from Seamly2D.</p>
                <p>Use measurement names in expressions when creating points (e.g., &quot;bust/4 + 2&quot;).</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mt-4">
              <h3 className="font-medium text-blue-900 mb-3">Supported Formats</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>.vit</strong> - Individual measurements</div>
                <div><strong>.vst</strong> - Multisize measurements</div>
                <div><strong>.json</strong> - Custom format</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New File Dialog */}
      {showNewDialog && <NewFileDialog onClose={() => setShowNewDialog(false)} onCreate={handleNewFile} />}
      
      {/* Edit File Dialog */}
      {editingFile && (
        <EditFileDialog 
          file={editingFile} 
          onClose={() => setEditingFile(null)}
          onChange={setEditingFile}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

interface NewFileDialogProps {
  onClose: () => void;
  onCreate: (name: string, units: 'cm' | 'in') => void;
}

function NewFileDialog({ onClose, onCreate }: NewFileDialogProps) {
  const [name, setName] = useState('');
  const [units, setUnits] = useState<'cm' | 'in'>('cm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), units);
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">New Measurement File</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">File Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Measurements"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Units</label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value as 'cm' | 'in')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditFileDialogProps {
  file: MeasurementFile;
  onClose: () => void;
  onChange: (file: MeasurementFile) => void;
  onSave: () => void;
}

function EditFileDialog({ file, onClose, onChange, onSave }: EditFileDialogProps) {
  const handleMeasurementChange = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...file,
      measurements: {
        ...file.measurements,
        [name]: numValue,
      },
    });
  };

  const handleAddMeasurement = () => {
    const name = prompt('Measurement name:');
    if (name && !file.measurements[name]) {
      handleMeasurementChange(name, '0');
    }
  };

  const handleRemoveMeasurement = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _removed, ...rest } = file.measurements;
    onChange({
      ...file,
      measurements: rest,
    });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content max-w-2xl max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Edit: {file.name}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">File Name</label>
            <input
              type="text"
              value={file.name}
              onChange={(e) => onChange({ ...file, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Measurements</label>
              <button 
                onClick={handleAddMeasurement}
                className="btn text-sm"
              >
                Add Measurement
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(file.measurements).map(([name, value]) => (
                <div key={name} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-gray-600">
                      {STANDARD_MEASUREMENTS[name as keyof typeof STANDARD_MEASUREMENTS] || 'Custom measurement'}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleMeasurementChange(name, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    step="0.1"
                  />
                  <button
                    onClick={() => handleRemoveMeasurement(name)}
                    className="text-red-600 hover:text-red-800 text-sm px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
