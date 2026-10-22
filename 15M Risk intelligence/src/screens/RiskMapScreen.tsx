import React, { useState } from 'react';
import { RiskAnchor } from '../types';
import { AIAnalystAction } from '../services/aiAnalystService';

interface RiskMapScreenProps {
  riskAnchors: RiskAnchor[];
  onInspectRiskAnchor: (anchor: RiskAnchor) => void;
  onTriggerAI?: (action: AIAnalystAction, prompt?: string, anchor?: RiskAnchor) => void;
}

export const RiskMapScreen: React.FC<RiskMapScreenProps> = ({
  riskAnchors,
  onInspectRiskAnchor,
  onTriggerAI,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Energy' | 'Chips' | 'Metals' | 'Polymers'>('All');
  const [stressFactor, setStressFactor] = useState<number>(0);

  const filteredAnchors = riskAnchors.filter(r => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Energy') return r.category.includes('Energy');
    if (activeFilter === 'Chips') return r.category.includes('Micro');
    if (activeFilter === 'Metals') return r.category.includes('Metallurgy');
    if (activeFilter === 'Polymers') return r.category.includes('Polymers');
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#101B33]">15M Risk Map & Scenario Simulation</h2>
            <span className="px-2 py-0.5 rounded bg-[#EAF3FC] text-[#176BCE] font-mono text-[10px] font-bold border border-[#D0E2FA]">
              ISO 31000 EVALUATION
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Likelihood vs Severity matrix mapped against live ERP bill-of-materials and multi-tier telemetry.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E0E7F1] shadow-xs">
          {(['All', 'Energy', 'Chips', 'Metals', 'Polymers'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-[#176BCE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#101B33]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* AI Risk Map Quick Action Strip */}
      {onTriggerAI && (
        <div className="bg-gradient-to-r from-[#0E2038] to-[#143254] p-3.5 rounded-xl border border-[#1E3E66] text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#19B6A4] text-[20px]">psychology</span>
            <div>
              <span className="font-bold text-[13px] text-white">AI Risk Map Copilot</span>
              <span className="text-slate-300 text-[12px] ml-2 hidden sm:inline">
                Evaluate line of acceptance boundaries, detect hidden BOM dependencies, and draft mitigations.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTriggerAI('explain_risk', 'Explain why our top risk anchors breach the 15M Line of Acceptance and what information is missing')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-semibold text-[#00D2FF] transition-colors"
            >
              Analyze Line of Acceptance
            </button>
            <button
              type="button"
              onClick={() => onTriggerAI('recommend_mitigation', 'Draft comprehensive 15M mitigation plans for all critical risk anchors')}
              className="px-2.5 py-1 rounded-lg bg-[#0084A8] hover:bg-[#026E8C] text-[11px] font-semibold text-white transition-colors"
            >
              Draft Portfolio Mitigations
            </button>
          </div>
        </div>
      )}

      {/* Stress Test Simulation Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E0E7F1] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-[#101B33]">Macro Supply Shock Stress Testing</h4>
            <p className="text-[12px] text-slate-500">
              Simulate geopolitical quota freezes, raw material export bans, or cleanroom contamination.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-72">
          <input
            type="range"
            min="0"
            max="100"
            value={stressFactor}
            onChange={(e) => setStressFactor(parseInt(e.target.value))}
            className="w-full accent-[#DC2626]"
          />
          <span className="font-mono text-[12px] font-bold text-[#DC2626] shrink-0">
            +{stressFactor}% Shock
          </span>
        </div>
      </div>

      {/* Grid of Risk Anchors with Contextual AI Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAnchors.map((anchor) => (
          <div
            key={anchor.id}
            className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs hover:border-[#176BCE] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                  {anchor.code}
                </span>
                <span className="text-[10px] font-semibold text-[#176BCE] bg-[#EAF3FC] px-2 py-0.5 rounded">
                  Score: {anchor.score} / 25
                </span>
              </div>
              <h3 
                onClick={() => onInspectRiskAnchor(anchor)}
                className="font-bold text-[15px] text-[#101B33] group-hover:text-[#176BCE] transition-colors cursor-pointer"
              >
                {anchor.supplier}
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5 font-medium">
                {anchor.material}
              </p>
              <p className="text-[12px] text-slate-600 mt-2 line-clamp-2">
                {anchor.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Revenue Exposure:</span>
                <strong className="text-[#DC2626] font-mono">{anchor.revenueAtRisk}</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inventory Buffer:</span>
                <span className="font-mono font-bold text-[#D97706]">{anchor.bufferWeeks}w</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Requal Gap:</span>
                <span className="font-mono text-slate-600">{anchor.requalificationWeeks}w</span>
              </div>

              {/* Contextual AI Actions */}
              {onTriggerAI && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerAI('explain_risk', `Explain risk anchor [${anchor.code}] (${anchor.supplier}) in detail. What evidence supports it and what information is missing?`, anchor);
                    }}
                    className="flex-1 py-1 rounded bg-[#EAF3FC] hover:bg-[#D5E8FA] text-[#176BCE] font-semibold text-[10px] transition-colors flex items-center justify-center gap-1"
                    title="Explain Risk & Missing Data"
                  >
                    <span className="material-symbols-outlined text-[12px]">search</span>
                    <span>Explain</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerAI('recommend_mitigation', `Draft a structured 15M mitigation plan for [${anchor.code}] ${anchor.supplier} to bridge the ${anchor.requalificationWeeks}w requalification gap.`, anchor);
                    }}
                    className="flex-1 py-1 rounded bg-[#0084A8]/10 hover:bg-[#0084A8]/20 text-[#0084A8] font-semibold text-[10px] transition-colors flex items-center justify-center gap-1"
                    title="Draft 15M Mitigation Plan"
                  >
                    <span className="material-symbols-outlined text-[12px]">shield</span>
                    <span>Mitigate</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
