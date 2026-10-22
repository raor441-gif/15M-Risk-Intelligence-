import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E0E7F1] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#176BCE] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#101B33]">Privacy Policy & Data Governance</h3>
              <p className="text-[12px] text-slate-500">ISO 27001 / GDPR / BAFA CSDDD Regulatory Compliance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-[13px] text-slate-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-[#101B33] text-[14px] mb-1">1. Enterprise Data Handling & Privacy</h4>
            <p>
              Sourcing Champions B.V. processes supplier financial metrics, ERP bill-of-materials runs, and osapiens early-warning telemetry in accordance with Regulation (EU) 2016/679 (General Data Protection Regulation). All multi-tier supplier data is encrypted at rest using AES-256 and transmitted exclusively via TLS 1.3 protocol.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#101B33] text-[14px] mb-1">2. Supply Chain Due Diligence (BAFA CSDDD)</h4>
            <p>
              Telemetry ingested from automated feeds is analyzed strictly to ensure compliance with the German Supply Chain Due Diligence Act (LkSG / BAFA) and EU Corporate Sustainability Due Diligence Directive (CSDDD). Human rights and environmental risk parameters are audited by certified independent auditors.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#101B33] text-[14px] mb-1">3. Confidentiality of Supplier Solvency & Escrow</h4>
            <p>
              Credit downgrades and insolvency escrow flags (e.g. Dun & Bradstreet rating downgrades) are classified as Confidential Executive Material. Such signals are restricted to designated C-suite officers and authorized procurement council members.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#101B33] text-[14px] mb-1">4. Data Retention & EU Sovereignty</h4>
            <p>
              All customer telemetry resides in secure data centers situated within the European Union (Frankfurt / Amsterdam nodes). Audit trails are retained for 7 years pursuant to international financial audit requirements.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E0E7F1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#176BCE] hover:bg-[#1357A6] text-white text-[13px] font-semibold rounded-lg shadow-sm"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
