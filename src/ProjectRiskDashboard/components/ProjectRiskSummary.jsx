// src/components/ProjectRiskSummary.jsx
import React, { useMemo } from "react";
import { useFilter } from "../../context/FilterContext";
import ProjectRanking from "./ProjectRanking";
import { getDisplayName } from "../utils/projectName";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export default function ProjectRiskSummary() {
  const { excelData } = useFilter();

  console.log("excelData =", excelData);
  console.log("excelData keys =", Object.keys(excelData || {}));

  const riskData = useMemo(() => {
    const rawProjects =
      excelData?.master_project || excelData?.db_master_data || [];

    console.log("excelData keys =", Object.keys(excelData || {}));
    console.log("master_project =", excelData?.master_project?.length);
    console.log("db_master_data =", excelData?.db_master_data?.length);
    console.log("rawProjects =", rawProjects.length);

    console.log(
      "STATUS SAMPLE",
      rawProjects.slice(0, 20).map((p) => ({
        nama: getDisplayName(p),

        status: p.status_project_current || p.status_proyek || p.status,
      })),
    );
    // 1. Filter proyek On Going & SAP Not Updated
    let filtered = rawProjects.filter((proj) => {
      const status = String(proj.status_projek || proj.status || "")
        .trim()
        .toLowerCase();
      return status.includes("on going") || status.includes("sap not updated");
    });

    if (filtered.length === 0)
      return { list: [], stats: { kritis: 0, waspada: 0, normal: 0 } };

    // 2. Hitung nilai mentah masing-masing parameter
    let calculated = filtered.map((proj) => {
      const progRencana = safeParseNumber(
        proj.progress_rencana || proj.rencana_progress,
      );
      const progRealisasi = safeParseNumber(
        proj.progress_realisasi || proj.realisasi_progress,
      );
      const behindSchedule = progRealisasi - progRencana;

      
      const realisasiBiaya = safeParseNumber(
        proj.realisasi_biaya || proj.biaya_aktual,
      );
      

      const sisaProgres = Math.max(0, 100 - progRealisasi);
      const sisaHari = safeParseNumber(proj.sisa_hari || proj.sisa_waktu || 30);
      const urgencyRatio =
        sisaHari > 0 ? (sisaProgres / sisaHari) * 100 : sisaProgres * 2;

      return {
        ...proj,
        nama_projek:
          getDisplayName(proj) ||
          proj.nama_projek ||
          proj.nama_proyek ||
          "Proyek Tanpa Nama",
        divisi: proj.divisi_current || proj.divisi || proj.owner || "-",
        behindSchedule,
        costOverrun,
        urgencyRatio,
      };
    });

    // 3. Berikan Peringkat (Ranking) untuk masing-masing parameter
    // Rank Behind Schedule (Paling minus = Rank 1)
    calculated.sort((a, b) => a.behindSchedule - b.behindSchedule);
    calculated.forEach((p, i) => (p.rankBehind = i + 1));

    // Rank Cost Overrun (Paling minus = Rank 1)
    calculated.sort((a, b) => a.costOverrun - b.costOverrun);
    calculated.forEach((p, i) => (p.rankCost = i + 1));

    // Rank Urgency (Paling besar = Rank 1)
    calculated.sort((a, b) => b.urgencyRatio - a.urgencyRatio);
    calculated.forEach((p, i) => (p.rankUrgency = i + 1));

    // 4. Hitung Skor Poin Keseluruhan & Urutkan
    calculated.forEach((p) => {
      // Semakin kecil total skor, semakin sering dia berada di peringkat terburuk
      p.totalRiskScore = p.rankBehind + p.rankCost + p.rankUrgency;
    });

    // Urutkan berdasarkan total skor (Terkecil/Terparah di atas)
    calculated.sort((a, b) => a.totalRiskScore - b.totalRiskScore);

    // 5. Kategorisasi Status Risiko (Dibagi 3 porsi)
    let kritisCount = 0;
    let waspadaCount = 0;
    let normalCount = 0;

    const third = Math.ceil(calculated.length / 3);

    calculated.forEach((p, index) => {
      if (index < third) {
        p.riskLevel = "KRITIS";
        kritisCount++;
      } else if (index < third * 2) {
        p.riskLevel = "WASPADA";
        waspadaCount++;
      } else {
        p.riskLevel = "NORMAL";
        normalCount++;
      }
    });

    return {
      list: calculated,
      stats: {
        kritis: kritisCount,
        waspada: waspadaCount,
        normal: normalCount,
      },
    };
  }, [excelData]);

  const { list, stats } = riskData;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 font-sans mt-8 flex flex-col max-h-[600px]">
      {/* HEADER EXECUTIVE SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Activity className="text-blue-900" size={20} />
            Executive Risk Summary
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Kumulasi performa proyek berdasarkan waktu, biaya, dan urgensi
          </p>
        
        </div>

        {/* INDIKATOR STATUS */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center justify-center bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            <span className="text-2xl font-black text-red-600">
              {stats.kritis}
            </span>
            <span className="text-[9px] font-bold text-red-600 uppercase">
              Kritis
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
            <span className="text-2xl font-black text-orange-500">
              {stats.waspada}
            </span>
            <span className="text-[9px] font-bold text-orange-500 uppercase">
              Waspada
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <span className="text-2xl font-black text-emerald-600">
              {stats.normal}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase">
              Normal
            </span>
          </div>
        </div>
      </div>

      {/* DAFTAR PROYEK (SCROLLABLE AREA) */}
      {/* Jika data banyak, ini akan memunculkan scroll vertikal tanpa merusak layout luar */}
      <div
        className="flex-1 overflow-y-auto pr-2 space-y-3 
                      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {list.length === 0 ? (
          <div className="text-center text-slate-400 py-10 text-sm">
            Tidak ada data proyek aktif.
          </div>
        ) : (
          list.map((proj, idx) => {
            // Konfigurasi Visual Level Risiko
            let Icon = CheckCircle;
            let bgClass = "bg-emerald-50 border-emerald-200";
            let textClass = "text-emerald-700";
            let iconColor = "text-emerald-500";

            if (proj.riskLevel === "KRITIS") {
              Icon = AlertOctagon;
              bgClass = "bg-red-50 border-red-200";
              textClass = "text-red-700";
              iconColor = "text-red-600";
            } else if (proj.riskLevel === "WASPADA") {
              Icon = AlertTriangle;
              bgClass = "bg-orange-50 border-orange-200";
              textClass = "text-orange-700";
              iconColor = "text-orange-500";
            }

            // Cari tahu apa masalah terbesar (peringkat terburuk) dari proyek ini
            let worstIssue = "";
            let worstRank = Math.min(
              proj.rankBehind,
              proj.rankCost,
              proj.rankUrgency,
            );

            if (worstRank === proj.rankBehind)
              worstIssue = "Keterlambatan Progres (Schedule)";
            else if (worstRank === proj.rankCost)
              worstIssue = "Pembengkakan Biaya (Cost Overrun)";
            else worstIssue = "Sisa Waktu Kritis (Urgency)";

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:shadow-md ${bgClass}`}
              >
                {/* RANK NUMBER & ICON */}
                <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-white shadow-sm ${textClass}`}
                  >
                    #{idx + 1}
                  </div>
                  <Icon className={iconColor} size={24} strokeWidth={2.5} />
                </div>

                {/* PROJECT DETAILS */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${textClass}`}>
                    {proj.nama_projek}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {proj.divisi}
                    </span>
                    {proj.riskLevel !== "NORMAL" && (
                      <span className="text-[10px] text-slate-500 truncate">
                        Faktor Kritis: <b>{worstIssue}</b>
                      </span>
                    )}
                  </div>
                </div>

                {/* STATS MINI BARS (Hanya Tampil di Desktop/Tablet) */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0 bg-white/60 p-2 rounded-xl border border-white/40">
                  <div className="text-center w-16">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">
                      Time
                    </div>
                    <div className="text-xs font-black text-slate-700">
                      {proj.behindSchedule.toFixed(1)}%
                    </div>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div className="text-center w-16">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">
                      Cost
                    </div>
                    <div className="text-xs font-black text-slate-700">
                      {(proj.costOverrun / 1000000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div className="text-center w-16">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">
                      Urgensi
                    </div>
                    <div className="text-xs font-black text-slate-700">
                      {proj.urgencyRatio.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`text-xs font-black uppercase tracking-wider ${textClass}`}
                  >
                    {proj.riskLevel}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Skor Risiko: {proj.totalRiskScore}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
