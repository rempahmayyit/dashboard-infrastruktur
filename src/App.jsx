// src/App.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import LoginPage from "./LoginPage";

// --- Import Halaman Konten ---
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import MonitoringCCTV from "./pages/MonitoringCCTV";
import PemasaranAnggaran from "./PemasaranAnggaran";
import PengendalianProyek from "./PengendalianProyek";
import KeuanganAkuntansi from "./KeuanganAkuntansi";
import TeknikMutuK3L from "./TeknikMutuK3L";
import LegalManrisk from "./LegalManrisk";
import SdmUmum from "./SdmUmum";
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
} from "lucide-react";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Executive Dashboard");
  const [openMenu, setOpenMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const menuItems = [
    { name: "Executive Dashboard", icon: LayoutDashboard },
    { name: "Pemasaran & Anggaran", icon: FolderKanban },
    { name: "Pengendalian Proyek", icon: AlertTriangle },
    { name: "Keuangan & Akuntansi", icon: CircleDollarSign },
    { name: "Teknik, Mutu & K3L", icon: LayoutDashboard },
    { name: "Legal & Manrisk", icon: FolderKanban },
    { name: "SDM & Umum", icon: Search },
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
    { name: "Drone & Live CCTV", icon: Video },
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
      case "SAP vs QC/Rekon":
        return <SapVsQcRekon />;
      case "Eskalasi":
        return <MonitoringEskalasiComponent />;
      case "PDPK":
        return <PdpkMonitoring />;
      case "Drone & Live CCTV":
        return <MonitoringCCTV />;
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
  const userName = session?.user?.user_metadata?.full_name || "Vidi Handoko";
  const userEmail = session?.user?.email || "vidi.handoko@waskita.co.id";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

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

    </div>
  );
}
