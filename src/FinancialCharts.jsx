// src/FinancialCharts.jsx
import React, { useState, useEffect } from "react";
import { Maximize2 } from "lucide-react";
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
import FinancialWarningList from "./components/FinancialWarningList";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export default function FinancialCharts() {
  const { excelData, globalFilter } = useFilter();

  const [activeChartTab, setActiveChartTab] = useState("PU");
  const [chartData, setChartData] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const [filterNonJo, setFilterNonJo] = useState(true);
  const [filterJoi, setFilterJoi] = useState(false);

  const monthMap = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6,
    Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12,
  };

  const currentMonthNum = monthMap[globalFilter?.bulan] || 4;

  useEffect(() => {
    if (activeChartTab === "PU") {
      setFilterNonJo(true); setFilterJoi(false);
    } else if (activeChartTab === "LK") {
      setFilterNonJo(true); setFilterJoi(true);
    } else if (activeChartTab === "BKPU") {
      setFilterNonJo(true); setFilterJoi(false);
    } else if (activeChartTab === "LB") {
      setFilterNonJo(true); setFilterJoi(true);
    }
  }, [activeChartTab]);

  const getComponentConfig = () => {
    switch (activeChartTab) {
      case "PU": return { name: "PU (Miliar)", color: "#000075", title: "Top 5 PU Tidak Tercapai" };
      case "LK": return { name: "Laba Kotor (Miliar)", color: "#BD002F", title: "Top 5 LK Tidak Tercapai" };
      case "BKPU": return { name: "BK/PU (%)", color: "#f97316", title: "Top 5 BK/PU Deviasi" };
      case "LB": return { name: "Laba Bersih (Miliar)", color: "#059669", title: "Top 5 LB Tidak Tercapai" };
      default: return { name: "Nilai", color: "#000075", title: "Peringatan" };
    }
  };

  const current = getComponentConfig();

  const monthFullNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const monthShortNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  const selectedMonthName = monthFullNames[currentMonthNum - 1] || "Bulan";

  useEffect(() => {
    try {
      const selectedYear = Number(globalFilter?.tahun || 2026);
      
      const rawRkapData = excelData?.db_rkap_awal || [];
      const rawRealisasiData = excelData?.db_realisasi || []; 

      // ======================================================================
      // RADAR DIAGNOSTIK: Tampil di Console (Tekan F12 di Browser)
      // ======================================================================
      console.log("--- STATUS DATA REALISASI ---");
      console.log(`Jumlah Baris Ditarik: ${rawRealisasiData.length}`);
      if (rawRealisasiData.length === 0) {
        console.warn("PERINGATAN: Data 0! Cek apakah tabel 'db_realisasi' di Supabase kosong, atau gembok RLS Policy (SELECT -> anon) belum dibuka!");
      } else {
        console.log("Daftar Kolom Anda di Supabase:", Object.keys(rawRealisasiData[0]).join(", "));
      }
      // ======================================================================

      let cumulative_PU_rencana = 0;
      let cumulative_PU_realisasi = 0;
      let cumulative_BK_rencana = 0;
      let cumulative_BK_realisasi = 0;

      const resultChart = monthShortNames.map((mName, index) => {
        const monthNumber = index + 1;

        const filterDataBulanan = (rawDataArray) => {
          return rawDataArray.filter((item) => {
            const itemYear = safeParseNumber(item.tahun);
            let itemMonth = safeParseNumber(item.bulan_index);
            if (itemMonth === 0 && item.bulan) {
              const namaBulan = String(item.bulan).toLowerCase().substring(0, 3);
              const arrayBulan = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"];
              const indexM = arrayBulan.indexOf(namaBulan);
              if (indexM !== -1) itemMonth = indexM + 1;
              else itemMonth = safeParseNumber(item.bulan);
            }

            const itemType = String(item.nonjo_joi || "").trim().toLowerCase();
            const isYearMonthMatch = itemYear === selectedYear && itemMonth === monthNumber;

            let isTypeMatch = false;
            if (itemType === "" || itemType === "-" || itemType === "null" || itemType === "undefined") isTypeMatch = true;
            else {
              if (filterNonJo && itemType.includes("non")) isTypeMatch = true;
              if (filterJoi && !itemType.includes("non") && itemType.includes("jo")) isTypeMatch = true;
            }

            return isYearMonthMatch && isTypeMatch;
          });
        };

        const rkapMonthData = filterDataBulanan(rawRkapData);
        const realisasiMonthData = filterDataBulanan(rawRealisasiData);

        // FITUR SAPU JAGAT: Otomatis mendeteksi nama kolom realisasi Anda
        const getDynamicValue = (item, typeKey) => { // typeKey = "pu" atau "bk"
          // 1. Cek ejaan presisi standar
          let exactMatch = item[`${typeKey}_realisasi_parsial`] ?? item[`${typeKey}_Realisasi_Parsial`] ?? item[`${typeKey}_realisasi`];
          if (exactMatch !== undefined && exactMatch !== null) return safeParseNumber(exactMatch);

          // 2. Sapu Jagat: Cari kolom apapun yang namanya mengandung "pu" & "real"
          const keys = Object.keys(item);
          for (let i = 0; i < keys.length; i++) {
            const k = keys[i].toLowerCase();
            if (k.includes(typeKey) && (k.includes("real") || k.includes("parsial"))) {
              return safeParseNumber(item[keys[i]]);
            }
          }
          return 0; // Jika benar-benar gagal total
        };

        const parsial_PU_rencana = rkapMonthData.reduce((sum, item) => sum + safeParseNumber(item.pu_rkap_parsial || item.PU_RKAP_Parsial), 0) / 1000000000;
        const parsial_BK_rencana = rkapMonthData.reduce((sum, item) => sum + safeParseNumber(item.bk_rkap_parsial || item.BK_RKAP_Parsial), 0) / 1000000000;

        // Menggunakan pendeteksi otomatis
        const parsial_PU_realisasi = realisasiMonthData.reduce((sum, item) => sum + getDynamicValue(item, "pu"), 0) / 1000000000;
        const parsial_BK_realisasi = realisasiMonthData.reduce((sum, item) => sum + getDynamicValue(item, "bk"), 0) / 1000000000;

        cumulative_PU_rencana += parsial_PU_rencana;
        cumulative_PU_realisasi += parsial_PU_realisasi;
        cumulative_BK_rencana += parsial_BK_rencana;
        cumulative_BK_realisasi += parsial_BK_realisasi;

        let finalRencana = 0;
        let finalRealisasi = 0;

        if (activeChartTab === "PU") {
          finalRencana = cumulative_PU_rencana;
          finalRealisasi = cumulative_PU_realisasi;
        } else if (activeChartTab === "LK" || activeChartTab === "LB") {
          finalRencana = cumulative_PU_rencana - cumulative_BK_rencana;
          finalRealisasi = cumulative_PU_realisasi - cumulative_BK_realisasi;
        } else if (activeChartTab === "BKPU") {
          finalRencana = cumulative_PU_rencana > 0 ? (cumulative_BK_rencana / cumulative_PU_rencana) * 100 : 0;
          finalRealisasi = cumulative_PU_realisasi > 0 ? (cumulative_BK_realisasi / cumulative_PU_realisasi) * 100 : 0;
        }

        const isPercentage = activeChartTab === "BKPU";

        return {
          month: mName,
          rencana: isPercentage ? Number(finalRencana.toFixed(2)) : Number(finalRencana.toFixed(0)),
          realisasi: monthNumber <= currentMonthNum
            ? (isPercentage ? Number(finalRealisasi.toFixed(2)) : Number(finalRealisasi.toFixed(0)))
            : null,
        };
      });

      setChartData(resultChart);
    } catch (error) {
      console.error("Error saat mengolah data grafik:", error);
    }
  }, [excelData, globalFilter, currentMonthNum, activeChartTab, filterNonJo, filterJoi]);

  return (
    <>
      <div className="space-y-4 font-sans mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900">Operational Performance</h3>
            <p className="text-slate-400 text-xs">Klik tab untuk mengubah rincian visualisasi data</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button onClick={() => setActiveChartTab("PU")} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeChartTab === "PU" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>PU</button>
              <button onClick={() => setActiveChartTab("LK")} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeChartTab === "LK" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>Laba Kotor</button>
              <button onClick={() => setActiveChartTab("BKPU")} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeChartTab === "BKPU" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>BK/PU</button>
              <button onClick={() => setActiveChartTab("LB")} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeChartTab === "LB" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>Laba Bersih</button>
            </div>
            <div className="w-px h-6 bg-slate-300 hidden sm:block mx-1"></div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button onClick={() => setFilterNonJo(!filterNonJo)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${filterNonJo ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:bg-slate-200"}`}><div className={`w-1.5 h-1.5 rounded-full ${filterNonJo ? "bg-green-400" : "bg-slate-400"}`}></div>Non JO</button>
              <button onClick={() => setFilterJoi(!filterJoi)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${filterJoi ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:bg-slate-200"}`}><div className={`w-1.5 h-1.5 rounded-full ${filterJoi ? "bg-green-400" : "bg-slate-400"}`}></div>JOI</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden max-h-[400px]">
            <div className="flex justify-between items-start mb-3 flex-shrink-0">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Kinerja sd. Bulan Ini</h4>
                <p className="text-[10px] text-slate-400">{`Periode Januari - ${selectedMonthName}`}</p>
              </div>
              <button onClick={() => setIsTableOpen(true)} className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all shadow-sm"><Maximize2 size={13} /></button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 pr-1"><FinancialTable /></div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Visualisasi Tren Bulanan</h4>
              <p className="text-[10px] text-slate-400">Komparasi target vs realisasi</p>
            </div>
            <div className="w-full flex-1 pt-4 min-w-0 min-h-[320px]">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 15, right: 15, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 9 }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: 9 }} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 12 }} />
                  <Line type="monotone" dataKey="rencana" stroke="#94a3b8" strokeWidth={1.5} name="RKAP Tahunan" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="realisasi" stroke={current.color} strokeWidth={2.5} connectNulls dot={{ fill: current.color, r: 3 }} name={current.name}>
                    <LabelList dataKey="realisasi" position="top" style={{ fill: current.color, fontSize: 8, fontWeight: "bold" }} />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-full"><FinancialWarningList current={current} /></div>
        </div>
      </div>

      <PopupContainer isOpen={isTableOpen} setIsOpen={setIsTableOpen} title="Kinerja sd. Bulan Ini" subtitle={`Periode Januari - ${selectedMonthName}`}>
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 sm:p-4 [&_table]:w-full [&_table]:min-w-max [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_th]:text-[13px] [&_th]:font-extrabold [&_th]:py-4 [&_th]:px-5 [&_th]:text-slate-700 [&_td]:text-[13px] [&_td]:font-semibold [&_td]:py-4 [&_td]:px-5 [&_td]:text-slate-800">
          <FinancialTable />
        </div>
      </PopupContainer>
    </>
  );
}