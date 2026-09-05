import React, { useState, useEffect } from 'react';
import { BatsmanComfortReport } from '../types';
import { X, Save, RotateCcw, Trash2 } from 'lucide-react';
import { REFERENCE_SHAHBAZ, EMPTY_BATSMAN_TEMPLATE } from '../data/cricketPresets';

interface DataEditorModalProps {
  report: BatsmanComfortReport;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedReport: BatsmanComfortReport) => void;
}

export const DataEditorModal: React.FC<DataEditorModalProps> = ({
  report,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<BatsmanComfortReport>({ ...report });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...report });
    }
  }, [report, isOpen]);

  if (!isOpen) return null;

  const handleAverageChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const newCategories = [...formData.bowlingCategories];
    newCategories[index] = { ...newCategories[index], average: num };
    setFormData({ ...formData, bowlingCategories: newCategories });
  };

  const handleDismissalChange = (index: number, val: string) => {
    const num = parseInt(val, 10) || 0;
    const newTable = [...formData.dismissalsTable];
    newTable[index] = { ...newTable[index], count: num };
    setFormData({ ...formData, dismissalsTable: newTable });
  };

  const handleResetToReference = () => {
    setFormData({ ...REFERENCE_SHAHBAZ });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0F172A] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/10 text-white animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Edit Graph &amp; Stats Values</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize batsman comfort averages and dismissal counts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Batsman Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Batsman Name
              </label>
              <input
                type="text"
                value={formData.batsmanName}
                onChange={(e) => setFormData({ ...formData, batsmanName: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 bg-[#0A0F1E] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Graph Subtitle
              </label>
              <input
                type="text"
                value={formData.comfortTitle}
                onChange={(e) => setFormData({ ...formData, comfortTitle: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 bg-[#0A0F1E] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Bowling Matchups (Chart Bars) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Bowling Variations (Chart Horizontal Bars)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {formData.bowlingCategories.map((item, idx) => (
                <div
                  key={item.code}
                  className="flex items-center gap-2 p-2.5 bg-[#131D33] rounded-xl border border-white/10"
                >
                  <span className="w-14 font-bold text-xs text-white shrink-0 font-['Space_Grotesk']">
                    {item.code}
                  </span>
                  <span className="text-xs text-slate-300 flex-1 truncate">{item.fullName}</span>
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="150"
                      value={item.average}
                      onChange={(e) => handleAverageChange(idx, e.target.value)}
                      className="w-20 text-xs px-2.5 py-1.5 bg-[#0A0F1E] border border-slate-700 rounded-lg text-right font-semibold text-white focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] text-slate-400">avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dismissals Table */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Dismissal Summary Table (RAM, LAM, LAS, RLB, ROB)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {formData.dismissalsTable.map((item, idx) => (
                <div key={item.bowlerType} className="text-center bg-[#131D33] p-2 rounded-xl border border-white/10">
                  <span className="block text-[11px] font-bold text-indigo-300 mb-1">
                    {item.bowlerType}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={item.count}
                    onChange={(e) => handleDismissalChange(idx, e.target.value)}
                    className="w-full text-center text-xs py-1 bg-[#0A0F1E] border border-slate-700 rounded-lg font-bold text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetToReference}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Reference
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...EMPTY_BATSMAN_TEMPLATE })}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Data
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Apply Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
