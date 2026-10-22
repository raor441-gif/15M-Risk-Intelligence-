import React, { useState } from 'react';
import { SupplierItem } from '../types';
import { AIAnalystAction } from '../services/aiAnalystService';

interface SuppliersScreenProps {
  suppliers: SupplierItem[];
  onInspectSupplier: (supplier: SupplierItem) => void;
  onTriggerAI?: (action: AIAnalystAction, prompt?: string, supplier?: SupplierItem) => void;
}

export const SuppliersScreen: React.FC<SuppliersScreenProps> = ({
  suppliers,
  onInspectSupplier,
  onTriggerAI,
}) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Tier 1' | 'Tier 2' | 'Sole Source'>('All');

  const filtered = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.material.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (tierFilter === 'Tier 1') return s.tier.includes('Tier 1');
    if (tierFilter === 'Tier 2') return s.tier.includes('Tier 2');
    if (tierFilter === 'Sole Source') return s.isSoleSource;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#101B33]">Supply Base & Dependency Registry</h2>
            <span className="px-2 py-0.5 rounded bg-[#EAF3FC] text-[#176BCE] font-mono text-[10px] font-bold border border-[#D0E2FA]">
              {suppliers.length} MONITORED VENDORS
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Tier-1 and Tier-2 sole-source moats, financial solvency ratings, and inventory coverage runways.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor or SKU..."
            className="h-8 px-3 rounded-lg bg-white border border-[#E0E7F1] text-[12px] text-[#101B33] placeholder:text-slate-400 focus:outline-none focus:border-[#176BCE]"
          />

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E0E7F1]">
            {(['All', 'Tier 1', 'Tier 2', 'Sole Source'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  tierFilter === t
                    ? 'bg-[#176BCE] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#101B33]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Supplier Intelligence Strip */}
      {onTriggerAI && (
        <div className="bg-gradient-to-r from-[#0C1B33] to-[#123154] p-3.5 rounded-xl border border-[#1A3B66] text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#19B6A4] text-[20px]">psychology</span>
            <div>
              <span className="font-bold text-[13px] text-white">AI Supplier Risk Dossier</span>
              <span className="text-slate-300 text-[12px] ml-2 hidden sm:inline">
                Evidence-based supplier summaries combining osapiens telemetry, D&B ratings, and 15M category profiles.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTriggerAI('explain_risk', 'Generate evidence-based risk summaries across all our critical sole-source suppliers')}
            className="px-3 py-1 rounded-lg bg-[#0084A8] hover:bg-[#026E8C] text-white font-semibold text-[11px] transition-colors"
          >
            Synthesize Sole-Source Base
          </button>
        </div>
      )}

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((supp) => (
          <div
            key={supp.id}
            className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs hover:border-[#176BCE] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div 
                  onClick={() => onInspectSupplier(supp)}
                  className="cursor-pointer"
                >
                  <h3 className="font-bold text-[15px] text-[#101B33] group-hover:text-[#176BCE] transition-colors flex items-center gap-1.5">
                    {supp.name}
                    {supp.isSoleSource && (
                      <span className="material-symbols-outlined text-[15px] text-[#DC2626]">verified</span>
                    )}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500">{supp.location}</p>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                  supp.status === 'critical'
                    ? 'bg-[#FEF2F2] text-[#DC2626]'
                    : supp.status === 'ramping'
                    ? 'bg-[#ECFDF5] text-[#059669]'
                    : 'bg-[#FFFBEB] text-[#D97706]'
                }`}>
                  {supp.tier}
                </span>
              </div>

              <div className="mt-3 p-3 bg-[#F8FAFD] rounded-lg border border-slate-100 space-y-1.5">
                <div className="text-[12px]">
                  <span className="text-slate-500 font-medium">Material: </span>
                  <strong className="text-[#101B33]">{supp.material}</strong>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>SKU: <code className="font-mono">{supp.materialSku}</code></span>
                  <span>Unit: {supp.businessUnit}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Runway vs Gap:</span>
                <span className="font-mono font-bold text-[#DC2626]">
                  {supp.bufferWeeks}w runway (Gap {supp.gapWeeks}w)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Financial Exposure:</span>
                <span className="font-mono font-bold text-[#101B33]">{supp.financialExposure}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Telemetry Alert:</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  supp.osapiensSignal.type === 'alert'
                    ? 'bg-[#FEF2F2] text-[#DC2626]'
                    : supp.osapiensSignal.type === 'positive'
                    ? 'bg-[#ECFDF5] text-[#059669]'
                    : 'bg-[#FFFBEB] text-[#D97706]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {supp.osapiensSignal.label}
                </span>
              </div>

              {/* Contextual AI Action */}
              {onTriggerAI && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onInspectSupplier(supp)}
                    className="text-[11px] text-slate-500 hover:text-[#176BCE] font-semibold"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onTriggerAI('explain_risk', `Provide an evidence-based risk summary for supplier [${supp.name}] (${supp.location}), supplying ${supp.material}. What are the risk indicators and what data is missing?`, supp)}
                    className="px-2.5 py-1 rounded bg-[#EAF3FC] hover:bg-[#D5E8FA] text-[#176BCE] text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                    <span>AI Risk Summary</span>
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
