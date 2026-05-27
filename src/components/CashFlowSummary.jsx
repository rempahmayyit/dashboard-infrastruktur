import React from "react";
import { CircleDollarSign, Wallet } from "lucide-react";

export default function CashFlowSummary() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 font-sans">

      {/* KOMITMEN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-full">
        
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#000075]/10 flex items-center justify-center">
            <CircleDollarSign className="text-[#000075]" size={16} />
          </div>
          <h2 className="text-xs font-black tracking-wider text-slate-900 uppercase">
            Komitmen & Realisasi Cash
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 flex-1">
          <table className="w-full min-w-[400px] text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Divisi
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Komitmen
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Realisasi
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-800">
                  Divisi Infrastruktur
                </td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-600 text-right">
                  174.403 M
                </td>
                <td className="px-4 py-3.5 text-xs font-bold text-emerald-600 text-right">
                  185.928 M
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-black">
                    106,61%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RESUME CASH FLOW */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        
        <div className="p-5 flex-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <Wallet className="text-slate-600" size={14} />
            </div>
            <h2 className="text-xs font-black tracking-wider text-slate-900 uppercase">
              Resume Posisi Cash Flow
            </h2>
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <span className="text-xs text-slate-500 font-medium">
                Saldo Awal
              </span>
              <span className="text-sm font-bold text-slate-800 tracking-wide">
                1.979.318 M
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <span className="text-xs text-emerald-600 font-medium">
                Cash In
              </span>
              <span className="text-sm font-bold text-emerald-600 tracking-wide">
                (+) 185.928 M
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-red-500 font-medium">
                Cash Out
              </span>
              <span className="text-sm font-bold text-red-500 tracking-wide">
                (-) 264.175 M
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER SALDO AKHIR DENGAN BACKGROUND KHUSUS */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex justify-between items-center">
          <span className="text-xs font-black text-[#000075] uppercase tracking-wider">
            Saldo Akhir
          </span>
          <span className="text-xl font-black text-[#000075] tracking-wide">
            1.904.966 M
          </span>
        </div>

      </div>

    </div>
  );
}