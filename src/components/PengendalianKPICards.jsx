// src/components/PengendalianKPICards.jsx

import React from "react";
import { formatCompact } from "../utils/formatters";

// ======================================================
// REUSABLE KPI CARD
// ======================================================

const KpiCardMinimalist = ({
  title,
  mainValue,
  targetPeriode,
  realPeriode,
  persenPeriode,
  targetTahun,
  persenTahun,
  isDeficit = false,
  onClick,
}) => {
  const safePersenPeriode = Math.min(
    Math.abs(persenPeriode || 0),
    100
  );

  const safePersenTahun = Math.min(
    Math.abs(persenTahun || 0),
    100
  );

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* HEADER */}
      <div className="mb-5">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">
          {title}
        </h3>

        <p className="text-3xl font-extrabold text-slate-900 mt-1">
          {typeof mainValue === "number"
            ? formatCompact(mainValue)
            : mainValue}
        </p>
      </div>

      {/* PROGRESS */}
      <div className="space-y-4">
        {/* YTD */}
        <div>
          <div className="flex justify-between items-end text-[11px] font-semibold text-slate-700 mb-1.5">
            <span>YTD</span>

            <span
              className={
                isDeficit
                  ? "text-red-600"
                  : "text-blue-700"
              }
            >
              {(persenPeriode || 0).toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isDeficit
                  ? "bg-red-500"
                  : "bg-blue-600"
              }`}
              style={{
                width: `${safePersenPeriode}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>
              T: {formatCompact(targetPeriode || 0)}
            </span>

            <span>
              R: {formatCompact(realPeriode || 0)}
            </span>
          </div>
        </div>

        {/* RKAP */}
        <div>
          <div className="flex justify-between items-end text-[11px] font-semibold text-slate-700 mb-1.5">
            <span>RKAP</span>

            <span className="text-slate-800">
              {(persenTahun || 0).toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-slate-700 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${safePersenTahun}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>
              Target: {formatCompact(targetTahun || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function PengendalianKPICards({
  kpiData,
  setActiveChartTab,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {/* PU */}
      <KpiCardMinimalist
        title="Pendapatan Usaha"
        mainValue={kpiData.pendapatanUsaha.mainValue}
        targetPeriode={
          kpiData.pendapatanUsaha.targetPeriode
        }
        realPeriode={
          kpiData.pendapatanUsaha.realPeriode
        }
        persenPeriode={
          kpiData.pendapatanUsaha.persenPeriode
        }
        targetTahun={
          kpiData.pendapatanUsaha.targetTahun
        }
        persenTahun={
          kpiData.pendapatanUsaha.persenTahun
        }
        onClick={() => setActiveChartTab("PU")}
      />

      {/* BKPU */}
      <KpiCardMinimalist
        title="BK/PU"
        mainValue={`${(
          kpiData.bkpu.mainValue || 0
        ).toFixed(2)}%`}
        targetPeriode={kpiData.bkpu.targetPeriode}
        realPeriode={kpiData.bkpu.realPeriode}
        persenPeriode={kpiData.bkpu.persenPeriode}
        targetTahun={kpiData.bkpu.targetTahun}
        persenTahun={kpiData.bkpu.persenTahun}
        onClick={() => setActiveChartTab("BKPU")}
      />

      {/* LK */}
      <KpiCardMinimalist
        title="Laba Kotor"
        mainValue={kpiData.labaKotor.mainValue}
        targetPeriode={
          kpiData.labaKotor.targetPeriode
        }
        realPeriode={
          kpiData.labaKotor.realPeriode
        }
        persenPeriode={
          kpiData.labaKotor.persenPeriode
        }
        targetTahun={
          kpiData.labaKotor.targetTahun
        }
        persenTahun={
          kpiData.labaKotor.persenTahun
        }
        isDeficit={true}
      />

      {/* LB */}
      <KpiCardMinimalist
        title="Laba Bersih"
        mainValue={kpiData.labaBersih.mainValue}
        targetPeriode={
          kpiData.labaBersih.targetPeriode
        }
        realPeriode={
          kpiData.labaBersih.realPeriode
        }
        persenPeriode={
          kpiData.labaBersih.persenPeriode
        }
        targetTahun={
          kpiData.labaBersih.targetTahun
        }
        persenTahun={
          kpiData.labaBersih.persenTahun
        }
        isDeficit={true}
      />
    </div>
  );
}