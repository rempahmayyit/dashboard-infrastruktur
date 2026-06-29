// src/components/ExecutiveKPICards.jsx

import React from "react";
import { formatCompact } from "../utils/formatters";
import {
  Target,
  TrendingUp,
  Activity,
  Coins,
  BadgeCheck,
  RefreshCcw,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

// ======================================================
// 1. REUSABLE KPI CARD (STANDARD)
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
  icon: Icon,
  onClick,
  isPercentage = false,
  colorTheme = "slate", // Prop baru untuk tema warna
}) => {
  // Ambil nilai aman untuk bar persentase (maksimal 100% untuk visual UI)
  const safePersenPeriode = Math.min(Math.abs(persenPeriode || 0), 100);
  const safePersenTahun = Math.min(Math.abs(persenTahun || 0), 100);

  // Dictionary untuk variasi warna
  const themeStyles = {
    blue: { border: "border-t-blue-500", iconBg: "bg-blue-50", iconText: "text-blue-600", iconBorder: "border-blue-100", progress: "bg-blue-500", textMain: "text-blue-700" },
    indigo: { border: "border-t-indigo-500", iconBg: "bg-indigo-50", iconText: "text-indigo-600", iconBorder: "border-indigo-100", progress: "bg-indigo-500", textMain: "text-indigo-700" },
    orange: { border: "border-t-orange-500", iconBg: "bg-orange-50", iconText: "text-orange-600", iconBorder: "border-orange-100", progress: "bg-orange-500", textMain: "text-orange-700" },
    red: { border: "border-t-red-500", iconBg: "bg-red-50", iconText: "text-red-600", iconBorder: "border-red-100", progress: "bg-red-500", textMain: "text-red-600" },
    slate: { border: "border-t-slate-300", iconBg: "bg-slate-50", iconText: "text-slate-500", iconBorder: "border-slate-100", progress: "bg-slate-600", textMain: "text-slate-700" },
  };

  const theme = themeStyles[colorTheme] || themeStyles.slate;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between transition-all duration-200 border-t-4 ${theme.border} ${
        onClick ? "hover:shadow-md cursor-pointer hover:-translate-y-0.5" : ""
      }`}
    >
      {/* HEADER */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">
            {title}
          </h3>
          {Icon && (
            <div className={`p-1.5 rounded-lg border ${theme.iconBg} ${theme.iconBorder} ${theme.iconText}`}>
              <Icon size={16} strokeWidth={2.5} />
            </div>
          )}
        </div>

        <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          {typeof mainValue === "number" ? formatCompact(mainValue) : mainValue}
        </p>
      </div>

      {/* PROGRESS BAR SECTION */}
      <div className="space-y-4">
        {/* YTD */}
        <div>
          <div className="flex justify-between items-end text-sm font-semibold text-slate-700 mb-1.5">
            <span>YTD</span>
            {/* Persentase mengikuti warna tema atau merah jika defisit */}
            <span className={isDeficit ? "text-red-600" : theme.textMain}>
              {(persenPeriode || 0).toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${isDeficit ? "bg-red-500" : theme.progress}`}
              style={{ width: `${safePersenPeriode}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-400 mt-1 font-medium">
            <span>
              Ra:{" "}
              {isPercentage
                ? `${(targetPeriode || 0).toFixed(2)}%`
                : formatCompact(targetPeriode || 0)}
            </span>

            <span>
              Ri:{" "}
              {isPercentage
                ? `${(realPeriode || 0).toFixed(2)}%`
                : formatCompact(realPeriode || 0)}
            </span>
          </div>
        </div>

        {/* RKAP */}
        <div>
          <div className="flex justify-between items-end text-sm font-semibold text-slate-700 mb-1.5">
            <span> RKAP Des. </span>
            <span className="text-slate-800">
              {(persenTahun || 0).toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-slate-700 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${safePersenTahun}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-400 mt-1 font-medium">
            <span>
              RKAP Des. :{" "}
              {isPercentage
                ? `${(targetTahun || 0).toFixed(2)}%`
                : formatCompact(targetTahun || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// 2. REUSABLE KPI CARD (KHUSUS CASHFLOW)
// ======================================================
const KpiCardCashflow = ({ title, data = {}, icon: Icon, onClick }) => {
  const { saldoAwal = 0, cashIn = 0, cashOut = 0, saldoAkhir = 0 } = data;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between transition-all duration-200 border-t-4 border-t-emerald-500 ${
        onClick ? "hover:shadow-md cursor-pointer hover:-translate-y-0.5" : ""
      }`}
    >
      {/* HEADER */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">
            {title}
          </h3>
          {Icon && (
            <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
              <Icon size={16} strokeWidth={2.5} />
            </div>
          )}
        </div>

        <p className="text-3xl font-extrabold text-emerald-600 mt-1 tracking-tight">
          {formatCompact(saldoAkhir)}
        </p>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">
          Saldo Akhir
        </span>
      </div>

      {/* CASHFLOW DETAILS SECTION */}
      <div className="space-y-3 pt-1">
        {/* Saldo Awal */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Saldo Awal
          </span>
          <span className="text-sm font-bold text-slate-700">
            {formatCompact(saldoAwal)}
          </span>
        </div>

        {/* In / Out Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Cash In */}
          <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase mb-1">
              <ArrowDownToLine size={10} strokeWidth={3} /> Cash In
            </div>
            <span className="text-sm font-bold text-emerald-700">
              {formatCompact(cashIn)}
            </span>
          </div>

          {/* Cash Out */}
          <div className="p-2 rounded-lg bg-red-50/50 border border-red-100 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-[9px] font-bold text-red-600 uppercase mb-1">
              <ArrowUpFromLine size={10} strokeWidth={3} /> Cash Out
            </div>
            <span className="text-sm font-bold text-red-700">
              {formatCompact(cashOut)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// 3. MAIN COMPONENT (EXECUTIVE KPI CARDS)
// ======================================================

export default function ExecutiveKPICards({
  nkbData = {},
  kpiData = {},
  cashflowData = {},
  setActiveChartTab,
}) {
  const safeKpi = {
    pendapatanUsaha: kpiData.pendapatanUsaha || {},
    gpm: kpiData.gpm || {},
    labaKotor: kpiData.labaKotor || {},
    labaBersih: kpiData.labaBersih || {},
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5 mb-6">
      {/* 1. NKB */}
      <KpiCardMinimalist
        title="Nilai Kontrak Baru"
        icon={Target}
        colorTheme="blue"
        mainValue={nkbData.mainValue || 0}
        targetPeriode={nkbData.targetPeriode}
        realPeriode={nkbData.realPeriode}
        persenPeriode={nkbData.persenPeriode}
        targetTahun={nkbData.targetTahun}
        persenTahun={nkbData.persenTahun}
      />

      {/* 2. PU */}
      <KpiCardMinimalist
        title="Pendapatan Usaha"
        icon={TrendingUp}
        colorTheme="indigo"
        mainValue={safeKpi.pendapatanUsaha.mainValue || 0}
        targetPeriode={safeKpi.pendapatanUsaha.targetPeriode}
        realPeriode={safeKpi.pendapatanUsaha.realPeriode}
        persenPeriode={safeKpi.pendapatanUsaha.persenPeriode}
        targetTahun={safeKpi.pendapatanUsaha.targetTahun}
        persenTahun={safeKpi.pendapatanUsaha.persenTahun}
      />

      {/* 3. GPM */}
      <KpiCardMinimalist
        title="Gross Profit Margin"
        isPercentage={true}
        icon={Activity}
        colorTheme="orange"
        mainValue={`${(safeKpi.gpm.mainValue || 0).toFixed(2)}%`}
        targetPeriode={safeKpi.gpm.targetPeriode}
        realPeriode={safeKpi.gpm.realPeriode}
        persenPeriode={safeKpi.gpm.persenPeriode}
        targetTahun={safeKpi.gpm.targetTahun}
        persenTahun={safeKpi.gpm.persenTahun}
      />

      {/* 4. LABA KOTOR */}
      <KpiCardMinimalist
        title="Laba Kotor"
        icon={Coins}
        colorTheme="red"
        mainValue={safeKpi.labaKotor.mainValue || 0}
        targetPeriode={safeKpi.labaKotor.targetPeriode}
        realPeriode={safeKpi.labaKotor.realPeriode}
        persenPeriode={safeKpi.labaKotor.persenPeriode}
        targetTahun={safeKpi.labaKotor.targetTahun}
        persenTahun={safeKpi.labaKotor.persenTahun}
        isDeficit={true}
      />

      {/* 5. LABA BERSIH */}
      <KpiCardMinimalist
        title="Laba Bersih"
        icon={BadgeCheck}
        colorTheme="red"
        mainValue={safeKpi.labaBersih.mainValue || 0}
        targetPeriode={safeKpi.labaBersih.targetPeriode}
        realPeriode={safeKpi.labaBersih.realPeriode}
        persenPeriode={safeKpi.labaBersih.persenPeriode}
        targetTahun={safeKpi.labaBersih.targetTahun}
        persenTahun={safeKpi.labaBersih.persenTahun}
        isDeficit={true}
      />

      {/* 6. POSISI CASHFLOW */}
      <KpiCardCashflow
        title="Posisi Cashflow"
        icon={RefreshCcw}
        data={cashflowData}
      />
    </div>
  );
}