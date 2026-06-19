import React, { useState } from "react";
import { Wallet, TrendingUp, Activity, Building2, Layers, Loader2 } from "lucide-react";

// 1. IMPORT CUSTOM HOOK (Sesuaikan path-nya jika beda folder)
// Asumsi: useKeuanganData.js ada di dalam folder yang sama, atau sesuaikan menjadi "../hooks/useKeuanganData"
import useKeuanganData from "../../hooks/useKeuanganData"; 

// Import Components
import CashFlowResume from "../components/CashFlowResume";
import KomitmenTermin from "../components/KomitmenTermin";
import AgingChart from "../components/AgingChart";
import ModalKerjaNwc from "../components/ModalKerjaNwc";
import PiutangKategori from "../components/PiutangKategori"; 
// 2. IMPORT TABEL BARU (Ganti DetailCashFlow)
import DetailPiutangTable from "../components/DetailPiutangTable"; 

export default function KeuanganAkuntansi() {
  const [activeTab, setActiveTab] = useState("cashflow");
  
  // 3. WAJIB PANGGIL HOOK-NYA DI SINI
  const { chartData, detailData, loading } = useKeuanganData();

  return (
    <div className="space-y-6 animate-fadeIn font-sans relative">
      
      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between border-l-4 border-l-[#000075]">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Saldo Kas Akhir (Apr)</p>
            <h2 className="text-2xl font-black text-slate-800">1.904,96 <span className="text-sm text-slate-500 font-bold">Milyar</span></h2>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-[#000075]"><Wallet size={24} /></div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Realisasi Cash In (Apr)</p>
            <h2 className="text-2xl font-black text-slate-800">185,92 <span className="text-sm text-slate-500 font-bold">Milyar</span></h2>
            <p className="text-xs font-bold text-emerald-600 mt-1">106,61% dari Target</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><TrendingUp size={24} /></div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between border-l-4 border-l-[#BD002F]">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Posisi NWC</p>
            <h2 className="text-2xl font-black text-slate-800">-120,45 <span className="text-sm text-slate-500 font-bold">Milyar</span></h2>
            <p className="text-xs font-bold text-[#BD002F] mt-1">Perlu Perhatian</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl text-[#BD002F]"><Activity size={24} /></div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex gap-4 border-b-2 border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab("cashflow")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-all duration-300 border-b-2 ${
            activeTab === "cashflow" ? "border-[#000075] text-[#000075]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Building2 size={18} />
          Cash Flow & Aging
        </button>
        <button
          onClick={() => setActiveTab("nwc")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-all duration-300 border-b-2 ${
            activeTab === "nwc" ? "border-[#000075] text-[#000075]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Activity size={18} />
          Modal Kerja (NWC)
        </button>
        <button
          onClick={() => setActiveTab("piutang_kat")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-all duration-300 border-b-2 ${
            activeTab === "piutang_kat" ? "border-[#000075] text-[#000075]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers size={18} />
          Analisis Piutang (Kategori)
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="mt-4">
        {activeTab === "cashflow" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
              <div className="w-full xl:w-[40%]"><CashFlowResume /></div>
              <div className="w-full xl:w-[60%]"><KomitmenTermin /></div>
            </div>
            
            {/* 4. TAMPILKAN GRAFIK & TABEL BERDASARKAN STATUS LOADING */}
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
                <Loader2 className="animate-spin text-[#000075] mb-3" size={32} />
                <span className="text-slate-500 font-medium">Memuat data piutang dari Supabase...</span>
              </div>
            ) : (
              <>
                <AgingChart chartData={chartData} detailData={detailData} />
                <DetailPiutangTable detailData={detailData} />
              </>
            )}
          </div>
        )}
        
        {activeTab === "nwc" && (
          <div className="animate-fadeIn">
            <ModalKerjaNwc />
          </div>
        )}

        {activeTab === "piutang_kat" && (
          <div className="animate-fadeIn">
            <PiutangKategori />
          </div>
        )}
      </div>
      
    </div>
  );
}