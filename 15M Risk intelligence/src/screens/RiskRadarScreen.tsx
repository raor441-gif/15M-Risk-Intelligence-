import React, { useState } from 'react';
import { RadarDomain } from '../types';
import { AIAnalystAction } from '../services/aiAnalystService';

interface RiskRadarScreenProps {
  domains: RadarDomain[];
  onOpenCalibrateWeights: () => void;
  onTriggerAI?: (action: AIAnalystAction, prompt?: string) => void;
}

export const RiskRadarScreen: React.FC<RiskRadarScreenProps> = ({
  domains,
  onOpenCalibrateWeights,
  onTriggerAI,
}) => {
  const [selectedDomainForGuide, setSelectedDomainForGuide] = useState<RadarDomain | null>(null);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#101B33]">15M Risk Radar · 9 Domain Posture</h2>
            <span className="px-2 py-0.5 rounded-md bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] font-mono text-[10px] font-bold">
              MULTI-ATTRIBUTE FRAMEWORK
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Weighted composite risk posture across key enterprise procurement dimensions grounded in Prof. Dr. Heß 15M Architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerAI && (
            <button
              type="button"
              onClick={() => onTriggerAI('assess_risk', 'Guide me through a comprehensive 15M Risk Cube assessment across all 9 official Tier 1 categories.')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#0084A8] hover:bg-[#026E8C] text-white text-[12px] font-semibold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">psychology</span>
              <span>15M Guided Assessment</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCalibrateWeights}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-white border border-[#DCE6EE] hover:bg-[#F4F8FA] text-slate-700 text-[12px] font-semibold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#176BCE]">tune</span>
            <span>Calibrate Weights</span>
          </button>
        </div>
      </div>

      {/* 15M Guided Assessment Banner */}
      <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">quiz</span>
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-[#166534]">15M Guided Risk Radar Diagnostic</h4>
            <p className="text-[12px] text-slate-600">
              Heß Methodology: Evaluate cause-oriented triggers vs. existential damage potential across the 9 official Tier-1 categories.
            </p>
          </div>
        </div>

        {onTriggerAI && (
          <button
            type="button"
            onClick={() => onTriggerAI('assess_risk', 'Run the 15M Diagnostic Checklist: Which domains exceed the Line of Acceptance, and what are the suggested category actions?')}
            className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-bold text-[12px] transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">checklist</span>
            <span>Run 15M Diagnostic</span>
          </button>
        )}
      </div>

      {/* Grid of the 9 Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => {
          const isSevere = domain.score >= 70;
          const isModerate = domain.score >= 50 && domain.score < 70;

          return (
            <div
              key={domain.slug}
              className={`bg-white rounded-xl p-5 border shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                isSevere
                  ? 'border-[#EF4444]/30 hover:border-[#EF4444]'
                  : isModerate
                  ? 'border-[#F59E0B]/30 hover:border-[#F59E0B]'
                  : 'border-[#10B981]/30 hover:border-[#10B981]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">
                      Domain Weight: {(domain.weight * 100).toFixed(0)}%
                    </span>
                    <h3 className="font-bold text-[16px] text-[#101B33] mt-0.5">
                      {domain.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                    isSevere
                      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                      : isModerate
                      ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                      : 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                  }`}>
                    {domain.score.toFixed(1)} / 100
                  </span>
                </div>

                {/* Progress Bar vs Target */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Current Risk Posture</span>
                    <span className="text-slate-400">Target: &lt; {domain.target}</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden flex relative">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
                      style={{ left: `${domain.target}%` }}
                      title={`Target: ${domain.target}`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSevere ? 'bg-[#DC2626]' : isModerate ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                      }`}
                      style={{ width: `${Math.min(domain.score, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[12px] text-slate-600 mt-3 leading-relaxed">
                  {domain.description}
                </p>

                {/* Key Drivers */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">
                    Key Telemetry Triggers:
                  </span>
                  <ul className="space-y-1">
                    {domain.keyDrivers.map((driver, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#176BCE]"></span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Guided AI Assessment Button for this domain */}
              {onTriggerAI && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">15M Category Review</span>
                  <button
                    type="button"
                    onClick={() => onTriggerAI('assess_risk', `Assess domain [${domain.name}] (Current Score: ${domain.score.toFixed(1)}/100, Target: ${domain.target}). What are the key risk drivers, missing data, and preventive 15M measures?`)}
                    className="px-2.5 py-1 rounded-md bg-[#EAF3FC] hover:bg-[#D5E8FA] text-[#176BCE] text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                    <span>Assess Domain</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
