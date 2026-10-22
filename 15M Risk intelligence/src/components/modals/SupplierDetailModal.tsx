import React from 'react';
import { SupplierItem } from '../../types';

interface SupplierDetailModalProps {
  supplier: SupplierItem | null;
  onClose: () => void;
}

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  supplier,
  onClose,
}) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E0E7F1] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[18px] text-[#101B33]">{supplier.name}</h3>
              {supplier.isSoleSource && (
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                  SOLE SOURCE
                </span>
              )}
            </div>
            <p className="text-[12px] font-mono text-slate-500 mt-0.5">
              {supplier.code} · {supplier.location} · {supplier.tier}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-[13px]">
          {/* Status signal callout */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E0E7F1] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Live osapiens Early-Warning Status
              </span>
              <span className="font-bold text-[#101B33] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                {supplier.osapiensSignal.label}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-1 rounded-md border border-[#FEE2E2]">
              Alert Active
            </span>
          </div>

          {/* Metric Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white border border-[#E0E7F1]">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Buffer Runway</span>
              <strong className="text-[16px] font-mono font-extrabold text-[#DC2626]">{supplier.bufferWeeks}w</strong>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E0E7F1]">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Requal Gap</span>
              <strong className="text-[16px] font-mono font-extrabold text-slate-700">{supplier.gapWeeks}w</strong>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E0E7F1]">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Credit Rating</span>
              <strong className="text-[14px] font-mono font-bold text-[#101B33]">{supplier.creditRating || 'BBB'}</strong>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E0E7F1]">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">ESG Score</span>
              <strong className="text-[16px] font-mono font-extrabold text-[#059669]">{supplier.esgScore || 85}/100</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E0E7F1] space-y-2">
            <h4 className="font-bold text-[14px] text-[#101B33]">Material & Production Impact</h4>
            <p className="text-slate-600 text-[12px] leading-relaxed">
              Supplies <strong className="text-[#101B33]">{supplier.material}</strong> (<code>{supplier.materialSku}</code>) to the <strong>{supplier.businessUnit}</strong>.
              Failure of this component impacts a stop-ship production value of <strong>{supplier.financialExposure}</strong> against annual strategic procurement spend of <strong>{supplier.spend}</strong>.
            </p>
          </div>

          {supplier.contactPerson && (
            <div className="p-3 rounded-lg bg-[#F8FAFD] border border-slate-100 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Procurement Contact:</span>
                <span className="font-bold text-[#101B33]">{supplier.contactPerson}</span>
              </div>
              <span className="font-mono text-[11px] text-[#176BCE]">NDA Verified</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E0E7F1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#176BCE] hover:bg-[#1357A6] text-white text-[13px] font-semibold rounded-lg shadow-sm"
          >
            Close Deep-Dive
          </button>
        </div>
      </div>
    </div>
  );
};
