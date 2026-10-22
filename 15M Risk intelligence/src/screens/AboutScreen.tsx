import React from 'react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-5xl mx-auto">
      {/* Title & Author Header */}
      <div className="border-b border-[#E0E7F1] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#EAF3FC] text-[#176BCE] font-mono text-[11px] font-bold border border-[#D0E2FA]">
              WHITE PAPER REFERENCE · PROF. DR. GERHARD HEß
            </span>
            <span className="text-[12px] text-slate-500 font-mono">15M Architecture Quick Start</span>
          </div>
          <h2 className="text-[26px] font-extrabold text-[#101B33] mt-2 tracking-tight">
            Systematically Managing Procurement Risks with the 15M Architecture
          </h2>
          <p className="text-[14px] text-slate-600 mt-1 italic">
            &ldquo;No Risk, No Fun. <strong className="text-[#101B33]">No Risk, No Business.</strong>&rdquo;
          </p>
        </div>

        <a
          href="/assets/aistudio/Sourcing-Champions_White-paper-15M_RISK_d5f9b294.pdf"
          target="_blank"
          rel="noreferrer noopener"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176BCE] hover:bg-[#1357A6] text-white font-semibold text-[13px] shadow-sm transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download White Paper PDF</span>
        </a>
      </div>

      {/* Philosophy: Risk Management as an Investment */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-xs space-y-4">
        <h3 className="text-[17px] font-bold text-[#101B33]">
          1. Philosophy: Risk Management as an Investment (Section 2.2)
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          Actions to reduce risk are strategic investments. In essence, it is offsetting the costs today for uncertain future returns or savings. The role of risk management is to make balanced, well-informed investment decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
            <span className="font-mono text-[11px] font-bold text-[#176BCE] uppercase block">
              Single-Source Strategy
            </span>
            <ul className="text-[12px] text-slate-600 space-y-1">
              <li>• Bundling / volume discounts & fixed order cost reduction</li>
              <li>• Simplified supplier management & preferred customer status</li>
              <li className="text-amber-800 font-semibold">• Trade-off: Severe vulnerability to stop-ship disruption</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-2">
            <span className="font-mono text-[11px] font-bold text-[#059669] uppercase block">
              Second-Source Investment Strategy
            </span>
            <ul className="text-[12px] text-slate-600 space-y-1">
              <li>• Security of supply & protection against regional factory freezes</li>
              <li>• Elimination of single-vendor dependency pricing power</li>
              <li className="text-[#059669] font-semibold">• Trade-off: Known setup CapEx vs uncertain future benefit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The 5 Strategy Partitions */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-xs space-y-4">
        <h3 className="text-[17px] font-bold text-[#101B33]">
          2. The Five Strategy Partitions (SP1 – SP5) of 15M Architecture
        </h3>
        <p className="text-[13px] text-slate-600">
          The 15M Architecture provides a holistic and integrated view of procurement, encompassing all relevant decision dimensions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-[12px]">
          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#176BCE] block">SP1</span>
              <strong className="text-[#101B33] block mt-1">Framework Strategy</strong>
              <p className="text-slate-500 text-[11px] mt-1">Aligns procurement with overall business goals & risk appetite.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#176BCE] block">SP2</span>
              <strong className="text-[#101B33] block mt-1">Category Strategies</strong>
              <p className="text-slate-500 text-[11px] mt-1">Dedicated 4-step strategic roadmap for each product category.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#176BCE] block">SP3</span>
              <strong className="text-[#101B33] block mt-1">Supplier Strategies</strong>
              <p className="text-slate-500 text-[11px] mt-1">Governs collaboration, single-source moats, and vendor evaluation.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#176BCE] block">SP4</span>
              <strong className="text-[#101B33] block mt-1">Process / Digital</strong>
              <p className="text-slate-500 text-[11px] mt-1">Workflow automation, AI data integration, and prober alerts.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-[#176BCE] block">SP5</span>
              <strong className="text-[#101B33] block mt-1">PMS & Maturity</strong>
              <p className="text-slate-500 text-[11px] mt-1">Controlling, KPIs, risk inventory, roles, leadership & governance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing Champions Consulting Programs (Page 26) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E7F1] shadow-xs space-y-5">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#19B6A4] uppercase">
            SOURCING CHAMPIONS PROCUREMENT CONSULTING
          </span>
          <h3 className="text-[18px] font-bold text-[#101B33] mt-0.5">
            Transforming Sourcing & Procurement into a Real Competitive Advantage
          </h3>
          <p className="text-[13px] text-slate-600 mt-1">
            Benefit from our procurement expertise, ensuring up to 80% spend under category strategy, full ESG compliance, 30% annual cost savings, and 100% digital adoption.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-1.5">
            <span className="material-symbols-outlined text-[24px] text-[#176BCE]">hub</span>
            <h4 className="font-bold text-[13px] text-[#101B33]">Plan-to-Strategy & Transformation</h4>
            <p className="text-[12px] text-slate-500">Enhance your operating model with our 15M approach, change management, and value-driven procurement strategies.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-1.5">
            <span className="material-symbols-outlined text-[24px] text-[#059669]">paid</span>
            <h4 className="font-bold text-[13px] text-[#101B33]">Cost Optimization</h4>
            <p className="text-[12px] text-slate-500">We operate on a no cure, no pay model, delivering results through design-to-cost and supplier conventions.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-1.5">
            <span className="material-symbols-outlined text-[24px] text-[#19B6A4]">eco</span>
            <h4 className="font-bold text-[13px] text-[#101B33]">Sustainability & Risk</h4>
            <p className="text-[12px] text-slate-500">Turning data into value — ensure compliance, drive sustainability, and unlock long-term business success.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 space-y-1.5">
            <span className="material-symbols-outlined text-[24px] text-[#D97706]">devices</span>
            <h4 className="font-bold text-[13px] text-[#101B33]">S2P Digitalization</h4>
            <p className="text-[12px] text-slate-500">Digitalize your processes — optimize all spend and suppliers on one automated platform.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500 border-t border-slate-100">
          <span>&ldquo;We boost. We transform. We make it happen.&rdquo;</span>
          <div className="font-mono text-[11px] text-[#101B33]">
            Weesperzijde 4, 1091EA Amsterdam · info@sourcingchampions.com
          </div>
        </div>
      </div>
    </div>
  );
};
