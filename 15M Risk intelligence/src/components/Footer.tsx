import React from 'react';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenAbout,
  onOpenContact,
}) => {
  return (
    <footer className="mt-12 bg-[#0C1527] text-slate-300 border-t border-[#1C2C4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Responsive Multi-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission Statement (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#176BCE] to-[#19B6A4] flex items-center justify-center p-0.5 shadow-md shadow-[#19B6A4]/15">
                <div className="w-full h-full bg-[#101B33] rounded-[6px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#19B6A4] text-[18px]">hub</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-tight text-[15px] leading-tight">
                  Sourcing Champions
                </span>
                <span className="font-mono text-[10px] text-[#19B6A4] tracking-wider uppercase font-semibold">
                  15M Risk Intelligence Hub
                </span>
              </div>
            </div>

            <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm">
              The premier European enterprise intelligence platform for supply chain resilience, forensic supplier solvency audits, and multi-tier bill-of-materials risk monitoring.
            </p>

            {/* Social Media Links with Accessible Labels & Icons */}
            <div className="pt-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Connect With Intelligence Desk
              </span>
              <div className="flex items-center gap-3 text-slate-300">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Sourcing Champions on LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#176BCE] hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Sourcing Champions on X Twitter"
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#176BCE] hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Sourcing Champions on Facebook"
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#176BCE] hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Sourcing Champions Intelligence Briefings on YouTube"
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#EF4444] hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: 15M Methodology & Services */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-bold block mb-3">
              15M Methodology
            </span>
            <ul className="space-y-2 text-[13px] text-slate-400">
              <li>
                <button 
                  onClick={onOpenAbout} 
                  className="hover:text-white transition-colors text-left"
                >
                  15M Risk Taxonomy v4.2
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Time-to-Survive (TTS) Index
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Time-to-Recover (TTR) Models
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Single-Source Moat Scoring
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  osapiens Live Telemetry API
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Regulatory */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-bold block mb-3">
              Compliance & Audit
            </span>
            <ul className="space-y-2 text-[13px] text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  ISO 31000 Risk Management
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  BAFA CSDDD Human Rights Audit
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  EU CSRD Scope 3 Verification
                </span>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyPolicy}
                  className="hover:text-white text-left transition-colors text-[#19B6A4]"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Forensic Insolvency Escrow
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Executive Headquarters & Contact */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-bold block mb-3">
              Operations & Headquarters
            </span>
            <ul className="space-y-2 text-[13px] text-slate-400">
              <li className="text-white font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#19B6A4]">location_on</span>
                <span>Weesperzijde 4, 1091EA</span>
              </li>
              <li className="text-[12px] text-slate-300">
                Amsterdam, Netherlands
              </li>
              <li className="font-mono text-[11px] text-slate-300 flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                <a href="mailto:info@sourcingchampions.com" className="hover:text-white">
                  info@sourcingchampions.com
                </a>
              </li>
              <li className="font-mono text-[11px] text-[#19B6A4] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">public</span>
                <a href="https://www.sourcingchampions.com" target="_blank" rel="noreferrer" className="hover:underline">
                  www.sourcingchampions.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  download
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#176BCE]/20 text-[#60A5FA] border border-[#176BCE]/40 font-mono text-[10px] hover:bg-[#176BCE] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">download</span>
                  <span>15M White Paper (PDF)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Badges */}
        <div className="mt-10 pt-6 border-t border-[#1C2C4E]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© Copyright 2026 Sourcing Champions · All rights Reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="italic text-slate-400">&ldquo;No Risk, No Fun. No Risk, No Business.&rdquo;</span>
            <span className="hidden sm:inline">·</span>
            <button 
              onClick={onOpenPrivacyPolicy} 
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Terms of Engagement
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19B6A4]"></span>
              Prof. Dr. Gerhard Heß 15M Architecture
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              ISO 31000 / BAFA CSDDD Compliant
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
