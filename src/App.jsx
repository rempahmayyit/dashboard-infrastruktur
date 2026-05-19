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
  BarChart3,
} from "lucide-react";

import { formatNumber, formatPercent, formatMiliar } from "./utils/formatters";

import { nkbProjectList } from "./data";

import ProjectMap from "./ProjectMap";
import FinancialCharts from "./FinancialCharts";
import PemasaranAnggaran from "./PemasaranAnggaran";
import PengendalianProyek from "./PengendalianProyek";
import KeuanganAkuntansi from "./KeuanganAkuntansi";
import TeknikMutuK3L from "./TeknikMutuK3L";
import LegalManrisk from "./LegalManrisk";
import SdmUmum from "./SdmUmum";
import MonitoringEskalasiComponent from "./MonitoringEskalasiComponent";
import PusatData from "./PusatData";

import waskitaLogo from "./assets/waskita_logo.png";
import danantaraLogo from "./assets/Logo_danantara.png";

export default function App() {
  const [totalProject, setTotalProject] = useState(0);
  const [produksiUsaha, setProduksiUsaha] = useState(0);
  const [bkpuValue, setBkpuValue] = useState(0);
  const [cashInValue, setCashInValue] = useState(0);
  const [activeMenu, setActiveMenu] = useState("Executive Dashboard");
  const [openMenu, setOpenMenu] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [activeChartTab, setActiveChartTab] = useState("PU");

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
    const { count } = await supabase.from("project_progress").select("*", {
      count: "exact",
      head: true,
    });

    setTotalProject(count || 0);

    // PENDAPATAN USAHA
    const { data: puData } = await supabase.from("tren_keuangan").select("*");

    if (puData?.length > 0) {
      const totalPU = puData.reduce(
        (sum, item) => sum + Number(item.realisasi || 0),
        0,
      );

      setProduksiUsaha(totalPU);
    }

    // BKPU
    const { data: bkpuData } = await supabase.from("tren_bk_pu").select("*");

    if (bkpuData?.length > 0) {
      const avgBKPU =
        bkpuData.reduce((sum, item) => sum + Number(item.realisasi || 0), 0) /
        bkpuData.length;

      setBkpuValue(avgBKPU);
    }

    // CASH IN
    const { data: cashData } = await supabase.from("aging_invoice").select("*");

    if (cashData?.length > 0) {
      const totalCash = cashData.reduce(
        (sum, item) =>
          sum + Number(String(item.total).replace(/[^\d]/g, "") || 0),
        0,
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
      name: "Monitoring",
      icon: BarChart3,
      children: [
        { name: "Eskalasi" },
        { name: "Cost Overrun" },
        { name: "Deviasi Progress" },
      ],
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
                      Evaluasi Pemasaran & Anggaran (NKB)
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
                    Deviasi Negatif terhadap Target April:
                    {formatMiliar(-251.4)}
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

            <FinancialCharts
              activeChartTab={activeChartTab}
              setActiveChartTab={setActiveChartTab}
            />

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

      case "Eskalasi":
        return <MonitoringEskalasiComponent />;

      case "Pusat Data & Integrasi":
        return <PusatData />;

      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans antialiased relative">
      {/* ================= SIDEBAR KIRI FINAL ================= */}
      <div className="w-72 bg-[#00005a] text-slate-200 min-h-screen flex flex-col justify-between p-5 font-sans border-r border-slate-800/40 shadow-2xl sticky top-0 z-10">
        <div>
          {/* LOGO AREA */}
          <div className="bg-white rounded-3xl p-5 mb-8 shadow-inner">
            {/* TOP LOGO */}
            <div className="flex items-center justify-center gap-8">
              {/* DANANTARA */}
              <div className="flex items-center justify-center">
                <img
                  src={danantaraLogo}
                  alt="Danantara"
                  className="h-16 object-contain mix-blend-multiply"
                />
              </div>

              {/* DIVIDER */}
              <div className="w-px h-16 bg-slate-300"></div>

              {/* WASKITA */}
              <div className="flex items-center justify-center">
                <img
                  src={waskitaLogo}
                  alt="Waskita"
                  className="h-16 object-contain"
                />
              </div>
            </div>

            {/* GARIS */}
            <div className="border-t border-slate-200 my-4"></div>

            {/* TEXT */}
            <div className="text-center">
              <p className="text-[11px] font-black tracking-[0.35em] text-[#00005a] uppercase">
                Divisi Infrastruktur
              </p>
            </div>
          </div>

          {/* MENU */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;

              return (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === item.name ? null : item.name)
                        }
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
              ${
                activeMenu === item.name
                  ? "bg-gradient-to-r from-[#BD002F] to-[#990022] text-white shadow-xl shadow-red-900/30"
                  : "text-blue-200/80 hover:bg-white/5 hover:text-white hover:translate-x-1"
              }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={17} />

                          <span className="text-[13px] font-semibold tracking-wide">
                            {item.name}
                          </span>
                        </div>

                        <ChevronRight
                          size={14}
                          className={`transition-all duration-300 ${
                            openMenu === item.name
                              ? "rotate-90 text-blue-300"
                              : "text-blue-300/50"
                          }`}
                        />
                      </button>

                      {openMenu === item.name && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              onClick={() => setActiveMenu(child.name)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                    ${
                      activeMenu === child.name
                        ? "bg-white text-[#BD002F] font-semibold"
                        : "text-blue-200/70 hover:bg-white/10"
                    }`}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => setActiveMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-[#BD002F] to-[#990022] text-white shadow-xl shadow-red-900/30"
                : "text-blue-200/80 hover:bg-white/5 hover:text-white hover:translate-x-1"
            }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} />

                        <span className="text-[13px] font-semibold tracking-wide">
                          {item.name}
                        </span>
                      </div>

                      <ChevronRight
                        size={14}
                        className={`transition-all ${
                          isActive
                            ? "text-white"
                            : "text-blue-300/50 group-hover:text-white"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase font-bold">
            #FORBETTERWASKITA
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeMenu}
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Dashboard Portofolio Divisi Infrastruktur
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-sm font-semibold transition-all"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 size={16} />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 size={16} />
                  Fullscreen
                </>
              )}
            </button>

            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-sm font-semibold transition-all">
              <Printer size={16} />
              Cetak PDF Resmi
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto px-8 py-6 h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
