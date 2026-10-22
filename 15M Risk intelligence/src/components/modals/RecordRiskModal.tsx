import React, { useState } from 'react';
import { RiskLikelihood, RiskSeverity } from '../../types';

interface RecordRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (riskData: {
    supplier: string;
    material: string;
    category: string;
    businessUnit: string;
    likelihood: RiskLikelihood;
    severity: RiskSeverity;
    financialExposure: string;
    bufferWeeks: number;
    description: string;
  }) => void;
}

export const RecordRiskModal: React.FC<RecordRiskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [supplier, setSupplier] = useState('');
  const [material, setMaterial] = useState('');
  const [category, setCategory] = useState('Energy Storage');
  const [businessUnit, setBusinessUnit] = useState('EV Mobility Platform');
  const [likelihood, setLikelihood] = useState<RiskLikelihood>(4);
  const [severity, setSeverity] = useState<RiskSeverity>(4);
  const [financialExposure, setFinancialExposure] = useState('€15.0M');
  const [bufferWeeks, setBufferWeeks] = useState(4.5);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim() || !material.trim()) return;
    onSubmit({
      supplier,
      material,
      category,
      businessUnit,
      likelihood,
      severity,
      financialExposure,
      bufferWeeks,
      description,
    });
    onClose();
  };

  const calculatedScore = likelihood * severity;
  const isCritical = calculatedScore >= 16;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E0E7F1] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#176BCE] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#101B33]">Record 15M Risk Incident</h3>
              <p className="text-[12px] text-slate-500">Log new supplier risk into the active 15M telemetry matrix</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Supplier Name *
              </label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Apex High-Purity Silicon Ltd"
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Critical Material / Part *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 300mm Ingot Wafers (SKU-WFR-09)"
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Procurement Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              >
                <option value="Energy Storage">Energy Storage</option>
                <option value="Microelectronics">Microelectronics</option>
                <option value="Specialty Metallurgy">Specialty Metallurgy</option>
                <option value="Polymers & Resins">Polymers & Resins</option>
                <option value="Optoelectronics">Optoelectronics</option>
                <option value="Raw Minerals">Raw Minerals</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Affected Business Unit
              </label>
              <input
                type="text"
                value={businessUnit}
                onChange={(e) => setBusinessUnit(e.target.value)}
                placeholder="e.g. EV Mobility Platform"
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              />
            </div>
          </div>

          {/* Matrix Coordinates */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E0E7F1]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-bold text-[#101B33]">5×5 Matrix Assessment</span>
              <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                isCritical ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]' : 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
              }`}>
                Compound Score: {calculatedScore} ({isCritical ? 'CRITICAL EXPOSURE' : 'HIGH MONITORING'})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Likelihood: {likelihood} (1–5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value) as RiskLikelihood)}
                  className="w-full accent-[#176BCE]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>1 Rare</span>
                  <span>5 Impending</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Severity / Financial Impact: {severity} (1–5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value) as RiskSeverity)}
                  className="w-full accent-[#176BCE]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>1 Marginal</span>
                  <span>5 Stop-Ship</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Estimated Revenue at Risk
              </label>
              <input
                type="text"
                value={financialExposure}
                onChange={(e) => setFinancialExposure(e.target.value)}
                placeholder="e.g. €22.5M"
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Inventory Buffer Runway (Weeks)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="52"
                value={bufferWeeks}
                onChange={(e) => setBufferWeeks(parseFloat(e.target.value) || 1)}
                className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1">
              Incident Context & Early Warning Rationale
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail root cause (e.g. single-source fab tool maintenance, export sanction, port blockage)..."
              className="w-full p-2.5 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:bg-white focus:border-[#176BCE] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E0E7F1] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-slate-700 text-[13px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#176BCE] hover:bg-[#1357A6] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              Commit Risk Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
