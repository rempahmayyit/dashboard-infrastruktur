// src/FinancialCharts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Maximize2, AlertTriangle } from "lucide-react";
import { getDisplayName } from "./utils/projectName";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  LabelList,
} from "recharts";

import { useFilter } from "./context/FilterContext";
import PopupContainer from "./components/PopupContainer";
import FinancialTable from "./components/FinancialTable";
import { formatNumber } from "./utils/formatters";

// Helper Keamanan Angka
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

// ============================================================================
// KOMPONEN BARU: PANEL TOP 5 (Sesuai Aturan Deviasi & Laba Bersih)
// ============================================================================
const Top5WarningPanel = ({ current, top5Data, activeTab }) => {
  const isLB = activeTab === "LB";

  // Format Helper: Otomatis membagi 1 Miliar dan menambah imbuhan "M" atau "%"
  const formatM = (val) => {
    const num = (val / 1000000000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return num + " M";
  };

  const formatPct = (val) => {
    return (
      val.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + "%"
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col h-full max-h-[400px] overflow-hidden">
      {" "}
      <div className="flex-shrink-0 mb-3 border-b border-slate-100 pb-2">
        <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-wider text-[#BD002F] flex items-center gap-1.5">
          <AlertTriangle size={15} strokeWidth={2.5} />
          {current.title}
        </h4>
        <p className="text-[14px] text-slate-400 mt-0.5">
          Peringkat 5 deviasi negatif
        </p>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
        {top5Data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-[20px] mb-1">🎉</span>
            <span className="text-[12px] font-black text-emerald-600 tracking-wide uppercase">
              Semua Tercapai!
            </span>
          </div>
        )}

        {/* RENDER UNTUK TAB PU, LK, DAN BK/PU (Berdasarkan Proyek) */}
        {!isLB &&
          top5Data.map((item, i) => {
            let valStr = "";
            if (activeTab === "PU") valStr = formatM(item.devPu);
            else if (activeTab === "LK") valStr = formatM(item.devLk);
            else if (activeTab === "BKPU") valStr = formatPct(item.devBkPu);

            return (
              <div
                key={i}
                className="flex justify-between items-center p-2.5 rounded-xl bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors"
              >
                <span
                  className="text-[12px] font-bold text-slate-700 break-words whitespace-normal pr-2"
                  title={item.name}
                >
                  {item.name}
                </span>
                <span className="text-[12px] font-black text-[#BD002F] font-mono tracking-tighter">
                  {valStr}
                </span>
              </div>
            );
          })}

        {/* RENDER KHUSUS UNTUK TAB LABA BERSIH (Berdasarkan Beban - Tampil Semua) */}
        {isLB &&
          top5Data.map((item, i) => {
            // Logika Warna: Merah jika jebol (minus), Hijau jika hemat/tercapai (plus atau 0)
            const isOverbudget = item.dev < 0;

            return (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-colors ${
                  isOverbudget
                    ? "bg-red-50/60 border-red-100 hover:bg-red-50"
                    : "bg-emerald-50/60 border-emerald-100 hover:bg-emerald-50"
                }`}
              >
                <div
                  className={`flex justify-between items-center border-b pb-1.5 ${isOverbudget ? "border-red-100/60" : "border-emerald-100/60"}`}
                >
                  <span
                    className="text-[12px] font-black text-slate-800 uppercase break-words whitespace-normal pr-2"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`text-[12px] font-black bg-white px-1.5 py-0.5 rounded shadow-sm border font-mono tracking-tighter ${
                      isOverbudget
                        ? "text-[#BD002F] border-red-100"
                        : "text-emerald-600 border-emerald-100"
                    }`}
                  >
                    {formatM(item.dev)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    RKAP:{" "}
                    <span className="font-bold text-slate-700 font-mono">
                      {formatM(item.rkap)}
                    </span>
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    Real:{" "}
                    <span className="font-bold text-slate-700 font-mono">
                      {formatM(item.real)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default function FinancialCharts() {
  const { excelData, globalFilter } = useFilter();

  const [activeChartTab, setActiveChartTab] = useState("PU");
  const [chartData, setChartData] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const [filterNonJo, setFilterNonJo] = useState(true);
  const [filterJoi, setFilterJoi] = useState(false);

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
  const currentMonthNum =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

  useEffect(() => {
    if (activeChartTab === "PU") {
      setFilterNonJo(true);
      setFilterJoi(false);
    } else if (activeChartTab === "LK") {
      setFilterNonJo(true);
      setFilterJoi(true);
    } else if (activeChartTab === "BKPU") {
      setFilterNonJo(true);
      setFilterJoi(false);
    } else if (activeChartTab === "LB") {
      setFilterNonJo(true);
      setFilterJoi(true);
    }
  }, [activeChartTab]);

  const getComponentConfig = () => {
    switch (activeChartTab) {
      case "PU":
        return {
          name: "PU",
          color: "#000075",
          title: "Top 5 PU Tidak Tercapai",
        };
      case "LK":
        return {
          name: "Laba Kotor",
          color: "#BD002F",
          title: "Top 5 LK Tidak Tercapai",
        };
      case "BKPU":
        return {
          name: "BK/PU",
          color: "#f97316",
          title: "Top 5 BK/PU (Cost Overrun)",
        };
      case "LB":
        // UBAH JUDUL DI SINI
        return {
          name: "Laba Bersih",
          color: "#059669",
          title: "Rincian Deviasi Beban",
        };
      default:
        return { name: "Nilai", color: "#000075", title: "Peringatan" };
    }
  };

  const current = getComponentConfig();
  const monthFullNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthShortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const selectedMonthName = monthFullNames[currentMonthNum - 1] || "Bulan";

  // HELPER PENDETEKSI KOLOM OTOMATIS (Sapu Jagat)
  const getDynamicValue = (item, typeKey) => {
    let exactMatch =
      item[`${typeKey}_realisasi_parsial`] ??
      item[`${typeKey}_Realisasi_Parsial`] ??
      item[`${typeKey}_realisasi`];
    if (exactMatch !== undefined && exactMatch !== null)
      return safeParseNumber(exactMatch);

    const keys = Object.keys(item);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i].toLowerCase();
      if (
        k.includes(typeKey) &&
        (k.includes("real") || k.includes("parsial"))
      ) {
        return safeParseNumber(item[keys[i]]);
      }
    }
    return 0;
  };

  // ======================================================================
  // LOGIKA 1: KALKULASI DATA GRAFIK UTAMA
  // ======================================================================
  useEffect(() => {
    try {
      const selectedYear = Number(globalFilter?.tahun || 2026);
      const rawRkapData = excelData?.db_rkap_awal || [];
      const rawRealisasiData = excelData?.db_realisasi || [];
      const rawBebanData = excelData?.db_beban_bawah || []; // TAMBAHAN BEBAN

      let cumulative_PU_rencana = 0,
        cumulative_PU_realisasi = 0;
      let cumulative_BK_rencana = 0,
        cumulative_BK_realisasi = 0;
      let cumulative_Beban_rencana = 0,
        cumulative_Beban_realisasi = 0; // TAMBAHAN BEBAN

      const resultChart = monthShortNames.map((mName, index) => {
        const monthNumber = index + 1;

        const filterDataBulanan = (rawDataArray, isRkap = false) => {
          return rawDataArray.filter((item) => {
            const itemYear = safeParseNumber(item.tahun);
            let itemMonth = safeParseNumber(item.bulan_index);
            if (itemMonth === 0 && item.bulan) {
              const textBulan = String(item.bulan)
                .toLowerCase()
                .substring(0, 3);
              const indexM = [
                "jan",
                "feb",
                "mar",
                "apr",
                "mei",
                "jun",
                "jul",
                "agu",
                "sep",
                "okt",
                "nov",
                "des",
              ].indexOf(textBulan);
              itemMonth =
                indexM !== -1 ? indexM + 1 : safeParseNumber(item.bulan);
            }

            const isYearMonthMatch =
              itemYear === selectedYear && itemMonth === monthNumber;
            let category = String(
              item.jenis_jo_current || item.nonjo_joi || "",
            ).toUpperCase();

            let isTypeMatch = false;
            if (filterNonJo && !filterJoi)
              isTypeMatch = category.includes("NON");
            else if (!filterNonJo && filterJoi)
              isTypeMatch = category.includes("JOI");
            else if (filterNonJo && filterJoi) isTypeMatch = true;

            if (isRkap && isYearMonthMatch && isTypeMatch) {
              return String(item.rkap_status || "")
                .toLowerCase()
                .includes("awal");
            }

            return isYearMonthMatch && isTypeMatch;
          });
        };

        // FILTER KHUSUS BEBAN BAWAH (Karena tidak punya kolom status JO/NON-JO, ia berlaku Total)
        const filterBebanBulanan = () => {
          return rawBebanData.filter((item) => {
            let y =
              safeParseNumber(item.tahun) ||
              (item.periode ? new Date(item.periode).getFullYear() : 0);
            let m = safeParseNumber(item.bulan_index);
            if (!m && item.periode) m = new Date(item.periode).getMonth() + 1;

            return y === selectedYear && m === monthNumber;
          });
        };

        const rkapMonthData = filterDataBulanan(rawRkapData, true);
        const realisasiMonthData = filterDataBulanan(rawRealisasiData, false);
        const bebanMonthData = filterBebanBulanan(); // EKSEKUSI FILTER BEBAN

        cumulative_PU_rencana +=
          rkapMonthData.reduce(
            (sum, item) =>
              sum +
              safeParseNumber(item.pu_rkap_parsial || item.PU_RKAP_Parsial),
            0,
          ) / 1000000000;
        cumulative_BK_rencana +=
          rkapMonthData.reduce(
            (sum, item) =>
              sum +
              safeParseNumber(item.bk_rkap_parsial || item.BK_RKAP_Parsial),
            0,
          ) / 1000000000;

        cumulative_PU_realisasi +=
          realisasiMonthData.reduce(
            (sum, item) => sum + getDynamicValue(item, "pu"),
            0,
          ) / 1000000000;
        cumulative_BK_realisasi +=
          realisasiMonthData.reduce(
            (sum, item) => sum + getDynamicValue(item, "bk"),
            0,
          ) / 1000000000;

        // KALKULASI BEBAN (Angka beban Supabase sudah minus, jadi ditambahkan langsung)
        cumulative_Beban_rencana +=
          bebanMonthData.reduce(
            (sum, item) => sum + safeParseNumber(item.beban_bawah_rkap_parsial),
            0,
          ) / 1000000000;
        cumulative_Beban_realisasi +=
          bebanMonthData.reduce(
            (sum, item) => sum + safeParseNumber(item.beban_bawah_real_parsial),
            0,
          ) / 1000000000;

        let finalRencana = 0,
          finalRealisasi = 0;

        if (activeChartTab === "PU") {
          finalRencana = cumulative_PU_rencana;
          finalRealisasi = cumulative_PU_realisasi;
        } else if (activeChartTab === "LK") {
          finalRencana = cumulative_PU_rencana - cumulative_BK_rencana;
          finalRealisasi = cumulative_PU_realisasi - cumulative_BK_realisasi;
        } else if (activeChartTab === "LB") {
          // LABA BERSIH = (PU - BK) + BEBAN BAWAH
          finalRencana =
            cumulative_PU_rencana -
            cumulative_BK_rencana +
            cumulative_Beban_rencana;
          finalRealisasi =
            cumulative_PU_realisasi -
            cumulative_BK_realisasi +
            cumulative_Beban_realisasi;
        } else if (activeChartTab === "BKPU") {
          finalRencana =
            cumulative_PU_rencana > 0
              ? (cumulative_BK_rencana / cumulative_PU_rencana) * 100
              : 0;
          finalRealisasi =
            cumulative_PU_realisasi > 0
              ? (cumulative_BK_realisasi / cumulative_PU_realisasi) * 100
              : 0;
        }

        const isPercentage = activeChartTab === "BKPU";
        return {
          month: mName,
          rencana: isPercentage
            ? Number(finalRencana.toFixed(2))
            : Number(finalRencana.toFixed(0)),
          realisasi:
            monthNumber <= currentMonthNum
              ? isPercentage
                ? Number(finalRealisasi.toFixed(2))
                : Number(finalRealisasi.toFixed(0))
              : null,
        };
      });

      setChartData(resultChart);
    } catch (error) {
      console.error("Error chart:", error);
    }
  }, [
    excelData,
    globalFilter,
    currentMonthNum,
    activeChartTab,
    filterNonJo,
    filterJoi,
  ]);

  // ======================================================================
  // LOGIKA 2: KALKULASI TOP 5 TIDAK TERCAPAI
  // ======================================================================
  const top5Data = useMemo(() => {
    const rawRkapData = excelData?.db_rkap_awal || [];
    const rawRealisasiData = excelData?.db_realisasi || [];
    const rawBebanData = excelData?.db_beban_bawah || [];
    const selectedYear = Number(globalFilter?.tahun || 2026);

    // FUNGSI PENCARI BULAN SUPER KETAT (Bisa baca format kalender apapun)
    const getValidMonth = (row) => {
      let m = safeParseNumber(row.bulan_index);

      if (!m && row.bulan) {
        const textBulan = String(row.bulan).toLowerCase().substring(0, 3);
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

      if (!m && row.periode) {
        const rawDate = String(row.periode);
        const d = new Date(rawDate);

        if (!isNaN(d.getTime())) {
          m = d.getMonth() + 1; // Jika format YYYY-MM-DD standar
        } else {
          // Jika Supabase menyimpan dalam format DD/MM/YYYY atau DD-MM-YYYY
          const parts = rawDate.split(/[-/]/);
          if (parts.length === 3) {
            if (parts[0].length <= 2 && parts[2].length === 4) {
              m = safeParseNumber(parts[1]);
            } else if (parts[0].length === 4) {
              m = safeParseNumber(parts[1]);
            }
          }
        }
      }
      return m;
    };

    // SAPU JAGAT KHUSUS BEBAN BAWAH
    const getBebanValue = (row, keyPart) => {
      let exact =
        row[`beban_bawah_${keyPart}_parsial`] ?? row[`beban_${keyPart}`];
      if (exact !== undefined && exact !== null) return safeParseNumber(exact);

      const keys = Object.keys(row);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i].toLowerCase();
        if (
          k.includes(keyPart) &&
          (k.includes("beban") || k.includes("parsial"))
        ) {
          return safeParseNumber(row[keys[i]]);
        }
      }
      return 0;
    };

    // ALUR 1: Jika Tab Laba Bersih (Tampilkan KESELURUHAN Rincian db_beban_bawah)
    if (activeChartTab === "LB") {
      const bebanMap = {};

      rawBebanData.forEach((row) => {
        const m = getValidMonth(row);
        let y = safeParseNumber(row.tahun);

        if (!y && row.periode) {
          const d = new Date(row.periode);
          if (!isNaN(d.getTime())) y = d.getFullYear();
          else if (row.periode.includes("/"))
            y = safeParseNumber(row.periode.split("/").pop());
          else if (row.periode.includes("-"))
            y = safeParseNumber(row.periode.split("-").pop());
        }
        if (!y) y = selectedYear;

        // Filter YTD: Tahun cocok & Bulan <= Bulan Terpilih
        if (y === selectedYear && m > 0 && m <= currentMonthNum) {
          const rawName =
            row.uraian ||
            row.keterangan ||
            row.nama_beban ||
            row.item ||
            "Beban Lainnya";

          // STANDARISASI: Huruf Besar Semua & Hapus Spasi Berlebih agar akumulasi tidak bocor
          const groupKey = String(rawName)
            .trim()
            .toUpperCase()
            .replace(/\s+/g, " ");

          if (!bebanMap[groupKey]) {
            bebanMap[groupKey] = { name: rawName, rkap: 0, real: 0 };
          }

          bebanMap[groupKey].rkap += getBebanValue(row, "rkap");
          bebanMap[groupKey].real += getBebanValue(row, "real");
        }
      });

      console.log("BEBAN MAP =", bebanMap);

      return Object.values(bebanMap)
        .map((b) => ({
          ...b,
          dev: b.real - b.rkap,
        }))
        .sort((a, b) => a.dev - b.dev); // Minus terbesar di atas
    }

    // ALUR 2: Jika Tab PU, LK, BK/PU (Tampilkan Rincian Proyek)
    const projectMap = {};
    const processData = (dataArray, isRkap) => {
      dataArray.forEach((row) => {
        const m = getValidMonth(row);
        const y = safeParseNumber(row.tahun);

        if (y === selectedYear && m > 0 && m <= currentMonthNum) {
          let category = String(
            row.jenis_jo_current || row.nonjo_joi || "",
          ).toUpperCase();
          let isTypeMatch = false;
          if (filterNonJo && !filterJoi) isTypeMatch = category.includes("NON");
          else if (!filterNonJo && filterJoi)
            isTypeMatch = category.includes("JOI");
          else if (filterNonJo && filterJoi) isTypeMatch = true;

          if (!isTypeMatch) return;
          if (
            isRkap &&
            !String(row.rkap_status || "")
              .toLowerCase()
              .includes("awal")
          )
            return;

          const id =
            row.id_project || row.id_proyek || row.project_id || row.id;
          if (!id) return;

          if (!projectMap[id]) {
            projectMap[id] = {
              id,
              name: getDisplayName(row) || `Proyek ${id}`,
              rkapPu: 0,
              rkapBk: 0,
              realPu: 0,
              realBk: 0,
            };
          }

          if (isRkap) {
            projectMap[id].rkapPu += safeParseNumber(
              row.pu_rkap_parsial || row.PU_RKAP_Parsial,
            );
            projectMap[id].rkapBk += safeParseNumber(
              row.bk_rkap_parsial || row.BK_RKAP_Parsial,
            );
          } else {
            projectMap[id].realPu += getDynamicValue(row, "pu");
            projectMap[id].realBk += getDynamicValue(row, "bk");
          }
        }
      });
    };

    processData(rawRkapData, true);
    processData(rawRealisasiData, false);

    let list = Object.values(projectMap).map((p) => {
      p.devPu = p.realPu - p.rkapPu;
      p.devLk = p.realPu - p.realBk - (p.rkapPu - p.rkapBk);
      const rkapBkPu = p.rkapPu > 0 ? (p.rkapBk / p.rkapPu) * 100 : 0;
      const realBkPu = p.realPu > 0 ? (p.realBk / p.realPu) * 100 : 0;
      p.devBkPu = rkapBkPu - realBkPu;
      return p;
    });

    if (activeChartTab === "PU")
      list = list.filter((p) => p.devPu < 0).sort((a, b) => a.devPu - b.devPu);
    else if (activeChartTab === "LK")
      list = list.filter((p) => p.devLk < 0).sort((a, b) => a.devLk - b.devLk);
    else if (activeChartTab === "BKPU")
      list = list
        .filter((p) => p.devBkPu < 0)
        .sort((a, b) => a.devBkPu - b.devBkPu);

    return list.slice(0, 5);
  }, [
    excelData,
    globalFilter,
    currentMonthNum,
    activeChartTab,
    filterNonJo,
    filterJoi,
  ]);

  return (
    <>
      <div className="space-y-4 font-sans mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-[24px] font-bold text-slate-900">
              Operational Performance
            </h3>
            <p className="text-slate-400 text-[11]]">
              Klik tab untuk mengubah rincian data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button
                onClick={() => setActiveChartTab("PU")}
                className={`px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${activeChartTab === "PU" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                PU
              </button>
              <button
                onClick={() => setActiveChartTab("LK")}
                className={`px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${activeChartTab === "LK" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                Laba Kotor
              </button>
              <button
                onClick={() => setActiveChartTab("BKPU")}
                className={`px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${activeChartTab === "BKPU" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                BK/PU
              </button>
              <button
                onClick={() => setActiveChartTab("LB")}
                className={`px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${activeChartTab === "LB" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                Laba Bersih
              </button>
            </div>
            <div className="w-px h-6 bg-slate-300 hidden sm:block mx-1"></div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button
                onClick={() => setFilterNonJo(!filterNonJo)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${filterNonJo ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:bg-slate-200"}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${filterNonJo ? "bg-green-400" : "bg-slate-400"}`}
                ></div>
                Non JO
              </button>
              <button
                onClick={() => setFilterJoi(!filterJoi)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-black rounded-lg transition-all ${filterJoi ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:bg-slate-200"}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${filterJoi ? "bg-green-400" : "bg-slate-400"}`}
                ></div>
                JOI
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden max-h-[400px]">
            <div className="flex justify-between items-start mb-3 flex-shrink-0">
              <div>
                <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-wider">
                  Kinerja sd. Bulan Ini
                </h4>
                <p className="text-[14px] text-slate-400">{`Periode Januari - ${selectedMonthName}`}</p>
              </div>
              <button
                onClick={() => setIsTableOpen(true)}
                className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all shadow-sm"
              >
                <Maximize2 size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <FinancialTable />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0">
              <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-wider">
                Tren Kinerja Bulanan
              </h4>
              <p className="text-[14px] text-slate-400">
                Komparasi RKAP vs Realisasi
              </p>
            </div>
            <div className="w-full flex-1 pt-4 min-w-0 min-h-[320px]">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 15, bottom: 5, left: -15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const isPercent = activeChartTab === "BKPU";
                      return [
                        isPercent
                          ? `${formatNumber(value, 2)}%`
                          : `${formatNumber(value, 1)} M`,
                        name,
                      ];
                    }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                      color: "#475569",
                      marginBottom: "4px",
                      fontSize: "14px",
                    }}
                    itemStyle={{ fontSize: "14px", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14, paddingTop: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="rencana"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    name="RKAP"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="realisasi"
                    stroke={current.color}
                    strokeWidth={2.5}
                    connectNulls
                    dot={{ fill: current.color, r: 3 }}
                    name={current.name}
                  >
                    <LabelList
                      dataKey="realisasi"
                      position="top"
                      style={{
                        fill: current.color,
                        fontSize: 11,
                        fontWeight: "bold",
                      }}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-full">
            {/* INJEKSI PANEL TOP 5 BARU MENGGANTIKAN KOMPONEN LAMA */}
            <Top5WarningPanel
              current={current}
              top5Data={top5Data}
              activeTab={activeChartTab}
            />
          </div>
        </div>
      </div>

      <PopupContainer
        isOpen={isTableOpen}
        setIsOpen={setIsTableOpen}
        title="Kinerja sd. Bulan Ini"
        subtitle={`Periode Januari - ${selectedMonthName}`}
      >
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 sm:p-4 [&_table]:w-full [&_table]:min-w-max [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_th]:text-[13px] [&_th]:font-extrabold [&_th]:py-4 [&_th]:px-5 [&_th]:text-slate-700 [&_td]:text-[13px] [&_td]:font-semibold [&_td]:py-4 [&_td]:px-5 [&_td]:text-slate-800">
          <FinancialTable />
        </div>
      </PopupContainer>
    </>
  );
}
