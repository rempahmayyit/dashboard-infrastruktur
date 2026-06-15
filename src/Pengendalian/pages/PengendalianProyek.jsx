// src/PengendalianProyek.jsx

import React, { useState } from "react";
import { ShieldAlert, Activity } from "lucide-react";

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

  return (
    <div className="space-y-4 animate-fadeIn font-sans">
      {/* 1. KARTU KPI KEUANGAN */}
      <PengendalianKPICards
        kpiData={kpiData}
        setActiveChartTab={setActiveChartTab}
      />

      {/* 2. CHART FINANCIAL */}
      <FinancialCharts
        activeChartTab={activeChartTab}
        setActiveChartTab={setActiveChartTab}
        selectedMonth={selectedMonth}
      />

      {/* 3. JUDUL MONITORING */}
      <div className="border-b border-slate-200 pb-3 mt-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity size={20} className="text-blue-800" />
          Matriks Monitoring & Pengendalian Operasional
        </h2>
      </div>

      {/* 4. TABEL MONITORING (Time Overrun, Cost Overrun, dll) */}
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

      {/* 6. TABEL ANALISIS RKAP & BK/PU */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
          Evaluasi RKAP vs Realisasi
        </h3>

        <RkapVsRealisasiTable />
      </div>

      {/* 6. SAP VS QC/REKON */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
          Monitoring SAP vs Quick Count
        </h3>
        <SapVsQcRekon />
      </div>

      {/* 7. FOOTER */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3">
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
  );
}
