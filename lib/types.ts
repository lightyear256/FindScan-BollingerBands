export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface LineStyleSettings {
  visible: boolean;
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed';
}

export interface BackgroundSettings {
  visible: boolean;
  color:string
  opacity: number;
}

export interface BollingerBandsOptions {
  length: number;
  maType: 'SMA';
  source: 'close';
  stdDevMultiplier: number;
  offset: number;
  basis: LineStyleSettings;
  upper: LineStyleSettings;
  lower: LineStyleSettings;
  background: BackgroundSettings;
}

export interface BollingerBandsData {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}