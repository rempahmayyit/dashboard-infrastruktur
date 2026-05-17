// src/App.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import {
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  CircleDollarSign,
  Search,
  AlertCircle,
  Printer,
  ChevronRight,
  ListOrdered,
  Database,
  Maximize2,
  Minimize2,
} from "lucide-react";

import {
  formatNumber,
  formatPercent,
  formatMiliar,
} from "./utils/formatters";

import { nkbProjectList } from "./data";

import ProjectMap from "./ProjectMap";
import FinancialCharts from "./FinancialCharts";
import PemasaranAnggaran from "./PemasaranAnggaran";
import PengendalianProyek from "./PengendalianProyek";
import KeuanganAkuntansi from "./KeuanganAkuntansi";
import TeknikMutuK3L from "./TeknikMutuK3L";
import LegalManrisk from "./LegalManrisk";
import SdmUmum from "./SdmUmum";
import PusatData from "./PusatData";

import waskitaLogo from "./assets/waskita_logo.png";
import danantaraLogo from "./assets/Logo_danantara.png";

export default function App() {
  const [totalProject, setTotalProject] = useState(0);
  const [produksiUsaha, setProduksiUsaha] = useState(0);
  const [bkpuValue, setBkpuValue] = useState(0);
  const [cashInValue, setCashInValue] = useState(0);
  const [activeMenu, setActiveMenu] = useState("Executive Dashboard");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchExecutiveKPI();
  }, []);

  const toggleFullscreen = async () => {

  if (!document.fullscreenElement) {

    await document.documentElement.requestFullscreen();

    setIsFullscreen(true);

  } else {

    if (document.exitFullscreen) {
      await document.exitFullscreen();
    }

    setIsFullscreen(false);
  }
};

  const fetchExecutiveKPI = async () => {
    // TOTAL PROJECT
    const { count } = await supabase
      .from("project_progress")
      .select("*", {
        count: "exact",
        head: true,
      });

    setTotalProject(count || 0);

    // PENDAPATAN USAHA
    const { data: puData } = await supabase
      .from("tren_keuangan")
      .select("*");

    if (puData?.length > 0) {
      const totalPU = puData.reduce(
        (sum, item) =>
          sum + Number(item.realisasi || 0),
        0
      );

      setProduksiUsaha(totalPU);
    }

    // BKPU
    const { data: bkpuData } = await supabase
      .from("tren_bk_pu")
      .select("*");

    if (bkpuData?.length > 0) {
      const avgBKPU =
        bkpuData.reduce(
          (sum, item) =>
            sum + Number(item.realisasi || 0),
          0
        ) / bkpuData.length;

      setBkpuValue(avgBKPU);
    }

    // CASH IN
    const { data: cashData } = await supabase
      .from("aging_invoice")
      .select("*");

    if (cashData?.length > 0) {
      const totalCash = cashData.reduce(
        (sum, item) =>
          sum +
          Number(
            String(item.total).replace(/[^\d]/g, "") ||
              0
          ),
        0
      );

      setCashInValue(totalCash);
    }
  };

  const menuItems = [
    {
      name: "Executive Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Pemasaran & Anggaran",
      icon: FolderKanban,
    },
    {
      name: "Pengendalian Proyek",
      icon: AlertTriangle,
    },
    {
      name: "Keuangan & Akuntansi",
      icon: CircleDollarSign,
    },
    {
      name: "Teknik, Mutu & K3L",
      icon: LayoutDashboard,
    },
    {
      name: "Legal & Manrisk",
      icon: FolderKanban,
    },
    {
      name: "SDM & Umum",
      icon: Search,
    },
    {
      name: "Pusat Data & Integrasi",
      icon: Database,
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "Executive Dashboard":
        return (
          <>
            {/* NKB */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">

              <div className="w-full lg:w-[45%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Evaluasi Pemasaran & Anggaran
                      (NKB)
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
                    <span>
                      Progres Kumulatif Realisasi
                      terhadap RKAP
                    </span>

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
                    Deviasi Negatif terhadap Target
                    April:
                    {formatMiliar(-251.4)}
                  </p>
                </div>
              </div>

              {/* TABLE */}
              <div className="w-full lg:w-[55%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-full flex flex-col">

                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                    <ListOrdered
                      size={14}
                      className="text-[#000075]"
                    />

                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Breakdown Log Realisasi
                      Perolehan NKB 2026
                    </span>
                  </div>

                  <div className="overflow-y-auto max-h-[175px] flex-1 scrollbar-thin">
                    <table className="w-full text-left text-xs border-collapse">

                      <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 shadow-sm backdrop-blur-sm z-10">
                        <tr>
                          <th className="p-2.5 pl-4">
                            Nama Paket
                          </th>

                          <th className="p-2.5 pr-4 text-right w-28">
                            NK
                          </th>
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

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Total Proyek On Going
                </p>

                <h3 className="text-3xl font-black text-slate-900 mt-2">
                  {formatNumber(totalProject)}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Produksi Usaha (PU)
                </p>

                <h3 className="text-3xl font-black text-[#000075] mt-2">
                  {formatMiliar(produksiUsaha)}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Rasio BK / PU Usaha
                </p>

                <h3 className="text-3xl font-black text-orange-500 mt-2">
                  {formatPercent(bkpuValue)}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Realisasi Cash In
                </p>

                <h3 className="text-3xl font-black text-emerald-600 mt-2">
                  {formatMiliar(cashInValue)}
                </h3>
              </div>

            </div>

            <FinancialCharts />

            <div className="mb-8">
              <ProjectMap />
            </div>
          </>
        );

      case "Pemasaran & Anggaran":
        return <PemasaranAnggaran />;

      case "Pengendalian Proyek":
        return <PengendalianProyek />;

      case "Keuangan & Akuntansi":
        return <KeuanganAkuntansi />;

      case "Teknik, Mutu & K3L":
        return <TeknikMutuK3L />;

      case "Legal & Manrisk":
        return <LegalManrisk />;

      case "SDM & Umum":
        return <SdmUmum />;

      case "Pusat Data & Integrasi":
        return <PusatData />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased relative">

      {/* SIDEBAR */}
      <div className="w-80 bg-gradient-to-b from-[#000060] via-[#000045] to-[#020220] text-white p-5 flex flex-col h-screen sticky top-0 z-10 shadow-2xl border-r border-[#000030]">

        <div className="mb-8 pb-5 border-b border-white/10">

          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-white/20 w-full h-20">

            <div className="w-1/2 flex flex-col items-start justify-center">
              <span className="text-[7px] text-slate-400 font-black tracking-widest block uppercase mb-1 leading-none">
                MEMBER OF
              </span>

              <img
                src={danantaraLogo}
                alt="Logo Danantara"
                className="h-9 w-full object-contain object-left scale-105"
              />
            </div>

            <div className="w-[2px] h-12 bg-slate-200 self-center"></div>

            <div className="w-1/2 flex items-center justify-center">
              <img
                src={waskitaLogo}
                alt="Logo Waskita"
                className="h-10 w-full object-contain object-center scale-110"
              />
            </div>

          </div>

        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 scrollbar-none">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeMenu === item.name;

            return (
              <div
                key={item.name}
                onClick={() =>
                  setActiveMenu(item.name)
                }
                className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                  isActive
                    ? "bg-gradient-to-r from-[#BD002F] to-[#990022] text-white shadow-lg shadow-red-900/40 font-bold border-t border-white/10"
                    : "text-blue-200/80 hover:bg-white/5 hover:text-white hover:translate-x-1.5"
                }`}
              >
                <div className="flex items-center gap-3.5 z-10">
                  <Icon size={17} />

                  <span className="text-[13.5px] tracking-wide">
                    {item.name}
                  </span>
                </div>

                <ChevronRight size={14} />
              </div>
            );
          })}

        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[9px] text-blue-300/40 font-black tracking-widest uppercase">
            #ForBetterWaskita
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-2">

  {/* FULLSCREEN */}
  <button
    onClick={toggleFullscreen}
    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm"
  >
    {isFullscreen ? (
      <Minimize2 size={15} />
    ) : (
      <Maximize2 size={15} />
    )}

    {isFullscreen
      ? "Exit Fullscreen"
      : "Fullscreen"}
  </button>

  {/* PDF */}
  <button
    onClick={() => window.print()}
    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm"
  >
    <Printer size={15} />
    Cetak PDF Resmi
  </button>

</div>

        </div>

        {renderContent()}

      </div>
    </div>
  );
}