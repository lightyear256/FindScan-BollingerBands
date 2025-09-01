"use client";
import { useEffect, useRef, useState } from "react";
import {
  init,
  dispose,
  registerIndicator,
  Chart as KLineChart,
} from "klinecharts";
import { OHLCVData, BollingerBandsOptions } from "../lib/types";
import { computeBollingerBands } from "@/lib/Indicators/bollinger";

interface ChartProps {
  showBollinger: boolean;
  bollingerOptions: BollingerBandsOptions;
}

const generateSampleData = (): OHLCVData[] => {
  const data: OHLCVData[] = [];
  let timestamp = Date.now() - 200 * 24 * 60 * 60 * 1000; 
  let price = 100;

  for (let i = 0; i < 200; i++) {
    const open = price;
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility * price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.01 * price;
    const low = Math.min(open, close) - Math.random() * 0.01 * price;
    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
    timestamp += 24 * 60 * 60 * 1000; 
  }

  return data;
};

export default function Chart({ showBollinger, bollingerOptions }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const klineChartRef = useRef<KLineChart | null>(null);
  const [ohlcvData] = useState<OHLCVData[]>(generateSampleData());

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = init(chartRef.current);
    klineChartRef.current = chart;

    if (chart === null) {
      return;
    }
    chart.setStyles({
      grid: {
        horizontal: {
          color: "#393939",
        },
        vertical: {
          color: "#393939",
        },
      },
      candle: {
        bar: {
          upColor: "#26a69a",
          downColor: "#ef5350",
          noChangeColor: "#888888",
        },
        tooltip: {
          showRule: "always",
          showType: "standard",
        },
      },
      indicator: {
        tooltip: {
          showRule: "always",
          showType: "standard",
        },
      },
    });

    const klineData = ohlcvData.map((item) => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    chart.applyNewData(klineData);

    return () => {
      if (klineChartRef.current && chartRef.current) {
        dispose(chartRef.current);
        klineChartRef.current = null;
      }
    };
  }, [ohlcvData]);
  
  console.log(bollingerOptions.background.visible); 
  
  useEffect(() => {
    if (!klineChartRef.current) return;

    if (showBollinger) {
      klineChartRef.current.removeIndicator("candle_pane", "CUSTOM_BOLL");

      const indicatorName = `CUSTOM_BOLL_${Date.now()}`;

      const customBollConfig = {
        name: indicatorName,
        shortName: "BOLL",
        calcParams: [
          bollingerOptions.length,
          bollingerOptions.stdDevMultiplier,
        ],
        figures: [
          { key: "up", title: "UP: ", type: "line" },
          { key: "mid", title: "MID: ", type: "line" },
          { key: "dn", title: "DN: ", type: "line" },
        ],
        calc: (dataList: OHLCVData[]) => {
          return dataList.map((d, i) => {
            if (i < bollingerOptions.length - 1) {
              return {}; 
            }

            const band = computeBollingerBands(
              dataList.slice(0, i + 1),
              bollingerOptions
            ).pop();

            return {
              up: band?.upper,
              mid: band?.basis,
              dn: band?.lower,
              timestamp: d.timestamp,
            };
          });
        },
        styles: {
          lines: [
            {
              color: bollingerOptions.upper.visible
                ? bollingerOptions.upper.color
                : "transparent",
              size: bollingerOptions.upper.lineWidth || 1,
              style:
                bollingerOptions.upper.lineStyle === "dashed"
                  ? "dashed"
                  : "solid",
              dashedValue:
                bollingerOptions.upper.lineStyle === "dashed" ? [5, 5] : [2, 2],
            },
            {
              color: bollingerOptions.basis.visible
                ? bollingerOptions.basis.color
                : "transparent",
              size: bollingerOptions.basis.lineWidth || 1,
              style:
                bollingerOptions.basis.lineStyle === "dashed"
                  ? "dashed"
                  : "solid",
              dashedValue:
                bollingerOptions.basis.lineStyle === "dashed" ? [5, 5] : [2, 2],
            },
            {
              color: bollingerOptions.lower.visible
                ? bollingerOptions.lower.color
                : "transparent",
              size: bollingerOptions.lower.lineWidth || 1,
              style:
                bollingerOptions.lower.lineStyle === "dashed"
                  ? "dashed"
                  : "solid",
              dashedValue:
                bollingerOptions.lower.lineStyle === "dashed" ? [5, 5] : [2, 2],
            },
          ],
        },
      };

      registerIndicator(customBollConfig);

      klineChartRef.current.createIndicator(indicatorName, true, {
        id: "candle_pane",
      });
    } else {
      const indicators =
        klineChartRef.current.getIndicators("candle_pane") || [];
      indicators.forEach((indicator) => {
        if (indicator.name?.startsWith("CUSTOM_BOLL")) {
          klineChartRef.current!.removeIndicator("candle_pane", indicator.name);
        }
      });
    }
  }, [showBollinger, bollingerOptions]);

  return (
    <div
      ref={chartRef}
      className="w-full text-xl bg-white rounded"
      style={{ height: "500px" }}
    />
  );
}