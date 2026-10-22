import React, { useState } from 'react';
import { ScreenId } from './Sidebar';

interface StickyHeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onToggleMobileSidebar: () => void;
  onOpenRecordRisk: () => void;
  onOpenExportBriefing: () => void;
  onOpenSearch: () => void;
  onOpenAIAnalyst?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onToggleMobileSidebar,
  onOpenRecordRisk,
  onOpenExportBriefing,
  onOpenSearch,
  onOpenAIAnalyst,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isLanding = currentScreen === 'landing';

  return (
    <header className={`fixed top-0 left-0 lg:left-64 right-0 h-16 backdrop-blur-md z-40 transition-colors duration-300 ${
      isLanding
        ? 'bg-[#040B16]/85 border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        : 'bg-white/95 border-b border-[#E0E7F1] shadow-[0_1px_10px_rgba(16,27,51,0.03)]'
    }`}>
      <div className="w-full h-16 px-4 lg:px-6 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* Left: Mobile hamburger + Sticky Top Navigation Links */}
        <div className="flex items-center gap-3 lg:gap-5 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#176BCE] ${
              isLanding ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Open sidebar navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Core Sticky Nav Links: 'Portal', 'Home', '15M Risk Cube', 'Services', 'About', 'Contact' */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onSelectScreen('landing')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentScreen === 'landing'
                  ? 'text-[#00D2FF] bg-[#0084A8]/20 border border-[#00A6CC]/40 shadow-xs'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#19B6A4] animate-pulse"></span>
              <span>Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectScreen('overview')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                currentScreen === 'overview'
                  ? isLanding ? 'text-[#00D2FF] bg-white/10' : 'text-[#176BCE] bg-[#EAF3FC]'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('15m-cube')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentScreen === '15m-cube'
                  ? isLanding ? 'text-[#00D2FF] bg-white/10' : 'text-[#176BCE] bg-[#EAF3FC]'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              <span>15M Risk Cube</span>
              <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-[#19B6A4]/20 text-[#19B6A4] font-mono text-[9px] font-bold">
                Whitepaper
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('risk-radar')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                currentScreen === 'risk-radar' || currentScreen === 'risk-map' || currentScreen === 'suppliers'
                  ? isLanding ? 'text-[#00D2FF] bg-white/10' : 'text-[#176BCE] bg-[#EAF3FC]'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('about')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                currentScreen === 'about'
                  ? isLanding ? 'text-[#00D2FF] bg-white/10' : 'text-[#176BCE] bg-[#EAF3FC]'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('contact')}
              className={`hidden sm:inline-flex px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                currentScreen === 'contact'
                  ? isLanding ? 'text-[#00D2FF] bg-white/10' : 'text-[#176BCE] bg-[#EAF3FC]'
                  : isLanding
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#101B33] hover:bg-slate-100'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Quick Search bar: Compact on xl, full width on 2xl */}
          <div className="hidden 2xl:flex relative w-full max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={onOpenSearch}
              placeholder="Search suppliers, materials, risks..."
              className={`w-full h-9 pl-9 pr-12 border rounded-lg text-[12px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#176BCE]/15 transition-all ${
                isLanding 
                  ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-[#00D2FF]' 
                  : 'bg-[#F5F8FC] border-[#E0E7F1] text-[#101B33] focus:bg-white focus:border-[#176BCE]'
              }`}
            />
            <span 
              onClick={onOpenSearch}
              className={`absolute right-2.5 top-2 px-1.5 py-0.5 rounded border font-mono text-[10px] font-semibold shadow-xs cursor-pointer ${
                isLanding ? 'bg-white/10 border-white/20 text-slate-300' : 'bg-white border-[#E0E7F1] text-slate-500'
              }`}
            >
              ⌘K
            </span>
          </div>

          {/* Search Trigger for xl screens */}
          <button
            type="button"
            onClick={onOpenSearch}
            className={`hidden xl:flex 2xl:hidden items-center gap-2 h-8 px-2.5 rounded-lg border text-[12px] font-medium transition-colors shrink-0 ${
              isLanding 
                ? 'bg-white/10 border-white/20 text-slate-300 hover:text-white hover:bg-white/15' 
                : 'bg-[#F5F8FC] border-[#E0E7F1] text-slate-600 hover:text-[#101B33] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">search</span>
            <span>Search</span>
            <kbd className={`px-1.5 py-0.2 rounded border font-mono text-[10px] ${
              isLanding ? 'bg-white/10 border-white/20 text-slate-300' : 'bg-white border-[#E0E7F1] text-slate-500'
            }`}>⌘K</kbd>
          </button>

          {/* Framework pill */}
          <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF3FC] text-[#176BCE] text-[11px] font-medium border border-[#D0E2FA] whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19B6A4]"></span>
            <span>15M Framework v4.2 · Synthetic Enterprise Model</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-Time osapiens Signal Badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[11px] font-semibold whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[15px] text-[#DC2626] animate-pulse">warning</span>
            <span>osapiens: 2 High Alert Signals</span>
          </div>

          {/* Action Buttons */}
          <a
            href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
            target="_blank"
            rel="noreferrer noopener"
            download
            className="hidden 2xl:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#E6F4F8] border border-[#BDE2EC] text-[#0084A8] hover:bg-[#D4EDF4] text-[12px] font-semibold transition-colors whitespace-nowrap"
            title="Download Prof. Dr. Gerhard Heß 15M White Paper"
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>15M White Paper</span>
          </a>

          {/* 15M AI Risk Analyst Button */}
          {onOpenAIAnalyst && (
            <button
              type="button"
              onClick={onOpenAIAnalyst}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg bg-gradient-to-r from-[#176BCE] to-[#0084A8] hover:from-[#145CB2] hover:to-[#026E8C] text-white text-[12px] font-bold transition-all shadow-sm shadow-[#176BCE]/25 whitespace-nowrap cursor-pointer"
              title="Open 15M AI Risk Analyst"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00D2FF]">psychology</span>
              <span>AI Analyst</span>
              <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-[#19B6A4] animate-pulse"></span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRecordRisk}
            className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg bg-[#0084A8] hover:bg-[#026E8C] text-white text-[12px] font-semibold transition-colors shadow-sm shadow-[#0084A8]/20 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden xs:inline">Record Risk</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportBriefing}
            className={`hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-semibold transition-colors shadow-xs whitespace-nowrap ${
              isLanding ? 'bg-white/10 border-white/20 text-white hover:bg-white/15' : 'bg-white border-[#DCE6EE] hover:bg-[#F4F8FA] text-[#0A192A]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isLanding ? 'text-slate-300' : 'text-slate-500'}`}>ios_share</span>
            <span>Export Briefing</span>
          </button>

          <div className={`h-6 w-px hidden sm:block ${isLanding ? 'bg-white/15' : 'bg-[#DCE6EE]'}`}></div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#EAF3FC] cursor-pointer text-slate-600 transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white rounded-full flex items-center justify-center font-mono text-[9px] font-bold ring-2 ring-white">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E0E7F1] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#101B33]">Critical Incident Feeds</span>
                  <span className="font-mono text-[10px] text-[#DC2626] font-semibold bg-[#FEF2F2] px-2 py-0.5 rounded-full">
                    3 New Alerts
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-[#F8FAFD] transition-colors cursor-pointer" onClick={() => onSelectScreen('overview')}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#DC2626] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                        Nordvolt Export Alert
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">8m ago</span>
                    </div>
                    <p className="text-[12px] text-slate-600">Swedish quota embargo threatens €48.2M cell supply.</p>
                  </div>
                  <div className="p-3 hover:bg-[#F8FAFD] transition-colors cursor-pointer" onClick={() => onSelectScreen('overview')}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#DC2626] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        Hexaprime Fab Contamination
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">24m ago</span>
                    </div>
                    <p className="text-[12px] text-slate-600">Yield alert on MCU-88 chips. Dual-sourcing CapEx required.</p>
                  </div>
                  <div className="p-3 hover:bg-[#F8FAFD] transition-colors cursor-pointer" onClick={() => onSelectScreen('overview')}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#D97706] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        Castellan Credit Downgrade
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">1h ago</span>
                    </div>
                    <p className="text-[12px] text-slate-600">D&B rating fallen to 5A4. Advance milestone frozen.</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => { setShowNotifications(false); onSelectScreen('action-centre'); }}
                    className="text-[#176BCE] hover:underline text-[12px] font-semibold"
                  >
                    View All Priority Actions →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 pl-1 rounded-lg p-1 transition-colors ${isLanding ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}
            >
              <img
                alt="Elena Rostova"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#176BCE]/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMCyB1AOUFTDFjpywGWeBdzhWhjeCgQVtRntQYOhUdFTKk9L6TV5LsHKsd95UbHZV3uBe-lALVMlycMqs7110PaPBStAfcQuGlRQVDHckN-5cr-r9eCl6WNUIuH1QsJxuD5A9HM4NH_tP7mPh6TGl2MTTCi3Xf_aDPmsOm6BMUBSP1S1n_iy3glcUoRjBB8HeqtJlhqGuNC5f6hSOZhapgDJhk4rPCfVavhK2r8ogSRLfpgjDHOS4"
              />
              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[12px] font-semibold leading-tight ${isLanding ? 'text-white' : 'text-[#101B33]'}`}>Elena Rostova</span>
                  <span className={`px-1 py-0.2 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${isLanding ? 'bg-[#176BCE]/30 text-[#00D2FF]' : 'bg-[#EAF3FC] text-[#176BCE]'}`}>
                    Enterprise
                  </span>
                </div>
                <span className={`text-[11px] leading-tight ${isLanding ? 'text-slate-400' : 'text-slate-500'}`}>Chief Procurement Officer</span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E0E7F1] py-2 z-50 text-[12px]">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="font-bold text-[#101B33]">Elena Rostova</p>
                  <p className="text-slate-500 text-[11px]">elena.rostova@sourcingchampions.com</p>
                  <span className="inline-block mt-1 font-mono text-[10px] text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded font-semibold">
                    Global CPO Authorization Active
                  </span>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => { setShowProfileMenu(false); onSelectScreen('governance-system'); }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F5F8FC] text-slate-700 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-400">tune</span>
                    Risk Calibration Settings
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); onSelectScreen('reports-audit'); }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F5F8FC] text-slate-700 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-400">security</span>
                    Audit & Compliance Package
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
