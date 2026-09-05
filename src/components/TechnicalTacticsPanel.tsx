import React from 'react';
import { BatsmanComfortReport } from '../types';
import { Target, CheckCircle2, AlertTriangle, Lightbulb, Compass } from 'lucide-react';

interface TechnicalTacticsPanelProps {
  report: BatsmanComfortReport;
}

export const TechnicalTacticsPanel: React.FC<TechnicalTacticsPanelProps> = ({ report }) => {
  return (
    <div className="bg-[#0F172A] rounded-2xl border border-white/10 shadow-lg p-6 sm:p-7 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
            <Compass className="w-5 h-5 text-indigo-400" />
            Tactical Analysis &amp; Performance Blueprint
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strategic breakdown inferred from comfort levels against pace &amp; spin
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Overall Comfort Index:</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <span className="text-sm font-bold text-indigo-300 font-['Space_Grotesk']">
              {report.overallComfortScore || 70}
            </span>
            <span className="text-[11px] text-indigo-400">/100</span>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 bg-[#131D33] rounded-xl border border-white/10 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div className="font-semibold text-white mb-1.5 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Comfort Level Evaluation
        </div>
        {report.comfortSummary}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Technical Biomechanics */}
        <div className="bg-[#0A0F1E]/70 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Technical Strengths
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.technicalInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opposition Plan */}
        <div className="bg-[#0A0F1E]/70 rounded-xl p-4 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
            <Target className="w-4 h-4 text-rose-400" />
            Opposition Bowling Plan
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.tacticalPlanAgainstBatsman.map((plan, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{plan}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Batsman Counter Strategy */}
        <div className="bg-[#0A0F1E]/70 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Batsman Counter Strategy
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.batsmanCounterStrategy.map((strat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>{strat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
