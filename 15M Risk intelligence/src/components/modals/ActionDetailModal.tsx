import React from 'react';
import { PriorityAction } from '../../types';

interface ActionDetailModalProps {
  action: PriorityAction | null;
  onClose: () => void;
  onExecute: (action: PriorityAction) => void;
}

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({
  action,
  onClose,
  onExecute,
}) => {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E0E7F1] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626]">
              {action.code}
            </span>
            <span className="text-[11px] font-semibold text-[#176BCE] bg-[#EAF3FC] px-2 py-0.5 rounded">
              {action.category}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <h3 className="font-bold text-[16px] text-[#101B33] leading-snug">
            {action.title}
          </h3>

          <p className="text-[13px] text-slate-600 leading-relaxed bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E0E7F1]">
            {action.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 rounded-lg border border-[#E0E7F1] bg-white">
              <span className="text-slate-500 block mb-1">Executive Sponsor:</span>
              <strong className="text-[#101B33]">{action.owner}</strong>
            </div>
            <div className="p-3 rounded-lg border border-[#E0E7F1] bg-white">
              <span className="text-slate-500 block mb-1">Financial Commitment:</span>
              <strong className="text-[#059669] text-[13px] font-mono">{action.financialAmount}</strong>
            </div>
            <div className="p-3 rounded-lg border border-[#E0E7F1] bg-white">
              <span className="text-slate-500 block mb-1">Stop-Ship Revenue Protected:</span>
              <strong className="text-[#101B33] font-mono">{action.revenueImpact}</strong>
            </div>
            <div className="p-3 rounded-lg border border-[#E0E7F1] bg-white">
              <span className="text-slate-500 block mb-1">Residual Risk Delta:</span>
              <strong className="text-[#059669]">{action.residualRisk}</strong>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FEF3C7] text-[12px] text-[#B45309] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#D97706] shrink-0">info</span>
            <span>
              Action carries binding financial or legal execution authority under CPO mandate. Sign-off will be logged to the immutable ISO 31000 audit registry.
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E0E7F1] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-slate-700 text-[13px] font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onExecute(action);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#176BCE] hover:bg-[#1357A6] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {action.actionButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
