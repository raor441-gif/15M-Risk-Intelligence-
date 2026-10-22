import React from 'react';
import { SupplierItem } from '../types';

interface MaterialsScreenProps {
  suppliers: SupplierItem[];
  onInspectSupplier: (supplier: SupplierItem) => void;
}

export const MaterialsScreen: React.FC<MaterialsScreenProps> = ({
  suppliers,
  onInspectSupplier,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#101B33]">Critical Materials & BOM Inventory Runways</h2>
            <span className="px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] font-mono text-[10px] font-bold border border-[#FEE2E2]">
              14 SINGLE-SOURCE MOATS
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Tracking time-to-survive coverage versus requalification replacement lead times across production lines.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E7F1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-[#F8FAFD] border-b border-[#E0E7F1] text-slate-600 font-mono text-[10px] uppercase tracking-wider h-10">
                <th className="px-4 font-semibold">Critical Material & SKU</th>
                <th className="px-3 font-semibold">Primary Supplier</th>
                <th className="px-3 font-semibold">Category</th>
                <th className="px-3 font-semibold">Buffer Runway</th>
                <th className="px-3 font-semibold">Requalification Gap</th>
                <th className="px-3 font-semibold">Stop-Ship Line</th>
                <th className="px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E7F1] text-[12px]">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-[#EAF3FC]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#101B33]">{s.material}</p>
                    <code className="font-mono text-[10px] text-slate-400">{s.materialSku}</code>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-[#101B33]">{s.name}</span>
                    <span className="block font-mono text-[10px] text-slate-400">{s.location}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded bg-[#F5F8FC] border border-[#E0E7F1] text-[11px] font-medium text-slate-700">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-[#DC2626]">
                    {s.bufferWeeks} weeks
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-600">
                    {s.gapWeeks > 0 ? `${s.gapWeeks} weeks` : 'Mitigated'}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">
                    {s.businessUnit}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => onInspectSupplier(s)}
                      className="p-1 hover:bg-[#EAF3FC] rounded text-[#176BCE]"
                    >
                      <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
