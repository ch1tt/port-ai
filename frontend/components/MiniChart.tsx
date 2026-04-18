'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, HistogramSeries } from 'lightweight-charts';

interface MiniChartProps {
  ticker: string;
  name: string;
  data: { time: string; value: number; volume: number }[];
  height?: number;
}

export default function MiniChart({ ticker, name, data, height = 250 }: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const initial = data[0].value;
    const last = data[data.length - 1].value;
    const isUp = last >= initial;
    
    // Aesthetic colors based on the images (Emerald/Red)
    const lineColor = isUp ? '#059669' : '#dc2626'; // Vibrant green vs red
    const topColor = isUp ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)';
    const bottomColor = isUp ? 'rgba(5, 150, 105, 0.0)' : 'rgba(220, 38, 38, 0.0)';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2, // Leave space for volume
        },
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        timeVisible: true,
      },
      handleScroll: false,
      handleScale: false,
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(255,255,255,0.2)' },
        horzLine: { color: 'rgba(255,255,255,0.2)' },
      }
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: lineColor,
      topColor: topColor,
      bottomColor: bottomColor,
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    areaSeries.setData(data.map(d => ({ time: d.time as any, value: d.value })));

    // Volume Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: isUp ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay loosely on the chart
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    volumeSeries.setData(data.map(d => ({ time: d.time as any, value: d.volume })));

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  const lastValue = data.length > 0 ? data[data.length - 1].value : 0;
  const initialValue = data.length > 0 ? data[0].value : 0;
  const isUp = lastValue >= initialValue;
  const pnlColor = isUp ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white';

  return (
    <div className="relative w-full rounded-xl overflow-hidden glass-panel border border-white/5 bg-[#0a0a0b]">
      {/* Absolute overlay for top left ticker info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-3">
        <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">{ticker[0]}</span>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-md overflow-hidden">
            <span className="px-2 py-1 text-xs font-bold text-white bg-white/10">{ticker}</span>
            <span className="px-2 py-1 text-[10px] text-white/50">{name}</span>
        </div>
      </div>

      {/* Absolute overlay for current price */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className={`px-3 py-1 rounded font-mono text-xs font-bold ${pnlColor}`}>
            {lastValue.toFixed(2)}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full mt-2" style={{ height: `${height}px` }} />
    </div>
  );
}
