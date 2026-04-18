'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries, IChartApi, ISeriesApi } from 'lightweight-charts';

interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeData {
  time: string;
  value: number;
  color: string;
}

interface TradeMarker {
  time: string;
  position: 'aboveBar' | 'belowBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown';
  text: string;
}

interface AdvancedChartProps {
  data: OHLCData[];
  volumeData?: VolumeData[];
  markers?: TradeMarker[];
  height?: number;
  ticker?: string;
}

// ── RSI Calculation ──────────────────────────────────────────────────────────
function calculateRSI(data: OHLCData[], period: number = 14) {
  const rsiData = [];
  if (data.length <= period) return [];

  let gains = 0;
  let losses = 0;

  // Initial average
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiData.push({ time: data[i].time, value: rsi });
  }

  return rsiData;
}

// ── SMA Calculation ──────────────────────────────────────────────────────────
function calculateSMA(data: OHLCData[], period: number) {
  const smaData = [];
  if (data.length < period) return [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaData.push({ time: data[i].time, value: sum / period });
  }
  return smaData;
}

export default function AdvancedChart({ data, volumeData, markers, height = 500, ticker = 'ASSET' }: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [legendData, setLegendData] = useState<{
    open?: number; high?: number; low?: number; close?: number; volume?: number; rsi?: number;
    color?: string;
  }>({});

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(124, 58, 237, 0.4)',
          width: 0.5,
          labelBackgroundColor: '#111827',
        },
        horzLine: {
          color: 'rgba(124, 58, 237, 0.4)',
          width: 0.5,
          labelBackgroundColor: '#111827',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        autoScale: true,
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        rightOffset: 12,
        barSpacing: 6,
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    // ── Main Series (Candles) ────────────────────────────────────────────────
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    candlestickSeries.setData(sortedData);

    // ── Indicators: SMAs ─────────────────────────────────────────────────────
    const sma20Series = chart.addSeries(LineSeries, {
      color: 'rgba(59, 130, 246, 0.8)',
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    sma20Series.setData(calculateSMA(sortedData, 20));

    const sma50Series = chart.addSeries(LineSeries, {
      color: 'rgba(245, 158, 11, 0.8)',
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    sma50Series.setData(calculateSMA(sortedData, 50));

    // ── Volume ───────────────────────────────────────────────────────────────
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    
    if (volumeData && volumeData.length > 0) {
      const sortedVol = [...volumeData].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      volumeSeries.setData(sortedVol);
    } else {
      // Generate volume data if missing
      volumeSeries.setData(sortedData.map(d => ({
        time: d.time,
        value: Math.random() * 1000000,
        color: d.close >= d.open ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      })));
    }

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // ── Markers ─────────────────────────────────────────────────────────────
    if (markers && markers.length > 0) {
      const sortedMarkers = [...markers].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      candlestickSeries.setMarkers(sortedMarkers);
    }

    // ── RSI Pane ───────────────────────────────────────────────────────────
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#A78BFA',
      lineWidth: 2,
      priceScaleId: 'rsi',
      priceLineVisible: true,
      lastValueVisible: true,
    });

    rsiSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0.05 },
      borderColor: 'rgba(255, 255, 255, 0.1)',
    });

    const rsiData = calculateRSI(sortedData);
    rsiSeries.setData(rsiData);

    // ── Crosshair / Legend Logic ───────────────────────────────────────────
    chart.subscribeCrosshairMove(param => {
      if (param.time === undefined || param.point === undefined || !param.seriesData.get(candlestickSeries)) {
        const last = sortedData[sortedData.length - 1];
        const lastRsi = rsiData[rsiData.length - 1];
        setLegendData({
          open: last?.open, high: last?.high, low: last?.low, close: last?.close,
          rsi: lastRsi?.value,
          color: last?.close >= last?.open ? 'text-emerald-400' : 'text-red-400'
        });
        return;
      }

      const candleData: any = param.seriesData.get(candlestickSeries);
      const volData: any = param.seriesData.get(volumeSeries);
      const currentRsiData: any = param.seriesData.get(rsiSeries);

      setLegendData({
        open: candleData?.open,
        high: candleData?.high,
        low: candleData?.low,
        close: candleData?.close,
        volume: volData?.value,
        rsi: currentRsiData?.value,
        color: candleData?.close >= candleData?.open ? 'text-emerald-400' : 'text-red-400'
      });
    });

    window.addEventListener('resize', handleResize);
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, volumeData, markers, height]);

  return (
    <div className="flex flex-col w-full h-full relative group">
      {/* Legend Overlay */}
      <div className="absolute top-2 left-4 z-20 flex flex-wrap gap-x-6 gap-y-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-tight">{ticker}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Historical OHLC</span>
        </div>
        <div className="flex gap-4 text-[11px] font-mono whitespace-nowrap">
          <div className="flex gap-1.5"><span className="text-white/30">O</span><span className={legendData.color}>{legendData.open?.toFixed(2)}</span></div>
          <div className="flex gap-1.5"><span className="text-white/30">H</span><span className={legendData.color}>{legendData.high?.toFixed(2)}</span></div>
          <div className="flex gap-1.5"><span className="text-white/30">L</span><span className={legendData.color}>{legendData.low?.toFixed(2)}</span></div>
          <div className="flex gap-1.5"><span className="text-white/30">C</span><span className={legendData.color}>{legendData.close?.toFixed(2)}</span></div>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <div className="flex gap-1.5 uppercase tracking-tighter"><span className="text-white/30 italic">VOL</span><span className="text-white/60">{(legendData.volume || 0).toLocaleString()}</span></div>
          <div className="flex gap-1.5 uppercase tracking-tighter"><span className="text-purple-400 italic">RSI(14)</span><span className="text-purple-300">{legendData.rsi?.toFixed(2)}</span></div>
        </div>
      </div>

      {/* SMAs Legend */}
      <div className="absolute top-10 left-4 z-10 flex gap-4 text-[9px] uppercase tracking-widest font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-blue-500/80" /> <span className="text-blue-400/80">SMA 20</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-amber-500/80" /> <span className="text-amber-400/80">SMA 50</span></div>
      </div>

      <div ref={chartContainerRef} className="w-full relative flex-1" />
      
      {/* Visual Polish: Side Vignettes */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
}

