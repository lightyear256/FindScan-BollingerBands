"use client"

import { useCallback, useState } from "react";
import { BollingerBandsOptions } from '../lib/types';
import Chart from "@/components/Chart";
import BollingerSettings from "@/components/BollingerSettings";
import {ChartCandlestick} from 'lucide-react'

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [bollingerOptions, setBollingerOptions] = useState<BollingerBandsOptions>({
    length: 20,
    maType: 'SMA',
    source: 'close',
    stdDevMultiplier: 2,
    offset: 0,
    basis: {
      visible: true,
      color: '#2962FF',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    upper: {
      visible: true,
      color: '#AAFF00',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    lower: {
      visible: true,
      color: '#FF0000',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    background: {
      visible: true,
      color:"#FF0000",
      opacity: 10
    }
  });

  const handleAddIndicator = useCallback(() => {
    setIndicatorAdded(true);
    setShowSettings(true);
  }, []);
  
  const handleRemoveIndicator = useCallback(() => {
    setIndicatorAdded(false);
    setShowSettings(false);
  }, []);

  const handleSettingsChange = useCallback((newOptions: BollingerBandsOptions) => {
    setBollingerOptions(newOptions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-y-6 sm:gap-y-8 lg:gap-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8 lg:mt-12 mb-4 sm:mb-6 gap-6">
          {/* Title and Icon */}
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-3 sm:gap-x-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <ChartCandlestick className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"/>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                FindScan
              </div>
            </div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium ml-2 sm:ml-0">
              Bollinger Bands Analysis
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {!indicatorAdded && (
              <button
                onClick={handleAddIndicator}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-0"
              >
                <span className="hidden sm:inline">Add Bollinger Bands</span>
                <span className="sm:hidden">Add Bands</span>
              </button>
            )}
            {indicatorAdded && (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-0"
                >
                  Settings
                </button>
                <button
                  onClick={() => handleRemoveIndicator()}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-0"
                >
                  <span className="hidden sm:inline">Remove Bands</span>
                  <span className="sm:hidden">Remove</span>
                </button>
              </>
            )}
          </div>
        </div>



        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            <Chart
              showBollinger={indicatorAdded}
              bollingerOptions={bollingerOptions}
            />
          </div>
        </div>

        {showSettings && (
          <BollingerSettings
            options={bollingerOptions}
            onOptionsChange={handleSettingsChange}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}