import React, { useState } from 'react';
import { RiskAnchor, PriorityAction, SupplierItem } from '../../types';
import { AIAnalystAction } from '../../services/aiAnalystService';

interface AiRiskBriefingPanelProps {
  riskAnchors: RiskAnchor[];
  actions: PriorityAction[];
  suppliers: SupplierItem[];
  onTriggerAI: (action: AIAnalystAction, prompt?: string) => void;
}

export const AiRiskBriefingPanel: React.FC<AiRiskBriefingPanelProps> = ({
  riskAnchors,
  actions,
  suppliers,
  onTriggerAI,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const topAnchor = riskAnchors[0];
  const pendingActions = actions.filter((a) => a.status === 'pending');
  const overdueAction = actions.find((a) => a.urgency === 'overdue') || actions[0];

  return (
    <div className="bg-gradient-to-r from-[#0F1E38] via-[#0A192A] to-[#0A2640] rounded-xl border border-[#1E3A63] text-white p-4 sm:p-5 shadow-lg relative overflow-hidden mb-5">
      {/* Ambient background decoration */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#0084A8]/10 blur-2xl pointer-events-none" />
      <div className="absolute right-40 top-0 w-32 h-32 rounded-full bg-[#19B6A4]/10 blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0084A8] to-[#19B6A4] p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#0A192A] rounded-[7px] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#19B6A4] text-[20px]">smart_toy</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[15px] tracking-tight text-white flex items-center gap-2">
                <span>AI Risk Briefing</span>
                <span className="px-2 py-0.5 rounded-full bg-[#19B6A4]/20 border border-[#19B6A4]/40 text-[#19B6A4] font-mono text-[10px] font-bold">
                  15M Intelligence v4.2
                </span>
              </h3>
            </div>
            <p className="text-[12px] text-slate-300">
              Live automated synthesis across {suppliers.length} critical suppliers and {riskAnchors.length} high-severity risk anchors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTriggerAI('executive_briefing')}
            className="px-3 py-1.5 rounded-lg bg-[#0084A8] hover:bg-[#026E8C] text-white font-semibold text-[12px] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            <span>Launch AI Analyst</span>
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand AI Briefing' : 'Collapse AI Briefing'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {collapsed ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {!collapsed && (
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-[12px]">
          
          {/* Finding 1: Critical Single-Point-of-Failure */}
          <div className="bg-white/[0.05] border border-white/10 rounded-lg p-3 hover:bg-white/[0.08] transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[#00D2FF] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                Key Vulnerability
              </span>
              <span className="font-mono text-slate-400">Anchor {topAnchor?.code || 'R-101'}</span>
            </div>
            <div className="font-bold text-white text-[13px] mb-1">
              {topAnchor?.supplier || 'Nordvolt Cells AB'} · €48.2M Exposure
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
              4.2 weeks buffer stock vs 28 weeks requalification lead time. Export license halt review active.
            </p>
            <button
              type="button"
              onClick={() => onTriggerAI('explain_risk', `Explain risk anchor [${topAnchor?.code || 'R-101'}] ${topAnchor?.supplier} and resilience gap consequences`)}
              className="text-[#00D2FF] hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              <span>Explain Why This Matters</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>

          {/* Finding 2: 15M Resilience Gap Analysis */}
          <div className="bg-white/[0.05] border border-white/10 rounded-lg p-3 hover:bg-white/[0.08] transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[#19B6A4] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">view_in_ar</span>
                15M Cube Classification
              </span>
              <span className="font-mono text-slate-400">BB-2 Impact Gap</span>
            </div>
            <div className="font-bold text-white text-[13px] mb-1">
              Supply & Dependency Dominance (84.2/100)
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
              High risk concentration in sole-source microcontrollers & lithium cathodes. No hot-swap redundancy.
            </p>
            <button
              type="button"
              onClick={() => onTriggerAI('assess_risk', 'Assess the 15M Risk Cube dimensions for our top supply bottlenecks')}
              className="text-[#19B6A4] hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              <span>Run Guided 15M Assessment</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>

          {/* Finding 3: Overdue Decision Queue */}
          <div className="bg-white/[0.05] border border-white/10 rounded-lg p-3 hover:bg-white/[0.08] transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[#F87171] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">priority_high</span>
                Urgent Action Required
              </span>
              <span className="font-mono text-[#F87171] font-bold">{pendingActions.length} Pending</span>
            </div>
            <div className="font-bold text-white text-[13px] mb-1 truncate">
              {overdueAction ? overdueAction.title : 'Tooling CapEx Approval'}
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2 truncate">
              {overdueAction ? `${overdueAction.financialAmount} to protect ${overdueAction.revenueImpact} revenue.` : 'Critical dual-sourcing validation line.'}
            </p>
            <button
              type="button"
              onClick={() => onTriggerAI('recommend_mitigation', 'Suggest next steps and preventive measures for pending priority actions')}
              className="text-[#F87171] hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              <span>Recommend Mitigation Next Steps</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
