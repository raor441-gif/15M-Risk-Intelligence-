import React from 'react';
import { PriorityAction } from '../types';

interface ActionCentreScreenProps {
  actions: PriorityAction[];
  onExecuteAction: (action: PriorityAction) => void;
  onInspectAction: (action: PriorityAction) => void;
}

export const ActionCentreScreen: React.FC<ActionCentreScreenProps> = ({
  actions,
  onExecuteAction,
  onInspectAction,
}) => {
  const pending = actions.filter((a) => a.status === 'pending');
  const executed = actions.filter((a) => a.status !== 'pending');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#101B33]">Action Centre · Decision Pipeline</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white font-mono text-[10px] font-bold">
              {pending.length} Actions Awaiting Authorization
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Binding CPO mandates mitigating critical stop-ship paths across powertrain and microelectronics.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-[#E0E7F1]">
          <span>Pipeline Status: 8 Open · 2 Overdue · 1 Blocked · 19 Completed QoQ</span>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="space-y-4">
        <h3 className="font-bold text-[15px] text-[#101B33] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse"></span>
          Pending Executive Sign-offs
        </h3>

        {pending.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#E0E7F1] text-slate-500">
            <span className="material-symbols-outlined text-[36px] text-[#059669] mb-1">check_circle</span>
            <p className="font-semibold text-[#101B33]">All priority actions authorized</p>
            <p className="text-[12px] text-slate-400">Next risk escalation review scheduled in 4d 06h</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#176BCE]/40 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] font-mono text-[10px] font-bold">
                      {act.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] text-[10px] font-semibold">
                      {act.category}
                    </span>
                    <span className="font-mono text-[11px] text-[#DC2626] font-bold bg-[#FEF2F2] px-2 py-0.5 rounded">
                      {act.urgencyLabel}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#101B33] mt-2">{act.title}</h4>
                  <p className="text-[13px] text-slate-600 mt-1">{act.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
                    <span>Owner: <strong className="text-[#101B33]">{act.owner}</strong></span>
                    <span>Commitment: <strong className="text-[#059669] font-mono font-bold">{act.financialAmount}</strong></span>
                    <span>Protected: <strong className="text-[#101B33] font-mono">{act.revenueImpact}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => onInspectAction(act)}
                    className="px-3.5 h-8 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-[#101B33] text-[12px] font-semibold"
                  >
                    {act.secondaryButtonLabel}
                  </button>
                  <button
                    onClick={() => onExecuteAction(act)}
                    className="px-4 h-8 rounded-lg bg-[#176BCE] hover:bg-[#1357A6] text-white text-[12px] font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    {act.actionButtonLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Executed History Log */}
      {executed.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-[15px] text-[#101B33] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
            Executed & Enforced QoQ
          </h3>
          <div className="space-y-2">
            {executed.map((act) => (
              <div
                key={act.id}
                className="bg-[#F8FAFD] rounded-xl p-4 border border-[#E0E7F1] flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#059669] mr-2">
                    {act.code} · EXECUTED
                  </span>
                  <span className="font-bold text-[13px] text-[#101B33]">{act.title}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Signed by {act.owner} · Logged in ISO 31000 Registry</p>
                </div>
                <span className="font-mono font-bold text-[12px] text-[#059669]">
                  {act.financialAmount} Committed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
