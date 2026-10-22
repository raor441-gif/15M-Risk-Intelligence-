import React, { useState } from 'react';

export const ContactScreen: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Elena Rostova',
    email: 'elena.rostova@sourcingchampions.com',
    priority: 'Critical P1 - Stop-Ship Alert',
    supplier: 'Nordvolt Cells AB',
    notes: 'Requesting emergency secondary qualification fast-track at Tavira Electronics.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[#E0E7F1] pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-bold text-[#101B33]">Procurement Incident War Room & Support</h2>
          <span className="px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] font-mono text-[10px] font-bold border border-[#FEE2E2]">
            24/7 EXECUTIVE ESCALATION
          </span>
        </div>
        <p className="text-[14px] text-slate-600 mt-1">
          Direct secure link to Sourcing Champions incident commanders and crisis resilience taskforces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-[#E0E7F1] shadow-xs">
          <h3 className="font-bold text-[16px] text-[#101B33] mb-4">Transmit Incident Escalation Dispatch</h3>

          {submitted ? (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-center space-y-1">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
              <p className="font-bold text-[14px]">Dispatch Transmitted to Operations War Room</p>
              <p className="text-[12px] text-slate-600">Incident Commander will acknowledge within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">CPO / Lead Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:outline-none focus:border-[#176BCE]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:outline-none focus:border-[#176BCE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Priority Classification</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:outline-none focus:border-[#176BCE]"
                  >
                    <option value="Critical P1 - Stop-Ship Alert">Critical P1 - Stop-Ship Alert</option>
                    <option value="High P2 - 30-Day Buffer Warning">High P2 - 30-Day Buffer Warning</option>
                    <option value="Standard - Vendor Onboarding">Standard - Vendor Onboarding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Primary Supplier Affected</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full h-9 px-3 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:outline-none focus:border-[#176BCE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Brief Description of Bottleneck</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F8FC] border border-[#E0E7F1] rounded-lg text-[13px] text-[#101B33] focus:outline-none focus:border-[#176BCE]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-[#176BCE] hover:bg-[#1357A6] text-white font-semibold text-[13px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Deploy Incident Taskforce
              </button>
            </form>
          )}
        </div>

        {/* Global Hubs Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
              European Headquarters
            </span>
            <h4 className="font-bold text-[14px] text-[#101B33]">Amsterdam Hub</h4>
            <p className="text-[12px] text-slate-500 mt-1">
              Keizersgracht 421<br />
              1016 EK Amsterdam, Netherlands
            </p>
            <p className="text-[11px] font-mono text-[#176BCE] mt-2">+31 (0) 20 894 3300</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
              DACH & Automotive Desk
            </span>
            <h4 className="font-bold text-[14px] text-[#101B33]">Munich Intelligence Lab</h4>
            <p className="text-[12px] text-slate-500 mt-1">
              Maximilianstraße 35<br />
              80539 Munich, Germany
            </p>
            <p className="text-[11px] font-mono text-[#176BCE] mt-2">+49 (0) 89 244 1850</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E0E7F1] shadow-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Asia-Pacific Telemetry Center
            </span>
            <h4 className="font-bold text-[14px] text-[#101B33]">Singapore Desk</h4>
            <p className="text-[12px] text-slate-500 mt-1">
              Marina Bay Financial Centre Tower 1<br />
              Singapore 018981
            </p>
            <p className="text-[11px] font-mono text-[#176BCE] mt-2">+65 6818 6000</p>
          </div>
        </div>
      </div>
    </div>
  );
};
