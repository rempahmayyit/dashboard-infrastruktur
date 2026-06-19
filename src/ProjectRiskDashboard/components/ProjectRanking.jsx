// src/components/ProjectRanking.jsx
import React, { useState, useMemo } from "react";
import { useFilter } from "../../context/FilterContext";
import { ArrowUpDown, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import { getDisplayName } from "../utils/projectName";

// ======================================================================
// HELPER FUNCTIONS
// ======================================================================
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const safeDateConvert = (rawDate) => {
  if (!rawDate) return null;
  let result = null;
  if (typeof rawDate === "number" && rawDate > 10000) {
    result = new Date((rawDate - 25569) * 86400 * 1000);
  } else {
    result = new Date(rawDate);
  }
  if (!result || isNaN(result.getTime())) return null;
  return result;
};

export default function ProjectRanking() {
  const { excelData, globalFilter } = useFilter();
  const [sortBy, setSortBy] = useState("behind_schedule");

  // Setup Waktu (Untuk menghitung Sisa Hari aktual)
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
  // ENGINE KALKULASI PARAMETER PENILAIAN RISK RANKING
  // ======================================================================
  const sortedProjects = useMemo(() => {
    const rawProjects = excelData?.db_master_data || [];
    const rawRealisasi = excelData?.db_realisasi || [];
    const piutangDetail = excelData?.db_piutang_detail || [];

    // Tentukan hari terakhir di bulan yang difilter sebagai 'Today'
    const today = new Date(selectedYear, selectedMonth, 0);
    today.setHours(23, 59, 59, 999);

    // 1. Filter Proyek On Going (Anti-Typo & Anti-Spasi)
    const filtered = rawProjects.filter((proj) => {
      const rawStatus =
        proj.status_proyek ||
        proj.status_projek ||
        proj.status_project ||
        proj.status ||
        "";
      const status = String(rawStatus).toLowerCase().replace(/\s+/g, "");

      return status.includes("ongoing");
    });

    const calculated = filtered.map((proj) => {
      const id =
        proj.id_project || proj.id_proyek || proj.project_id || proj.id;

      // 2. Ambil Riwayat Realisasi Terakhir s.d Bulan Terpilih (YTD)
      const projRealisasi = rawRealisasi
        .filter((r) => {
          const rId = r.id_project || r.id_proyek || r.project_id || r.id;
          let m = safeParseNumber(r.bulan_index);

          if (!m && r.bulan) {
            const textBulan = String(r.bulan).toLowerCase().substring(0, 3);
            const bMap = {
              jan: 1,
              feb: 2,
              mar: 3,
              apr: 4,
              may: 5,
              mei: 5,
              jun: 6,
              jul: 7,
              agu: 8,
              sep: 9,
              okt: 10,
              nov: 11,
              des: 12,
            };
            m = bMap[textBulan] || 0;
          }
          if (!m && r.periode) m = new Date(r.periode).getMonth() + 1;

          let y = safeParseNumber(r.tahun);
          if (!y && r.periode) y = new Date(r.periode).getFullYear();

          return (
            rId === id && y === selectedYear && m > 0 && m <= selectedMonth
          );
        })
        .sort((a, b) => {
          const dateA = a.periode
            ? new Date(a.periode)
            : new Date(a.tahun, a.bulan_index - 1);
          const dateB = b.periode
            ? new Date(b.periode)
            : new Date(b.tahun, b.bulan_index - 1);
          return dateB - dateA;
        });

      const latestReal = projRealisasi[0] || {};

      // --- PARAMETER 1: Behind Schedule ---
      const progRencana = safeParseNumber(
        latestReal.prog_rencana || proj.progress_rencana,
      );
      const progRealisasi = safeParseNumber(
        latestReal.prog_real || proj.progress_realisasi,
      );
      const behindSchedule = progRealisasi - progRencana;

      // --- PARAMETER 2: Cost Overrun ---
      
      const bkMappKumulatif = safeNumber(proj?.bk_mapp_kumulatif_current);

      const puMappKumulatif = safeNumber(proj?.pu_mapp_kumulatif_current);

      const mapp =
        puMappKumulatif > 0 ? (bkMappKumulatif / puMappKumulatif) * 100 : 0;

      const realBkpuPercent = safeParseNumber(latestReal.bkpu_real_kumulatif);
      const costOverrun = mappPercent - realBkpuPercent;

      // --- PARAMETER 3: Time Overrun / Urgency ---
      const sisaProgres = Math.max(0, 100 - progRealisasi);
      const endDate = safeDateConvert(proj.end_date_current || proj.end_date);
      let sisaHari = 30;

      if (endDate) {
        endDate.setHours(0, 0, 0, 0);
        sisaHari = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      }
      const urgencyRatio =
        sisaHari > 0 ? (sisaProgres / sisaHari) * 100 : sisaProgres * 2;

      // =====================================================
      // TAGIHAN BRUTO DARI vw_piutang_detail
      // =====================================================

      const piutangProject = piutangDetail.filter((item) => {
        const namaPiutang = String(item.project_name || "")
          .trim()
          .toUpperCase();

        const namaProject = String(
          proj.project_name || proj.project || proj.nama_proyek || "",
        )
          .trim()
          .toUpperCase();

        return namaPiutang === namaProject;
      });

      const brutoData = piutangProject.filter(
        (item) => item.kategori_piutang === "BRUTO",
      );

      const tagihanBruto = brutoData.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0,
      );

      // sementara cash in kita nonaktifkan dulu
      const komitmenCashIn = 0;

      return {
        ...proj,
        nama_projek: getDisplayName(proj),
        divisi: proj.divisi || proj.owner || "-",
        status_asli: proj.status_proyek || proj.status || "On Going",
        progRencana,
        progRealisasi,
        behindSchedule,
        costOverrun,
        mappPercent,
        realBkpuPercent,
        urgencyRatio,
        sisaHari,
        sisaProgres,
        tagihanBruto,
        komitmenCashIn,
      };
    });

    // 3. Engine Sorting Dinamis
    return calculated.sort((a, b) => {
      if (sortBy === "behind_schedule")
        return a.behindSchedule - b.behindSchedule;
      if (sortBy === "cost_overrun") return a.costOverrun - b.costOverrun;
      if (sortBy === "time_overrun") return b.urgencyRatio - a.urgencyRatio;
      return 0;
    });
  }, [excelData, globalFilter, sortBy, selectedMonth, selectedYear]);

  // ======================================================================
  // RENDER UI
  // ======================================================================
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 font-sans mt-8">
      {/* HEADER KOMPONEN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Project Risk & Performance Ranking
            </h3>
            <span className="px-2 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded-md border border-red-200 uppercase">
              Live Evaluation
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Daftar peringkat kritis proyek On Going berdasarkan deviasi minus
            terbesar (Data YTD)
          </p>
        </div>

        {/* CONTROLLER SWITCH SORTING */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setSortBy("behind_schedule")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "behind_schedule" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <TrendingDown size={12} />
            Behind Schedule
          </button>
          <button
            onClick={() => setSortBy("cost_overrun")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "cost_overrun" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <ShieldAlert size={12} />
            Cost Overrun
          </button>
          <button
            onClick={() => setSortBy("time_overrun")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${sortBy === "time_overrun" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <Clock size={12} />
            Urgency Ratio
          </button>
        </div>
      </div>

      {/* RENDER TABEL RANKING PROYEK */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 scrollbar-thin">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
            <tr>
              <th className="p-3 px-4 text-center w-12">Rank</th>
              <th className="p-3 px-4">Informasi Projek</th>
              <th className="p-3 px-4 text-center">Status</th>

              {/* KOLOM PARAMETER 1 */}
              <th
                className={`p-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-all ${sortBy === "behind_schedule" ? "bg-blue-50/50 text-[#000075]" : ""}`}
                onClick={() => setSortBy("behind_schedule")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Behind Schedule</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              {/* KOLOM PARAMETER 2 */}
              <th
                className={`p-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-all ${sortBy === "cost_overrun" ? "bg-red-50/50 text-[#BD002F]" : ""}`}
                onClick={() => setSortBy("cost_overrun")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Cost Overrun</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              {/* KOLOM PARAMETER 3 */}
              <th
                className={`p-3 px-4 text-center cursor-pointer hover:bg-slate-100 transition-all ${sortBy === "time_overrun" ? "bg-orange-50/50 text-orange-600" : ""}`}
                onClick={() => setSortBy("time_overrun")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Urgency Waktu</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              {/* KOLOM INDIKATOR FINANSIAL */}
              <th className="p-3 px-4 text-right text-slate-600 font-bold bg-slate-100/50">
                Tagihan Bruto
              </th>
              <th className="p-3 px-4 text-right text-slate-600 font-bold bg-slate-100/50 border-r border-transparent">
                Komitmen Cash In
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedProjects.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-slate-400 font-medium"
                >
                  Tidak ada proyek dengan status On Going yang ditemukan pada
                  bulan ini.
                </td>
              </tr>
            ) : (
              sortedProjects.map((proj, idx) => {
                const rankNum = idx + 1;

                // Styling warna lencana peringkat
                let rankBadgeColor = "bg-slate-100 text-slate-700";
                if (rankNum === 1)
                  rankBadgeColor = "bg-red-600 text-white font-black";
                else if (rankNum === 2)
                  rankBadgeColor = "bg-orange-500 text-white font-black";
                else if (rankNum === 3)
                  rankBadgeColor = "bg-amber-500 text-white font-black";

                return (
                  <tr
                    key={proj.id || idx}
                    className="hover:bg-slate-50/80 transition-all"
                  >
                    {/* NOMOR URUT RANKING */}
                    <td className="p-3 px-4 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] ${rankBadgeColor}`}
                      >
                        {rankNum}
                      </span>
                    </td>

                    {/* DETAIL NAMA PROYEK */}
                    <td className="p-3 px-4 max-w-[320px]">
                      <div className="font-bold text-slate-800 break-words whitespace-normal">
                        {proj.nama_projek}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {proj.divisi}
                      </div>
                    </td>

                    {/* STATUS PROYEK */}
                    <td className="p-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          proj.status_asli.toLowerCase().includes("sap")
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {proj.status_asli}
                      </span>
                    </td>

                    {/* ISI PARAMETER 1: BEHIND SCHEDULE */}
                    <td
                      className={`p-3 px-4 text-right font-semibold ${sortBy === "behind_schedule" ? "bg-blue-50/20" : ""}`}
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
                        {`Plan: ${proj.progRencana}% | Act: ${proj.progRealisasi}%`}
                      </div>
                    </td>

                    {/* ISI PARAMETER 2: COST OVERRUN (MAPP vs REAL %) */}
                    <td
                      className={`p-3 px-4 text-right font-semibold ${sortBy === "cost_overrun" ? "bg-red-50/20" : ""}`}
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
                        {`Mapp: ${proj.mappPercent.toFixed(1)}% | Real: ${proj.realBkpuPercent.toFixed(1)}%`}
                      </div>
                    </td>

                    {/* ISI PARAMETER 3: TIME OVERRUN (URGENCY RATIO) */}
                    <td
                      className={`p-3 px-4 text-center font-semibold ${sortBy === "time_overrun" ? "bg-orange-50/20" : ""}`}
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
                        {`Sisa Prog: ${proj.sisaProgres.toFixed(0)}% | Waktu: ${proj.sisaHari} hr`}
                      </div>
                    </td>

                    {/* DATA TAGIHAN BRUTO */}
                    <td className="p-3 px-4 text-right font-semibold bg-slate-50/30">
                      <div className="text-slate-700">
                        {proj.tagihanBruto > 0
                          ? `${(proj.tagihanBruto / 1000000000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
                          : "-"}
                      </div>
                    </td>

                    {/* DATA KOMITMEN CASH IN */}
                    <td className="p-3 px-4 text-right font-semibold bg-slate-50/30">
                      <div className="text-emerald-600">
                        {proj.komitmenCashIn > 0
                          ? `${(proj.komitmenCashIn / 1000000000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
                          : "-"}
                      </div>
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
