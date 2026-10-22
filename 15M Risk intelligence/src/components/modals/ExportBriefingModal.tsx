import React, { useState } from 'react';

interface ExportBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  criticalCount: number;
  revenueAtRisk: string;
}

export const ExportBriefingModal: React.FC<ExportBriefingModalProps> = ({
  isOpen,
  onClose,
  criticalCount,
  revenueAtRisk,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (format: 'pdf' | 'csv' | 'json') => {
    // Generate and trigger simulated instant download
    const filename = `15M_Executive_Risk_Briefing_Q3_2024.${format}`;
    const blob = new Blob([
      `Sourcing Champions · 15M Risk Intelligence Hub Executive Briefing
Date: October 2026
Critical Exposure: ${criticalCount} Tier-1 Bottlenecks
Total Stop-Ship Revenue at Risk: ${revenueAtRisk}
ISO 31000 & BAFA CSDDD Certified Evaluation
Anchors: R-101 (Nordvolt), R-104 (Hexaprime), R-188 (Sundara), R-112 (Castellan)
`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E0E7F1]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#176BCE] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#101B33]">Export CPO Executive Briefing</h3>
              <p className="text-[12px] text-slate-500">Generate board-ready risk dossier with full audit trails</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E0E7F1] text-[12px] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Reporting Cycle:</span>
              <span className="font-bold text-[#101B33]">Q3 2024 · Live osapiens Telemetry</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Critical Tier-1 Bottlenecks:</span>
              <span className="font-bold text-[#DC2626]">{criticalCount} active anchors</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Stop-Ship Revenue Exposure:</span>
              <span className="font-bold text-[#101B33] font-mono">{revenueAtRisk}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Regulatory Standard:</span>
              <span className="font-mono text-[11px] text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded">
                ISO 31000 / BAFA CSDDD
              </span>
            </div>
          </div>

          <p className="text-[12px] text-slate-600">
            Select export format to compile bill-of-materials explosion, supplier single-source moats, and mitigation CapEx proposals:
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => handleDownload('pdf')}
              className="p-3 rounded-xl border border-[#E0E7F1] hover:border-[#176BCE] hover:bg-[#EAF3FC]/30 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <span className="material-symbols-outlined text-[24px] text-[#DC2626]">picture_as_pdf</span>
              <span className="font-bold text-[12px] text-[#101B33] group-hover:text-[#176BCE]">PDF Dossier</span>
              <span className="text-[10px] text-slate-400">Board Slide Deck</span>
            </button>

            <button
              onClick={() => handleDownload('csv')}
              className="p-3 rounded-xl border border-[#E0E7F1] hover:border-[#176BCE] hover:bg-[#EAF3FC]/30 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <span className="material-symbols-outlined text-[24px] text-[#059669]">table_view</span>
              <span className="font-bold text-[12px] text-[#101B33] group-hover:text-[#176BCE]">CSV Raw Data</span>
              <span className="text-[10px] text-slate-400">ERP & Excel Format</span>
            </button>

            <button
              onClick={() => handleDownload('json')}
              className="p-3 rounded-xl border border-[#E0E7F1] hover:border-[#176BCE] hover:bg-[#EAF3FC]/30 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <span className="material-symbols-outlined text-[24px] text-[#176BCE]">data_object</span>
              <span className="font-bold text-[12px] text-[#101B33] group-hover:text-[#176BCE]">JSON Schema</span>
              <span className="text-[10px] text-slate-400">SAP / API Ingestion</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[12px] font-semibold text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Briefing exported successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
