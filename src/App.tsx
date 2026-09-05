import React, { useState } from 'react';
import { REFERENCE_SHAHBAZ, EMPTY_BATSMAN_TEMPLATE } from './data/cricketPresets';
import { BatsmanComfortReport } from './types';
import { ComfortLevelChart } from './components/ComfortLevelChart';
import { AverageCalculator } from './components/AverageCalculator';
import { MetricsCards } from './components/MetricsCards';
import { TechnicalTacticsPanel } from './components/TechnicalTacticsPanel';
import { DataEditorModal } from './components/DataEditorModal';
import { GlossaryModal } from './components/GlossaryModal';
import { exportReportToPdf } from './utils/pdfExport';
import {
  Activity,
  BarChart3,
  BookOpen,
  Eye,
  Sliders,
  Sparkles,
  Share2,
  Check,
  FileDown,
  Loader2,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<BatsmanComfortReport>(REFERENCE_SHAHBAZ);
  const [chartMode, setChartMode] = useState<'authentic' | 'interactive'>('authentic');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [selectedGlossaryCode, setSelectedGlossaryCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  const handleOpenGlossaryForCode = (code: string) => {
    setSelectedGlossaryCode(code);
    setIsGlossaryOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Export ONLY the Graph Section to PDF
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const success = await exportReportToPdf('comfort-level-chart-container', report, {
        theme: 'dark',
      });
      if (success) {
        setPdfToast(`Saved ${(report.batsmanName || 'Batsman').replace(/[^a-zA-Z0-9_-]/g, '_')}_Comfort_Level_Graph.pdf`);
      } else {
        setPdfToast('Print dialog opened for Graph PDF creation');
      }
      setTimeout(() => setPdfToast(null), 4000);
    } catch (error) {
      console.error('PDF export error:', error);
      setPdfToast('Graph export completed via print dialog');
      setTimeout(() => setPdfToast(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleResetToDefault = () => {
    setReport(REFERENCE_SHAHBAZ);
    setPdfToast('Reloaded Shahbaz reference sample.');
    setTimeout(() => setPdfToast(null), 3000);
  };

  const handleDeletePreloadedData = () => {
    setReport(EMPTY_BATSMAN_TEMPLATE);
    setPdfToast('Preloaded data deleted. All graphs & fields cleared.');
    setTimeout(() => setPdfToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navigation */}
      <header className="bg-[#0F172A]/85 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 shadow-md shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/10">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] leading-tight tracking-wide">
                Cricket Batsman Comfort Level
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Bowling Matchup &amp; Average Calculation Suite
              </p>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#0A0F1E] p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartMode('authentic')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === 'authentic'
                    ? 'bg-[#1E293B] text-white shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Exact visual reproduction matching standard cricket broadcast graphics"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Reference Card</span>
                <span className="sm:hidden">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setChartMode('interactive')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === 'interactive'
                    ? 'bg-[#1E293B] text-white shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Interactive drill-down graph"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Interactive View</span>
                <span className="sm:hidden">Interactive</span>
              </button>
            </div>

            {/* Export Graph Section Only (PDF) */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 border border-white/15 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50"
              title="Export only the Graph Section to PDF"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-indigo-200" />
                  <span className="hidden sm:inline">Export Graph (PDF)</span>
                  <span className="sm:hidden">Graph PDF</span>
                </>
              )}
            </button>

            {/* Delete Preloaded Data Quick Button */}
            <button
              type="button"
              onClick={handleDeletePreloadedData}
              className="p-2 text-rose-400 hover:text-rose-200 bg-[#0A0F1E] hover:bg-rose-950/40 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
              title="Delete preloaded data (clear all fields & graphs)"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Glossary Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedGlossaryCode(null);
                setIsGlossaryOpen(true);
              }}
              className="p-2 text-slate-400 hover:text-white bg-[#0A0F1E] hover:bg-[#1E293B] border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Cricket Bowling Acronyms Glossary (RAFM, RALS, LAFM, etc.)"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Manual Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-[#0A0F1E] hover:bg-[#1E293B] border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Edit Values & Stats Manually"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Share / Copy Button */}
            <button
              type="button"
              onClick={handleShare}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#1E293B] border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="flex flex-col gap-6">
          {/* Top Banner with Batsman Profile Context */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#111C38] via-[#162248] to-[#111C38] border border-white/10 text-white shadow-lg shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Batsman Matchup Profiling &amp; Analytics
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                {report.batsmanName || 'ENTER BATSMAN NAME'} — {report.comfortTitle || 'Comfort Level'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Calculated batting average across Right-Arm &amp; Left-Arm pace and spin variations,
                complete with dismissal distribution and tactical plans.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end flex-wrap">
              {/* Option to Delete Preloaded Data */}
              <button
                type="button"
                onClick={handleDeletePreloadedData}
                className="px-3.5 py-2 text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/40 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                title="Delete preloaded data and start with clean inputs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Delete Preloaded Data
              </button>

              {/* Option to Reload Reference Sample */}
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 hover:border-white/25 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                title="Reload default Shahbaz sample profile"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Reload Sample
              </button>

              {/* Export only Graph Section to PDF */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-white/20 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
                title="Export only the Graph Section to PDF"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    Export Graph (PDF)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1. Key Performance Metric Cards */}
          <MetricsCards report={report} onSelectCategory={handleOpenGlossaryForCode} />

          {/* 2. Main Center Grid: Chart on Left, Average Calculator on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: The Comfort Level Graph Card (Target for Export) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <ComfortLevelChart
                report={report}
                mode={chartMode}
                onBowlingTypeClick={handleOpenGlossaryForCode}
                onEditClick={() => setIsEditorOpen(true)}
                onExportPdf={handleExportPdf}
                isExportingPdf={isExportingPdf}
              />

              {/* Quick bowling acronym definitions pill */}
              <div className="bg-[#0F172A] rounded-xl border border-white/10 p-4 text-xs text-slate-400 flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-semibold text-slate-200">Need bowling code definitions?</span>{' '}
                  Click on any code (RAFM, RALS, LAFM, etc.) or open the glossary.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGlossaryCode(null);
                    setIsGlossaryOpen(true);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline shrink-0 ml-2 cursor-pointer transition-colors"
                >
                  View Glossary
                </button>
              </div>
            </div>

            {/* Right: The Batting Average & Stats Calculator */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <AverageCalculator
                currentReport={report}
                onApplyCalculations={(newReport) => setReport(newReport)}
                onOpenGlossary={handleOpenGlossaryForCode}
              />
            </div>
          </div>

          {/* 3. Technical Tactics & Performance Blueprint */}
          <TechnicalTacticsPanel report={report} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0F1E] border-t border-white/10 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Cricket Batsman Comfort Level Analyzer — Average Calculation, Graph Visualization &amp; PDF Reporting
          </p>
          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
            <button
              type="button"
              onClick={handleExportPdf}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors flex items-center gap-1 font-semibold"
            >
              <FileDown className="w-3 h-3" />
              Download Graph (PDF)
            </button>
            <button
              type="button"
              onClick={handleDeletePreloadedData}
              className="text-rose-400 hover:text-rose-300 cursor-pointer transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete Preloaded Data
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGlossaryCode(null);
                setIsGlossaryOpen(true);
              }}
              className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              Bowling Acronyms
            </button>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              Edit Stats
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {pdfToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#0F172A] border border-indigo-500/40 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-white block">Status Notification</span>
            <span className="text-xs text-slate-300">{pdfToast}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <DataEditorModal
        report={report}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(updated) => setReport(updated)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        selectedCode={selectedGlossaryCode}
      />
    </div>
  );
}
