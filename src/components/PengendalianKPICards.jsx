// src/components/PengendalianKPICards.jsx

import React from "react";
import { formatCompact } from "../utils/formatters";
import { safeNumber, safePercent } from "../hooks/usePengendalianData";

export default function PengendalianKPICards({
  setActiveChartTab,
  totalPURealisasi,
  capaianPercent,
  bkpuReal,
  bkpuProgress,
  labaKotorReal,
  labaBersihReal,
}) {
  return (
    <div className="dashboard-card grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* PU */}
      <div onClick={() => setActiveChartTab("PU")} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">Pendapatan Usaha</h3>
        <h2 className="text-3xl font-bold text-slate-800 mt-3">{formatCompact(totalPURealisasi)}</h2>
        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${safePercent(capaianPercent)}%` }} />
          </div>
        </div>
      </div>

      {/* BKPU */}
      <div onClick={() => setActiveChartTab("BKPU")} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">BK/PU</h3>
        <h2 className="text-3xl font-bold text-slate-800 mt-3">{safeNumber(bkpuReal).toFixed(2)}%</h2>
        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${safePercent(bkpuProgress)}%` }} />
          </div>
        </div>
      </div>

      {/* LK */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">Laba Kotor</h3>
        <h2 className="text-3xl font-bold text-slate-800 mt-3">{formatCompact(labaKotorReal)}</h2>
      </div>

      {/* LB */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">Laba Bersih</h3>
        <h2 className="text-3xl font-bold text-slate-800 mt-3">{formatCompact(labaBersihReal)}</h2>
      </div>
    </div>
  );
}