import React, { useEffect, useState, useRef } from "react";
import { supabase } from "./lib/supabase";
import LoginPage from "./LoginPage";

// --- Import Halaman Konten ---
import LandingPage from "./pages/LandingPage";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";

import ProjectMapDashboard from "./ProjectMap/pages/ProjectMapDashboard";

import PemasaranAnggaran from "./PemasaranAnggaran";
import PengendalianProyek from "./Pengendalian/pages/PengendalianProyek";
import KeuanganAkuntansi from "./Keuangan/pages/KeuanganAkuntansi";
import TeknikMutuK3L from "./TeknikMutuK3L";
import LegalManrisk from "./LegalManrisk";
import SdmUmum from "./SdmUmum";
import ProjectRiskDashboard from "./ProjectRiskDashboard/pages/ProjectRiskDashboard";
import SapVsQcRekon from "./SapVsQcRekon";
import MonitoringEskalasiComponent from "./MonitoringEskalasiComponent";
import PdpkMonitoring from "./PdpkMonitoring";
import PusatData from "./PusatData";
import ReportDashboard from "./Report/pages/ReportModule";
import { getUserProfile } from "./lib/userProfile";

import MasterProject from "./PusatData/MasterProject";

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
  const [activeMenu, setActiveMenu] = useState("Portal Infrastruktur");
  const [openMenu, setOpenMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  // Gunakan undefined sebagai penanda awal "Belum difetch"
  const [profile, setProfile] = useState(undefined);

  // Gunakan ref untuk menyimpan fungsi timer agar bisa dipanggil manual
  const resetTimerRef = useRef(null);

  const userRole = profile?.role || "viewer";

  // Optimasi Supabase Auth & Fetch Profile
  // Optimasi Supabase Auth & Fetch Profile
  // Optimasi Supabase Auth & Anti-Deadlock Fetch
  useEffect(() => {
    let isMounted = true;

    // 1. Cek session tanpa memblokir thread
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        if (session?.user?.id) {
          await supabase
            .from("user_profiles")
            .update({
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.user.id);
        }

        // KUNCI UTAMA: Langsung matikan loading di sini!
        // Jangan menunggu profil ter-load agar layar tidak stuck.
        setLoading(false);

        // 2. Fetch profil di background
        if (session?.user?.id) {
          getUserProfile(session.user.id).then((profileData) => {
            if (isMounted) setProfile(profileData || null);
          });
        } else {
          if (isMounted) setProfile(null);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === "SIGNED_IN" && session?.user?.id) {
        // Update last login
        supabase
          .from("user_profiles")
          .update({
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        getUserProfile(session.user.id).then((profileData) => {
          if (isMounted) setProfile(profileData || null);
        });
      }
    });

    

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
          setProfile(null);
        },
        30 * 60 * 1000,
      );
    };

    // Simpan fungsi ke dalam ref
    resetTimerRef.current = resetTimer;

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

  const allMenus = [
    {
      name: "Portal Infrastruktur",
      icon: LayoutDashboard,
    },
    { name: "Executive Dashboard", icon: LayoutDashboard },

    { name: "Exsum Proyek", icon: LayoutDashboard },

    { name: "Report Mode", 
      roles: ["admin", "super_admin"],
      icon: BarChart3 },

    {
      name: "Pemasaran & Anggaran",
      icon: FolderKanban,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Pengendalian Proyek",
      icon: AlertTriangle,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Keuangan & Akuntansi",
      icon: CircleDollarSign,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Teknik, Mutu & K3L",
      icon: LayoutDashboard,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Legal & Manrisk",
      icon: FolderKanban,
      roles: ["admin", "super_admin"],
    },

    {
      name: "SDM & Umum",
      icon: Search,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Project Risk Dashboard",
      icon: ShieldAlert,
      roles: ["admin", "super_admin"],
    },

    {
      name: "Monitoring",
      icon: BarChart3,
      roles: ["admin", "super_admin"],
      children: [{ name: "Eskalasi" }, { name: "PDPK" }],
    },

    {
      name: "Pusat Data & Integrasi",
      icon: Database,
      roles: ["super_admin"],
    },

    {
      name: "Master Project",
      icon: Database,
      roles: ["admin", "super_admin"],
    },
  ];

  const menuItems = allMenus.filter(
    (menu) => !menu.roles || menu.roles.includes(userRole),
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Portal Infrastruktur":
        return (
          <LandingPage setActiveMenu={setActiveMenu} userName={userName} />
        );
      case "Executive Dashboard":
        return <ExecutiveDashboard />;
      case "Exsum Proyek":
        return <ProjectMapDashboard />;
      case "Report Mode":
        return <ReportDashboard />;
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
        return (
          <div className="flex items-center justify-center h-full text-slate-500">
            Form Pemasaran & Anggaran belum tersedia
          </div>
        );
      case "Master Project":
        return <MasterProject />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  // SEMENTARA DISABLE DULU BAGIAN INI dengan menambahkan /* dan */

  if (session && profile === undefined) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading Profile...
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
    // Memanggil ulang fungsi reset dengan rapi lewat ref
    if (resetTimerRef.current) {
      resetTimerRef.current();
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex font-sans antialiased relative overflow-hidden print:block">
      {!isFullscreen && (
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
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden print:block">
        {!isFullscreen && activeMenu !== "Portal Infrastruktur" && (
          <Topbar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            activeMenu={activeMenu}
          />
        )}

        <div
          className={`flex-1 overflow-y-auto ${
            isFullscreen
              ? "p-0"
              : activeMenu === "Portal Infrastruktur"
                ? "p-0"
                : "p-8"
          }`}
        >
          {renderContent()}
        </div>
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
                    setProfile(null);
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
