import React from "react";
import { FileSpreadsheet } from "lucide-react";

export default function DetailCashFlow() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[#000075]" />
            Laporan Realisasi & Prognosa Cash Flow
          </h3>
          <p className="text-slate-400 text-[11px] font-medium mt-1">
            Periode Mei 2026 (Dalam Rp. Milyar)
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
            Realisasi Apr: Selesai
          </span>
          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-100">
            Prognosa Mei: Berjalan
          </span>
        </div>
      </div>

      <div className="border border-slate-300 rounded-xl overflow-x-auto text-[11.5px] scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-[#000075] text-white">
            <tr>
              <th className="p-3 font-semibold w-1/2 border-r border-blue-800">Uraian</th>
              <th className="p-3 font-semibold text-right border-r border-blue-800">Bulan Lalu (April)</th>
              <th className="p-3 font-semibold text-right">Bulan Ini (Mei - Prognosa)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            
            {/* SALDO AWAL */}
            <tr className="bg-slate-50 font-black text-slate-900">
              <td className="p-2.5 border-r border-slate-200">Saldo Awal</td>
              <td className="p-2.5 text-right border-r border-slate-200">1.979,31</td>
              <td className="p-2.5 text-right">1.904,96</td>
            </tr>

            {/* PENERIMAAN */}
            <tr className="bg-emerald-50/50 font-bold text-emerald-800">
              <td className="p-2.5 border-r border-slate-200">A. Total Penerimaan (Cash In)</td>
              <td className="p-2.5 text-right border-r border-slate-200">185,92</td>
              <td className="p-2.5 text-right">187,87</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Pemberi Kerja</td>
              <td className="p-2.5 text-right border-r border-slate-200 font-medium">183,17</td>
              <td className="p-2.5 text-right font-medium">183,00</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Pihak ke 3 - Waskita (Anak Perusahaan)</td>
              <td className="p-2.5 text-right border-r border-slate-200 font-medium">1,63</td>
              <td className="p-2.5 text-right font-medium text-slate-400">-</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Restitusi Pajak</td>
              <td className="p-2.5 text-right border-r border-slate-200 font-medium">0,00</td>
              <td className="p-2.5 text-right font-medium text-slate-400">-</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Penerimaan Lain-lain</td>
              <td className="p-2.5 text-right border-r border-slate-200 font-medium">1,11</td>
              <td className="p-2.5 text-right font-medium">4,86</td>
            </tr>

            {/* PENGELUARAN */}
            <tr className="bg-red-50/50 font-bold text-red-700">
              <td className="p-2.5 border-r border-slate-200">B. Total Pengeluaran (Cash Out)</td>
              <td className="p-2.5 text-right border-r border-slate-200">(264,17)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Bahan / Material</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600 font-medium">(57,06)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Upah / Mandor</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600 font-medium">(15,35)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Subkon</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600 font-medium">(152,09)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Biaya Alat</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600 font-medium">(8,35)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 pl-8 border-r border-slate-200 text-slate-600">Overhead, Sewa, Rupa-Rupa, dll</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600 font-medium">(10,66)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>

            {/* NET CASH FLOW & SALDO AKHIR */}
            <tr className="bg-slate-100 font-bold text-slate-800">
              <td className="p-2.5 border-r border-slate-200">C. Net Cash Flow (A - B)</td>
              <td className="p-2.5 text-right border-r border-slate-200 text-red-600">(78,24)</td>
              <td className="p-2.5 text-right text-slate-400">...</td>
            </tr>
            <tr className="bg-[#000075] font-black text-white">
              <td className="p-3 border-r border-blue-800 text-sm">SALDO AKHIR</td>
              <td className="p-3 text-right border-r border-blue-800 text-sm">1.904,96</td>
              <td className="p-3 text-right text-sm text-blue-200">...</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}