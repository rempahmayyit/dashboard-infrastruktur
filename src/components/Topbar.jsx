// src/components/Topbar.jsx

import React, { useState } from "react";
import { Menu, Maximize2, Minimize2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useFilter } from "../context/FilterContext";

export default function Topbar({ isCollapsed, setIsCollapsed, activeMenu }) {
  const { globalFilter, setGlobalFilter } = useFilter();
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200 bg-white print:static">
      <div className="flex items-center gap-4">
        {/* TOMBOL TOGGLE SIDEBAR */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200 print:hidden shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {activeMenu === "PDPK" ? "Proyek Dalam Penanganan Khusus" : activeMenu}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Dashboard Portofolio Divisi Infrastruktur</p>
        </div>
      </div>

      <div className="flex items-center gap-3 print:hidden">
        {/* KONTEN FILTER DROPDOWN */}
        <div className="bg-slate-100 rounded-xl p-1 flex items-center gap-0.5 border border-slate-200 shadow-inner font-sans">
          
          {/* FILTER TAHUN */}
          <select
            value={globalFilter.tahun}
            onChange={(e) => setGlobalFilter({ ...globalFilter, tahun: Number(e.target.value) })}
            className="bg-transparent hover:bg-white text-slate-700 hover:text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-lg cursor-pointer outline-none appearance-none text-center"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
          
          <div className="h-3.5 w-[1px] bg-slate-300 self-center mx-0.5"></div>
          
          {/* FILTER BULAN (Full Jan - Des) */}
          <select
            value={globalFilter.bulan}
            onChange={(e) => setGlobalFilter({ ...globalFilter, bulan: e.target.value })}
            className="bg-transparent hover:bg-white text-slate-700 hover:text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-lg cursor-pointer outline-none appearance-none text-center"
          >
            <option value="Jan">Jan</option>
            <option value="Feb">Feb</option>
            <option value="Mar">Mar</option>
            <option value="Apr">Apr</option>
            <option value="Mei">Mei</option>
            <option value="Jun">Jun</option>
            <option value="Jul">Jul</option>
            <option value="Agu">Agu</option>
            <option value="Sep">Sep</option>
            <option value="Okt">Okt</option>
            <option value="Nov">Nov</option>
            <option value="Des">Des</option>
          </select>

          <div className="h-3.5 w-[1px] bg-slate-300 self-center mx-0.5"></div>
          
          {/* FILTER MINGGU */}
          <select
            value={globalFilter.minggu}
            onChange={(e) => setGlobalFilter({ ...globalFilter, minggu: Number(e.target.value) })}
            className="bg-transparent hover:bg-white text-slate-700 hover:text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-lg cursor-pointer outline-none appearance-none text-center"
          >
            <option value={1}>Minggu 1</option>
            <option value={2}>Minggu 2</option>
            <option value={3}>Minggu 3</option>
            <option value={4}>Minggu 4</option>
            <option value={5}>Minggu 5</option>
          </select>
        </div>

        {/* TOMBOL FULLSCREEN */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-[11px] font-black shadow-sm transition-all duration-200"
        >
          {isFullscreen ? <><Minimize2 size={14} /> Exit Fullscreen</> : <><Maximize2 size={14} /> Fullscreen</>}
        </button>

        {/* TOMBOL LOGOUT */}
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 hover:text-red-700 text-[11px] font-black shadow-sm transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}