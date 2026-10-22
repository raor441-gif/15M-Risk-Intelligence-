import React, { useState } from 'react';
import { RadarDomain } from '../../types';

interface CalibrateWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: RadarDomain[];
  onSaveDomains: (updated: RadarDomain[]) => void;
}

export const CalibrateWeightsModal: React.FC<CalibrateWeightsModalProps> = ({
  isOpen,
  onClose,
  domains,
  onSaveDomains,
}) => {
  const [localDomains, setLocalDomains] = useState<RadarDomain[]>(domains);

  if (!isOpen) return null;

  const handleScoreChange = (index: number, newScore: number) => {
    const next = [...localDomains];
    next[index] = { ...next[index], score: newScore };
    setLocalDomains(next);
  };

  const handleSave = () => {
    onSaveDomains(localDomains);
    onClose();
  };

  const handleReset = () => {
    setLocalDomains(domains);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E0E7F1] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E7F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#176BCE] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#101B33]">Calibrate 15M Risk Taxonomy Weights</h3>
              <p className="text-[12px] text-slate-500">Fine-tune domain sensitivity thresholds for Q3 2024</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-[12px] text-slate-600">
            Adjust composite risk scores for the 9 procurement domains. Higher scores reflect greater operational, geopolitical, or financial vulnerability.
          </p>

          <div className="space-y-3">
            {localDomains.map((domain, idx) => (
              <div key={domain.slug} className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E0E7F1]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[12px] text-[#101B33]">
                    {domain.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-[#176BCE]">
                      {domain.score.toFixed(1)} / 100
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      domain.score >= 70 ? 'bg-[#FEF2F2] text-[#DC2626]' : domain.score >= 50 ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#ECFDF5] text-[#059669]'
                    }`}>
                      {domain.score >= 70 ? 'Severe' : domain.score >= 50 ? 'Moderate' : 'Optimal'}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="0.5"
                  value={domain.score}
                  onChange={(e) => handleScoreChange(idx, parseFloat(e.target.value))}
                  className="w-full accent-[#176BCE]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Target: &lt; {domain.target.toFixed(1)}</span>
                  <span className="truncate max-w-[280px]">{domain.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E0E7F1] flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-[12px] text-slate-500 hover:text-slate-800 font-medium"
            >
              Reset to Defaults
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E0E7F1] hover:bg-[#F5F8FC] text-slate-700 text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[#176BCE] hover:bg-[#1357A6] text-white text-[12px] font-semibold"
              >
                Apply Calibration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
