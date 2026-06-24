import React from "react";
import { ArrowUpDown, TrendingDown, Clock, ShieldAlert, Target } from "lucide-react";
import { getDisplayName } from "../../utils/projectName";
import { formatCompact } from "../utils";

export default function PerformanceTable({ 
  projects, searchTerm, setSearchTerm, sortBy, setSortBy, highlightedId, tableRef, rowRefs 
}) {
  return (
    <div ref={tableRef} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 scroll-mt-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Project Performance Detail Matrix</h3>
          <p className="text-slate-400 text-xs mt-0.5">Rincian poin deviasi seluruh proyek yang aktif</p>
        </div>

        <div className="flex-1 max-w-md">
          <input type="text" placeholder="🔍 Cari Nama Proyek atau ID Proyek..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onClick={() => setSortBy("total_risk")} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "total_risk" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}><Target size={12} /> Peringkat Eksekutif</button>
          <button onClick={() => setSortBy("behind_schedule")} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "behind_schedule" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}><TrendingDown size={12} /> Behind Schedule</button>
          <button onClick={() => setSortBy("cost_overrun")} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "cost_overrun" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}><ShieldAlert size={12} /> Cost Overrun</button>
          <button onClick={() => setSortBy("time_overrun")} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "time_overrun" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}><Clock size={12} /> Urgensi Waktu</button>
          <button onClick={() => setSortBy("piutang")} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${sortBy === "piutang" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>Piutang Risk</button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 relative scrollbar-thin">
        <table className="w-full min-w-[1150px] text-left text-xs relative">
          <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 shadow-sm border-b border-slate-200">
            <tr>
              <th className="p-3 px-4 text-center w-12 border-b">Rnk</th>
              <th className="p-3 px-4 border-b">Informasi Proyek</th>
              <th className="p-3 px-4 text-center border-b">Status</th>
              <th className={`p-3 px-4 text-right cursor-pointer border-b ${sortBy === "behind_schedule" ? "bg-blue-50/90 text-[#000075]" : ""}`} onClick={() => setSortBy("behind_schedule")}>
                <div className="flex items-center justify-end gap-1"><span>Behind Schedule</span><ArrowUpDown size={10} /></div>
              </th>
              <th className={`p-3 px-4 text-right cursor-pointer border-b ${sortBy === "cost_overrun" ? "bg-red-50/90 text-[#BD002F]" : ""}`} onClick={() => setSortBy("cost_overrun")}>
                <div className="flex items-center justify-end gap-1"><span>Cost Overrun</span><ArrowUpDown size={10} /></div>
              </th>
              <th className={`p-3 px-4 text-center cursor-pointer border-b ${sortBy === "time_overrun" ? "bg-orange-50/90 text-orange-600" : ""}`} onClick={() => setSortBy("time_overrun")}>
                <div className="flex items-center justify-center gap-1"><span>Urgensi Waktu</span><ArrowUpDown size={10} /></div>
              </th>
              <th className="p-3 px-4 text-center text-slate-500 font-semibold bg-slate-100/80 border-b">Tagihan Bruto <div className="text-[9px] font-normal text-slate-400">(&gt;60 Hari | &gt;180 Hari)</div></th>
              <th className="p-3 px-4 text-center">Piutang Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-slate-400 font-medium">Data kosong.</td></tr>
            ) : (
              projects.map((proj) => {
                const isHighlighted = highlightedId === proj.id_project;
                const rowClass = isHighlighted ? "bg-yellow-100 transition-all duration-300 ring-2 ring-yellow-400 ring-inset relative z-0" : "hover:bg-slate-50/80 transition-all";
                let rankBadgeColor = "bg-slate-100 text-slate-700";
                if (proj.finalRank === 1) rankBadgeColor = "bg-red-600 text-white font-black";
                else if (proj.finalRank === 2) rankBadgeColor = "bg-orange-500 text-white font-black";
                else if (proj.finalRank === 3) rankBadgeColor = "bg-amber-500 text-white font-black";

                return (
                  <tr key={proj.id_project} ref={(el) => (rowRefs.current[proj.id_project] = el)} className={rowClass}>
                    <td className="p-3 px-4 text-center font-bold"><span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] ${rankBadgeColor}`}>{proj.finalRank}</span></td>
                    <td className="p-3 px-4 max-w-[320px]">
                      <div className="font-bold text-slate-800 break-words whitespace-normal">{getDisplayName(proj)}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2"><span>{proj.divisi}</span>{isHighlighted && <span className="bg-yellow-300 text-yellow-800 px-1.5 py-0.5 rounded font-bold text-[8px] uppercase animate-pulse">Memeriksa Rincian</span>}</div>
                    </td>
                    <td className="p-3 px-4 text-center"><span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${(proj.status_proyek || "").toLowerCase().includes("sap") ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"} border`}>{proj.status_proyek}</span></td>
                    <td className={`p-3 px-4 text-right font-semibold ${sortBy === "behind_schedule" && !isHighlighted ? "bg-blue-50/20" : ""}`}>
                      <div className={proj.behindSchedule < 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>{proj.behindSchedule.toFixed(2)}%</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Plan: {proj.progRencana.toFixed(2)}% | Act: {proj.progRealisasi.toFixed(2)}%</div>
                    </td>
                    <td className={`p-3 px-4 text-right font-semibold ${sortBy === "cost_overrun" && !isHighlighted ? "bg-red-50/20" : ""}`}>
                      <div className={proj.costOverrun < 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>{proj.costOverrun.toFixed(2)}%</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Mapp: {proj.mappPercent.toFixed(1)}% | Real: {proj.realBkpuPercent.toFixed(1)}%</div>
                    </td>
                    <td className={`p-3 px-4 text-center font-semibold ${sortBy === "time_overrun" && !isHighlighted ? "bg-orange-50/20" : ""}`}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${proj.targetHarianStatus === "OVERDUE" ? "bg-red-100 text-red-700 border border-red-200" : proj.targetHarianValue > 0.5 ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                          {proj.targetHarianStatus === "OVERDUE" ? "OVERDUE" : proj.targetHarianStatus === "SELESAI" ? "FINISH" : `${proj.targetHarianValue.toFixed(2)}%/hr`}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 font-mono">Sisa Prog: {proj.sisaProgres.toFixed(0)}% | Waktu: {proj.sisaHari} hr</div>
                    </td>
                    <td className="p-3 px-4 text-center bg-slate-50/30">
                      <div className="font-bold text-slate-700">{formatCompact(proj.tagihanBruto)}</div>
                      <div className="text-[9px] text-slate-400 mt-1 font-mono">&gt;60: {formatCompact(proj.aging60 || 0)} | &gt;180: {formatCompact(proj.aging180 || 0)}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-lg font-bold text-[10px] ${proj.piutangRiskLevel === "KRITIS" ? "bg-red-100 text-red-700" : proj.piutangRiskLevel === "WASPADA" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>{proj.piutangRiskLevel}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}