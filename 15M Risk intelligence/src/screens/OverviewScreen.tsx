import React, { useState } from 'react';
import { Timeframe, SupplierItem, PriorityAction, RadarDomain, RiskAnchor } from '../types';
import { AIAnalystAction, authorizeMitigationAction } from '../services/aiAnalystService';
import { AiRiskBriefingPanel } from '../components/ai/AiRiskBriefingPanel';
import { useRealtimeDashboard } from '../hooks/useRealtimeDashboard';

interface OverviewScreenProps {
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  onOpenCalibrateWeights: () => void;
  onOpenRecordRisk: () => void;
  onOpenExportBriefing: () => void;
  suppliers: SupplierItem[];
  actions: PriorityAction[];
  radarDomains: RadarDomain[];
  riskAnchors: RiskAnchor[];
  onExecuteAction: (action: PriorityAction) => void;
  onInspectAction: (action: PriorityAction) => void;
  onInspectSupplier: (supplier: SupplierItem) => void;
  onInspectRiskAnchor: (anchor: RiskAnchor) => void;
  onNavigateToRiskMap: () => void;
  onNavigateToSuppliers: () => void;
  onTriggerAI?: (action: AIAnalystAction, prompt?: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  timeframe,
  setTimeframe,
  onOpenCalibrateWeights,
  onOpenRecordRisk,
  onOpenExportBriefing,
  suppliers,
  actions,
  radarDomains,
  riskAnchors,
  onExecuteAction,
  onInspectAction,
  onInspectSupplier,
  onInspectRiskAnchor,
  onNavigateToRiskMap,
  onNavigateToSuppliers,
  onTriggerAI,
}) => {
  const [matrixFilter, setMatrixFilter] = useState<'All Levels' | 'Framework' | 'Categories' | 'Suppliers' | 'Processes'>('All Levels');
  const [selectedCell, setSelectedCell] = useState<{ l: number; s: number } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');

  // Live Real-Time Dashboard Hook (SSE with 15s polling fallback)
  const { 
    metrics, 
    loading: isMetricsLoading, 
    lastUpdatedText, 
    isLiveSSE, 
    connectionStatus, 
    refresh: refreshDashboard 
  } = useRealtimeDashboard();

  // Dynamic values adjusted slightly by timeframe or live backend data
  const isStress = timeframe === 'Stress Case (95% CI)';
  const isTTM = timeframe === 'TTM Projected';

  const criticalExposureCount = isStress ? 7 : isTTM ? 5 : (metrics?.severityBreakdown.critical ?? 4);
  const revenueAtRisk = isStress ? '€164.2M' : isTTM ? '€128.0M' : (metrics?.totalRevenueExposure ?? '€112.5M');
  const spendAtRisk = isStress ? '€62.4M' : isTTM ? '€54.1M' : (metrics?.totalSpendAtRisk ?? '€48.2M');
  const resilienceScore = isStress ? 52 : isTTM ? 60 : 64;
  const totalMonitoredRisks = metrics?.totalActiveRisks ?? 113;
  const highRisksCount = metrics?.severityBreakdown.high ?? 12;
  const medRisksCount = metrics?.severityBreakdown.medium ?? 29;
  const lowRisksCount = metrics?.severityBreakdown.low ?? 68;
  const overdueActions = metrics?.overdueActions ?? [];

  const topAnchor = riskAnchors[0] || {
    code: 'R-101',
    supplier: 'Nordvolt Cells AB',
    description: 'Export Quota Restrictions (€48.2M Revenue Line halted)'
  };

  // Filter table rows
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesCat = categoryFilter === 'all' || s.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = !tableSearch || s.name.toLowerCase().includes(tableSearch.toLowerCase()) || s.material.toLowerCase().includes(tableSearch.toLowerCase()) || s.category.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportCSV = () => {
    const csvContent = "Supplier,Location,Material,SKU,Category,BufferWeeks,GapWeeks,FinancialExposure,osapiensSignal\n" +
      filteredSuppliers.map(s => `"${s.name}","${s.location}","${s.material}","${s.materialSku}","${s.category}",${s.bufferWeeks},${s.gapWeeks},"${s.financialExposure}","${s.osapiensSignal.label}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Critical_Dependency_Watchlist_${timeframe.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      
      {/* System Status & Executive Header Strip */}
      <section className="px-4 sm:px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Real-time SSE / Polling indicator */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E0E7F1] shadow-[0_2px_8px_rgba(16,27,51,0.03)] text-[12px]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSSE ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveSSE ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
              }`}></span>
            </span>
            <span className="font-semibold text-[#101B33]">
              {isLiveSSE ? 'Real-Time Stream Active' : 'Polling Active (15s)'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-mono text-[11px]">{lastUpdatedText}</span>
            <button
              type="button"
              onClick={() => refreshDashboard()}
              className="ml-1 p-0.5 rounded text-slate-400 hover:text-[#176BCE] transition-colors"
              title="Force Refresh Data"
            >
              <span className={`material-symbols-outlined text-[14px] ${isMetricsLoading ? 'animate-spin' : ''}`}>sync</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 text-[12px] font-medium bg-white px-3 py-1.5 rounded-lg border border-[#E0E7F1]">
            <span className="material-symbols-outlined text-[16px] text-[#19B6A4]">database</span>
            <span>Enterprise 15M DB Grounded</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-600 text-[12px] font-medium bg-white px-3 py-1.5 rounded-lg border border-[#E0E7F1]">
            <span className="material-symbols-outlined text-[16px] text-[#176BCE]">verified_user</span>
            <span>9 Official Tier-1 Categories</span>
          </div>
        </div>

        {/* Timeframe & Sensitivity Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-lg bg-white border border-[#DCE6EE] shadow-xs text-[12px]">
            <button
              type="button"
              onClick={() => setTimeframe('Q3 2024')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                timeframe === 'Q3 2024'
                  ? 'bg-[#0084A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A192A]'
              }`}
            >
              Q3 2024
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('TTM Projected')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                timeframe === 'TTM Projected'
                  ? 'bg-[#0084A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A192A]'
              }`}
            >
              TTM Projected
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('Stress Case (95% CI)')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                timeframe === 'Stress Case (95% CI)'
                  ? 'bg-[#0084A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A192A]'
              }`}
            >
              Stress Case (95% CI)
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenCalibrateWeights}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-[#DCE6EE] hover:bg-[#F4F8FA] text-slate-700 text-[12px] font-medium transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0084A8]">tune</span>
            <span>Calibrate Weights</span>
          </button>
        </div>
      </section>

      {/* Section 0: AI Risk Briefing Panel */}
      {onTriggerAI && (
        <section className="px-4 sm:px-6 pt-2 pb-1">
          <AiRiskBriefingPanel
            riskAnchors={riskAnchors}
            actions={actions}
            suppliers={suppliers}
            onTriggerAI={onTriggerAI}
          />
        </section>
      )}

      {/* Section 1: Executive KPI Strip */}
      <section className="px-4 sm:px-6 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Metric 1: Critical Risks */}
          <div className="group relative bg-white rounded-xl p-4 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] hover:border-[#EF4444]/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Critical Exposure</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping"></span>
                2 OSAPIENS
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-[#DC2626] tracking-tight leading-none font-mono">
                {criticalExposureCount}
              </span>
              <span className="text-[12px] text-slate-500 font-medium">of {totalMonitoredRisks} monitored</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-600">{highRisksCount} High · {medRisksCount} Med · {lowRisksCount} Low</span>
              <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-[#176BCE] transition-colors cursor-help">info</span>
            </div>
            {/* Tooltip */}
            <div className="absolute left-2 right-2 bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-[#101B33] text-white rounded-lg shadow-xl z-20 pointer-events-none text-[11px] leading-relaxed border border-[#1C2C4E]">
              <span className="font-semibold text-[#19B6A4] font-mono text-[9px] uppercase tracking-wider mb-1">Risk Definition</span>
              Risks with compound score ≥ 20 requiring executive board visibility within 24h. Includes active regulatory & raw material quota embargoes.
            </div>
          </div>

          {/* Metric 2: Financial Revenue at Risk */}
          <div className="group relative bg-white rounded-xl p-4 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] hover:border-[#176BCE]/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Revenue at Risk</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] text-[10px] font-bold">Stop-Ship Est.</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-[#101B33] tracking-tight leading-none font-mono">
                {revenueAtRisk}
              </span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Spend: <strong className="text-[#101B33] font-semibold">{spendAtRisk}</strong> · CM: <strong className="text-[#101B33] font-semibold">€24.8M</strong></span>
              <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-[#176BCE] transition-colors cursor-help">info</span>
            </div>
            {/* Tooltip */}
            <div className="absolute left-2 right-2 bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-[#101B33] text-white rounded-lg shadow-xl z-20 pointer-events-none text-[11px] leading-relaxed border border-[#1C2C4E]">
              <span className="font-semibold text-[#19B6A4] font-mono text-[9px] uppercase tracking-wider mb-1">Financial Impact Model</span>
              Direct gross revenue of bill-of-materials halted if supplier lead-time buffer reaches zero. Contribution Margin at risk is €24.8M.
            </div>
          </div>

          {/* Metric 3: Concentrated Tier 1 Base */}
          <div className="group relative bg-white rounded-xl p-4 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] hover:border-[#F59E0B]/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Concentration Index</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] text-[10px] font-bold">1.4% base</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-[#101B33] tracking-tight leading-none font-mono">6</span>
              <span className="text-[12px] text-slate-500 font-medium">High-Risk Suppliers</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Holds <strong className="text-[#DC2626] font-semibold">18.2%</strong> strategic spend</span>
              <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-[#176BCE] transition-colors cursor-help">info</span>
            </div>
            {/* Tooltip */}
            <div className="absolute left-2 right-2 bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-[#101B33] text-white rounded-lg shadow-xl z-20 pointer-events-none text-[11px] leading-relaxed border border-[#1C2C4E]">
              <span className="font-semibold text-[#19B6A4] font-mono text-[9px] uppercase tracking-wider mb-1">Supply Dependency</span>
              6 of 420 Tier-1 suppliers maintain single-source leverage on critical components with no immediate secondary vendor ready.
            </div>
          </div>

          {/* Metric 4: Single-Source Bottlenecks */}
          <div className="group relative bg-white rounded-xl p-4 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] hover:border-[#EF4444]/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Single-Source Moats</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] text-[10px] font-bold">&lt; 6w Buffer</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-[#DC2626] tracking-tight leading-none font-mono">14</span>
              <span className="text-[12px] text-slate-500 font-medium">Critical Materials</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>&gt; 26w requalification gap</span>
              <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-[#176BCE] transition-colors cursor-help">info</span>
            </div>
            {/* Tooltip */}
            <div className="absolute left-2 right-2 bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-[#101B33] text-white rounded-lg shadow-xl z-20 pointer-events-none text-[11px] leading-relaxed border border-[#1C2C4E]">
              <span className="font-semibold text-[#19B6A4] font-mono text-[9px] uppercase tracking-wider mb-1">Time-to-Survive (TTS)</span>
              Inventory runs dry within 42 days while alternate production line validation requires minimum 182 days.
            </div>
          </div>

          {/* Metric 5: Resilience Score & Readiness */}
          <div className="group relative bg-white rounded-xl p-4 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] hover:border-[#19B6A4]/40 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Resilience Index</span>
              <span className="inline-flex items-center gap-0.5 text-[#006B5F] bg-[#E6F8F5] border border-[#B4F0E6] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px] text-[#19B6A4]">trending_up</span>+4 QoQ
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-[#0084A8] tracking-tight leading-none font-mono">
                {resilienceScore}
              </span>
              <span className="text-[12px] text-slate-500 font-medium">/ 100</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Readiness: <strong className="text-[#0A192A] font-semibold">72/100</strong> · -14% Risk</span>
              <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-[#0084A8] transition-colors cursor-help">info</span>
            </div>
            {/* Tooltip */}
            <div className="absolute left-2 right-2 bottom-full mb-2 hidden group-hover:flex flex-col p-2.5 bg-[#0A192A] text-white rounded-lg shadow-xl z-20 pointer-events-none text-[11px] leading-relaxed border border-[#162842]">
              <span className="font-semibold text-[#19B6A4] font-mono text-[9px] uppercase tracking-wider mb-1">Enterprise Readiness</span>
              Dynamic multi-attribute model measuring inventory elasticity, dual-sourcing velocity, and emergency contingency protocols.
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Two-Column Primary Analytics Grid */}
      <section className="px-4 sm:px-6 py-2 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Interactive 5x5 Likelihood vs Impact Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-4 sm:p-5 border border-[#DCE6EE] shadow-[0_2px_12px_rgba(10,25,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#0A192A]">15M Risk Matrix</h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#E6F4F8] font-mono text-[10px] text-[#0084A8] font-bold border border-[#BDE2EC]">
                    5×5 EVALUATION
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Likelihood vs. Severity index with automated osapiens real-time incident mapping
                </p>
              </div>

              {/* Filter by 15M Dimension */}
              <div className="flex flex-wrap items-center gap-1 bg-[#F4F8FA] p-1 rounded-lg border border-[#DCE6EE]">
                {(['All Levels', 'Framework', 'Categories', 'Suppliers', 'Processes'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setMatrixFilter(filter)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                      matrixFilter === filter
                        ? 'bg-[#0084A8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0A192A] hover:bg-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 5x5 Grid Visualization */}
            <div className="mt-4 grid grid-cols-12 gap-2 items-center">
              {/* Y-Axis Label */}
              <div className="col-span-1 flex flex-col items-center justify-between h-72 py-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 [writing-mode:vertical-rl] rotate-180">
                  Likelihood (1–5)
                </span>
                <div className="flex flex-col justify-between h-full py-1 text-right font-mono text-[11px] text-slate-400 font-medium">
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
              </div>

              {/* Heatmap Canvas */}
              <div className="col-span-11 flex flex-col">
                <div className="grid grid-cols-5 gap-1.5 h-72">
                  
                  {/* Row 5 (Likelihood 5) */}
                  <div 
                    onClick={() => setSelectedCell({ l: 5, s: 1 })}
                    className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-lg flex items-center justify-center p-1 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <span className="font-mono text-[10px] text-amber-800 font-semibold">5</span>
                  </div>
                  <div 
                    onClick={() => setSelectedCell({ l: 5, s: 2 })}
                    className="bg-[#FED7AA]/60 border border-[#FDBA74] rounded-lg flex items-center justify-center p-1 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <span className="font-mono text-[10px] text-amber-900 font-semibold">10</span>
                  </div>
                  <div 
                    onClick={() => setSelectedCell({ l: 5, s: 3 })}
                    className="bg-[#FDBA74]/70 border border-[#FB923C] rounded-lg flex items-center justify-center p-1 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <span className="font-mono text-[10px] text-orange-950 font-semibold">15</span>
                  </div>
                  
                  {/* R-188 Sundara Rare Earth */}
                  <div
                    onClick={() => onInspectRiskAnchor(riskAnchors[1])}
                    className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-lg flex flex-col items-center justify-center p-1 shadow-sm ring-2 ring-[#EF4444]/40 relative group cursor-pointer transition-transform hover:scale-[1.03]"
                  >
                    <span className="px-1.5 py-0.5 bg-[#101B33] text-white rounded font-mono text-[9px] font-bold">
                      R-188
                    </span>
                    <span className="font-mono text-[9px] text-white font-medium truncate w-full text-center mt-0.5">
                      Sundara
                    </span>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#19B6A4] ring-2 ring-white"></span>
                  </div>

                  {/* R-101 Nordvolt Geopolitical */}
                  <div
                    onClick={() => onInspectRiskAnchor(riskAnchors[0])}
                    className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-lg flex flex-col items-center justify-center p-1 shadow-md ring-2 ring-[#EF4444] relative group cursor-pointer transition-transform hover:scale-[1.03]"
                  >
                    <span className="px-1.5 py-0.5 bg-[#101B33] text-[#19B6A4] rounded font-mono text-[9px] font-bold">
                      R-101
                    </span>
                    <span className="font-mono text-[9px] text-white font-bold truncate w-full text-center mt-0.5">
                      Nordvolt
                    </span>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white animate-ping"></span>
                  </div>

                  {/* Row 4 (Likelihood 4) */}
                  <div className="bg-[#D1FAE5]/60 border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-emerald-800 font-semibold">4</span>
                  </div>
                  <div className="bg-[#FEF3C7]/70 border border-[#FDE68A] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-amber-800 font-semibold">8</span>
                  </div>
                  <div className="bg-[#FED7AA]/70 border border-[#FDBA74] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-orange-900 font-semibold">12</span>
                  </div>

                  {/* R-104 Hexaprime cleanroom alert */}
                  <div
                    onClick={() => onInspectRiskAnchor(riskAnchors[2])}
                    className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-lg flex flex-col items-center justify-center p-1 shadow-sm ring-1 ring-[#EF4444] cursor-pointer hover:scale-[1.03] transition-transform"
                  >
                    <span className="px-1.5 py-0.5 bg-[#101B33] text-white rounded font-mono text-[9px] font-bold">
                      R-104
                    </span>
                    <span className="font-mono text-[9px] text-white font-medium truncate w-full text-center mt-0.5">
                      Hexaprime
                    </span>
                  </div>

                  {/* R-112 Castellan Polymer Insolvency */}
                  <div
                    onClick={() => onInspectRiskAnchor(riskAnchors[3])}
                    className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-lg flex flex-col items-center justify-center p-1 shadow-sm ring-1 ring-[#EF4444] cursor-pointer hover:scale-[1.03] transition-transform"
                  >
                    <span className="px-1.5 py-0.5 bg-[#101B33] text-white rounded font-mono text-[9px] font-bold">
                      R-112
                    </span>
                    <span className="font-mono text-[9px] text-white font-medium truncate w-full text-center mt-0.5">
                      Castellan
                    </span>
                  </div>

                  {/* Row 3 (Likelihood 3) */}
                  <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-emerald-800 font-semibold">3</span>
                  </div>
                  <div className="bg-[#D1FAE5]/70 border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-emerald-800 font-semibold">6</span>
                  </div>
                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#F59E0B] text-white rounded font-mono text-[9px] font-bold">
                      4 risks
                    </span>
                  </div>
                  <div className="bg-[#FED7AA] border border-[#FDBA74] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#F97316] text-white rounded font-mono text-[9px] font-bold">
                      3 risks
                    </span>
                  </div>
                  <div className="bg-[#FECDD3] border border-[#FDA4AF] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#EF4444] text-white rounded font-mono text-[9px] font-bold">
                      2 risks
                    </span>
                  </div>

                  {/* Row 2 (Likelihood 2) */}
                  <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg flex items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-emerald-800 font-medium">2</span>
                  </div>
                  <div className="bg-[#D1FAE5]/60 border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#10B981] text-white rounded font-mono text-[9px] font-medium">
                      14 risks
                    </span>
                  </div>
                  <div className="bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#059669] text-white rounded font-mono text-[9px] font-medium">
                      9 risks
                    </span>
                  </div>
                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#D97706] text-white rounded font-mono text-[9px] font-medium">
                      6 risks
                    </span>
                  </div>
                  <div className="bg-[#FED7AA] border border-[#FDBA74] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#EA580C] text-white rounded font-mono text-[9px] font-medium">
                      1 risk
                    </span>
                  </div>

                  {/* Row 1 (Likelihood 1) */}
                  <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#10B981] text-white rounded font-mono text-[9px] font-medium">
                      28 risks
                    </span>
                  </div>
                  <div className="bg-[#D1FAE5]/60 border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#059669] text-white rounded font-mono text-[9px] font-medium">
                      18 risks
                    </span>
                  </div>
                  <div className="bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#047857] text-white rounded font-mono text-[9px] font-medium">
                      7 risks
                    </span>
                  </div>
                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#D97706] text-white rounded font-mono text-[9px] font-medium">
                      3 risks
                    </span>
                  </div>
                  <div className="bg-[#FED7AA] border border-[#FDBA74] rounded-lg flex items-center justify-center p-1">
                    <span className="px-1.5 py-0.5 bg-[#C2410C] text-white rounded font-mono text-[9px] font-medium">
                      1 risk
                    </span>
                  </div>

                </div>

                {/* X-Axis Label */}
                <div className="grid grid-cols-5 text-center mt-2 font-mono text-[11px] text-slate-400">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                  Business Severity / Financial Impact (1–5)
                </div>
              </div>
            </div>
          </div>

          {/* Live Critical Callout Strip */}
          <div className="mt-4 pt-3 border-t border-[#E0E7F1] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#F8FAFD] p-2.5 rounded-lg border border-[#E2E8F0]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC2626] shrink-0">
                <span className="material-symbols-outlined text-[15px]">crisis_alert</span>
              </span>
              <div className="truncate text-[12px]">
                <span className="font-mono text-[10px] font-bold text-[#DC2626] uppercase">Top Critical Anchor:</span>
                <span className="font-bold text-[#101B33] ml-1">{topAnchor.code} {topAnchor.supplier}</span>
                <span className="text-slate-500"> · {topAnchor.description}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToRiskMap}
              className="inline-flex items-center gap-1 text-[#176BCE] hover:text-[#1357A6] text-[11px] font-bold shrink-0 transition-colors"
            >
              <span>Drilldown File</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* RIGHT: 15M Risk Radar Snapshot Across 9 Tier-1 Domains (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 sm:p-5 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#101B33]">15M Risk Radar</h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] font-mono text-[10px] font-bold">
                    9 DOMAINS
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Weighted composite risk posture across procurement dimensions
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500 bg-[#F5F8FC] border border-[#E0E7F1] px-2 py-1 rounded-md">
                Target: &lt; 35.0
              </span>
            </div>

            {/* SVG Radar Chart with Modern Precision Aesthetics */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center my-2">
              <svg aria-label="15M Radar Chart" className="w-full h-full max-h-64" viewBox="0 0 320 280">
                <defs>
                  <radialGradient cx="50%" cy="50%" id="radarGlow" r="50%">
                    <stop offset="0%" stopColor="#176BCE" stopOpacity="0.18"></stop>
                    <stop offset="100%" stopColor="#19B6A4" stopOpacity="0.02"></stop>
                  </radialGradient>
                </defs>
                {/* Concentric polygons */}
                <polygon
                  fill="none"
                  points="160,30 245,65 275,150 225,230 160,250 95,230 45,150 75,65"
                  stroke="#CBD5E1"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                ></polygon>
                <polygon
                  fill="none"
                  points="160,65 218,90 238,150 203,205 160,220 117,205 82,150 102,90"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                ></polygon>
                <polygon
                  fill="none"
                  points="160,105 190,120 200,150 180,180 160,190 140,180 120,150 130,120"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                ></polygon>

                {/* Axis lines */}
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="160" y1="150" y2="30"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="245" y1="150" y2="65"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="275" y1="150" y2="150"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="225" y1="150" y2="230"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="160" y1="150" y2="250"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="95" y1="150" y2="230"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="45" y1="150" y2="150"></line>
                <line stroke="#E2E8F0" strokeWidth="1" x1="160" x2="75" y1="150" y2="65"></line>

                {/* Benchmark Target Zone (Safe Threshold) */}
                <polygon
                  fill="#19B6A4"
                  fillOpacity="0.08"
                  points="160,105 190,120 200,150 180,180 160,190 140,180 120,150 130,120"
                  stroke="#19B6A4"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                ></polygon>

                {/* Actual Risk Perimeter (Shape) */}
                <polygon
                  fill="url(#radarGlow)"
                  points="160,42 238,78 268,150 190,210 160,205 105,215 50,150 82,75"
                  stroke="#176BCE"
                  strokeWidth="2.2"
                ></polygon>

                {/* Highlighted critical nodes */}
                <circle cx="160" cy="42" fill="#DC2626" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                <circle cx="268" cy="150" fill="#DC2626" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                <circle cx="50" cy="150" fill="#F59E0B" r="4" stroke="#FFFFFF" strokeWidth="1.5"></circle>
                <circle cx="238" cy="78" fill="#F59E0B" r="4" stroke="#FFFFFF" strokeWidth="1.5"></circle>
                <circle cx="82" cy="75" fill="#176BCE" r="3.5" stroke="#FFFFFF" strokeWidth="1.5"></circle>
                <circle cx="190" cy="210" fill="#176BCE" r="3.5" stroke="#FFFFFF" strokeWidth="1.5"></circle>
                <circle cx="160" cy="205" fill="#10B981" r="3.5" stroke="#FFFFFF" strokeWidth="1.5"></circle>
                <circle cx="105" cy="215" fill="#10B981" r="3.5" stroke="#FFFFFF" strokeWidth="1.5"></circle>

                {/* Labels with updated taxonomy & osapiens styling */}
                <text className="text-[9px] font-bold fill-[#DC2626] font-mono" textAnchor="middle" x="160" y="20">
                  SUPPLY (78.4)
                </text>
                <text className="text-[9px] font-semibold fill-slate-700 font-mono" textAnchor="start" x="254" y="60">
                  COST (62.1)
                </text>
                <text className="text-[9px] font-bold fill-[#DC2626] font-mono" textAnchor="start" x="282" y="153">
                  DEPENDENCY (84.2)
                </text>
                <text className="text-[9px] font-semibold fill-slate-600 font-mono" textAnchor="start" x="234" y="244">
                  FINANCIAL (44.0)
                </text>
                <text className="text-[9px] font-semibold fill-[#006B5F] font-mono" textAnchor="middle" x="160" y="266">
                  SUSTAIN/COMPL (38.5)
                </text>
                <text className="text-[9px] font-semibold fill-slate-600 font-mono" textAnchor="end" x="82" y="244">
                  PERFORMANCE (31.2)
                </text>
                <text className="text-[9px] font-bold fill-[#D97706] font-mono" textAnchor="end" x="36" y="153">
                  QUALITY (66.8)
                </text>
                <text className="text-[9px] font-semibold fill-slate-600 font-mono" textAnchor="end" x="66" y="60">
                  KNOW-HOW (29.0)
                </text>
              </svg>
            </div>
          </div>

          {/* Category Heat Distribution Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E0E7F1]">
            <div className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] flex flex-col">
              <span className="font-mono text-[9px] text-[#DC2626] font-bold uppercase">Severe Exposure</span>
              <span className="text-[12px] text-[#101B33] font-bold leading-snug">Dependency & Supply</span>
              <span className="font-mono text-[10px] text-slate-500 mt-0.5">Single-source bottlenecks</span>
            </div>
            <div className="p-2 rounded-lg bg-[#FFFBEB] border border-[#FEF3C7] flex flex-col">
              <span className="font-mono text-[9px] text-[#D97706] font-bold uppercase">Moderate Stress</span>
              <span className="text-[12px] text-[#101B33] font-bold leading-snug">Cost & Quality</span>
              <span className="font-mono text-[10px] text-slate-500 mt-0.5">Inflationary volatility</span>
            </div>
            <div className="p-2 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] flex flex-col">
              <span className="font-mono text-[9px] text-[#059669] font-bold uppercase">Controlled</span>
              <span className="text-[12px] text-[#101B33] font-bold leading-snug">ESG & Innovation</span>
              <span className="font-mono text-[10px] text-slate-500 mt-0.5">Compliant to EU CSRD</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2B: 9 Official 15M Tier-1 Risk Categories Live Matrix */}
      <section className="px-4 sm:px-6 py-2">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#101B33]">Official 15M Tier-1 Risk Categories</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] font-mono text-[10px] font-bold">
                  9 OFFICIAL DOMAINS
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Prof. Dr. Gerhard Heß Taxonomy</span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Data-backed live distribution calculated directly from authorized active risk register records
              </p>
            </div>
            {onTriggerAI && (
              <button
                type="button"
                onClick={() => onTriggerAI('assess_risk', 'Assess our risk exposure across the nine official 15M Tier-1 categories.')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#F5F8FC] border border-[#DCE6EE] hover:bg-[#EAF3FC] text-[#176BCE] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                <span>Ask AI to Assess Categories</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: '1', name: 'Supply risks', exposure: '€64.4M', count: 2, severity: 'Critical', desc: 'Market allocation & raw material export embargos (Nordvolt, Sundara)' },
              { id: '2', name: 'Failure risks', exposure: '€38.4M', count: 1, severity: 'Critical', desc: 'Disruptions from operational breakdown & wafer yield loss (Hexaprime)' },
              { id: '3', name: 'Cost risks', exposure: '€14.2M', count: 1, severity: 'High', desc: 'Raw material volatility, index surcharges (+4.2% spot cobalt)' },
              { id: '4', name: 'Quality risks', exposure: '€38.4M', count: 1, severity: 'Critical', desc: 'Cleanroom micro-particulates & wafer contamination drift' },
              { id: '5', name: 'Know-how and innovation risks', exposure: '€8.5M', count: 1, severity: 'Medium', desc: 'Proprietary ECU tooling CAD IP protection & tooling ownership' },
              { id: '6', name: 'Financial risks', exposure: '€9.7M', count: 1, severity: 'Critical', desc: 'Insolvency exposure & D&B downgrade to 5A4 (Castellan Polymers)' },
              { id: '7', name: 'Sustainability and compliance risks', exposure: '€11.0M', count: 1, severity: 'Medium', desc: 'BAFA CSDDD German Due Diligence Act tier-2 audit compliance' },
              { id: '8', name: 'Dependency risks', exposure: '€62.7M', count: 2, severity: 'Critical', desc: 'Sole source lock-in: 6 vendors hold 18.2% spend (<6w buffer)' },
              { id: '9', name: 'Performance risks', exposure: '€7.8M', count: 1, severity: 'Low', desc: 'Rotterdam terminal clearance backlog & logistics SLA drift' },
            ].map((cat) => {
              const isCrit = cat.severity === 'Critical';
              const isHigh = cat.severity === 'High';
              return (
                <div 
                  key={cat.id}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FAFBFD] hover:bg-white hover:border-[#176BCE]/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-400">0{cat.id}</span>
                      <span className="font-bold text-[13px] text-[#101B33]">{cat.name}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isCrit ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]' :
                      isHigh ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]' :
                      'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                    }`}>
                      {cat.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Active: <strong className="text-[#101B33] font-mono">{cat.count}</strong> records
                    </span>
                    <span className="font-mono font-bold text-[#101B33]">
                      {cat.exposure}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2C: Risk Trajectory Over Time & Change Explanation */}
      <section className="px-4 sm:px-6 py-2">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">timeline</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#101B33]">Risk Trajectory & Historical Audit Trends</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] font-mono text-[10px] font-bold">
                    +2 Critical QoQ
                  </span>
                </div>
                <p className="text-[12px] text-slate-500">
                  Timestamped history explaining why critical count shifted from 2 to 4 between September and October
                </p>
              </div>
            </div>

            {onTriggerAI && (
              <button
                type="button"
                onClick={() => onTriggerAI('general_query', 'Why did our critical risk count change?')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#101B33] hover:bg-[#1C2C4E] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-[#19B6A4]">psychology</span>
                <span>Ask AI: Why Did Count Change?</span>
              </button>
            )}
          </div>

          {/* Historical Timeline Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            {[
              { week: 'Week 36', date: 'Sep 01', total: 102, critical: 1, exposure: '€91.2M', note: 'Baseline Q3 register active' },
              { week: 'Week 38', date: 'Sep 15', total: 105, critical: 2, exposure: '€101.4M', note: '+1 Crit: Sundara license delay (IN-ODS)' },
              { week: 'Week 40', date: 'Sep 29', total: 108, critical: 2, exposure: '€101.4M', note: 'Quarterly review; buffers maintained' },
              { week: 'Week 41', date: 'Oct 10', total: 110, critical: 3, exposure: '€108.5M', note: '+1 Crit: Castellan D&B downgrade to 5A4' },
              { week: 'Week 42', date: 'Oct 14', total: 112, critical: 4, exposure: '€112.5M', note: '+1 Crit: Hexaprime Fab 3 cleanroom yield drop' },
              { week: 'Week 43 (Now)', date: 'Oct 22', total: 113, critical: 4, exposure: '€112.5M', note: 'Current live state: 1 Overdue CPO action' },
            ].map((pt, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border transition-all ${
                  idx === 5 
                    ? 'bg-[#FEF2F2]/60 border-[#FCA5A5]' 
                    : idx >= 3 
                    ? 'bg-[#FFFBEB]/50 border-[#FDE68A]' 
                    : 'bg-[#F8FAFD] border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#101B33]">{pt.week}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{pt.date}</span>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className={`text-[18px] font-mono font-extrabold ${
                    pt.critical >= 4 ? 'text-[#DC2626]' : pt.critical >= 3 ? 'text-[#D97706]' : 'text-[#176BCE]'
                  }`}>
                    {pt.critical} Crit
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">/ {pt.total}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-1.5">
                  Exposure: <strong className="text-slate-800">{pt.exposure}</strong>
                </div>
                <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                  {pt.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: CPO Urgent Decision Queue */}
      <section className="px-4 sm:px-6 py-2">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)]">
          
          {/* Overdue Mitigation Callout Banner with Direct Authorization */}
          {overdueActions.length > 0 && (
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px] animate-pulse">crisis_alert</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#DC2626] font-bold text-[13px] uppercase tracking-wide">
                      Overdue Mitigation Action Requiring CPO Authorization
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-mono font-bold">
                      {overdueActions[0].urgencyLabel}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-700 mt-0.5">
                    <strong>{overdueActions[0].code}:</strong> {overdueActions[0].title} ({overdueActions[0].amount})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await authorizeMitigationAction(overdueActions[0].code, 'Direct authorization from CPO alert banner');
                      const act = actions.find(a => a.code === overdueActions[0].code);
                      if (act) onExecuteAction(act);
                      refreshDashboard();
                    } catch (e) {
                      console.warn(e);
                    }
                  }}
                  className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-[12px] font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Authorize €1.2M CapEx</span>
                </button>
                {onTriggerAI && (
                  <button
                    type="button"
                    onClick={() => onTriggerAI('recommend_mitigation', 'Explain why ACTION-409 is overdue and what will happen if delayed.')}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
                  >
                    Ask AI
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[20px]">assignment_late</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#101B33]">Priority Decision Queue</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white font-mono text-[10px] font-bold">
                    {actions.filter(a => a.status === 'pending').length} CPO Actions Pending
                  </span>
                </div>
                <p className="text-[12px] text-slate-500">Decisions holding critical stop-ship paths across key production lines</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-500 bg-[#F5F8FC] border border-[#E0E7F1] px-3 py-1.5 rounded-lg">
                Pipeline: 8 Open · 2 Overdue · 1 Blocked · 19 Completed QoQ
              </span>
            </div>
          </div>

          {/* Action Cards Stack */}
          <div className="space-y-3">
            {actions.map((act) => {
              const isOverdue = act.urgency === 'overdue';
              const isWarning = act.urgency === 'warning';
              const isHandled = act.status !== 'pending';

              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isHandled
                      ? 'bg-[#F0FDF4]/50 border-[#A7F3D0]'
                      : 'bg-[#F8FAFD] border-[#E2E8F0] hover:border-[#176BCE]/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 max-w-3xl">
                    <span className={`w-1.5 self-stretch rounded-full shrink-0 ${
                      isHandled ? 'bg-[#059669]' : isOverdue ? 'bg-[#DC2626]' : isWarning ? 'bg-[#D97706]' : 'bg-[#176BCE]'
                    }`}></span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          isHandled ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626]'
                        }`}>
                          {act.code}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] text-[10px] font-semibold">
                          {act.category}
                        </span>
                        {!isHandled ? (
                          <span className={`font-mono text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded ${
                            isOverdue
                              ? 'text-[#DC2626] bg-[#FEF2F2]'
                              : 'text-[#D97706] bg-[#FFFBEB] border border-[#FEF3C7]'
                          }`}>
                            <span className="material-symbols-outlined text-[13px]">
                              {isOverdue ? 'timer' : 'schedule'}
                            </span>
                            {act.urgencyLabel}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded flex items-center gap-1 border border-[#A7F3D0]">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Signed Off & Active
                          </span>
                        )}
                      </div>

                      <h4 className="text-[14px] font-bold text-[#101B33] mt-1.5 leading-snug">
                        {act.title}
                      </h4>
                      <p className="text-[12px] text-slate-600 mt-1">
                        {act.description}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
                        <span>Owner: <strong className="text-[#101B33]">{act.owner}</strong></span>
                        <span>Revenue Impact: <strong className="text-[#059669] font-bold">{act.revenueImpact}</strong></span>
                        <span>Residual Impact: <span className="text-[#059669] font-bold bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">{act.residualRisk}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => onInspectAction(act)}
                      className="px-3.5 h-8 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-[#101B33] text-[12px] font-semibold transition-colors shadow-xs"
                    >
                      {act.secondaryButtonLabel}
                    </button>

                    {!isHandled ? (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await authorizeMitigationAction(act.code, 'Approved in Priority Decision Queue');
                            refreshDashboard();
                          } catch (e) {
                            console.warn(e);
                          }
                          onExecuteAction(act);
                        }}
                        className={`px-4 h-8 rounded-lg text-white text-[12px] font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer ${
                          act.code === 'ACTION-398'
                            ? 'bg-white border border-[#DC2626]/30 hover:bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#176BCE] hover:bg-[#1357A6] shadow-[#176BCE]/25'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {act.code === 'ACTION-398' ? 'lock' : 'check_circle'}
                        </span>
                        <span>{act.actionButtonLabel}</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 h-8 rounded-lg bg-slate-100 text-slate-500 text-[12px] font-semibold flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        <span>Executed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Critical Dependency Watchlist Table */}
      <section className="px-4 sm:px-6 py-2">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#101B33]">Critical Dependency Watchlist</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#EAF3FC] font-mono text-[10px] text-[#176BCE] font-bold border border-[#D0E2FA]">
                  SINGLE-SOURCE EXPOSURE
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Live telemetry tracking inventory coverage runway versus requalification replacement lead time
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Quick Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#E0E7F1] text-[12px] text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Energy Storage">Energy Storage</option>
                <option value="Microelectronics">Microelectronics</option>
                <option value="Specialty Metallurgy">Specialty Metallurgy</option>
                <option value="Polymers">Polymers</option>
              </select>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#E0E7F1] hover:bg-white text-[#101B33] text-[12px] font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px] text-slate-500">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Modern Responsive Data Table */}
          <div className="overflow-x-auto rounded-lg border border-[#E0E7F1]">
            <table className="w-full text-left min-w-[840px]">
              <thead>
                <tr className="bg-[#F8FAFD] border-b border-[#E0E7F1] text-slate-600 font-mono text-[10px] uppercase tracking-wider h-10">
                  <th className="px-4 font-semibold">Supplier & Location</th>
                  <th className="px-3 font-semibold">Critical Material</th>
                  <th className="px-3 font-semibold">Category</th>
                  <th className="px-3 font-semibold">Business Unit</th>
                  <th className="px-4 font-semibold min-w-[210px]">Coverage Runway vs. Qualification Gap</th>
                  <th className="px-3 font-semibold">Financial Exposure</th>
                  <th className="px-3 font-semibold">osapiens Signal</th>
                  <th className="px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7F1] text-[12px]">
                {filteredSuppliers.map((supp) => {
                  const isRamping = supp.status === 'ramping';
                  const isCrit = supp.status === 'critical';
                  const isWarn = supp.status === 'high';

                  return (
                    <tr 
                      key={supp.id}
                      className={`hover:bg-[#EAF3FC]/30 transition-colors ${
                        isRamping ? 'bg-[#F0FDF4]/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#101B33] flex items-center gap-1.5">
                            {supp.name}
                            {supp.isSoleSource && (
                              <span 
                                className="material-symbols-outlined text-[15px] text-[#DC2626]" 
                                title="Single Source Verified"
                              >
                                verified
                              </span>
                            )}
                            {isRamping && (
                              <span className="material-symbols-outlined text-[15px] text-[#059669]">
                                published_with_changes
                              </span>
                            )}
                          </span>
                          <span className={`font-mono text-[10px] ${isRamping ? 'text-[#059669] font-medium' : 'text-slate-500'}`}>
                            {supp.code} · {supp.tier}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#101B33]">{supp.material}</span>
                          <span className="font-mono text-[10px] text-slate-400">{supp.materialSku}</span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F8FC] border border-[#E0E7F1] text-[11px] font-medium text-slate-700">
                          {supp.category}
                        </span>
                      </td>

                      <td className="px-3 py-3 font-medium text-slate-700">
                        {supp.businessUnit}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className={`font-bold ${
                              isRamping ? 'text-[#059669]' : isCrit ? 'text-[#DC2626]' : 'text-[#D97706]'
                            }`}>
                              {isRamping ? `Ramping (${supp.bufferWeeks}w to Pilot)` : `${supp.bufferWeeks}w Buffer`}
                            </span>
                            <span className="text-slate-500">
                              {isRamping ? 'On-Schedule' : `Gap: ${supp.gapWeeks}w`}
                            </span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full rounded-full ${
                                isRamping ? 'bg-[#10B981]' : isCrit ? 'bg-[#DC2626]' : 'bg-[#F59E0B]'
                              }`} 
                              style={{ width: `${supp.bufferProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold text-[13px] ${
                            isRamping ? 'text-[#059669]' : isCrit ? 'text-[#DC2626]' : 'text-[#101B33]'
                          }`}>
                            {supp.financialExposure}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{supp.spend}</span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          supp.osapiensSignal.type === 'alert'
                            ? 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626]'
                            : supp.osapiensSignal.type === 'warning'
                            ? 'bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#ECFDF5] border border-[#D1FAE5] text-[#059669]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            supp.osapiensSignal.type === 'alert'
                              ? 'bg-[#EF4444] animate-pulse'
                              : supp.osapiensSignal.type === 'warning'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#10B981]'
                          }`}></span>
                          {supp.osapiensSignal.label}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectSupplier(supp)}
                          className="p-1.5 hover:bg-[#EAF3FC] rounded-lg text-[#176BCE] transition-colors"
                          title="Inspect Supplier Deep-Dive"
                        >
                          <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="mt-3.5 pt-3 border-t border-[#E0E7F1] flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-500">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-[#101B33]">{filteredSuppliers.length} of {suppliers.length}</strong> active single-source bottlenecks
              </span>
              <span className="text-slate-300">·</span>
              <span>Buffer definition: Days to halt line assuming zero inbound receipts</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-500">Next Audit Cycle: in 4d 06h</span>
              <button 
                type="button" 
                onClick={onNavigateToSuppliers}
                className="text-[#176BCE] hover:underline font-bold ml-2 inline-flex items-center gap-0.5"
              >
                <span>View Full Dependency Registry</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Methodology Transparency Drawer / Executive Guidance Strip */}
      <section className="px-4 sm:px-6 py-2">
        <div className="p-4 rounded-xl bg-white border border-[#E0E7F1] shadow-[0_2px_12px_rgba(16,27,51,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] border border-[#D0E2FA] flex items-center justify-center text-[#176BCE] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <h5 className="text-[14px] font-bold text-[#101B33]">15M Risk Intelligence Engine Governance</h5>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Residual Risk score calculated using live ERP inventory runs, multi-tier bill-of-materials explosion, and osapiens automated early-warning telemetry.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-[11px] text-slate-500 bg-[#F5F8FC] border border-[#E0E7F1] px-2.5 py-1 rounded-md">
              ISO 31000 / BAFA CSDDD Compliant
            </span>
            <button
              type="button"
              onClick={onOpenExportBriefing}
              className="px-3.5 h-8 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-[#101B33] text-[12px] font-semibold transition-colors shadow-xs"
            >
              Export Audit Package
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
