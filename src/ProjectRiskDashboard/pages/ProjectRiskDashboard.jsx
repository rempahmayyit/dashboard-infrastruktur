// src/components/ProjectRiskDashboard.jsx
import React, { useState, useMemo, useRef } from "react";
import { useFilter } from "../../context/FilterContext";
import { usePengendalianData } from "../../hooks/usePengendalianData";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowUpDown,
  TrendingDown,
  Clock,
  ShieldAlert,
  Target,
} from "lucide-react";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export default function ProjectRiskDashboard() {
  const { excelData } = useFilter();

  const pengendalian = usePengendalianData();

  const ongoingProjects = pengendalian?.ongoingProjects || [];

  const behindScheduleProjects = pengendalian?.behindScheduleProjects || [];

  const bkpuMappProjects = pengendalian?.bkpuMappProjects || [];

  const pureTimeOverrunProjects = pengendalian?.pureTimeOverrunProjects || [];

  console.log("ONGOING", ongoingProjects);
  console.log("BEHIND", behindScheduleProjects);
  console.log("BKPU", bkpuMappProjects);
  console.log("TIME", pureTimeOverrunProjects);

  // State untuk Tabel Detail Bawah
  const [sortBy, setSortBy] = useState("total_risk");

  // State & Ref untuk Interaksi Klik -> Scroll -> Highlight
  const [highlightedId, setHighlightedId] = useState(null);
  const tableRef = useRef(null);
  const rowRefs = useRef({});

  // ======================================================================
  // ENGINE KALKULASI TUNGGAL (Dipakai bersama oleh Summary & Tabel)
  // ======================================================================
  const riskData = useMemo(() => {
    const calculated = ongoingProjects.map((proj) => {
      const project_name =
        proj.project_name || proj.nama_paket || "Proyek Tanpa Nama";

      const behind = behindScheduleProjects.find((x) => x.name === project_name);

      const cost = bkpuMappProjects.find((x) => x.name === project_name);

      const time = pureTimeOverrunProjects.find((x) => x.name === project_name);

      const behindSchedule = Number(behind?.dev || 0);

      const costOverrun = Number(cost?.dev || 0);

      const urgencyRatio =
        time?.remain && time?.progress
          ? ((100 - time.progress) / Math.max(time.remain, 1)) * 100
          : 0;

      return {
        ...proj,

        project_name: project_name,

        divisi: proj.divisi_current || proj.divisi || "-",

        status_proyek:
          proj.status_proyek || proj.status_project_current || "On Going",

        progRencana: Number(behind?.ra || 0),

        progRealisasi: Number(behind?.ri || 0),

        behindSchedule,

        costOverrun,

        urgencyRatio,

        sisaHari: Number(time?.remain || 0),

        sisaProgres: Number(100 - (time?.progress || 0)),
      };
    });

    calculated.sort((a, b) => a.behindSchedule - b.behindSchedule);

    calculated.forEach((p, i) => (p.rankBehind = i + 1));

    calculated.sort((a, b) => a.costOverrun - b.costOverrun);

    calculated.forEach((p, i) => (p.rankCost = i + 1));

    calculated.sort((a, b) => b.urgencyRatio - a.urgencyRatio);

    calculated.forEach((p, i) => (p.rankUrgency = i + 1));

    calculated.forEach((p) => {
      p.totalRiskScore = p.rankBehind + p.rankCost + p.rankUrgency;
    });

    calculated.sort((a, b) => a.totalRiskScore - b.totalRiskScore);

    let kritisCount = 0;
    let waspadaCount = 0;
    let normalCount = 0;

    const third = Math.ceil(calculated.length / 3);

    calculated.forEach((p, index) => {
      p.finalRank = index + 1;

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
  }, [
    ongoingProjects,
    behindScheduleProjects,
    bkpuMappProjects,
    pureTimeOverrunProjects,
  ]);

  const { list: allProjects, stats } = riskData;

  // 5. Engine Pengurutan Khusus untuk Tabel Bawah
  const sortedTableProjects = (() => {
    switch (sortBy) {
      case "behind_schedule":
        return [...allProjects].sort(
          (a, b) => a.behindSchedule - b.behindSchedule,
        );

      case "cost_overrun":
        return [...allProjects].sort((a, b) => a.costOverrun - b.costOverrun);

      case "time_overrun":
        return [...allProjects].sort((a, b) => b.urgencyRatio - a.urgencyRatio);

      default:
        return [...allProjects].sort(
          (a, b) => a.totalRiskScore - b.totalRiskScore,
        );
    }
  })();

  console.log("SORT BY", sortBy);
  console.log("TABLE DATA", sortedTableProjects);

  // ======================================================================
  // INTERAKSI KLIK & AUTO-SCROLL
  // ======================================================================
  const handleSummaryClick = (id_project) => {
    setHighlightedId(id_project);
    setSortBy("total_risk"); // Kembalikan tabel ke urutan default agar mudah dicari

    // Scroll layar utama ke area tabel
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Beri sedikit delay, lalu scroll di dalam tabel agar baris proyek terlihat di tengah
    setTimeout(() => {
      if (rowRefs.current[id_project]) {
        rowRefs.current[id_project].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);

    // Matikan highlight setelah 4 detik
    setTimeout(() => setHighlightedId(null), 4000);
  };

  return (
    <div className="w-full space-y-6 font-sans mt-8">
      {/* ====================================================================== */}
      {/* MODUL 1: EXECUTIVE RISK SUMMARY (ATAS) */}
      {/* ====================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="text-blue-900" size={20} />
              Executive Risk Summary
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Klik nama proyek untuk melihat rincian evaluasinya di tabel bawah.
            </p>
          </div>

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

        {/* List Summary (Tinggi dibatasi untuk ~5 baris, max-h-[380px]) */}
        <div
          className="overflow-y-auto max-h-[380px] pr-2 space-y-3 
                        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {allProjects.length === 0 ? (
            <div className="text-center text-slate-400 py-10 text-sm">
              Tidak ada data proyek aktif.
            </div>
          ) : (
            allProjects.map((proj) => {
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

              let worstIssue = "";
              let worstRank = Math.min(
                proj.rankBehind,
                proj.rankCost,
                proj.rankUrgency,
              );
              if (worstRank === proj.rankBehind)
                worstIssue = "Keterlambatan (Schedule)";
              else if (worstRank === proj.rankCost)
                worstIssue = "Pembengkakan Biaya";
              else worstIssue = "Sisa Waktu Kritis";

              return (
                <div
                  key={proj.id_project}
                  onClick={() => handleSummaryClick(proj.id_project)}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:shadow-lg cursor-pointer ${bgClass} hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-white shadow-sm ${textClass}`}
                    >
                      #{proj.finalRank}
                    </div>
                    <Icon className={iconColor} size={24} strokeWidth={2.5} />
                  </div>

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
                          Faktor Kritis:{" "}
                          <b className="underline decoration-dashed underline-offset-2">
                            {worstIssue}
                          </b>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`text-xs font-black uppercase tracking-wider ${textClass}`}
                    >
                      {proj.riskLevel}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 font-bold hover:text-slate-700 flex items-center justify-end gap-1">
                      Klik untuk bedah rincian &rarr;
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MODUL 2: PROJECT RANKING DETAIL (BAWAH) */}
      {/* ====================================================================== */}
      <div
        ref={tableRef}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 scroll-mt-6"
      >
        {/* Header Tabel */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Project Performance Detail Matrix
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Rincian poin deviasi seluruh proyek yang aktif
            </p>
          </div>

          {/* Pengendali Urutan Tabel */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSortBy("total_risk")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "total_risk" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              <Target size={12} /> Peringkat Eksekutif
            </button>
            <button
              onClick={() => setSortBy("behind_schedule")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "behind_schedule" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              <TrendingDown size={12} /> Behind Schedule
            </button>
            <button
              onClick={() => setSortBy("cost_overrun")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "cost_overrun" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              <ShieldAlert size={12} /> Cost Overrun
            </button>
            <button
              onClick={() => setSortBy("time_overrun")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "time_overrun" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              <Clock size={12} /> Urgency Ratio
            </button>
          </div>
        </div>

        {/* Tabel Rincian */}
        {/* max-h-[500px] agar tabelnya mandiri punya scrollbar sendiri dan rapi */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 relative">
          <table className="w-full min-w-[1150px] text-left text-xs relative">
            <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="p-3 px-4 text-center w-12 border-b border-slate-200">
                  Rnk
                </th>
                <th className="p-3 px-4 border-b border-slate-200">
                  Informasi Projek
                </th>
                <th className="p-3 px-4 text-center border-b border-slate-200">
                  Status
                </th>

                <th
                  className={`p-3 px-4 text-right cursor-pointer border-b border-slate-200 ${sortBy === "behind_schedule" ? "bg-blue-50/90 text-[#000075]" : ""}`}
                  onClick={() => setSortBy("behind_schedule")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Behind Schedule</span>
                    <ArrowUpDown size={10} />
                  </div>
                </th>
                <th
                  className={`p-3 px-4 text-right cursor-pointer border-b border-slate-200 ${sortBy === "cost_overrun" ? "bg-red-50/90 text-[#BD002F]" : ""}`}
                  onClick={() => setSortBy("cost_overrun")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Cost Overrun</span>
                    <ArrowUpDown size={10} />
                  </div>
                </th>
                <th
                  className={`p-3 px-4 text-center cursor-pointer border-b border-slate-200 ${sortBy === "time_overrun" ? "bg-orange-50/90 text-orange-600" : ""}`}
                  onClick={() => setSortBy("time_overrun")}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Urgency Waktu</span>
                    <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="p-3 px-4 text-right text-slate-400 font-medium bg-slate-100/80 border-b border-slate-200">
                  Tagihan Bruto
                </th>
                <th className="p-3 px-4 text-right text-slate-400 font-medium bg-slate-100/80 border-b border-slate-200">
                  Komitmen Cash In
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedTableProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    Data kosong.
                  </td>
                </tr>
              ) : (
                sortedTableProjects.map((proj, idx) => {
                  const isHighlighted = highlightedId === proj.id_project;

                  // Efek Highlight Kuning Menyala saat diklik
                  const rowClass = isHighlighted
                    ? "bg-yellow-100 transition-all duration-300 ring-2 ring-yellow-400 ring-inset relative z-0"
                    : "hover:bg-slate-50/80 transition-all";

                  let rankBadgeColor = "bg-slate-100 text-slate-700";
                  if (proj.finalRank === 1)
                    rankBadgeColor = "bg-red-600 text-white font-black";
                  else if (proj.finalRank === 2)
                    rankBadgeColor = "bg-orange-500 text-white font-black";
                  else if (proj.finalRank === 3)
                    rankBadgeColor = "bg-amber-500 text-white font-black";

                  return (
                    <tr
                      key={proj.id_project}
                      ref={(el) => (rowRefs.current[proj.id_project] = el)}
                      className={rowClass}
                    >
                      <td className="p-3 px-4 text-center font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] ${rankBadgeColor}`}
                        >
                          {proj.finalRank}
                        </span>
                      </td>

                      <td className="p-3 px-4 max-w-[320px]">
                        <div className="font-bold text-slate-800 truncate">
                          {proj.project_name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{proj.divisi}</span>
                          {isHighlighted && (
                            <span className="bg-yellow-300 text-yellow-800 px-1.5 py-0.5 rounded font-bold text-[8px] uppercase animate-pulse">
                              Memeriksa Rincian
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            (proj.status_proyek || "")
                              .toLowerCase()
                              .includes("sap")
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {proj.status_proyek}
                        </span>
                      </td>

                      <td
                        className={`p-3 px-4 text-right font-semibold ${sortBy === "behind_schedule" && !isHighlighted ? "bg-blue-50/20" : ""}`}
                      >
                        <div
                          className={
                            proj.behindSchedule < 0
                              ? "text-red-600 font-bold"
                              : "text-slate-700"
                          }
                        >
                          {Number(proj.behindSchedule || 0).toFixed(2)}%
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Plan: {proj.progRencana}% | Act: {proj.progRealisasi}%
                        </div>
                      </td>

                      <td
                        className={`p-3 px-4 text-right font-semibold ${sortBy === "cost_overrun" && !isHighlighted ? "bg-red-50/20" : ""}`}
                      >
                        <div
                          className={
                            proj.costOverrun < 0
                              ? "text-red-600 font-bold"
                              : "text-emerald-600"
                          }
                        >
                          {proj.costOverrun < 0 ? "" : "+"}
                          {(Number(proj.costOverrun || 0) / 1000000000).toFixed(
                            2,
                          )}{" "}
                          M
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Budget vs Real Biaya
                        </div>
                      </td>

                      <td
                        className={`p-3 px-4 text-center font-semibold ${sortBy === "time_overrun" && !isHighlighted ? "bg-orange-50/20" : ""}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${
                              proj.urgencyRatio > 150
                                ? "bg-red-100 text-red-700"
                                : proj.urgencyRatio > 80
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {Number(proj.urgencyRatio || 0).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Sisa Prog: {Number(proj.sisaProgres || 0).toFixed(0)}%
                          | {proj.sisaHari} Hari
                        </div>
                      </td>

                      <td className="p-3 px-4 text-right text-slate-400 font-medium bg-slate-50/30">
                        -
                      </td>
                      <td className="p-3 px-4 text-right text-slate-400 font-medium bg-slate-50/30">
                        -
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
