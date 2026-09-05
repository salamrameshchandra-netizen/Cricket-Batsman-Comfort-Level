import React from 'react';
import { BatsmanComfortReport } from '../types';
import { ShieldCheck, AlertOctagon, Activity, Zap, Award } from 'lucide-react';

interface MetricsCardsProps {
  report: BatsmanComfortReport;
  onSelectCategory?: (code: string) => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ report, onSelectCategory }) => {
  // Find highest and lowest
  const sorted = [...report.bowlingCategories].sort((a, b) => b.average - a.average);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  // Pace vs Spin calculations
  const paceCodes = ['RAFM', 'LAFM', 'RAM', 'LAM'];
  const spinCodes = ['RALS', 'RAOS', 'LAOD', 'LAS', 'RLB', 'ROB'];

  const paceEntries = report.bowlingCategories.filter((b) =>
    ['RAFM', 'LAFM', 'RAM', 'LAM'].some((code) => b.code.toUpperCase().includes(code))
  );
  const spinEntries = report.bowlingCategories.filter((b) =>
    ['RALS', 'RAOS', 'LAOD', 'LAS', 'RLB', 'ROB', 'SPIN'].some((code) =>
      b.code.toUpperCase().includes(code)
    )
  );

  const paceAvg =
    paceEntries.length > 0
      ? paceEntries.reduce((acc, curr) => acc + curr.average, 0) / paceEntries.length
      : 0;

  const spinAvg =
    spinEntries.length > 0
      ? spinEntries.reduce((acc, curr) => acc + curr.average, 0) / spinEntries.length
      : 0;

  const totalDismissals = report.dismissalsTable.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Dominant Bowling Style */}
      <div
        className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 shadow-sm hover:border-emerald-500/40 hover:bg-[#121B30] transition-all cursor-pointer group"
        onClick={() => highest && onSelectCategory?.(highest.code)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Dominant Comfort
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {highest ? highest.code : 'N/A'}
          </span>
          {highest && (
            <span className="text-sm font-bold text-emerald-400">
              {highest.average.toFixed(1)} avg
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-1">
          {highest ? highest.fullName : 'No data'}
        </p>
      </div>

      {/* 2. Most Vulnerable */}
      <div
        className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 shadow-sm hover:border-rose-500/40 hover:bg-[#121B30] transition-all cursor-pointer group"
        onClick={() => lowest && onSelectCategory?.(lowest.code)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Critical Vulnerability
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {lowest ? lowest.code : 'N/A'}
          </span>
          {lowest && (
            <span className="text-sm font-bold text-rose-400">
              {lowest.average.toFixed(1)} avg
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-1">
          {lowest ? lowest.fullName : 'No data'}
        </p>
      </div>

      {/* 3. Pace vs Spin Comfort Index */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pace vs Spin Comfort
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Pace Avg</span>
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">
              {paceAvg ? paceAvg.toFixed(1) : '-'}
            </span>
          </div>
          <div className="h-7 w-[1px] bg-white/10 mx-2" />
          <div>
            <span className="text-slate-400 block text-[11px]">Spin Avg</span>
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">
              {spinAvg ? spinAvg.toFixed(1) : '-'}
            </span>
          </div>
        </div>
        <div className="mt-3 w-full bg-[#0A0F1E] border border-white/5 rounded-full h-1.5 overflow-hidden flex">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{
              width: `${
                paceAvg + spinAvg > 0 ? (paceAvg / (paceAvg + spinAvg)) * 100 : 50
              }%`,
            }}
            title={`Pace: ${paceAvg.toFixed(1)}`}
          />
          <div
            className="bg-indigo-500 h-full transition-all"
            style={{
              width: `${
                paceAvg + spinAvg > 0 ? (spinAvg / (paceAvg + spinAvg)) * 100 : 50
              }%`,
            }}
            title={`Spin: ${spinAvg.toFixed(1)}`}
          />
        </div>
      </div>

      {/* 4. Total Tracked Dismissals */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recorded Dismissals
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {totalDismissals}
          </span>
          <span className="text-xs font-medium text-slate-400">across 5 types</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">
          Most dismissed by:{' '}
          <strong className="text-slate-200">
            {report.dismissalsTable.length > 0
              ? [...report.dismissalsTable].sort((a, b) => b.count - a.count)[0].bowlerType
              : 'RAM'}
          </strong>
        </p>
      </div>
    </div>
  );
};
