import React, { useRef } from 'react';
import { BowlingMatchupData, DismissalCountData, BatsmanComfortReport } from '../types';
import { ShieldCheck, AlertTriangle, Info, FileDown, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ComfortLevelChartProps {
  report: BatsmanComfortReport;
  mode: 'authentic' | 'interactive';
  onBowlingTypeClick?: (code: string) => void;
  onEditClick?: () => void;
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
}

export const ComfortLevelChart: React.FC<ComfortLevelChartProps> = ({
  report,
  mode,
  onBowlingTypeClick,
  onEditClick,
  onExportPdf,
  isExportingPdf = false,
}) => {
  const chartCardRef = useRef<HTMLDivElement>(null);

  // Maximum value for axis scaling (at least 50 like reference image)
  const maxAverage = Math.max(
    50,
    Math.ceil((Math.max(...report.bowlingCategories.map((b) => b.average), 50) + 5) / 5) * 5
  );

  // Ticks at intervals of 5: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50...
  const ticks: number[] = [];
  for (let i = 0; i <= maxAverage; i += 5) {
    ticks.push(i);
  }

  // Reference visual layout uses top-to-bottom order: RAFM, RALS, RAOS, LAFM, LAOD
  const categories = report.bowlingCategories;

  const handleExport = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      window.print();
    }
  };

  return (
    <div
      id="comfort-level-chart-container"
      ref={chartCardRef}
      className="bg-[#0F172A] rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 transition-all flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center w-full max-w-md mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wider text-white uppercase font-['Space_Grotesk']">
          {report.batsmanName || 'ENTER BATSMAN NAME'}
        </h2>
        <p className="text-lg sm:text-xl font-light text-slate-400 tracking-wide mt-0.5">
          {report.comfortTitle || 'Comfort Level'}
        </p>
        {!report.batsmanName && (
          <div className="mt-2 text-[11px] text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full inline-block">
            Preloaded data cleared • Enter runs &amp; dismissals in the calculator
          </div>
        )}
      </div>

      {mode === 'authentic' ? (
        /* Authentic Reproduction of the Reference Graphic */
        <div className="w-full max-w-md flex flex-col items-center select-none">
          <div className="w-full relative px-2 py-4">
            {/* SVG implementation for pixel-perfect line work, ticks, and crisp bars */}
            <svg
              className="w-full overflow-visible"
              viewBox="0 0 380 260"
              style={{ maxHeight: '320px' }}
            >
              {/* Axes Origin: Left x=65, bottom y=220, top y=20 */}
              {/* Y-Axis Line */}
              <line
                x1="65"
                y1="15"
                x2="65"
                y2="220"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* X-Axis Line */}
              <line
                x1="65"
                y1="220"
                x2="350"
                y2="220"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Categories & Bars */}
              {categories.map((item, index) => {
                const totalCats = categories.length;
                const slotHeight = 200 / totalCats;
                const yCenter = 25 + index * slotHeight + slotHeight / 2;
                const barHeight = 16;
                const yTop = yCenter - barHeight / 2;

                // Value scaling to width (max width = 270px at maxAverage)
                const availableWidth = 270;
                const barWidth = Math.max(2, (item.average / maxAverage) * availableWidth);

                return (
                  <g
                    key={item.code}
                    className="cursor-pointer group"
                    onClick={() => onBowlingTypeClick?.(item.code)}
                  >
                    {/* Y-Axis Tick mark */}
                    <line
                      x1="58"
                      y1={yCenter}
                      x2="65"
                      y2={yCenter}
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Y-Axis Category Label (e.g. RAFM, RALS, RAOS, LAFM, LAOD) */}
                    <text
                      x="52"
                      y={yCenter + 4}
                      textAnchor="end"
                      className="text-[12px] font-semibold fill-slate-200 tracking-tight"
                    >
                      {item.code}
                    </text>

                    {/* Horizontal Bar matching reference blue color */}
                    <rect
                      x="66"
                      y={yTop}
                      width={barWidth}
                      height={barHeight}
                      fill="#2563EB"
                      rx="0"
                      className="transition-all duration-300 group-hover:fill-blue-400"
                    />

                    {/* Value on hover */}
                    <text
                      x={66 + barWidth + 6}
                      y={yCenter + 4}
                      textAnchor="start"
                      className="text-[11px] font-bold fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {item.average.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Ticks & Labels */}
              {ticks.map((val) => {
                const xPos = 65 + (val / maxAverage) * 270;
                return (
                  <g key={val}>
                    {/* Tick mark */}
                    <line
                      x1={xPos}
                      y1="220"
                      x2={xPos}
                      y2="226"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Tick label */}
                    <text
                      x={xPos}
                      y="238"
                      textAnchor="middle"
                      className="text-[10.5px] font-medium fill-slate-400 font-sans"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend: ■ Average */}
          <div className="flex items-center justify-center gap-2 mt-1 mb-5">
            <span className="w-3.5 h-3.5 bg-[#2563EB] inline-block rounded-none" />
            <span className="text-sm font-medium text-slate-300">Average</span>
          </div>

          {/* Dismissals / Matchup Summary Table matching reference image */}
          <div className="w-full max-w-sm border border-white/15 rounded-xl overflow-hidden shadow-md mb-3">
            {/* Header row: Blue background with white bold codes (RAM | LAM | LAS | RLB | ROB) */}
            <div className="grid grid-cols-5 bg-[#1E3A8A] text-white text-center font-bold text-sm sm:text-base py-2 border-b border-white/20">
              {report.dismissalsTable.map((item) => (
                <div
                  key={item.bowlerType}
                  className="px-1 truncate border-r last:border-r-0 border-white/20 cursor-pointer hover:bg-blue-800 transition-colors"
                  title={`${item.fullName}: ${item.count} dismissals`}
                  onClick={() => onBowlingTypeClick?.(item.bowlerType)}
                >
                  {item.bowlerType}
                </div>
              ))}
            </div>

            {/* Values row: Sleek dark navy container with crisp white numbers */}
            <div className="grid grid-cols-5 bg-[#131E35] text-white text-center font-bold text-lg sm:text-xl py-2">
              {report.dismissalsTable.map((item) => (
                <div
                  key={item.bowlerType}
                  className="px-1 border-r last:border-r-0 border-white/10"
                >
                  {item.count}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Dismissals / Sample frequency by bowling discipline
          </p>
        </div>
      ) : (
        /* Interactive Modern Analytics View */
        <div className="w-full max-w-xl">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categories}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E293B" />
                <XAxis
                  type="number"
                  domain={[0, maxAverage]}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  unit=" avg"
                />
                <YAxis
                  dataKey="code"
                  type="category"
                  tick={{ fill: '#E2E8F0', fontWeight: 600, fontSize: 13 }}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as BowlingMatchupData;
                      return (
                        <div className="bg-[#0A0F1E] text-white p-3.5 rounded-xl shadow-2xl border border-white/15 text-xs space-y-1.5 max-w-xs backdrop-blur-md">
                          <div className="font-bold text-sm text-indigo-300">
                            {data.code} ({data.fullName})
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Comfort Average:</span>
                            <span className="font-bold text-white">{data.average.toFixed(1)}</span>
                          </div>
                          {data.comfortAssessment && (
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Assessment:</span>
                              <span
                                className={`font-semibold ${
                                  data.comfortAssessment === 'Dominant'
                                    ? 'text-emerald-400'
                                    : data.comfortAssessment === 'Comfortable'
                                    ? 'text-blue-400'
                                    : data.comfortAssessment === 'Moderate'
                                    ? 'text-amber-400'
                                    : 'text-rose-400'
                                }`}
                              >
                                {data.comfortAssessment}
                              </span>
                            </div>
                          )}
                          {data.strikeRate && (
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Strike Rate:</span>
                              <span className="text-slate-200">{data.strikeRate}</span>
                            </div>
                          )}
                          {data.description && (
                            <p className="text-slate-400 pt-1.5 border-t border-white/10 text-[11px] italic">
                              {data.description}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="average" radius={[0, 4, 4, 0]}>
                  {categories.map((entry) => {
                    let fill = '#3B82F6';
                    if (entry.average >= 45) fill = '#10B981'; // strong comfort
                    else if (entry.average >= 30) fill = '#3B82F6'; // good comfort
                    else if (entry.average >= 20) fill = '#F59E0B'; // moderate
                    else fill = '#EF4444'; // vulnerable
                    return <Cell key={entry.code} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend / Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
            <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-medium">&gt; 45: Dominant</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-300 font-medium">30-44: Comfortable</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-300 font-medium">20-29: Moderate</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-300 font-medium">&lt; 20: Vulnerable</span>
            </div>
          </div>

          {/* Dismissal Pills */}
          <div className="mt-5 p-4 bg-[#0A0F1E]/60 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Dismissal Distribution by Bowling Type
            </span>
            <div className="flex flex-wrap gap-2">
              {report.dismissalsTable.map((item) => (
                <div
                  key={item.bowlerType}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] border border-white/10 rounded-lg shadow-sm cursor-pointer hover:border-indigo-500/50 hover:bg-[#28354D] transition-all"
                  onClick={() => onBowlingTypeClick?.(item.bowlerType)}
                >
                  <span className="font-bold text-white text-xs">{item.bowlerType}</span>
                  <span className="text-[11px] text-slate-400">{item.fullName}</span>
                  <span className="px-1.5 py-0.5 text-xs font-bold text-indigo-300 bg-indigo-500/20 rounded">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Bar beneath chart */}
      <div
        className="w-full max-w-md flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 no-print"
        data-no-print="true"
      >
        <button
          type="button"
          onClick={handleExport}
          disabled={isExportingPdf}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#28354D] text-slate-200 hover:text-white border border-white/10 font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {isExportingPdf ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Exporting Graph...
            </>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              Export Graph (PDF)
            </>
          )}
        </button>

        {onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline cursor-pointer transition-colors"
          >
            Edit Values Manually
          </button>
        )}
      </div>
    </div>
  );
};
