// src/PengendalianProyek.jsx

import React, { useState } from "react";
import { ShieldAlert, Activity } from "lucide-react";

// Import Custom Hook untuk Data & Logika
import { usePengendalianData } from "./hooks/usePengendalianData";

// Import Komponen UI
import PengendalianKPICards from "./components/PengendalianKPICards";
import FinancialCharts from "./FinancialCharts";
import MonitoringTables from "./components/MonitoringTables";
import RkapRealisasiTable from "./components/RkapRealisasiTable";
import EvaluasiBKPUblnIni from "./components/EvaluasiBKPUblnIni";

export default function PengendalianProyek() {
  const [activeChartTab, setActiveChartTab] = useState("PU");

  // Panggil semua data yang sudah dihitung dari Custom Hook
  const {
    selectedMonth,
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
  } = usePengendalianData();

  return (
    <div className="space-y-4 animate-fadeIn font-sans">
      
      {/* 1. KARTU KPI KEUANGAN */}
      <PengendalianKPICards
        setActiveChartTab={setActiveChartTab}
        totalPURealisasi={totalPURealisasi}
        capaianPercent={capaianPercent}
        bkpuReal={bkpuReal}
        bkpuProgress={bkpuProgress}
        labaKotorReal={labaKotorReal}
        labaBersihReal={labaBersihReal}
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

      {/* 5. TABEL RKAP & EVALUASI */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-1">
          <RkapRealisasiTable />
          <div className="pt-6">
            <EvaluasiBKPUblnIni />
          </div>
        </div>
      </div>

      {/* 6. FOOTER */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3">
        <ShieldAlert size={18} className="text-[#000075] shrink-0" />
        <p className="text-slate-700 text-xs font-medium">
          <span className="font-bold text-[#000075]">Nota Pengendalian SCM:</span>{" "}
          Evaluasi cost overrun, progress delay, dan percepatan termin proyek berjalan.
        </p>
      </div>
      
    </div>
  );
}