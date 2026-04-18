'use client';

import React, { useMemo } from 'react';

interface MetricBoxProps {
  label: string;
  value: string | number;
  subValue?: string;
  isPositive?: boolean;
}

function MetricBox({ label, value, subValue, isPositive }: MetricBoxProps) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group">
      <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold mb-2 group-hover:text-white/50">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-xl font-medium tracking-tight text-white">{value}</div>
        {subValue && (
          <div className={`text-[10px] font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}

interface PerformanceTableProps {
  data: { time: string; value: number }[];
  baseValue: number;
}

export default function PerformanceTable({ data, baseValue }: PerformanceTableProps) {
  const stats = useMemo(() => {
    if (!data.length) return null;

    const initial = baseValue;
    const current = data[data.length - 1].value;
    const totalReturn = ((current / initial) - 1) * 100;

    // Daily returns for Sharpe/Volatility
    const returns = [];
    let maxDrawdown = 0;
    let peak = initial;

    for (let i = 0; i < data.length; i++) {
      const val = data[i].value;
      if (val > peak) peak = val;
      const dd = ((val / peak) - 1) * 100;
      if (dd < maxDrawdown) maxDrawdown = dd;

      if (i > 0) {
        returns.push((data[i].value / data[i - 1].value) - 1);
      }
    }

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.map(x => Math.pow(x - avgReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
    
    // Annualized (Assuming daily snapshots for simplicity in calculation)
    const annualizedReturn = (Math.pow(1 + avgReturn, 252) - 1) * 100;
    const annualizedVol = stdDev * Math.sqrt(252) * 100;
    const sharpe = (avgReturn / stdDev) * Math.sqrt(252);
    
    const positiveReturns = returns.filter(r => r > 0).length;
    const winRate = (positiveReturns / returns.length) * 100;

    return {
      totalReturn,
      annualizedReturn,
      maxDrawdown,
      sharpe,
      annualizedVol,
      winRate
    };
  }, [data, baseValue]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricBox label="Total Return" value={`${stats.totalReturn.toFixed(1)}%`} isPositive={stats.totalReturn >= 0} />
      <MetricBox label="CAGR (Est.)" value={`${stats.annualizedReturn.toFixed(1)}%`} isPositive={stats.annualizedReturn >= 0} />
      <MetricBox label="Max Drawdown" value={`${stats.maxDrawdown.toFixed(1)}%`} />
      <MetricBox label="Sharpe Ratio" value={stats.sharpe.toFixed(2)} />
      <MetricBox label="Volatility" value={`${stats.annualizedVol.toFixed(1)}%`} />
      <MetricBox label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
    </div>
  );
}
