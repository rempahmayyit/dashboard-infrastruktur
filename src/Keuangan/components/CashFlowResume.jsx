import React from "react";
import { CircleDollarSign } from "lucide-react";

export default function CashFlowResume() {
  return (
    <div className="w-full flex flex-col gap-6 justify-between h-full">
      {/* TABEL KOMITMEN & REALISASI CASH IN APRIL */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
          <CircleDollarSign size={16} className="text-[#000075]" />
          Komitmen & Realisasi Cash In April 2026
        </h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Divisi Kerja</th>
                <th className="p-3 text-right">Komitmen</th>
                <th className="p-3 text-right">Real s.d Apr</th>
                <th className="p-3 text-center">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white font-bold text-slate-800">
                <td className="p-3 text-[#000075]">Divisi Infrastruktur</td>
                <td className="p-3 text-right text-slate-600">174.403 M</td>
                <td className="p-3 text-right text-emerald-600">185.928 M</td>
                <td className="p-3 text-center">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black">
                    106,61%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RESUME POSISI CASH FLOW BOX */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 bg-gradient-to-br from-slate-50 to-white flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Resume Posisi Cash Flow (April)
        </h3>
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
            <span>Saldo Awal</span>
            <span className="font-bold text-slate-900">1.979.318 M</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1.5 text-emerald-600">
            <span>Cash In April</span>
            <span className="font-bold">(+) 185.928 M</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1.5 text-red-600">
            <span>Cash Out April</span>
            <span className="font-bold">(-) 264.175 M</span>
          </div>
          <div className="flex justify-between pt-2 text-sm font-black text-[#000075] border-t-2 border-slate-300">
            <span className="font-sans uppercase">Saldo Akhir</span>
            <span>1.904.966 M</span>
          </div>
        </div>
      </div>
    </div>
  );
}