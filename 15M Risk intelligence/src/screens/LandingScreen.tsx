import React from 'react';
import { ScreenId } from '../components/Sidebar';

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenRecordRisk: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNavigate,
  onOpenRecordRisk,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-10 z-10">
      {/* Hero Section */}
      <div className="max-w-4xl pt-4 lg:pt-8 space-y-6">
        
        {/* Top Intelligence Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0084A8]/15 border border-[#00A6CC]/30 text-[#00D2FF] text-[12px] font-mono font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#19B6A4] animate-pulse" />
          <span>osapiens Telemetry Live Integration · 15M Architecture v4.2</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.14]">
          <span className="block">Transforming Sourcing &amp; Procurement</span>
          <span className="text-gradient-cyan mt-1">
            Into A Real Competitive Advantage.
          </span>
        </h1>

        {/* Hero Prose */}
        <p className="text-[15px] sm:text-[17px] text-slate-300 max-w-2xl leading-relaxed">
          The next-generation enterprise risk intelligence command center. Systematically evaluate sole-source vulnerabilities, simulate stop-ship exposure, and execute CPO mitigation mandates across multi-tier global supply chains.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0084A8] to-[#00A6CC] hover:from-[#026E8C] hover:to-[#0084A8] text-white font-bold text-[14px] shadow-lg shadow-[#0084A8]/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
            <span>Launch Executive Risk Hub</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('15m-cube')}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-[14px] backdrop-blur-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px] text-[#00D2FF]">view_in_ar</span>
            <span>Explore 15M Risk Cube</span>
          </button>

          <a
            href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
            target="_blank"
            rel="noreferrer noopener"
            download
            className="px-4 py-3 rounded-xl text-slate-300 hover:text-white font-mono text-[12px] flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>White Paper (PDF)</span>
          </a>
        </div>

        {/* Executive KPI Micro-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3.5 rounded-xl bg-[#071526]/80 border border-[#162D4A] backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold block">
              Revenue at Risk
            </span>
            <strong className="text-[22px] font-mono font-extrabold text-white">€112.5M</strong>
            <span className="text-[#00D2FF] text-[10px] block mt-0.5 font-medium">BOM Stop-Ship Model</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071526]/80 border border-[#162D4A] backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold block">
              Sole-Source Moats
            </span>
            <strong className="text-[22px] font-mono font-extrabold text-[#EF4444]">14</strong>
            <span className="text-slate-400 text-[10px] block mt-0.5 font-medium">&lt; 6w Buffer Runway</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071526]/80 border border-[#162D4A] backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold block">
              Resilience Score
            </span>
            <strong className="text-[22px] font-mono font-extrabold text-[#19B6A4]">64 / 100</strong>
            <span className="text-[#10B981] text-[10px] block mt-0.5 font-medium">+4 QoQ Enterprise</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#071526]/80 border border-[#162D4A] backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold block">
              15M Domains
            </span>
            <strong className="text-[22px] font-mono font-extrabold text-white">9</strong>
            <span className="text-[#00A6CC] text-[10px] block mt-0.5 font-medium">ISO 31000 Standard</span>
          </div>
        </div>
      </div>

      {/* Feature Pillar Trio Inspired by Sourcing Champions & osapiens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
        <div 
          onClick={() => onNavigate('risk-map')}
          className="p-5 rounded-2xl bg-[#0A1A2E]/85 border border-[#162D4A] hover:border-[#00A6CC] hover:bg-[#0C223D] transition-all cursor-pointer backdrop-blur-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0084A8]/20 text-[#00D2FF] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">grid_view</span>
          </div>
          <h3 className="font-bold text-[16px] text-white group-hover:text-[#00D2FF] transition-colors">
            Cause-Oriented 5×5 Risk Map
          </h3>
          <p className="text-[13px] text-slate-300 mt-1.5 leading-relaxed">
            Deterministic Likelihood vs Severity scoring with defined acceptance boundaries. Automated live incident tracking across suppliers, categories, and processes.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('resilience')}
          className="p-5 rounded-2xl bg-[#0A1A2E]/85 border border-[#162D4A] hover:border-[#19B6A4] hover:bg-[#0C223D] transition-all cursor-pointer backdrop-blur-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#19B6A4]/20 text-[#19B6A4] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">timer</span>
          </div>
          <h3 className="font-bold text-[16px] text-white group-hover:text-[#19B6A4] transition-colors">
            Impact-Oriented Resilience Gap
          </h3>
          <p className="text-[13px] text-slate-300 mt-1.5 leading-relaxed">
            BOM parts-list resolution measuring Time-to-Survive (TTS) inventory buffers against alternate vendor qualification lead time (TTR) before stop-ship activation.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('action-centre')}
          className="p-5 rounded-2xl bg-[#0A1A2E]/85 border border-[#162D4A] hover:border-[#00D2FF] hover:bg-[#0C223D] transition-all cursor-pointer backdrop-blur-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
          </div>
          <h3 className="font-bold text-[16px] text-white group-hover:text-[#00D2FF] transition-colors">
            CPO Mandate & Decision Queue
          </h3>
          <p className="text-[13px] text-slate-300 mt-1.5 leading-relaxed">
            Binding executive sign-offs: €1.2M dual-sourcing tooling authorization, strategic buffer raw material hedging, and forensic insolvency escrow freezes.
          </p>
        </div>
      </div>
    </div>
  );
};
