import React, { useState, useEffect, useRef } from 'react';
import { SupplierItem, PriorityAction, RiskAnchor } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: SupplierItem[];
  actions: PriorityAction[];
  anchors: RiskAnchor[];
  onSelectSupplier: (supplier: SupplierItem) => void;
  onSelectAction: (action: PriorityAction) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  actions,
  anchors,
  onSelectSupplier,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredSuppliers = cleanQuery
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.material.toLowerCase().includes(cleanQuery) ||
          s.category.toLowerCase().includes(cleanQuery) ||
          s.location.toLowerCase().includes(cleanQuery)
      )
    : suppliers.slice(0, 4);

  const filteredActions = cleanQuery
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.code.toLowerCase().includes(cleanQuery) ||
          a.category.toLowerCase().includes(cleanQuery)
      )
    : actions;

  const filteredAnchors = cleanQuery
    ? anchors.filter(
        (r) =>
          r.supplier.toLowerCase().includes(cleanQuery) ||
          r.code.toLowerCase().includes(cleanQuery) ||
          r.material.toLowerCase().includes(cleanQuery)
      )
    : anchors;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#101B33]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E0E7F1] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E7F1] flex items-center gap-3 bg-[#F8FAFD]">
          <span className="material-symbols-outlined text-[22px] text-slate-400">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers, materials, risks, SKU codes..."
            className="w-full bg-transparent text-[14px] text-[#101B33] placeholder:text-slate-400 focus:outline-none"
          />
          <span className="px-2 py-0.5 rounded bg-white border border-[#E0E7F1] font-mono text-[11px] text-slate-400">
            ESC
          </span>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Critical Risk Anchors */}
          {filteredAnchors.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                15M Risk Anchors
              </span>
              <div className="space-y-1.5">
                {filteredAnchors.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      const match = suppliers.find((s) => s.name.includes(r.supplier) || r.supplier.includes(s.name));
                      if (match) onSelectSupplier(match);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#EAF3FC]/50 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-[#176BCE]/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626]">
                        {r.code}
                      </span>
                      <div>
                        <p className="font-bold text-[13px] text-[#101B33]">{r.supplier}</p>
                        <p className="text-[11px] text-slate-500">{r.material} · {r.category}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[12px] text-[#DC2626]">
                      {r.revenueAtRisk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers */}
          {filteredSuppliers.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Suppliers & Sole Sources
              </span>
              <div className="space-y-1.5">
                {filteredSuppliers.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSupplier(s);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#EAF3FC]/50 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-[#176BCE]/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        corporate_fare
                      </span>
                      <div>
                        <p className="font-bold text-[13px] text-[#101B33]">{s.name}</p>
                        <p className="text-[11px] text-slate-500">{s.location} · {s.tier}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      {s.bufferWeeks}w Buffer
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Actions */}
          {filteredActions.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Decision Queue Actions
              </span>
              <div className="space-y-1.5">
                {filteredActions.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onSelectAction(a);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#EAF3FC]/50 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-[#176BCE]/20"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#176BCE] mr-2">
                        {a.code}
                      </span>
                      <span className="text-[12px] font-semibold text-[#101B33]">{a.title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Owner: {a.owner}</p>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#059669]">
                      {a.financialAmount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredAnchors.length === 0 && filteredSuppliers.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[32px] mb-1">search_off</span>
              <p className="text-[13px]">No records found matching "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#F8FAFD] border-t border-[#E0E7F1] flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">15M Global Search Registry</span>
        </div>
      </div>
    </div>
  );
};
