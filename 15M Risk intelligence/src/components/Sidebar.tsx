import React from 'react';

export type ScreenId = 
  | 'landing'
  | 'overview' 
  | '15m-cube'
  | 'risk-map' 
  | 'risk-radar' 
  | 'resilience' 
  | 'crisis-readiness' 
  | 'suppliers' 
  | 'materials' 
  | 'categories' 
  | 'financial-exposure' 
  | 'action-centre' 
  | 'reports-audit' 
  | 'governance-system'
  | 'about'
  | 'contact';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  actionCount: number;
  onOpenAIAnalyst?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  mobileOpen,
  onCloseMobile,
  actionCount,
  onOpenAIAnalyst,
}) => {
  const handleNav = (screen: ScreenId) => {
    onSelectScreen(screen);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-[#101B33] z-50 flex flex-col justify-between select-none shadow-[2px_0_20px_rgba(16,27,51,0.22)] border-r border-[#1C2C4E] transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header / Logo */}
          <div className="p-5 border-b border-[#1C2C4E]/80 bg-[#0C1527]/70 flex items-start justify-between">
            <div>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNav('overview')}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0084A8] to-[#19B6A4] flex items-center justify-center p-0.5 shadow-md shadow-[#0084A8]/25 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0A192A] rounded-[7px] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#19B6A4] text-[20px]">hub</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white tracking-tight text-[15px] leading-tight">Sourcing Champions</span>
                  <span className="font-mono text-[10px] text-[#00A6CC] tracking-wider uppercase font-semibold">15M Intelligence</span>
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#176BCE]/20 text-[#60A5FA] border border-[#176BCE]/30 text-[10px] uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#19B6A4] animate-pulse"></span>
                  Risk Hub Pro
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-medium">v4.2 PRO</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {/* Executive Section */}
            <div className="space-y-1">
              <div className="px-3 py-1 font-mono text-[10px] uppercase text-slate-400 tracking-widest font-semibold">
                Executive
              </div>

              <button
                type="button"
                onClick={() => handleNav('landing')}
                className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'landing'
                    ? 'bg-gradient-to-r from-[#0084A8] to-[#00A6CC] text-white shadow-sm shadow-[#0084A8]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {currentScreen === 'landing' && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#19B6A4]" />
                )}
                <span className={`material-symbols-outlined text-[18px] ${currentScreen === 'landing' ? 'text-white' : 'text-[#00D2FF]'}`}>
                  rocket_launch
                </span>
                <span className="flex items-center gap-1.5">
                  <span>Welcome Portal</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#00D2FF]/20 text-[#00D2FF] font-mono text-[9px] font-bold">
                    3D Globe
                  </span>
                </span>
                {currentScreen === 'landing' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#19B6A4] shadow-[0_0_8px_#19B6A4]"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNav('overview')}
                className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'overview'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {currentScreen === 'overview' && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#19B6A4]" />
                )}
                <span className={`material-symbols-outlined text-[18px] ${currentScreen === 'overview' ? 'text-white' : 'text-slate-400'}`}>
                  space_dashboard
                </span>
                <span>Overview</span>
                {currentScreen === 'overview' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#19B6A4] shadow-[0_0_8px_#19B6A4]"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNav('15m-cube')}
                className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === '15m-cube'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {currentScreen === '15m-cube' && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#19B6A4]" />
                )}
                <span className={`material-symbols-outlined text-[18px] ${currentScreen === '15m-cube' ? 'text-white' : 'text-[#19B6A4]'}`}>
                  view_in_ar
                </span>
                <span className="flex items-center gap-1.5">
                  <span>15M Risk Cube</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#19B6A4]/20 text-[#19B6A4] font-mono text-[9px] font-bold">
                    Whitepaper
                  </span>
                </span>
              </button>
            </div>

            {/* 15M Methodology Section */}
            <div className="space-y-1">
              <div className="px-3 py-1 font-mono text-[10px] uppercase text-slate-400 tracking-widest font-semibold">
                15M Methodology
              </div>
              <button
                type="button"
                onClick={() => handleNav('risk-map')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'risk-map'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">grid_view</span>
                <span>Risk Map</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('risk-radar')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'risk-radar'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">radar</span>
                <span>15M Risk Radar</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('resilience')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'resilience'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">hub</span>
                <span>Resilience</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('crisis-readiness')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'crisis-readiness'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">emergency_heat</span>
                <span>Crisis Readiness</span>
              </button>
            </div>

            {/* Supply Base & Inventory */}
            <div className="space-y-1">
              <div className="px-3 py-1 font-mono text-[10px] uppercase text-slate-400 tracking-widest font-semibold">
                Supply Base & Inventory
              </div>
              <button
                type="button"
                onClick={() => handleNav('suppliers')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'suppliers'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">corporate_fare</span>
                <span>Suppliers</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('materials')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'materials'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">inventory_2</span>
                <span>Materials</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('categories')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'categories'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">category</span>
                <span>Categories</span>
              </button>
            </div>

            {/* Decision & Governance */}
            <div className="space-y-1">
              <div className="px-3 py-1 font-mono text-[10px] uppercase text-slate-400 tracking-widest font-semibold">
                Decision & Governance
              </div>
              <button
                type="button"
                onClick={() => handleNav('financial-exposure')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'financial-exposure'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                <span>Financial Exposure</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('action-centre')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'action-centre'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">task_alt</span>
                <span>Action Centre</span>
                {actionCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#FCA5A5] font-mono text-[10px] font-bold">
                    {actionCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleNav('reports-audit')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'reports-audit'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">history_edu</span>
                <span>Reports & Audit</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('governance-system')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentScreen === 'governance-system'
                    ? 'bg-gradient-to-r from-[#176BCE] to-[#145CB2] text-white shadow-sm shadow-[#176BCE]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">tune</span>
                <span>Governance & System</span>
              </button>
            </div>
          </nav>

          {/* AI Risk Analyst Interactive Launcher Card */}
          {onOpenAIAnalyst && (
            <div className="px-3 pb-2">
              <div 
                onClick={() => {
                  onOpenAIAnalyst();
                  onCloseMobile();
                }}
                className="p-3 rounded-xl bg-gradient-to-r from-[#0084A8]/20 to-[#176BCE]/20 border border-[#00A6CC]/40 hover:border-[#00D2FF] transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-[#00D2FF] font-bold text-[12px]">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span>AI Risk Analyst</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#19B6A4] shadow-[0_0_8px_#19B6A4] animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 group-hover:text-white transition-colors leading-tight">
                  15M Risk Cube grounded copilot for briefings, diagnostics & mitigations.
                </p>
              </div>
            </div>
          )}

          {/* Sidebar Footer Telemetry */}
          <div className="p-3 border-t border-[#1C2C4E]/80 bg-[#0C1527]/80">
            <div className="flex items-center justify-between rounded-lg bg-white/[0.04] p-2.5 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19B6A4] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19B6A4]"></span>
                </span>
                <span className="font-mono text-[11px] text-slate-300 font-medium">Engine 100%</span>
              </div>
              <span className="font-mono text-[10px] text-[#19B6A4] font-semibold bg-[#19B6A4]/10 px-1.5 py-0.5 rounded border border-[#19B6A4]/20">
                EU-CENTRAL
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
