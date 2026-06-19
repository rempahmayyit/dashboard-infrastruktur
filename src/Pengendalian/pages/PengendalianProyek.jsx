// src/PengendalianProyek.jsx

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Activity, 
  LayoutDashboard, 
  Target, 
  TrendingDown, 
  Database, 
  MoreHorizontal 
} from "lucide-react";

// Import Custom Hook untuk Data & Logika
import { usePengendalianData } from "../../hooks/usePengendalianData";

// Import Komponen UI
import PengendalianKPICards from "../../components/PengendalianKPICards";
import FinancialCharts from "../../FinancialCharts";
import MonitoringTables from "../../components/MonitoringTables";
import SapVsQcRekon from "../../SapVsQcRekon";
import RkapVsRealisasiTable from "../../components/RkapVsRealisasiTable";
import EbVsForecastTable from "../../components/EbVsForecastTable";
import MonitoringBudgetTable from "../components/MonitoringBudgetTable";
import MonitoringAgingStockTable from "../components/MonitoringAgingStockTable";
import MonitoringTagbrutTable from "../components/MonitoringTagbrutTable";

export default function PengendalianProyek() {
  const [activeChartTab, setActiveChartTab] = useState("PU");
  const [activeTab, setActiveTab] = useState("RESUME");

  // Panggil semua data yang sudah dihitung dari Custom Hook
  const {
    selectedMonth,
    financialTableData,
    kpiData,
    totalPURealisasi,
    capaianPercent,
    bkpuReal,
    bkpuProgress,
    labaKotorReal,
    labaBersihReal,
    totalProject,
    pureTimeOverrun,
    almostOverrun,
    timeOverrunPercent,
    behindScheduleProjects,
    behindSchedulePercent,
    costOverrunData,
    bkpuMappProjects,
    puRealNonJo,
  } = usePengendalianData();

  // Daftar Menu Sub-heading (Tabs)
  const navigationTabs = [
    { id: "RESUME", label: "RESUME KINERJA", icon: LayoutDashboard },
    { id: "RKAP_REAL", label: "EVALUASI RKAP VS REALISASI", icon: Target },
    { id: "SISA_TARGET", label: "SISA TARGET RKAP", icon: TrendingDown },
    { id: "MONITORING_SAP", label: "MONITORING SAP", icon: Database },
    { id: "LAINNYA", label: "LAINNYA", icon: MoreHorizontal },
  ];

  // Fungsi agar saat kartu KPI diklik, otomatis pindah ke tab RESUME untuk melihat grafiknya
  const handleKpiClick = (chartType) => {
    setActiveChartTab(chartType);
    if (activeTab !== "RESUME") {
      setActiveTab("RESUME");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. KARTU KPI KEUANGAN (STATIS DI ATAS) */}
      <PengendalianKPICards
        kpiData={kpiData}
        setActiveChartTab={handleKpiClick}
      />

      {/* 2. SUB-HEADING / TABS NAVIGATION (DI BAWAH KPI) */}
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar mt-2 mb-4">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "text-[#000075] border-b-[3px] border-[#000075]" 
                : "text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. RENDER KONTEN BERDASARKAN TAB YANG AKTIF */}
      
      {/* ----------------------------------------------------- */}
      {/* TAB 1: RESUME KINERJA                                   */}
      {/* ----------------------------------------------------- */}
      {activeTab === "RESUME" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* CHART FINANCIAL */}
          <FinancialCharts
            activeChartTab={activeChartTab}
            setActiveChartTab={setActiveChartTab}
            selectedMonth={selectedMonth}
          />

          {/* JUDUL MONITORING */}
          <div className="border-b border-slate-200 pb-3 mt-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity size={20} className="text-blue-800" />
              Monitoring & Pengendalian Operasional
            </h2>
          </div>

          {/* TABEL MONITORING (Time Overrun, Cost Overrun, dll) */}
          <MonitoringTables
            pureTimeOverrunProjects={pureTimeOverrun}
            totalProject={totalProject}
            behindScheduleProjects={behindScheduleProjects}
            bkpuMappProjects={bkpuMappProjects}
            timeOverrunPercent={timeOverrunPercent}
            behindSchedulePercent={behindSchedulePercent}
            almostOverrun={almostOverrun}
            costOverrunData={costOverrunData}
          />

          {/* FOOTER CATATAN */}
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3 mt-6">
            <ShieldAlert size={18} className="text-[#000075] shrink-0" />
            <p className="text-slate-700 text-xs font-medium">
              <span className="font-bold text-[#000075]">
                Catatan dari bapak Sayuti Mulyono SDU Dirop 1 :
              </span>{" "}
              Evaluasi cost overrun, progress delay, dan percepatan termin proyek
              berjalan.
            </p>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB 2: EVALUASI RKAP VS REALISASI                       */}
      {/* ----------------------------------------------------- */}
      {activeTab === "RKAP_REAL" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Target size={20} className="text-blue-800" />
              Evaluasi RKAP vs Realisasi
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Perbandingan pencapaian aktual terhadap Rencana Kerja dan Anggaran Perusahaan.
            </p>
          </div>
          
          <RkapVsRealisasiTable />
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB 3: SISA TARGET RKAP                                 */}
      {/* ----------------------------------------------------- */}
      {activeTab === "SISA_TARGET" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <TrendingDown size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Sisa Target RKAP</h2>
          <p className="text-slate-500 mt-2">
            Tabel dan analisis sisa target RKAP akan ditampilkan di sini.
          </p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB 4: MONITORING SAP                                   */}
      {/* ----------------------------------------------------- */}
      {activeTab === "MONITORING_SAP" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Database size={20} className="text-blue-800" />
              Monitoring SAP vs Quick Count
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Rekonsiliasi data antara sistem SAP dengan perhitungan cepat.
            </p>
          </div>
          
          <SapVsQcRekon />
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB 5: LAINNYA                                          */}
      {/* ----------------------------------------------------- */}
      {activeTab === "LAINNYA" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <MoreHorizontal size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Data Lainnya</h2>
          <p className="text-slate-500 mt-2">
            Tempat untuk modul atau tabel tambahan di masa mendatang.
          </p>
        </div>
      )}

    </div>
  );
}