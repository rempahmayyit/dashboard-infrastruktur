// src/App.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import LoginPage from "./LoginPage";

// --- Import Halaman Konten ---
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
//import MonitoringCCTV from "./pages/MonitoringCCTV";
import PemasaranAnggaran from "./PemasaranAnggaran";
import PengendalianProyek from "./Pengendalian/pages/PengendalianProyek";
import KeuanganAkuntansi from "./KeuanganAkuntansi";
import TeknikMutuK3L from "./TeknikMutuK3L";
import LegalManrisk from "./LegalManrisk";
import SdmUmum from "./SdmUmum";
import ProjectRiskDashboard from "./ProjectRiskDashboard/pages/ProjectRiskDashboard";
import SapVsQcRekon from "./SapVsQcRekon";
import MonitoringEskalasiComponent from "./MonitoringEskalasiComponent";
import PdpkMonitoring from "./PdpkMonitoring";
import PusatData from "./PusatData";

// --- Import Komponen Layout ---
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// --- Import Icons ---
import {
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  CircleDollarSign,
  Search,
  BarChart3,
  Database,
  Video,
  ShieldAlert,
} from "lucide-react";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Executive Dashboard");
  const [openMenu, setOpenMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // AUTO LOGOUT 30 MENIT + WARNING 5 MENIT SEBELUMNYA
  useEffect(() => {
    if (!session) return;

    let warningTimer;
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      setShowIdleWarning(false);

      // Popup warning di menit ke-25
      warningTimer = setTimeout(
        () => {
          setShowIdleWarning(true);
        },
        25 * 60 * 1000,
      );

      // Logout di menit ke-30
      logoutTimer = setTimeout(
        async () => {
          await supabase.auth.signOut();
          setSession(null);
        },
        30 * 60 * 1000,
      );
    };

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [session]);

  const menuItems = [
    { name: "Executive Dashboard", icon: LayoutDashboard },
    { name: "Pemasaran & Anggaran", icon: FolderKanban },
    { name: "Pengendalian Proyek", icon: AlertTriangle },
    { name: "Keuangan & Akuntansi", icon: CircleDollarSign },
    { name: "Teknik, Mutu & K3L", icon: LayoutDashboard },
    { name: "Legal & Manrisk", icon: FolderKanban },
    { name: "SDM & Umum", icon: Search },
    {
      name: "Project Risk Dashboard",
      icon: ShieldAlert,
    },
    {
      name: "Monitoring",
      icon: BarChart3,
      children: [
        { name: "SAP vs QC/Rekon" },
        { name: "Eskalasi" },
        { name: "PDPK" },
        { name: "Under Development" },
      ],
    },
        { name: "Pusat Data & Integrasi", icon: Database },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "Executive Dashboard":
        return <ExecutiveDashboard />;
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
      case "Project Risk Dashboard":
        return <ProjectRiskDashboard />;
      case "SAP vs QC/Rekon":
        return <SapVsQcRekon />;
      case "Eskalasi":
        return <MonitoringEskalasiComponent />;
      case "PDPK":
        return <PdpkMonitoring />;
      case "Pusat Data & Integrasi":
        return <PusatData />;
      case "Form Pemasaran & Anggaran":
        return <PusatData />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  // Identitas Profil
  const userEmail = session?.user?.email || "";

  const userName =
    session?.user?.user_metadata?.full_name ||
    (userEmail
      ? userEmail
          .split("@")[0]
          .split(".")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Guest User");

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const stayLoggedIn = () => {
    setShowIdleWarning(false);

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
      }),
    );
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex font-sans antialiased relative overflow-hidden print:block">
      <Sidebar
        isCollapsed={isCollapsed}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        menuItems={menuItems}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden print:block">
        <Topbar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeMenu={activeMenu}
        />

        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>

      {showIdleWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Sesi Akan Berakhir
              </h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Tidak ada aktivitas selama 25 menit. Sistem akan melakukan
                logout otomatis dalam 5 menit untuk alasan keamanan.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setSession(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Logout Sekarang
                </button>

                <button
                  onClick={stayLoggedIn}
                  className="px-4 py-2 rounded-xl bg-[#000075] text-white hover:bg-[#00005c] font-semibold"
                >
                  Tetap Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
