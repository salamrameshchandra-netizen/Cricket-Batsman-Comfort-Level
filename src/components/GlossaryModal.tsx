import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { BOWLING_GLOSSARY } from '../data/cricketPresets';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode?: string | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#0F172A] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 text-white animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">Cricket Bowling Acronyms</h3>
              <p className="text-xs text-slate-400">
                Guide to bowling variations used in comfort level graphs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto pr-1 space-y-3 flex-1 text-xs custom-scrollbar">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-200 leading-relaxed">
            <strong className="text-indigo-300">Understanding Comfort Level:</strong> In cricket matchup analytics, Comfort
            Level represents the batsman&apos;s batting average or efficiency against a specific
            bowling discipline. A high average (40+) indicates comfort and domination, whereas a low
            average (&lt;15) highlights an acute vulnerability.
          </div>

          <div className="space-y-2">
            {Object.entries(BOWLING_GLOSSARY).map(([code, details]) => {
              const isSelected = selectedCode === code;
              return (
                <div
                  key={code}
                  className={`p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-md'
                      : 'border-white/10 bg-[#131D33] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-white font-['Space_Grotesk'] text-sm">
                      {code}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {details.category}
                    </span>
                  </div>
                  <p className="font-medium text-indigo-300 text-xs">{details.fullName}</p>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    {details.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1E293B] hover:bg-[#28354D] border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
