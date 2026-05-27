// src/pages/ExecutiveDashboard.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatNumber, formatPercent, formatMiliar } from "../utils/formatters";
import { nkbProjectList } from "../data";
import ProjectMap from "../ProjectMap";
import FinancialCharts from "../FinancialCharts";
import CashFlowSummary from "../components/CashFlowSummary";
import {
  AlertCircle,
  ListOrdered,
  Briefcase,
  BarChart3,
  Percent,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

export default function ExecutiveDashboard() {
  const [totalProject, setTotalProject] = useState(0);
  const [produksiUsaha, setProduksiUsaha] = useState(0);
  const [bkpuValue, setBkpuValue] = useState(0);
  const [cashInValue, setCashInValue] = useState(0);
  const [activeChartTab, setActiveChartTab] = useState("PU");

  useEffect(() => {
    // fetchExecutiveKPI();
  }, []);

  const fetchExecutiveKPI = async () => {
    // TOTAL PROJECT
    try {
      const { count, error } = await supabase
        .from("project_progress")
        .select("*", { count: "exact", head: true });
      if (!error) setTotalProject(Number(count) || 0);
    } catch (err) {
      setTotalProject(0);
    }

    // PRODUKSI USAHA
    try {
      const { data, error } = await supabase.from("tren_keuangan").select("*");
      if (!error) {
        const totalPU = (data || []).reduce(
          (sum, item) => sum + (Number(item?.realisasi) || 0),
          0,
        );
        setProduksiUsaha(totalPU);
      }
    } catch (err) {
      setProduksiUsaha(0);
    }

    // BKPU
    try {
      const { data, error } = await supabase.from("tren_bk_pu").select("*");
      if (!error) {
        const safeData = data || [];
        const totalBKPU = safeData.reduce(
          (sum, item) => sum + (Number(item?.realisasi) || 0),
          0,
        );
        const avgBKPU = safeData.length > 0 ? totalBKPU / safeData.length : 0;
        setBkpuValue(Number(avgBKPU) || 0);
      }
    } catch (err) {
      setBkpuValue(0);
    }

    // CASH IN
    try {
      const { data, error } = await supabase.from("aging_invoice").select("*");
      if (!error) {
        const totalCash = (data || []).reduce((sum, item) => {
          const cleanValue = Number(
            String(item?.total || 0).replace(/[^\d]/g, ""),
          );
          return sum + (cleanValue || 0);
        }, 0);
        setCashInValue(totalCash / 1000000000);
      }
    } catch (err) {
      setCashInValue(0);
    }
  };

  return (
    <>
      {/* NKB */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
        <div className="w-full lg:w-[45%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Commercial Performance
              </h2>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg text-[10px] font-bold">
                RKAP: {formatPercent(18.66)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  RKAP Des '26
                </p>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {formatMiliar(6690)}
                </h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Target s.d Apr
                </p>
                <h3 className="text-base font-black text-[#000075] mt-1">
                  {formatMiliar(1525)}
                </h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Real s.d Apr
                </p>
                <h3 className="text-base font-black text-emerald-600 mt-1">
                  {formatMiliar(1273.6)}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40">
            <div className="flex justify-between mb-1 text-[11px] font-semibold text-slate-600">
              <span>Progres Kumulatif Realisasi terhadap RKAP</span>
              <span className="font-black text-slate-800">
                {formatPercent(18.66)}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#000075] h-2.5 rounded-full"
                style={{ width: "18.66%" }}
              ></div>
            </div>
            <p className="text-[10px] text-[#BD002F] font-bold mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              Deviasi Negatif terhadap Target April: {formatMiliar(-251.4)}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full lg:w-[55%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-full flex flex-col">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
              <ListOrdered size={14} className="text-[#000075]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Breakdown Log Realisasi Perolehan NKB 2026
              </span>
            </div>
            <div className="overflow-y-auto max-h-[175px] flex-1 scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 shadow-sm backdrop-blur-sm z-10">
                  <tr>
                    <th className="p-2.5 pl-4">Nama Paket</th>
                    <th className="p-2.5 pr-4 text-right w-28">NK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nkbProjectList.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-2.5 pl-4 font-bold text-slate-800 truncate max-w-[260px]">
                        {proj.name}
                      </td>
                      <td className="p-2.5 pr-4 text-right font-black text-emerald-600">
                        {proj.nilai}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* KPI MODERN */}
      <div className="page-break grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-8 font-sans">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Total Proyek On-Going
              </p>
              <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
                {formatNumber(totalProject)}{" "}
                <span className="text-xs font-bold text-slate-400">Paket</span>
              </h3>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px]">
            <span className="flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight size={10} strokeWidth={3} className="mr-0.5" />{" "}
              Active
            </span>
            <span className="text-slate-400 font-medium">
              Proyek berjalan aktif
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Produksi Usaha (PU)
              </p>
              <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
                {formatMiliar(produksiUsaha)}{" "}
                <span className="text-xs font-black text-blue-700">M</span>
              </h3>
            </div>
            <div className="p-2 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: "78%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] font-bold">
              <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                RKAP Tracking
              </span>
              <span className="text-slate-400 font-mono">
                {formatPercent(78)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Rasio BK / PU
              </p>
              <h3 className="text-2xl font-black text-orange-600 mt-1 tracking-tight">
                {formatPercent(bkpuValue)}
              </h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl">
              <Percent size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px]">
            <span className="flex items-center font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
              Monitoring
            </span>
            <span className="text-slate-400 font-medium">
              Efisiensi biaya usaha
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Realisasi Cash In
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">
                {formatMiliar(Number(cashInValue))}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] font-bold">
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Cash Flow
              </span>
              <span className="text-slate-400 font-mono">
                {formatPercent(92)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break">
        <FinancialCharts
          activeChartTab={activeChartTab}
          setActiveChartTab={setActiveChartTab}
        />
      </div>
      {/* CASH FLOW SUMMARY */}
      <div className="page-break mb-8">
        <CashFlowSummary />
      </div>
      
      <div className="page-break mb-8">
        <ProjectMap />
      </div>
    </>
  );
}
