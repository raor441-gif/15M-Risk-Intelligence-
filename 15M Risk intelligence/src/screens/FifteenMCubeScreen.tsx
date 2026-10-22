import React, { useState } from 'react';
import { fifteenMBuildingBlocks, whitepaper9RiskCategories } from '../data/mockData';
import { BuildingBlock } from '../types';

interface FifteenMCubeScreenProps {
  onNavigateToRiskMap: () => void;
  onNavigateToRadar: () => void;
  onNavigateToSuppliers: () => void;
}

export const FifteenMCubeScreen: React.FC<FifteenMCubeScreenProps> = ({
  onNavigateToRiskMap,
  onNavigateToRadar,
  onNavigateToSuppliers,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock>(fifteenMBuildingBlocks[0]);
  const [activeDimensionTab, setActiveDimensionTab] = useState<'cube' | 'building-blocks' | 'material-matrix' | 'digital-tools'>('cube');

  // Material matrix state (Building Block 4)
  const [selectedSupplierCount, setSelectedSupplierCount] = useState<'Sole' | 'Single' | 'Dual' | 'Multiple'>('Sole');
  const [selectedComplexity, setSelectedComplexity] = useState<'Standard' | 'Catalogue' | 'Drawing' | 'Tool' | 'License'>('Tool');
  const [selectedSalesLoss, setSelectedSalesLoss] = useState<'>= 20% Loss' | '< 20% Loss' | '> 10% Loss' | '< 10% Loss'>('>= 20% Loss');

  // Matrix calculation from page 16 of White Paper:
  // Sole + Tool = D
  // D + >=20% Loss = Risk Code 4 (Very High Material Risk)
  const getCauseClass = (supp: string, comp: string): 'A' | 'B' | 'C' | 'D' | 'X' => {
    if (supp === 'Sole') {
      return comp === 'Standard' ? 'X' : 'D';
    }
    if (supp === 'Single') {
      if (comp === 'Standard' || comp === 'Catalogue') return 'B';
      if (comp === 'Drawing' || comp === 'Tool') return 'C';
      return 'D';
    }
    if (supp === 'Dual') {
      if (comp === 'Standard' || comp === 'Catalogue') return 'A';
      if (comp === 'Drawing') return 'B';
      if (comp === 'Tool') return 'C';
      return 'D';
    }
    // Multiple
    if (comp === 'Standard' || comp === 'Catalogue') return 'A';
    if (comp === 'Drawing' || comp === 'Tool') return 'B';
    return 'X';
  };

  const causeClass = getCauseClass(selectedSupplierCount, selectedComplexity);

  const getMaterialRiskCode = (cClass: string, loss: string): { code: number; label: string; color: string } => {
    if (cClass === 'D' && loss === '>= 20% Loss') return { code: 4, label: 'Very High Material Risk', color: '#DC2626' };
    if (cClass === 'D' || loss === '>= 20% Loss') return { code: 4, label: 'Very High Material Risk', color: '#DC2626' };
    if (cClass === 'C' || loss === '< 20% Loss') return { code: 3, label: 'Remarkable Material Risk', color: '#D97706' };
    if (cClass === 'B' || loss === '> 10% Loss') return { code: 2, label: 'Medium Material Risk', color: '#F59E0B' };
    return { code: 1, label: 'Low Material Risk', color: '#059669' };
  };

  const riskResult = getMaterialRiskCode(causeClass, selectedSalesLoss);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner with White Paper Citation */}
      <div className="bg-gradient-to-r from-[#101B33] via-[#172B4D] to-[#101B33] rounded-2xl p-6 text-white border border-[#1C2C4E] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#19B6A4]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#19B6A4]/20 text-[#19B6A4] font-mono text-[10px] font-bold border border-[#19B6A4]/30">
                OFFICIAL 15M ARCHITECTURE
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                Prof. Dr. Gerhard Heß · Sourcing Champions White Paper
              </span>
            </div>
            
            <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-white">
              Systematically Managing Procurement Risks with the 15M Architecture
            </h1>
            
            <p className="text-[13px] sm:text-[14px] text-slate-300 mt-2 leading-relaxed">
              &ldquo;No Risk, No Fun. <strong className="text-[#19B6A4]">No Risk, No Business.</strong>&rdquo; Embedding risk management systematically across the 5 Strategy Partitions, 3 RM Approaches, and 9 Tier-1 Risk Categories through 7 modular building blocks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
              target="_blank"
              rel="noreferrer noopener"
              download="Sourcing-Champions_White-paper-15M_RISK.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#19B6A4] hover:bg-[#159a8b] text-[#101B33] font-bold text-[13px] shadow-lg shadow-[#19B6A4]/20 transition-all hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download White Paper (PDF)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E0E7F1] pb-3">
        <button
          type="button"
          onClick={() => setActiveDimensionTab('cube')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeDimensionTab === 'cube'
              ? 'bg-[#176BCE] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-[#101B33] border border-[#E0E7F1]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">view_in_ar</span>
          <span>The 15M Risk Cube (3 Dimensions)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDimensionTab('building-blocks')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeDimensionTab === 'building-blocks'
              ? 'bg-[#176BCE] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-[#101B33] border border-[#E0E7F1]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">account_tree</span>
          <span>The 7 Building Blocks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDimensionTab('material-matrix')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeDimensionTab === 'material-matrix'
              ? 'bg-[#176BCE] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-[#101B33] border border-[#E0E7F1]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">grid_on</span>
          <span>Material Complexity Matrix (BB4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDimensionTab('digital-tools')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
            activeDimensionTab === 'digital-tools'
              ? 'bg-[#176BCE] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-[#101B33] border border-[#E0E7F1]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">hub</span>
          <span>Digital Tools Landscape & Single Truth</span>
        </button>
      </div>

      {/* TAB 1: THE 15M RISK CUBE */}
      {activeDimensionTab === 'cube' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dimension 1: Decision-Making Levels */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0E7F1] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#EAF3FC] text-[#176BCE] font-bold text-[12px] flex items-center justify-center font-mono">
                  D1
                </span>
                <div>
                  <h3 className="font-bold text-[15px] text-[#101B33]">Decision-Making Levels</h3>
                  <span className="text-[11px] text-slate-400 font-mono">15M Strategy Partitions</span>
                </div>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed">
                Risk management differs across procurement levels, requiring tailored frameworks from top-level corporate strategy down to operational processes.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { name: 'SP1: Procurement Framework Strategy', desc: 'Top risks, acceptance threshold, alignment with business objectives.' },
                  { name: 'SP2: Category Strategies', desc: 'Supply market concentration, price volatility, and 4-step category roadmap.' },
                  { name: 'SP3: Supplier Strategies', desc: 'Single-source moats, supplier default risk, scoring-based SRM evaluations.' },
                  { name: 'SP4: Process & Digital Strategies', desc: 'Automation, AI data integration, early-warning prober triggers.' },
                  { name: 'SP5: Procurement Management System (PMS)', desc: 'Governance, risk targets, roles, KPIs, controlling, leadership.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#F8FAFD] border border-slate-100 text-[12px]">
                    <span className="font-bold text-[#101B33] block">{item.name}</span>
                    <span className="text-slate-500 text-[11px]">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimension 2: Risk Management Approaches */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0E7F1] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#EAF3FC] text-[#176BCE] font-bold text-[12px] flex items-center justify-center font-mono">
                  D2
                </span>
                <div>
                  <h3 className="font-bold text-[15px] text-[#101B33]">Approaches to Risk Management</h3>
                  <span className="text-[11px] text-slate-400 font-mono">3 Complementary Vectors</span>
                </div>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed">
                The white paper identifies three fundamental approaches that should ideally be combined and run in parallel:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-[#FEF2F2]/60 border border-[#FEE2E2]">
                  <div className="flex items-center gap-1.5 text-[#DC2626] font-bold text-[13px]">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span>1. Cause-Oriented Approach</span>
                  </div>
                  <p className="text-[12px] text-slate-600 mt-1">
                    Identifies and evaluates threats based on <strong>Likelihood and Impact</strong>. Risks above the defined acceptance threshold require proactive countermeasures in the Risk Map.
                  </p>
                  <button 
                    onClick={onNavigateToRiskMap}
                    className="mt-2 text-[#176BCE] hover:underline font-bold text-[11px] inline-flex items-center gap-0.5"
                  >
                    Open 5×5 Risk Map Matrix →
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFBEB]/60 border border-[#FEF3C7]">
                  <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-[13px]">
                    <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                    <span>2. Impact-Oriented Approach</span>
                  </div>
                  <p className="text-[12px] text-slate-600 mt-1">
                    Focuses on critical materials or suppliers whose disruption causes <strong>existential damage</strong> (&gt; X Million EUR), irrespective of probability. Determines the <strong>Resilience Gap</strong> (inventory runway vs replacement lead time).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#ECFDF5]/60 border border-[#D1FAE5]">
                  <div className="flex items-center gap-1.5 text-[#059669] font-bold text-[13px]">
                    <span className="material-symbols-outlined text-[16px]">shield</span>
                    <span>3. Resilience-Focused Approach</span>
                  </div>
                  <p className="text-[12px] text-slate-600 mt-1">
                    Accepts that crises are an inherent part of procurement. Strengthens organizational adaptability through <strong>15M Maturity Analysis</strong> (Orientation, Transparency, Leadership, Employees, Networking) and crisis fire drills.
                  </p>
                </div>
              </div>
            </div>

            {/* Dimension 3: Nine Tier-1 Risk Categories */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0E7F1] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#EAF3FC] text-[#176BCE] font-bold text-[12px] flex items-center justify-center font-mono">
                    D3
                  </span>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#101B33]">9 Tier-1 Risk Categories</h3>
                    <span className="text-[11px] text-slate-400 font-mono">15M Risk Taxonomy</span>
                  </div>
                </div>
                <button 
                  onClick={onNavigateToRadar}
                  className="text-[#176BCE] text-[11px] font-bold hover:underline"
                >
                  View Radar →
                </button>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed">
                Structured categories covering all supply chain vulnerabilities, serving as the basis for the 15M Risk Radar:
              </p>

              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {whitepaper9RiskCategories.map((cat) => (
                  <div key={cat.id} className="p-2 rounded-lg bg-[#F8FAFD] border border-slate-100 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101B33]">
                        {cat.id}. {cat.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#176BCE] bg-[#EAF3FC] px-1.5 py-0.2 rounded font-semibold">
                        Tier 1
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.definition}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cat.tier2.map((t2, idx) => (
                        <span key={idx} className="font-mono text-[9px] text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-100">
                          {t2}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE 7 BUILDING BLOCKS */}
      {activeDimensionTab === 'building-blocks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[#E0E7F1] shadow-xs">
            <h3 className="font-bold text-[16px] text-[#101B33] mb-1">
              The Seven Building Blocks of 15M Risk Management
            </h3>
            <p className="text-[13px] text-slate-500">
              Each building block can be implemented independently or sequenced together to create a holistic enterprise procurement risk management system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mt-4">
              {fifteenMBuildingBlocks.map((bb) => (
                <button
                  key={bb.id}
                  type="button"
                  onClick={() => setSelectedBlock(bb)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedBlock.id === bb.id
                      ? 'bg-[#176BCE] text-white border-[#176BCE] shadow-md scale-[1.02]'
                      : 'bg-[#F8FAFD] text-[#101B33] border-[#E0E7F1] hover:bg-[#EAF3FC]/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`font-mono text-[11px] font-extrabold px-1.5 py-0.2 rounded ${
                      selectedBlock.id === bb.id ? 'bg-white/20 text-white' : 'bg-[#EAF3FC] text-[#176BCE]'
                    }`}>
                      BB {bb.id}
                    </span>
                  </div>
                  <span className="font-bold text-[12px] leading-tight line-clamp-2 mt-1">
                    {bb.title}
                  </span>
                  <span className={`text-[10px] font-mono mt-2 truncate ${
                    selectedBlock.id === bb.id ? 'text-white/80' : 'text-slate-400'
                  }`}>
                    {bb.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Building Block Detail Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#176BCE] uppercase">
                  {selectedBlock.subtitle}
                </span>
                <h3 className="text-[20px] font-extrabold text-[#101B33] mt-0.5">
                  Building Block {selectedBlock.id}: {selectedBlock.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#EAF3FC] text-[#176BCE] font-mono text-[11px] font-bold border border-[#D0E2FA]">
                  Approach: {selectedBlock.approach}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-medium">
                  Level: {selectedBlock.level}
                </span>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 leading-relaxed">
              {selectedBlock.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
                <span className="font-mono text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#176BCE]">build</span>
                  Core Methodological Tools
                </span>
                <ul className="space-y-1.5 text-[13px] text-slate-700">
                  {selectedBlock.coreTools.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#176BCE]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
                <span className="font-mono text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#059669]">output</span>
                  Key Management Outputs
                </span>
                <ul className="space-y-1.5 text-[13px] text-slate-700">
                  {selectedBlock.keyOutputs.map((o, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MATERIAL COMPLEXITY MATRIX (BUILDING BLOCK 4) */}
      {activeDimensionTab === 'material-matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#EAF3FC] font-mono text-[10px] text-[#176BCE] font-bold">
                  WHITE PAPER PAGE 16 SPECIFICATION
                </span>
                <h3 className="text-[18px] font-bold text-[#101B33] mt-1">
                  Building Block 4: Multi-Axis Material Risk Classification
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Combines Cause-Oriented Complexity (Supplier Structure × Material Complexity) with Impact-Oriented Loss of Sales.
                </p>
              </div>

              {/* Live Result Code */}
              <div className="p-3 rounded-xl border flex items-center gap-3 bg-white shadow-xs" style={{ borderColor: riskResult.color }}>
                <div className="w-10 h-10 rounded-lg text-white font-mono font-extrabold text-[18px] flex items-center justify-center shadow-xs" style={{ backgroundColor: riskResult.color }}>
                  {riskResult.code}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Calculated Risk Code
                  </span>
                  <span className="font-bold text-[13px]" style={{ color: riskResult.color }}>
                    {riskResult.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {/* Supplier Structure */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 uppercase block">
                  1. Number of Suppliers
                </span>
                <div className="space-y-1.5">
                  {(['Sole', 'Single', 'Dual', 'Multiple'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSupplierCount(s)}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-[12px] font-semibold transition-all ${
                        selectedSupplierCount === s
                          ? 'bg-[#176BCE] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s} Source {s === 'Sole' && '(No qualified alternative exists)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Complexity */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 uppercase block">
                  2. Material Complexity
                </span>
                <div className="space-y-1.5">
                  {(['Standard', 'Catalogue', 'Drawing', 'Tool', 'License'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedComplexity(c)}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-[12px] font-semibold transition-all ${
                        selectedComplexity === c
                          ? 'bg-[#176BCE] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {c} {c === 'Tool' ? '(Proprietary tooling required)' : c === 'License' ? '(Special license/patent)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact-Oriented Loss of Sales */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 uppercase block">
                  3. Impact: Loss of Sales
                </span>
                <div className="space-y-1.5">
                  {(['>= 20% Loss', '< 20% Loss', '> 10% Loss', '< 10% Loss'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setSelectedSalesLoss(l)}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-[12px] font-semibold transition-all ${
                        selectedSalesLoss === l
                          ? 'bg-[#176BCE] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {l} of Total Revenue
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Reproduction of the Matrix from Page 16 */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="font-mono text-[11px] uppercase font-bold text-slate-500 block mb-2">
                Reference Matrix from Page 16: Cause-Oriented Complexity Class ({causeClass}) × Loss of Sales
              </span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#101B33] text-white font-mono text-[11px]">
                      <th className="p-2 text-left">Suppliers \ Complexity</th>
                      <th className="p-2">Standard</th>
                      <th className="p-2">Catalogue</th>
                      <th className="p-2">Drawing</th>
                      <th className="p-2">Tool</th>
                      <th className="p-2">License</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr className={selectedSupplierCount === 'Sole' ? 'bg-[#EAF3FC] font-bold' : ''}>
                      <td className="p-2 text-left font-sans font-semibold">Sole Source</td>
                      <td className="p-2 text-slate-400">X</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                    </tr>
                    <tr className={selectedSupplierCount === 'Single' ? 'bg-[#EAF3FC] font-bold' : ''}>
                      <td className="p-2 text-left font-sans font-semibold">Single Source</td>
                      <td className="p-2 text-amber-700">B</td>
                      <td className="p-2 text-amber-700">B</td>
                      <td className="p-2 text-orange-800">C</td>
                      <td className="p-2 text-orange-800">C</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                    </tr>
                    <tr className={selectedSupplierCount === 'Dual' ? 'bg-[#EAF3FC] font-bold' : ''}>
                      <td className="p-2 text-left font-sans font-semibold">Dual Source</td>
                      <td className="p-2 text-emerald-700">A</td>
                      <td className="p-2 text-emerald-700">A</td>
                      <td className="p-2 text-amber-700">B</td>
                      <td className="p-2 text-orange-800">C</td>
                      <td className="p-2 text-[#DC2626] font-bold">D</td>
                    </tr>
                    <tr className={selectedSupplierCount === 'Multiple' ? 'bg-[#EAF3FC] font-bold' : ''}>
                      <td className="p-2 text-left font-sans font-semibold">Multiple Sources</td>
                      <td className="p-2 text-emerald-700">A</td>
                      <td className="p-2 text-emerald-700">A</td>
                      <td className="p-2 text-amber-700">B</td>
                      <td className="p-2 text-amber-700">B</td>
                      <td className="p-2 text-slate-400">X</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL TOOLS & SINGLE POINT OF TRUTH */}
      {activeDimensionTab === 'digital-tools' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-xs space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#EAF3FC] font-mono text-[10px] text-[#176BCE] font-bold">
                WHITE PAPER PAGE 23 & 24 ARCHITECTURE
              </span>
              <h3 className="text-[18px] font-bold text-[#101B33] mt-1">
                Data Management & Single Source of Truth
              </h3>
              <p className="text-[13px] text-slate-600">
                All relevant supplier and market data is consolidated within a central database, serving as a single point of truth across both preventive and reactive applications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="font-mono text-[11px] font-bold text-[#176BCE] uppercase block mb-1">
                  1. Cause-Oriented Risk Data
                </span>
                <p className="text-[12px] text-slate-600">
                  Continuous feed of supplier financial credit ratings (Dun & Bradstreet, Creditreform), Altman Z-Scores, and quality PPM performance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="font-mono text-[11px] font-bold text-[#176BCE] uppercase block mb-1">
                  2. Impact-Oriented Risk Data
                </span>
                <p className="text-[12px] text-slate-600">
                  Real-time ERP synchronization (SAP) connecting bill-of-materials explosion with inventory buffer days and production stop-ship revenue.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="font-mono text-[11px] font-bold text-[#176BCE] uppercase block mb-1">
                  3. Automated osapiens Telemetry
                </span>
                <p className="text-[12px] text-slate-600">
                  Global news, geopolitical embargoes, and compliance probers streaming early-warning signals directly into the 15M Risk Radar.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1527] text-white flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#19B6A4] uppercase font-bold">
                  Sourcing Champions Executive Guarantee
                </span>
                <h4 className="text-[15px] font-bold text-white">
                  &ldquo;Transforming Sourcing & Procurement into a Real Competitive Advantage&rdquo;
                </h4>
                <p className="text-[12px] text-slate-400">
                  Up to 80% spend under category strategy, full ESG compliance, and 100% digital risk adoption.
                </p>
              </div>

              <a
                href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
                target="_blank"
                rel="noreferrer noopener"
                download
                className="px-4 py-2 rounded-lg bg-[#176BCE] hover:bg-[#1357A6] text-white font-semibold text-[12px] whitespace-nowrap shadow-sm shrink-0"
              >
                Download Complete White Paper
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
