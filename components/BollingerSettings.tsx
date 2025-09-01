'use client';

import { useState } from 'react';
import { BollingerBandsOptions } from '../lib/types';

interface BollingerSettingsProps {
  options: BollingerBandsOptions;
  onOptionsChange: (options: BollingerBandsOptions) => void;
  onClose: () => void;
}

export default function BollingerSettings({ 
  options, 
  onOptionsChange, 
  onClose 
}: BollingerSettingsProps) {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');
  const [localOptions, setLocalOptions] = useState<BollingerBandsOptions>(options);

  const handleInputChange = (field: keyof BollingerBandsOptions, value: any) => {
    setLocalOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (
    section: 'basis' | 'upper' | 'lower' | 'background',
    field: string,
    value: any
  ) => {
    setLocalOptions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleApply = () => {
    onOptionsChange(localOptions);
    onClose(); 
  };

  const handleCancel = () => {
    setLocalOptions(options); 
    onClose();
  };

  const StyleSection = ({ 
    title, 
    section, 
    settings 
  }: { 
    title: string; 
    section: 'basis' | 'upper' | 'lower'; 
    settings: any;
  }) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3 text-black">{title}</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={`${section}-visible`}
            checked={settings.visible}
            onChange={(e) => handleStyleChange(section, 'visible', e.target.checked)}
            className="w-4 h-4 text-green-600 bg-gray-700 border-gray-300 rounded"
          />
          <label htmlFor={`${section}-visible`} className="text-sm text-black">
            Visible
          </label>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-black mb-1">Color</label>
            <div className="relative">
              <input
                type="color"
                value={settings.color}
                onChange={(e) => handleStyleChange(section, 'color', e.target.value)}
                className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer"
              />
              <div 
                className="w-full h-8 rounded border border-gray-300 cursor-pointer flex items-center px-2"
                style={{ backgroundColor: settings.color }}
              >
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-black mb-1">Line Width</label>
            <input
              type="number"
              min="1"
              max="5"
              value={settings.lineWidth}
              onChange={(e) => handleStyleChange(section, 'lineWidth', parseInt(e.target.value))}
              className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded text-black  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-black mb-1">Line Style</label>
          <select
            value={settings.lineStyle}
            onChange={(e) => handleStyleChange(section, 'lineStyle', e.target.value)}
            className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded text-black "
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-black">Bollinger Bands Settings</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-white text-xl leading-none p-1 hover:bg-red-400  rounded transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'inputs'
                ? 'text-black border-b-2 border-green-500'
                : 'text-gray-800 hover:text-gray-500'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'style'
                ? 'text-black border-b-2 border-green-500'
                : 'text-gray-800 hover:text-gray-500'
            }`}
          >
            Style
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={localOptions.length}
                  onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Basic MA Type
                </label>
                <select
                  value={localOptions.maType}
                  onChange={(e) => handleInputChange('maType', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-black "
                >
                  <option value="SMA">SMA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Source
                </label>
                <select
                  value={localOptions.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="close">Close</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  StdDev Multiplier
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={localOptions.stdDevMultiplier}
                  onChange={(e) => handleInputChange('stdDevMultiplier', parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-black "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Offset
                </label>
                <input
                  type="number"
                  min="-50"
                  max="50"
                  value={localOptions.offset}
                  onChange={(e) => handleInputChange('offset', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-black "
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div>
              <StyleSection
                title="Basic (Middle Band)"
                section="basis"
                settings={localOptions.basis}
              />
              
              <StyleSection
                title="Upper Band"
                section="upper"
                settings={localOptions.upper}
              />
              
              <StyleSection
                title="Lower Band"
                section="lower"
                settings={localOptions.lower}
              />

              
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-300">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-white border bg-red-500  rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-400 transition-colors "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}