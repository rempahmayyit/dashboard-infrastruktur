// src/components/ProjectRiskDashboard.jsx
import React, { useState, useMemo, useRef } from "react";
import { useFilter } from "../../context/FilterContext";
import { getDisplayName } from "../../utils/projectName";
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
  BookOpen,
} from "lucide-react";

// ======================================================================
// IMPORT RUMUS GLOBAL DARI UTILS (Menjamin 100% Akurasi)
// ======================================================================
import {
  calculateRiProgress,
  calculateRaProgress,
  getProjectRealisasi,
} from "../../utils/projectCalculations";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const safeDateConvert = (rawDate) => {
  if (!rawDate) return null;
  if (rawDate instanceof Date) return rawDate;

  let result = null;
  if (typeof rawDate === "number" && rawDate > 10000) {
    result = new Date((rawDate - 25569) * 86400 * 1000);
  } else if (typeof rawDate === "string") {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) result = d;
    else {
      const parts = rawDate.split(/[-/]/);
      if (parts.length === 3 && parts[0].length <= 2 && parts[2].length === 4) {
        result = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
  }
  return result && !isNaN(result.getTime()) ? result : null;
};

export default function ProjectRiskDashboard() {
  const { excelData, globalFilter } = useFilter();
  const [sortBy, setSortBy] = useState("total_risk");
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef(null);
  const rowRefs = useRef({});

  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    Mei: 5,
    Jun: 6,
    Jul: 7,
    Agu: 8,
    Sep: 9,
    Okt: 10,
    Nov: 11,
    Des: 12,
  };
  const selectedYear = safeParseNumber(globalFilter?.tahun || 2026);
  const selectedMonth =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

  // ======================================================================
  // ENGINE KALKULASI MENGGUNAKAN HELPER GLOBAL
  // ======================================================================
  const riskData = useMemo(() => {
    const rawProjects = excelData?.db_master_data || [];
    const rawRealisasi = excelData?.db_realisasi || [];

    const today = new Date(selectedYear, selectedMonth, 0);
    today.setHours(23, 59, 59, 999);

    const ongoingProjects = rawProjects.filter((proj) => {
      const rawStatus =
        proj.status_proyek ||
        proj.status_projek ||
        proj.status_project ||
        proj.status ||
        "";
      const status = String(rawStatus).toLowerCase().replace(/\s+/g, "");
      return status.includes("ongoing");
    });

    // PERBAIKAN: Hanya ada 1 map di sini
    const calculated = ongoingProjects.map((proj) => {
      const mId =
        proj.id_project || proj.id_proyek || proj.project_id || proj.id;

      let realisasiProject = [];
      try {
        if (typeof getProjectRealisasi === "function") {
          realisasiProject = getProjectRealisasi(rawRealisasi, mId, today);
        }
      } catch (e) {
        console.warn("Helper getProjectRealisasi gagal", e);
      }

      // --- PARAMETER 1: Behind Schedule ---
      let progRencana = 0;
      let progRealisasi = 0;

      try {
        if (
          typeof calculateRaProgress === "function" &&
          typeof calculateRiProgress === "function"
        ) {
          progRencana = safeParseNumber(calculateRaProgress(realisasiProject));
          progRealisasi = safeParseNumber(
            calculateRiProgress(realisasiProject),
          );
        }
      } catch (e) {}

      const behindSchedule = progRealisasi - progRencana;

      // --- PARAMETER 2: Cost Overrun ---
      const nilaiKontrak = safeParseNumber(
        proj.nk_current || proj.nilai_kontrak,
      );
      const bkMappKumulatif = safeParseNumber(proj.bk_mapp_kumulatif_current);
      const mappPercent =
        nilaiKontrak > 0 ? (bkMappKumulatif / nilaiKontrak) * 100 : 0;

      let realBkpuPercent = 0;
      if (realisasiProject && realisasiProject.length > 0) {
        const latestReal = [...realisasiProject].sort(
          (a, b) => new Date(b.periode) - new Date(a.periode),
        )[0];
        realBkpuPercent = safeParseNumber(
          latestReal?.bkpu_real_kumulatif ?? latestReal?.bkpu_real,
        );
      }

      const costOverrun = mappPercent - realBkpuPercent;

      // --- PARAMETER 3: Time Overrun ---
      const sisaProgres = Math.max(0, 100 - progRealisasi);
      const endDate = safeDateConvert(proj.end_date_current || proj.end_date);
      let sisaHari = 30;
      if (endDate) {
        endDate.setHours(0, 0, 0, 0);
        sisaHari = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      }
      const urgencyRatio =
        sisaHari > 0 ? (sisaProgres / sisaHari) * 100 : sisaProgres * 2;

      return {
        ...proj,
        id_project: mId,
        project_name:
          proj.nama_proyek_current ||
          proj.nama_proyek ||
          getDisplayName(proj) ||
          "Proyek Tanpa Nama",
        divisi: proj.divisi_current || proj.divisi || "-",
        status_proyek:
          proj.status_proyek || proj.status_project_current || "On Going",
        progRencana,
        progRealisasi,
        behindSchedule,
        costOverrun,
        mappPercent,
        realBkpuPercent,
        urgencyRatio,
        sisaHari,
        sisaProgres,
      };
    });

    // Proses Pemeringkatan
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
  }, [excelData, globalFilter, selectedMonth, selectedYear]);

  const { list: allProjects, stats } = riskData;

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

  const filteredProjects = sortedTableProjects.filter((proj) => {
    const keyword = searchTerm.toLowerCase();

    return (
      String(getDisplayName(proj) || "")
        .toLowerCase()
        .includes(keyword) ||
      String(proj.id_project || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  const handleSummaryClick = (id_project) => {
    setHighlightedId(id_project);
    setSortBy("total_risk");
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (rowRefs.current[id_project]) {
        rowRefs.current[id_project].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);
    setTimeout(() => setHighlightedId(null), 4000);
  };

  return (
    <div className="w-full space-y-6 font-sans mt-8">
      {/* ====================================================================== */}
      {/* MODUL 1: GRID ATAS (KIRI: SUMMARY, KANAN: METODOLOGI) */}
      {/* ====================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* KOLOM KIRI: EXECUTIVE RISK SUMMARY */}
        <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="text-blue-900" size={20} />
                Executive Risk Summary
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Klik nama proyek untuk melihat rincian evaluasinya di tabel
                bawah.
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex flex-col items-center justify-center bg-red-50 px-3 sm:px-4 py-2 rounded-xl border border-red-100">
                <span className="text-xl sm:text-2xl font-black text-red-600">
                  {stats.kritis}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-red-600 uppercase">
                  Kritis
                </span>
              </div>
              <div className="flex flex-col items-center justify-center bg-orange-50 px-3 sm:px-4 py-2 rounded-xl border border-orange-100">
                <span className="text-xl sm:text-2xl font-black text-orange-500">
                  {stats.waspada}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-orange-500 uppercase">
                  Waspada
                </span>
              </div>
              <div className="flex flex-col items-center justify-center bg-emerald-50 px-3 sm:px-4 py-2 rounded-xl border border-emerald-100">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {stats.normal}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 uppercase">
                  Normal
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[380px] pr-2 space-y-3 scrollbar-thin">
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
                        {getDisplayName(proj)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
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
                        Bedah rincian &rarr;
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KOLOM KANAN: METODOLOGI PENILAIAN */}
        <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-5 flex-shrink-0">
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                Metodologi Penilaian
              </h2>
              <p className="text-[10px] text-slate-500">
                Sistem Peringkat Relatif (Relative Ranking)
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-5 overflow-y-auto max-h-[380px] pr-2 scrollbar-thin">
            <p className="leading-relaxed text-[11px]">
              Sistem ini tidak menggunakan bobot persentase statis, melainkan
              membandingkan kinerja setiap proyek <b>secara dinamis</b> dengan
              proyek lainnya yang sedang aktif (On Going).
            </p>

            {/* Tahap 1 */}
            <div>
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">
                  1
                </span>
                Penilaian 3 Indikator Utama
              </div>
              <div className="space-y-2.5 pl-5">
                <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-800 flex items-center gap-1.5 mb-1">
                    <TrendingDown size={12} /> Behind Schedule (Keterlambatan)
                  </span>
                  <span className="text-[10px] text-slate-600 leading-snug block">
                    Dihitung dari selisih Realisasi thd Rencana progres. Semakin
                    lambat proyek, peringkat (Rank) semakin kecil/buruk.
                  </span>
                </div>
                <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-xl">
                  <span className="font-bold text-red-800 flex items-center gap-1.5 mb-1">
                    <ShieldAlert size={12} /> Cost Overrun
                  </span>
                  <span className="text-[10px] text-slate-600 leading-snug block">
                    Dihitung dari selisih pemakaian BKPU aktual thd batasan
                    MAPP. Semakin over-budget, peringkat semakin kecil/buruk.
                  </span>
                </div>
                <div className="bg-orange-50/50 border border-orange-100 p-2.5 rounded-xl">
                  <span className="font-bold text-orange-800 flex items-center gap-1.5 mb-1">
                    <Clock size={12} /> Urgency Ratio (Tekanan Waktu)
                  </span>
                  <span className="text-[10px] text-slate-600 leading-snug block">
                    Rumus: <b>(Sisa Progres / Sisa Hari) &times; 100</b>.
                    Semakin tinggi rasionya (waktu makin mepet), peringkat
                    semakin kecil/kritis.
                  </span>
                </div>
              </div>
            </div>

            {/* Tahap 2 */}
            <div>
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 mt-2">
                <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">
                  2
                </span>
                Kalkulasi Total Risk Score
              </div>
              <p className="pl-5 text-[10px] leading-relaxed text-slate-600 mb-2">
                Ketiga peringkat di atas dijumlahkan. Semakin kecil angka
                totalnya, berarti proyek tersebut konsisten memiliki kinerja
                terburuk di semua lini parameter.
              </p>
              <div className="pl-5">
                <div className="bg-slate-50 font-mono text-slate-700 font-semibold px-3 py-2 rounded-lg border border-slate-200 text-[9px] break-words whitespace-normal text-center">
                  Total Risk = Rank Behind + Rank Cost + Rank Urgency
                </div>
              </div>
            </div>

            {/* Tahap 3 */}
            <div>
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 mt-2">
                <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">
                  3
                </span>
                Klasifikasi Status Eksekutif
              </div>
              <ul className="pl-5 space-y-2 text-[10px] text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="bg-red-100 p-1 rounded">
                    <AlertOctagon size={12} className="text-red-600 shrink-0" />
                  </div>
                  <span>
                    <b>KRITIS (Top 33.3%):</b> Kelompok proyek dengan skor
                    risiko paling buruk. Membutuhkan intervensi segera dari
                    manajemen.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-orange-100 p-1 rounded">
                    <AlertTriangle
                      size={12}
                      className="text-orange-500 shrink-0"
                    />
                  </div>
                  <span>
                    <b>WASPADA (Mid 33.3%):</b> Kelompok tengah. Membutuhkan
                    pengawasan ketat agar tidak turun kelas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-emerald-100 p-1 rounded">
                    <CheckCircle
                      size={12}
                      className="text-emerald-600 shrink-0"
                    />
                  </div>
                  <span>
                    <b>NORMAL (Bottom 33.3%):</b> Kelompok proyek sehat dengan
                    risiko terendah yang berjalan sesuai koridor.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MODUL 2: PROJECT RANKING DETAIL (TABEL BAWAH - FULL WIDTH) */}
      {/* ====================================================================== */}
      <div
        ref={tableRef}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 scroll-mt-6"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Project Performance Detail Matrix
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Rincian poin deviasi seluruh proyek yang aktif
            </p>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Cari Nama Proyek atau ID Proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
      w-full
      px-4
      py-2
      text-sm
      border
      border-slate-200
      rounded-xl
      bg-white
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
            />
          </div>

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

        <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 relative scrollbar-thin">
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
                filteredProjects.map((proj) => {
                  const isHighlighted = highlightedId === proj.id_project;
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
                        <div className="font-bold text-slate-800 break-words whitespace-normal">
                          {getDisplayName(proj)}
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
                              : "text-emerald-600 font-bold"
                          }
                        >
                          {proj.behindSchedule.toFixed(2)}%
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                          Plan: {proj.progRencana.toFixed(2)}% | Act:{" "}
                          {proj.progRealisasi.toFixed(2)}%
                        </div>
                      </td>

                      <td
                        className={`p-3 px-4 text-right font-semibold ${sortBy === "cost_overrun" && !isHighlighted ? "bg-red-50/20" : ""}`}
                      >
                        <div
                          className={
                            proj.costOverrun < 0
                              ? "text-red-600 font-bold"
                              : "text-emerald-600 font-bold"
                          }
                        >
                          {proj.costOverrun.toFixed(2)}%
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                          Mapp: {proj.mappPercent.toFixed(1)}% | Real:{" "}
                          {proj.realBkpuPercent.toFixed(1)}%
                        </div>
                      </td>

                      <td
                        className={`p-3 px-4 text-center font-semibold ${sortBy === "time_overrun" && !isHighlighted ? "bg-orange-50/20" : ""}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${
                              proj.urgencyRatio > 150
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : proj.urgencyRatio > 80
                                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {proj.urgencyRatio.toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">
                          Sisa Prog: {proj.sisaProgres.toFixed(0)}% | Waktu:{" "}
                          {proj.sisaHari} hr
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
