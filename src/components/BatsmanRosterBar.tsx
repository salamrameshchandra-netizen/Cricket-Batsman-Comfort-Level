import React, { useState } from 'react';
import { BatsmanComfortReport } from '../types';
import {
  Users,
  UserPlus,
  Save,
  Check,
  ChevronDown,
  Trash2,
  Sparkles,
  User,
} from 'lucide-react';

interface BatsmanRosterBarProps {
  roster: BatsmanComfortReport[];
  activeId: string;
  currentReport: BatsmanComfortReport;
  onSelectPlayer: (id: string) => void;
  onSaveCurrentPlayer: () => void;
  onOpenNewBatsmanModal: () => void;
  onDeletePlayer: (id: string) => void;
  isSaved?: boolean;
}

export const BatsmanRosterBar: React.FC<BatsmanRosterBarProps> = ({
  roster,
  activeId,
  currentReport,
  onSelectPlayer,
  onSaveCurrentPlayer,
  onOpenNewBatsmanModal,
  onDeletePlayer,
  isSaved = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activePlayer = roster.find((p) => p.id === activeId) || currentReport;

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shadow-black/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Left: Player Selector / Switcher */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Player Roster
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {roster.length} {roster.length === 1 ? 'Batsman' : 'Batsmen'} Saved
            </span>
          </div>
        </div>

        {/* Player Dropdown / Switcher */}
        <div className="relative flex-1 min-w-[200px]">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[#0A0F1E] hover:bg-[#131E38] border border-white/15 rounded-xl text-left transition-all cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                {currentReport.batsmanName || 'Unnamed Batsman'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-medium shrink-0">
                Score: {currentReport.overallComfortScore || 0}%
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
                isDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0F172A] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                  <span>Switch Saved Batsman</span>
                  <span>{roster.length} saved</span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {roster.map((player) => {
                    const isSelected = player.id === activeId;
                    return (
                      <div
                        key={player.id || player.batsmanName}
                        className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 text-white font-bold'
                            : 'text-slate-300 hover:bg-[#1E293B]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPlayer(player.id || '');
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 flex-1 text-left cursor-pointer truncate"
                        >
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? 'bg-indigo-400' : 'bg-slate-500'
                            }`}
                          />
                          <span className="truncate">{player.batsmanName || 'Unnamed'}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (Avg ~{player.overallComfortScore}%)
                          </span>
                        </button>

                        {roster.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Delete ${player.batsmanName || 'this batsman'} from roster?`
                                )
                              ) {
                                onDeletePlayer(player.id || '');
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors ml-2 cursor-pointer"
                            title={`Delete ${player.batsmanName} from saved roster`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-white/10 bg-[#0A0F1E]/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewBatsmanModal();
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + Add New Batsman
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: The Two Primary Action Buttons Requested by User */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        {/* Save Existing / Active Player Button */}
        <button
          type="button"
          onClick={onSaveCurrentPlayer}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95"
          title={`Save all current stats and edits for "${currentReport.batsmanName || 'Current Player'}" into roster`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-100" />
              <span>Save Player</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-emerald-100" />
              <span>Save Player *</span>
            </>
          )}
        </button>

        {/* Add New Batsman Button */}
        <button
          type="button"
          onClick={onOpenNewBatsmanModal}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 border border-white/20 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          title="Create a new batsman profile and save the currently active player"
        >
          <UserPlus className="w-3.5 h-3.5 text-indigo-100" />
          <span>+ Add New Batsman</span>
        </button>
      </div>
    </div>
  );
};
