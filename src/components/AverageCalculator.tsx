import React, { useState, useEffect } from 'react';
import { BatsmanComfortReport, BowlingMatchupData, DismissalCountData } from '../types';
import { EMPTY_BATSMAN_TEMPLATE } from '../data/cricketPresets';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  Check,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  Trash2,
  Save,
  UserPlus,
} from 'lucide-react';

interface AverageCalculatorProps {
  currentReport: BatsmanComfortReport;
  onApplyCalculations: (newReport: BatsmanComfortReport) => void;
  onOpenGlossary?: (code: string) => void;
  onSavePlayer?: (report: BatsmanComfortReport) => void;
  onAddNewBatsman?: () => void;
}

interface DisciplineInputRow {
  code: string;
  fullName: string;
  category: 'Pace' | 'Spin';
  runs: number;
  dismissals: number;
  ballsFaced: number;
}

const DEFAULT_DISCIPLINES: DisciplineInputRow[] = [
  { code: 'RAFM', fullName: 'Right Arm Fast Medium', category: 'Pace', runs: 255, dismissals: 5, ballsFaced: 385 },
  { code: 'RALS', fullName: 'Right Arm Leg Spin', category: 'Spin', runs: 26, dismissals: 1, ballsFaced: 112 },
  { code: 'RAOS', fullName: 'Right Arm Off Spin', category: 'Spin', runs: 46, dismissals: 1, ballsFaced: 245 },
  { code: 'LAFM', fullName: 'Left Arm Fast Medium', category: 'Pace', runs: 14, dismissals: 2, ballsFaced: 42 },
  { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', category: 'Spin', runs: 94, dismissals: 2, ballsFaced: 260 },
];

export const AverageCalculator: React.FC<AverageCalculatorProps> = ({
  currentReport,
  onApplyCalculations,
  onOpenGlossary,
  onSavePlayer,
  onAddNewBatsman,
}) => {
  const [calcMode, setCalcMode] = useState<'matchups' | 'innings'>('matchups');
  const [batsmanName, setBatsmanName] = useState<string>(currentReport.batsmanName);
  const [comfortTitle, setComfortTitle] = useState<string>(currentReport.comfortTitle || 'Comfort Level');
  const [showAppliedToast, setShowAppliedToast] = useState<boolean>(false);

  // Matchup discipline inputs
  const [disciplines, setDisciplines] = useState<DisciplineInputRow[]>(() => {
    return currentReport.bowlingCategories.map((cat) => {
      const dismissals = cat.dismissals !== undefined ? cat.dismissals : 2;
      const runs = cat.runs !== undefined ? cat.runs : Math.round(cat.average * dismissals);
      const ballsFaced = cat.ballsFaced !== undefined ? cat.ballsFaced : Math.round(runs * 0.85);
      const isPace = cat.code.includes('FM') || cat.code.includes('M') || cat.code.includes('F');

      return {
        code: cat.code,
        fullName: cat.fullName,
        category: isPace ? 'Pace' : 'Spin',
        runs,
        dismissals,
        ballsFaced,
      };
    });
  });

  // Dismissals Breakdown Table (RAM, LAM, LAS, RLB, ROB)
  const [dismissalMatrix, setDismissalMatrix] = useState<DismissalCountData[]>(
    currentReport.dismissalsTable.length > 0
      ? currentReport.dismissalsTable
      : [
          { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
          { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 2 },
          { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 2 },
          { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 1 },
          { bowlerType: 'ROB', fullName: 'Right Off Break', count: 1 },
        ]
  );

  // Synchronize internal state whenever currentReport updates from parent
  useEffect(() => {
    setBatsmanName(currentReport.batsmanName);
    setComfortTitle(currentReport.comfortTitle || 'Comfort Level');
    setDisciplines(
      currentReport.bowlingCategories.map((cat) => {
        const dismissals = cat.dismissals !== undefined ? cat.dismissals : 0;
        const runs =
          cat.runs !== undefined
            ? cat.runs
            : Math.round(cat.average * (dismissals > 0 ? dismissals : 1));
        const ballsFaced =
          cat.ballsFaced !== undefined ? cat.ballsFaced : Math.round(runs * 0.85);
        const isPace = cat.code.includes('FM') || cat.code.includes('M') || cat.code.includes('F');

        return {
          code: cat.code,
          fullName: cat.fullName,
          category: isPace ? 'Pace' : 'Spin',
          runs,
          dismissals,
          ballsFaced,
        };
      })
    );
    if (currentReport.dismissalsTable && currentReport.dismissalsTable.length > 0) {
      setDismissalMatrix(currentReport.dismissalsTable);
    }
  }, [currentReport]);

  // Inning log mode state
  const [inningScoresText, setInningScoresText] = useState<string>('51, 26, 46, 7, 47, 68*, 34');
  const [targetDisciplineForInnings, setTargetDisciplineForInnings] = useState<string>('RAFM');

  // Helper to calculate average
  const computeAverage = (runs: number, outs: number): number => {
    if (outs <= 0) return runs > 0 ? runs : 0;
    return parseFloat((runs / outs).toFixed(1));
  };

  // Helper to calculate strike rate
  const computeStrikeRate = (runs: number, balls: number): number => {
    if (balls <= 0) return 0;
    return parseFloat(((runs / balls) * 100).toFixed(1));
  };

  const getComfortAssessment = (avg: number): 'Dominant' | 'Comfortable' | 'Moderate' | 'Vulnerable' => {
    if (avg >= 45) return 'Dominant';
    if (avg >= 30) return 'Comfortable';
    if (avg >= 20) return 'Moderate';
    return 'Vulnerable';
  };

  const handleDisciplineChange = (
    index: number,
    field: 'runs' | 'dismissals' | 'ballsFaced',
    val: number
  ) => {
    const updated = [...disciplines];
    const safeVal = isNaN(val) || val < 0 ? 0 : val;
    updated[index] = { ...updated[index], [field]: safeVal };
    setDisciplines(updated);

    // Synchronize corresponding dismissal matrix type automatically if outs changed
    if (field === 'dismissals') {
      const code = updated[index].code;
      const matrixMap: Record<string, string> = {
        RAFM: 'RAM',
        LAFM: 'LAM',
        LAOD: 'LAS',
        RALS: 'RLB',
        RAOS: 'ROB',
      };
      const matrixCode = matrixMap[code];
      if (matrixCode) {
        setDismissalMatrix((prev) =>
          prev.map((item) =>
            item.bowlerType === matrixCode ? { ...item, count: safeVal } : item
          )
        );
      }
    }
  };

  const handleDismissalCountChange = (index: number, val: number) => {
    const safeVal = isNaN(val) || val < 0 ? 0 : val;
    setDismissalMatrix((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], count: safeVal };
      return copy;
    });
  };

  // Parse Inning Scores Text
  const parseInnings = () => {
    const tokens = inningScoresText
      .split(/[, ]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let totalRuns = 0;
    let totalOuts = 0;
    let totalNotOuts = 0;
    let scoresList: number[] = [];

    tokens.forEach((token) => {
      const isNotOut = token.includes('*');
      const num = parseInt(token.replace('*', ''), 10);
      if (!isNaN(num)) {
        totalRuns += num;
        scoresList.push(num);
        if (isNotOut) {
          totalNotOuts++;
        } else {
          totalOuts++;
        }
      }
    });

    const calculatedAvg = totalOuts > 0 ? parseFloat((totalRuns / totalOuts).toFixed(1)) : totalRuns;
    return {
      totalRuns,
      totalOuts,
      totalNotOuts,
      totalInnings: scoresList.length,
      calculatedAvg,
      highestScore: scoresList.length > 0 ? Math.max(...scoresList) : 0,
    };
  };

  const inningStats = parseInnings();

  const handleApplyInningToDiscipline = () => {
    setDisciplines((prev) =>
      prev.map((d) =>
        d.code === targetDisciplineForInnings
          ? {
              ...d,
              runs: inningStats.totalRuns,
              dismissals: Math.max(1, inningStats.totalOuts),
              ballsFaced: Math.round(inningStats.totalRuns * 0.9),
            }
          : d
      )
    );
  };

  // Build the complete BatsmanComfortReport from current calculator state
  const buildCurrentReport = (): BatsmanComfortReport => {
    const bowlingCategories: BowlingMatchupData[] = disciplines.map((d) => {
      const avg = computeAverage(d.runs, d.dismissals);
      const sr = computeStrikeRate(d.runs, d.ballsFaced);
      const assessment = getComfortAssessment(avg);

      let description = '';
      if (assessment === 'Dominant') {
        description = `Reads seam and spin release cleanly; dominant average of ${avg} with boundary execution.`;
      } else if (assessment === 'Comfortable') {
        description = `Consistent scoring rate (${sr} SR) with steady rotation and minimal risk taken.`;
      } else if (assessment === 'Moderate') {
        description = `Cautious approach; struggles slightly with variations but rotates strike periodically.`;
      } else {
        description = `Critical technical challenge against this angle/turn; vulnerable to early dismissals.`;
      }

      return {
        code: d.code,
        fullName: d.fullName,
        average: avg,
        comfortAssessment: assessment,
        runs: d.runs,
        dismissals: d.dismissals,
        ballsFaced: d.ballsFaced,
        strikeRate: sr,
        description,
      };
    });

    // Find highest and lowest for narrative updates
    const sorted = [...bowlingCategories].sort((a, b) => b.average - a.average);
    const dominant = sorted[0];
    const vulnerable = sorted[sorted.length - 1];

    // Compute Overall Score (0-100) based on weighted averages
    const totalAvg = bowlingCategories.reduce((acc, curr) => acc + curr.average, 0);
    const overallScore = Math.min(
      98,
      Math.max(25, Math.round((totalAvg / (bowlingCategories.length * 50)) * 75 + 15))
    );

    return {
      id: currentReport.id || `batsman-${Date.now()}`,
      batsmanName: batsmanName.trim() || 'BATSMAN',
      comfortTitle: comfortTitle.trim() || 'Comfort Level',
      bowlingCategories,
      dismissalsTable: dismissalMatrix,
      overallComfortScore: overallScore,
      dominantBowlingType: `${dominant.code} (${dominant.fullName})`,
      mostVulnerableBowlingType: `${vulnerable.code} (${vulnerable.fullName})`,
      comfortSummary: `${batsmanName.trim() || 'Batsman'} averages ${dominant.average.toFixed(
        1
      )} against ${dominant.fullName} as their primary scoring area, but shows vulnerability against ${
        vulnerable.fullName
      } with a lower average of ${vulnerable.average.toFixed(1)} across ${vulnerable.dismissals} dismissals.`,
      technicalInsights: [
        `Optimal bat flow and timing against ${dominant.code} with high scoring efficiency.`,
        `Footwork caution needed when facing ${vulnerable.code}; balance issues on the front foot.`,
        `Calculated average distribution shows clear matchup preference across pace and spin.`,
        `Maintains a composite strike rate with ${bowlingCategories.reduce((acc, c) => acc + (c.runs || 0), 0)} aggregate runs tracked.`,
      ],
      tacticalPlanAgainstBatsman: [
        `Target the batsman early with ${vulnerable.code} to exploit the lower ${vulnerable.average.toFixed(1)} comfort threshold.`,
        `Set attacking catching cordons (slips/gully/short leg) specifically during ${vulnerable.code} spells.`,
        `Restrict easy boundary options against ${dominant.code} by bowling disciplined defensive lines.`,
      ],
      batsmanCounterStrategy: [
        `Take calculated risks against ${dominant.code} to offset containment pressure.`,
        `Play late with soft hands when negotiating ${vulnerable.code} deliveries.`,
        `Rotate strike into gaps to avoid getting pinned down by high-probability dismissal lines.`,
      ],
      detectedFromImage: false,
      createdAt: currentReport.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
  };

  const handleApplyCalculations = () => {
    const newReport = buildCurrentReport();
    onApplyCalculations(newReport);
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 3500);
  };

  const handleSavePlayer = () => {
    const newReport = buildCurrentReport();
    onApplyCalculations(newReport);
    if (onSavePlayer) {
      onSavePlayer(newReport);
    }
  };

  // Reset to default sample
  const handleResetToDefault = () => {
    setDisciplines(DEFAULT_DISCIPLINES);
    setDismissalMatrix([
      { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
      { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 2 },
      { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 2 },
      { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 1 },
      { bowlerType: 'ROB', fullName: 'Right Off Break', count: 1 },
    ]);
    setBatsmanName('SHAHBAZ');
    setComfortTitle('Comfort Level');
  };

  // Delete preloaded data and clear all fields
  const handleDeletePreloadedData = () => {
    setBatsmanName('');
    setComfortTitle('Comfort Level');
    setInningScoresText('');
    const emptyDisciplines = disciplines.map((d) => ({
      ...d,
      runs: 0,
      dismissals: 0,
      ballsFaced: 0,
    }));
    setDisciplines(emptyDisciplines);
    const emptyMatrix = dismissalMatrix.map((item) => ({
      ...item,
      count: 0,
    }));
    setDismissalMatrix(emptyMatrix);
    onApplyCalculations(EMPTY_BATSMAN_TEMPLATE);
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 3500);
  };

  // Quick Preset Scenarios
  const handleLoadScenario = (scenario: 'pace_crusher' | 'spin_specialist' | 'zero') => {
    if (scenario === 'zero') {
      setDisciplines((prev) => prev.map((d) => ({ ...d, runs: 0, dismissals: 0, ballsFaced: 0 })));
      setDismissalMatrix((prev) => prev.map((d) => ({ ...d, count: 0 })));
    } else if (scenario === 'pace_crusher') {
      setDisciplines([
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', category: 'Pace', runs: 320, dismissals: 4, ballsFaced: 240 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', category: 'Spin', runs: 65, dismissals: 3, ballsFaced: 70 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', category: 'Spin', runs: 85, dismissals: 3, ballsFaced: 80 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', category: 'Pace', runs: 210, dismissals: 3, ballsFaced: 160 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', category: 'Spin', runs: 55, dismissals: 3, ballsFaced: 65 },
      ]);
      setDismissalMatrix([
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 4 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 3 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 3 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 3 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 3 },
      ]);
    } else if (scenario === 'spin_specialist') {
      setDisciplines([
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', category: 'Pace', runs: 90, dismissals: 4, ballsFaced: 95 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', category: 'Spin', runs: 280, dismissals: 4, ballsFaced: 220 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', category: 'Spin', runs: 265, dismissals: 3, ballsFaced: 210 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', category: 'Pace', runs: 45, dismissals: 3, ballsFaced: 50 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', category: 'Spin', runs: 310, dismissals: 5, ballsFaced: 250 },
      ]);
      setDismissalMatrix([
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 4 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 3 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 5 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 4 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 3 },
      ]);
    }
  };

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-white/10 shadow-lg p-6 sm:p-7 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
            <Calculator className="w-5 h-5 text-indigo-400" />
            Batting Average &amp; Stats Calculator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate batsman averages against bowling styles and push directly into graphs
          </p>
        </div>

        {/* Calculation Mode Toggle */}
        <div className="flex items-center bg-[#0A0F1E] p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCalcMode('matchups')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calcMode === 'matchups'
                ? 'bg-[#1E293B] text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matchup Rows
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('innings')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calcMode === 'innings'
                ? 'bg-[#1E293B] text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inning Score Log
          </button>
        </div>
      </div>

      {/* Batsman Name & Graph Title inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Batsman Name
          </label>
          <input
            type="text"
            value={batsmanName}
            onChange={(e) => setBatsmanName(e.target.value)}
            placeholder="e.g. SHAHBAZ"
            className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#0A0F1E] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-semibold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Graph Subtitle
          </label>
          <input
            type="text"
            value={comfortTitle}
            onChange={(e) => setComfortTitle(e.target.value)}
            placeholder="e.g. Comfort Level"
            className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#0A0F1E] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Mode 1: Matchup Rows Calculator */}
      {calcMode === 'matchups' && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Runs ÷ Outs Calculation Matrix
            </span>
            <span className="text-[11px] text-slate-400">Formula: Avg = Runs / Outs</span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar mb-4">
            {disciplines.map((item, idx) => {
              const avg = computeAverage(item.runs, item.dismissals);
              const sr = computeStrikeRate(item.runs, item.ballsFaced);
              const assessment = getComfortAssessment(avg);

              return (
                <div
                  key={item.code}
                  className="p-3 bg-[#0A0F1E] rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenGlossary?.(item.code)}
                        className="font-bold text-xs text-white hover:text-indigo-400 transition-colors font-['Space_Grotesk'] underline decoration-dotted cursor-pointer"
                        title="Click to view definition in glossary"
                      >
                        {item.code}
                      </button>
                      <span className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[190px]">
                        {item.fullName}
                      </span>
                    </div>

                    {/* Comfort assessment badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          assessment === 'Dominant'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : assessment === 'Comfortable'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : assessment === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {assessment}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-300">
                          {avg.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">avg</span>
                      </div>
                    </div>
                  </div>

                  {/* Input row: Runs, Outs, Balls */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">Runs Scored</span>
                      <input
                        type="number"
                        min="0"
                        value={item.runs}
                        onChange={(e) =>
                          handleDisciplineChange(idx, 'runs', parseInt(e.target.value, 10))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#131D33] border border-slate-700 rounded-lg text-white font-semibold text-center focus:ring-1 focus:ring-indigo-500"
                        placeholder="Runs"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">Dismissals (Outs)</span>
                      <input
                        type="number"
                        min="0"
                        value={item.dismissals}
                        onChange={(e) =>
                          handleDisciplineChange(idx, 'dismissals', parseInt(e.target.value, 10))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#131D33] border border-slate-700 rounded-lg text-white font-semibold text-center focus:ring-1 focus:ring-indigo-500"
                        placeholder="Outs"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">Balls Faced</span>
                      <input
                        type="number"
                        min="0"
                        value={item.ballsFaced}
                        onChange={(e) =>
                          handleDisciplineChange(idx, 'ballsFaced', parseInt(e.target.value, 10))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#131D33] border border-slate-700 rounded-lg text-slate-300 text-center focus:ring-1 focus:ring-indigo-500"
                        placeholder="Balls"
                      />
                    </div>
                  </div>

                  {item.ballsFaced > 0 && (
                    <div className="mt-1.5 text-right text-[10px] text-slate-400">
                      Strike Rate: <span className="font-semibold text-slate-200">{sr}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Inning Scores Log */}
      {calcMode === 'innings' && (
        <div className="flex-1 flex flex-col mb-4">
          <div className="p-3.5 bg-[#0A0F1E] rounded-xl border border-white/10 mb-3 text-xs">
            <span className="font-bold text-white block mb-1">
              Enter Inning Scores (Comma Separated)
            </span>
            <p className="text-slate-400 text-[11px] mb-2">
              Tip: Append an asterisk (e.g. <strong className="text-indigo-300">68*</strong>) for
              Not-Out innings so they add to runs without incrementing dismissals!
            </p>
            <textarea
              value={inningScoresText}
              onChange={(e) => setInningScoresText(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-[#131D33] border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. 45, 12, 68*, 0, 34"
            />
          </div>

          {/* Real-time calculated results card */}
          <div className="p-4 bg-[#131D33] rounded-xl border border-indigo-500/20 text-xs mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Computed Inning Aggregates
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                Avg: {inningStats.calculatedAvg}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[11px] py-1 border-y border-white/10 my-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Runs</span>
                <strong className="text-white text-sm">{inningStats.totalRuns}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Innings</span>
                <strong className="text-white text-sm">{inningStats.totalInnings}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Outs</span>
                <strong className="text-white text-sm">{inningStats.totalOuts}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Not Outs</span>
                <strong className="text-emerald-400 text-sm">{inningStats.totalNotOuts}</strong>
              </div>
            </div>

            {/* Quick assign to bowling type */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2">
              <span className="text-slate-300 text-xs">Assign this score to:</span>
              <div className="flex items-center gap-2">
                <select
                  value={targetDisciplineForInnings}
                  onChange={(e) => setTargetDisciplineForInnings(e.target.value)}
                  className="bg-[#0A0F1E] border border-slate-700 text-white text-xs rounded-lg px-2 py-1"
                >
                  {disciplines.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code} ({d.fullName})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleApplyInningToDiscipline}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dismissals Matrix Mini-Editor */}
      <div className="p-3 bg-[#0A0F1E]/80 rounded-xl border border-white/10 mb-4 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-indigo-400" />
            Dismissals by Bowler Category (RAM, LAM, LAS, RLB, ROB)
          </span>
          <span className="text-[10px] text-slate-500">
            Total: {dismissalMatrix.reduce((acc, c) => acc + c.count, 0)} outs
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {dismissalMatrix.map((item, idx) => (
            <div key={item.bowlerType} className="text-center bg-[#131D33] p-1.5 rounded-lg border border-white/5">
              <span className="block text-[10px] font-bold text-indigo-300">{item.bowlerType}</span>
              <input
                type="number"
                min="0"
                value={item.count}
                onChange={(e) => handleDismissalCountChange(idx, parseInt(e.target.value, 10))}
                className="w-full text-center text-xs py-1 bg-[#0A0F1E] border border-slate-700 rounded font-bold text-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Toast notification when applied */}
      {showAppliedToast && (
        <div className="mb-3 p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Updated batsman graphs, averages, and dismissal stats!</span>
          </div>
        </div>
      )}

      {/* Primary Action Button: Calculate & Enter into Graphs */}
      <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleApplyCalculations}
            className="flex-1 py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99] whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Calculate &amp; Enter Into Graphs</span>
          </button>

          {onSavePlayer && (
            <button
              type="button"
              onClick={handleSavePlayer}
              className="py-2.5 sm:py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 whitespace-nowrap"
              title="Save this player's data into roster"
            >
              <Save className="w-4 h-4 text-emerald-200" />
              <span>Save Player</span>
            </button>
          )}

          {onAddNewBatsman && (
            <button
              type="button"
              onClick={onAddNewBatsman}
              className="py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm bg-[#1E293B] hover:bg-[#28354D] border border-white/15 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 whitespace-nowrap"
              title="Add a new batsman profile"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">+ New Batsman</span>
              <span className="sm:hidden">+ New</span>
            </button>
          )}
        </div>

        {/* Preset & Reset Shortcuts */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500">Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadScenario('pace_crusher')}
              className="px-2 py-0.5 text-[11px] bg-[#1E293B] hover:bg-[#28354D] text-slate-300 rounded-md border border-white/10 transition-colors cursor-pointer"
            >
              Pace Crusher
            </button>
            <button
              type="button"
              onClick={() => handleLoadScenario('spin_specialist')}
              className="px-2 py-0.5 text-[11px] bg-[#1E293B] hover:bg-[#28354D] text-slate-300 rounded-md border border-white/10 transition-colors cursor-pointer"
            >
              Spin Master
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDeletePreloadedData}
              className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Delete all preloaded stats and clear fields to start fresh"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              Delete Preloaded Data
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reload default Shahbaz sample profile"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
