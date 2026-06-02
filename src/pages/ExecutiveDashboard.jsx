// src/pages/ExecutiveDashboard.jsx

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { formatPercent, formatMiliar } from "../utils/formatters";
import ProjectMap from "../ProjectMap";
import FinancialCharts from "../FinancialCharts";
import CashFlowSummary from "../components/CashFlowSummary";
import ProjectRiskDashboard from "../ProjectRiskDashboard/pages/ProjectRiskDashboard";
import ExecutiveKPICards from "../components/ExecutiveKPICards";
import {
  AlertCircle,
  ListOrdered,
  CheckCircle2,
} from "lucide-react";

import { usePemasaranData } from "../hooks/usePemasaranData";
import { usePengendalianData } from "../hooks/usePengendalianData"; 
import { useFilter } from "../context/FilterContext";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export default function ExecutiveDashboard() {
  const { excelData, globalFilter } = useFilter();
  const [activeChartTab, setActiveChartTab] = useState("PU");
  const [selectedStatus, setSelectedStatus] = useState("A0");

  const {
    marketingPipeline,
    totalRealisasiA0, 
    totalPrognosa,    
    loading: pemasaranLoading,
  } = usePemasaranData();

  const pengendalian = usePengendalianData(); 
  const { kpiData } = pengendalian; 

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const selectedMonthNum = monthNames.findIndex((m) => m.toLowerCase() === globalFilter?.bulan?.toLowerCase()) + 1;
  const selectedYear = safeParseNumber(globalFilter?.tahun || 2026);
  const selectedMonthLabelFull = globalFilter?.bulan || "Jan";
  const selectedMonthLabelCaps = selectedMonthLabelFull.toUpperCase();

  const { totalRkapTahunan, targetSdBulanIni } = useMemo(() => {
    const rawRkapData = excelData?.db_pemasaran_rkap || [];
    let rkapTotal = 0;
    let targetKumulatif = 0;

    rawRkapData.forEach((item) => {
      const nilaiEstimasi = safeParseNumber(item.estimasi_nilai) / 1_000_000_000;
      rkapTotal += nilaiEstimasi;

      let itemMonth = 0;
      const monthStr = String(item.bulan_perolehan || item.periode || "").toLowerCase().trim();
      const parsedMonth = parseInt(monthStr, 10);
      
      if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
        itemMonth = parsedMonth;
      } else {
        const arrayBulan = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"];
        const indexM = arrayBulan.findIndex((b) => monthStr.startsWith(b));
        if (indexM !== -1) itemMonth = indexM + 1;
      }

      if (itemMonth > 0 && itemMonth <= selectedMonthNum) {
        targetKumulatif += nilaiEstimasi;
      }
    });

    return { totalRkapTahunan: rkapTotal, targetSdBulanIni: targetKumulatif };
  }, [excelData, selectedMonthNum]);

  const progresRkapKumulatif = totalRkapTahunan > 0 ? (totalRealisasiA0 / totalRkapTahunan) * 100 : 0;
  const deviasiRkap = totalRealisasiA0 - targetSdBulanIni;
  const progresPrognosa = totalPrognosa > 0 ? (totalRealisasiA0 / totalPrognosa) * 100 : 0;
  const sisaPrognosa = Math.max(0, totalPrognosa - totalRealisasiA0);

  const filteredPipeline = marketingPipeline.filter((proj) => proj.status === selectedStatus);

  const dynamicNkbData = {
    mainValue: totalRealisasiA0 * 1_000_000_000,
    targetPeriode: targetSdBulanIni * 1_000_000_000,
    realPeriode: totalRealisasiA0 * 1_000_000_000,
    persenPeriode: targetSdBulanIni > 0 ? (totalRealisasiA0 / targetSdBulanIni) * 100 : 0,
    targetTahun: totalRkapTahunan * 1_000_000_000,
    persenTahun: totalRkapTahunan > 0 ? (totalRealisasiA0 / totalRkapTahunan) * 100 : 0,
  };

  const realGpm = 100 - (kpiData?.bkpu?.realPeriode || 0);
  const targetGpmPeriode = 100 - (kpiData?.bkpu?.targetPeriode || 0);
  const targetGpmTahun = 100 - (kpiData?.bkpu?.targetTahun || 0);

  const dynamicGpmData = {
    mainValue: realGpm,
    targetPeriode: targetGpmPeriode,
    realPeriode: realGpm,
    persenPeriode: targetGpmPeriode > 0 ? (realGpm / targetGpmPeriode) * 100 : 0,
    targetTahun: targetGpmTahun,
    persenTahun: targetGpmTahun > 0 ? (realGpm / targetGpmTahun) * 100 : 0,
  };

  const dynamicKpiData = {
    pendapatanUsaha: kpiData?.pendapatanUsaha || {},
    labaKotor: kpiData?.labaKotor || {},
    labaBersih: kpiData?.labaBersih || {},
    gpm: dynamicGpmData,
  };

  const dynamicCashflowData = useMemo(() => {
    const rawCashflow = excelData?.db_cashflow || [];
    let saldoAwal = 0;
    let cashIn = 0;
    let cashOut = 0;

    // Array referensi untuk mengubah teks bulan menjadi angka (1-12)
    const arrayBulan = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"];

    // 1. Ekstrak dan filter data yang tahun dan bulannya valid (<= bulan yang dipilih)
    const validRows = rawCashflow.map(row => {
      let rowYear = safeParseNumber(row.tahun);
      let rowMonth = 0;
      
      // Deteksi angka bulan dari teks (misal: "Jan" -> 1, "Apr" -> 4)
      if (row.bulan) {
        const monthStr = String(row.bulan).toLowerCase().trim();
        const indexM = arrayBulan.findIndex((b) => monthStr.startsWith(b));
        if (indexM !== -1) rowMonth = indexM + 1;
      }
      
      return { ...row, rowYear, rowMonth };
    }).filter(r => r.rowYear === selectedYear && r.rowMonth > 0 && r.rowMonth <= selectedMonthNum);

    // 2. Urutkan berdasarkan bulan (dari terkecil ke terbesar)
    validRows.sort((a, b) => a.rowMonth - b.rowMonth);

    // 3. Kalkulasi Data Cashflow
    if (validRows.length > 0) {
      // a. Ambil Saldo Awal HANYA dari data bulan pertama yang ditemukan (Bulan Januari)
      saldoAwal = safeParseNumber(validRows[0].saldo_awal);

      // b. Akumulasi seluruh Cash In dan Cash Out dari bulan awal hingga bulan yang difilter
      validRows.forEach(row => {
        cashIn += safeParseNumber(row.cash_in);
        cashOut += safeParseNumber(row.cash_out);
      });
    }

    return {
      saldoAwal,
      cashIn,
      cashOut,
      // Saldo Akhir didapat dari: Saldo Awal + Total Cash In - Total Cash Out
      saldoAkhir: saldoAwal + cashIn - cashOut, 
    };
  }, [excelData, selectedMonthNum, selectedYear]);

  return (
    <>
      {/* 1. EXECUTIVE KPI CARDS 6 KOLOM */}
      <ExecutiveKPICards
        nkbData={dynamicNkbData}
        kpiData={dynamicKpiData}
        cashflowData={dynamicCashflowData}
        setActiveChartTab={setActiveChartTab}
      />

      {/* 2. NKB / COMMERCIAL PERFORMANCE */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch font-sans mt-8">
        <div className="w-full lg:w-[45%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Commercial Performance
              </h2>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg text-[10px] font-bold">
                RKAP: {formatPercent(progresRkapKumulatif)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 text-center flex flex-col justify-center">
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                  RKAP Des '{String(globalFilter?.tahun || "").slice(-2)}
                </p>
                <h3 className="text-sm font-black text-slate-900 mt-1 truncate">
                  {formatMiliar(totalRkapTahunan)}
                </h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 text-center flex flex-col justify-center">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  Target s.d {selectedMonthLabelCaps}
                </p>
                <h3 className="text-sm font-black text-[#000075] mt-1 truncate">
                  {formatMiliar(targetSdBulanIni)}
                </h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 text-center flex flex-col justify-center">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  Real s.d {selectedMonthLabelCaps}
                </p>
                <h3 className="text-sm font-black text-emerald-600 mt-1 truncate">
                  {pemasaranLoading ? "..." : formatMiliar(totalRealisasiA0, 1)}
                </h3>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-100 text-center flex flex-col justify-center">
                <p className="text-blue-500 text-[9px] font-bold uppercase tracking-wider">
                  Prognosa '{String(globalFilter?.tahun || "").slice(-2)}
                </p>
                <h3 className="text-sm font-black text-blue-700 mt-1 truncate">
                  {pemasaranLoading ? "..." : formatMiliar(totalPrognosa, 1)}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* BAR 1: RKAP */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40">
              <div className="flex justify-between mb-1 text-[11px] font-semibold text-slate-600">
                <span>Progres Kumulatif Realisasi terhadap RKAP</span>
                <span className="font-black text-slate-800">
                  {formatPercent(progresRkapKumulatif)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#000075] h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(progresRkapKumulatif, 100)}%` }}
                ></div>
              </div>
              <p
                className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${deviasiRkap < 0 ? "text-[#BD002F]" : "text-emerald-600"}`}
              >
                {deviasiRkap < 0 ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                {deviasiRkap < 0 ? "Deviasi Negatif" : "Surplus"} terhadap
                Target {selectedMonthLabelFull}: {formatMiliar(deviasiRkap)}
              </p>
            </div>

            {/* BAR 2: PROGNOSA */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40">
              <div className="flex justify-between mb-1 text-[11px] font-semibold text-slate-600">
                <span>
                  Progres Pencapaian terhadap Prognosa '{String(globalFilter?.tahun || "").slice(-2)}
                </span>
                <span className="font-black text-slate-800">
                  {pemasaranLoading ? "..." : formatPercent(progresPrognosa)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(progresPrognosa, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Sisa Target Prognosa:{" "}
                <span className="font-bold">{formatMiliar(sisaPrognosa)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3. TABLE LOG REALISASI */}
        <div className="w-full lg:w-[55%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-full flex flex-col">
            <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListOrdered size={14} className="text-[#000075]" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">
                  Breakdown Log Realisasi Perolehan & Prognosa NKB {globalFilter?.tahun || 2026}
                </span>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-[10px] font-bold border border-slate-200 rounded-md py-1 px-2 text-slate-700 bg-white shadow-sm focus:outline-none focus:border-[#000075] focus:ring-1 focus:ring-[#000075] cursor-pointer"
              >
                <option value="A0">A0</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>

            <div className="overflow-y-auto max-h-[220px] flex-1 scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 shadow-sm backdrop-blur-sm z-10">
                  <tr>
                    <th className="p-2.5 text-center w-[50%]">Nama Paket</th>
                    <th className="p-2.5 text-center w-[15%] max-w-[70px]">Owner</th>
                    <th className="p-2.5 text-center w-[20%]">Nilai</th>
                    <th className="p-2.5 text-center w-[15%]">Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pemasaranLoading ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-xs text-slate-500 animate-pulse">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredPipeline.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-xs text-slate-500">
                        Belum ada data (Status {selectedStatus}).
                      </td>
                    </tr>
                  ) : (
                    filteredPipeline.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5 pl-4 font-bold text-slate-800 whitespace-normal break-words">
                          {proj.paket}
                        </td>
                        <td className="p-2.5 text-slate-600 text-center font-medium text-[11px] whitespace-normal break-words min-w-[50px] max-w-[70px]">
                          {proj.owner}
                        </td>
                        <td className="p-2.5 text-center font-black text-emerald-600 whitespace-nowrap align-top pt-3">
                          {proj.nilai}
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-500 whitespace-nowrap align-top pt-3">
                          {proj.bulan}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break">
        <FinancialCharts activeChartTab={activeChartTab} setActiveChartTab={setActiveChartTab} />
      </div>

      <div className="page-break mb-8">
        <CashFlowSummary />
      </div>

      <div className="page-break mb-8">
        <ProjectMap />
      </div>

      <div className="mt-6">
        <ProjectRiskDashboard />
      </div>
    </>
  );
}