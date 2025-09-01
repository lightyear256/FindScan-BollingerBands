import { OHLCVData, BollingerBandsOptions, BollingerBandsData } from '../types';
export function computeBollingerBands(
  data: OHLCVData[],
  options: BollingerBandsOptions
): BollingerBandsData[] {
  const { length, stdDevMultiplier, offset } = options;
  const result: BollingerBandsData[] = [];

  if (data.length < length) return result;

  for (let i = length - 1; i < data.length; i++) {
    const window = data.slice(i - length + 1, i + 1);
    const closes = window.map(d => d.close);
    
    const basis = closes.reduce((sum, close) => sum + close, 0) / length;
    
    const variance = closes.reduce((sum, close) => sum + Math.pow(close - basis, 2), 0) / length;
    const stdDev = Math.sqrt(variance);
    
    const upper = basis + (stdDevMultiplier * stdDev);
    const lower = basis - (stdDevMultiplier * stdDev);
    
    result.push({
      timestamp: data[i].timestamp,
      basis,
      upper,
      lower
    });
  }

  if (offset !== 0) {
    return result.map((item, index) => ({
      ...item,
      timestamp: data[Math.min(Math.max(index + offset, 0), data.length - 1)]?.timestamp || item.timestamp
    }));
  }

  return result;
}