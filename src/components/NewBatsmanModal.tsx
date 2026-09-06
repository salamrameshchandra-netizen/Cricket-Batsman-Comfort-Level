import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Check, FileText, Zap } from 'lucide-react';
import { createNewBatsman } from '../data/cricketPresets';
import { BatsmanComfortReport } from '../types';

interface NewBatsmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatsman: (newBatsman: BatsmanComfortReport, saveCurrentFirst: boolean) => void;
  currentBatsmanName: string;
  currentBatsmanData: BatsmanComfortReport;
}

export const NewBatsmanModal: React.FC<NewBatsmanModalProps> = ({
  isOpen,
  onClose,
  onAddBatsman,
  currentBatsmanName,
  currentBatsmanData,
}) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<'blank' | 'balanced' | 'pace_heavy' | 'spin_heavy' | 'copy_current'>('blank');
  const [saveCurrent, setSaveCurrent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a batsman name.');
      return;
    }

    let newBatsman: BatsmanComfortReport;
    if (template === 'copy_current') {
      newBatsman = {
        ...currentBatsmanData,
        id: `batsman-${Date.now()}`,
        batsmanName: name.trim().toUpperCase(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else {
      newBatsman = createNewBatsman(name.trim().toUpperCase(), template);
    }

    onAddBatsman(newBatsman, saveCurrent);
    setName('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-white/15 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#162248]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                Add New Batsman
              </h3>
              <p className="text-[11px] text-slate-300">
                Create a new player comfort profile and save existing player
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Batsman Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Batsman Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. VIRAT KOHLI, BABAR AZAM, STEVE SMITH"
              autoFocus
              className="w-full px-3.5 py-2.5 bg-[#0A0F1E] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
            />
            {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
          </div>

          {/* Starting Data Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Starting Data Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setTemplate('blank')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  template === 'blank'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#0A0F1E] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Clean Slate (0 Runs)
                  </span>
                  {template === 'blank' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[11px] text-slate-400">
                  Zeroed out matchups ready for fresh innings calculations.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('balanced')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  template === 'balanced'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#0A0F1E] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Balanced Benchmark
                  </span>
                  {template === 'balanced' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[11px] text-slate-400">
                  Averages ~35–44 across pace &amp; spin archetypes.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('pace_heavy')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  template === 'pace_heavy'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#0A0F1E] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    Pace Dominant
                  </span>
                  {template === 'pace_heavy' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[11px] text-slate-400">
                  High comfort against RAFM &amp; LAFM, tested by wrist spin.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('spin_heavy')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  template === 'spin_heavy'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#0A0F1E] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Spin Specialist
                  </span>
                  {template === 'spin_heavy' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[11px] text-slate-400">
                  High averages against RALS, RAOS, and LAOD spin.
                </span>
              </button>
            </div>
          </div>

          {/* Option to Save Existing Player before switching */}
          <div className="bg-[#0A0F1E] p-3.5 rounded-xl border border-white/10 flex items-start gap-3">
            <input
              type="checkbox"
              id="saveCurrentCheckbox"
              checked={saveCurrent}
              onChange={(e) => setSaveCurrent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-[#162248] cursor-pointer"
            />
            <label htmlFor="saveCurrentCheckbox" className="text-xs text-slate-300 cursor-pointer">
              <span className="font-semibold text-white block">
                Save currently active player ({currentBatsmanName || 'Current Player'}) to roster
              </span>
              Preserves all existing stats, calculations, and graphs so you can switch back anytime.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1E293B] hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Add Batsman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
