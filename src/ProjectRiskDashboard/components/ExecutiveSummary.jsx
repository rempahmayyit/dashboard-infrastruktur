import React from "react";
import { Activity, CheckCircle, AlertOctagon, AlertTriangle } from "lucide-react";
import { getDisplayName } from "../../utils/projectName";

export default function ExecutiveSummary({ stats, filteredProjects, riskFilter, setRiskFilter, onProjectClick }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Activity className="text-blue-900" size={20} /> Executive Risk Summary
          </h2>
          <p className="text-slate-500 text-xs mt-1">Klik nama proyek untuk melihat rincian evaluasinya.</p>
        </div>

        <div className="flex gap-2 sm:gap-3">
          {["KRITIS", "WASPADA", "NORMAL"].map((level) => {
            const isKritis = level === "KRITIS";
            const isWaspada = level === "WASPADA";
            const count = isKritis ? stats.kritis : isWaspada ? stats.waspada : stats.normal;
            const activeColor = isKritis ? "bg-red-600 border-red-600 text-white shadow-lg" : isWaspada ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-emerald-600 border-emerald-600 text-white shadow-lg";
            const inactiveColor = isKritis ? "bg-red-50 border-red-100 text-red-600 hover:scale-105" : isWaspada ? "bg-orange-50 border-orange-100 text-orange-500 hover:scale-105" : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:scale-105";

            return (
              <div
                key={level}
                onClick={() => setRiskFilter(riskFilter === level ? "ALL" : level)}
                className={`cursor-pointer flex flex-col items-center justify-center px-3 sm:px-4 py-2 rounded-xl border transition-all duration-200 ${riskFilter === level ? activeColor : inactiveColor}`}
              >
                <span className="text-xl sm:text-2xl font-black">{count}</span>
                <span className="text-[8px] sm:text-[9px] font-bold uppercase">{level}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[380px] pr-2 space-y-3 scrollbar-thin">
        {filteredProjects.length === 0 ? (
          <div className="text-center text-slate-400 py-10 text-sm">Tidak ada data proyek aktif.</div>
        ) : (
          filteredProjects.map((proj) => {
            const isKritis = proj.riskLevel === "KRITIS";
            const isWaspada = proj.riskLevel === "WASPADA";
            const Icon = isKritis ? AlertOctagon : isWaspada ? AlertTriangle : CheckCircle;
            const bgClass = isKritis ? "bg-red-50 border-red-200" : isWaspada ? "bg-orange-50 border-orange-200" : "bg-emerald-50 border-emerald-200";
            const textClass = isKritis ? "text-red-700" : isWaspada ? "text-orange-700" : "text-emerald-700";
            const iconColor = isKritis ? "text-red-600" : isWaspada ? "text-orange-500" : "text-emerald-500";

            let worstIssue = "";
            let worstRank = Math.min(proj.rankBehind, proj.rankCost, proj.rankUrgency);
            if (worstRank === proj.rankBehind) worstIssue = "Keterlambatan (Schedule)";
            else if (worstRank === proj.rankCost) worstIssue = "Pembengkakan Biaya";
            else worstIssue = "Sisa Waktu Kritis";

            return (
              <div key={proj.id_project} onClick={() => onProjectClick(proj.id_project)} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:shadow-lg cursor-pointer ${bgClass} hover:-translate-y-0.5`}>
                <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-white shadow-sm ${textClass}`}>#{proj.finalRank}</div>
                  <Icon className={iconColor} size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${textClass}`}>{getDisplayName(proj)}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{proj.divisi}</span>
                    {proj.riskLevel !== "NORMAL" && <span className="text-[10px] text-slate-500 truncate">Faktor Kritis: <b className="underline decoration-dashed">{worstIssue}</b></span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-xs font-black uppercase tracking-wider ${textClass}`}>{proj.riskLevel}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 font-bold flex items-center justify-end">Bedah rincian &rarr;</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}