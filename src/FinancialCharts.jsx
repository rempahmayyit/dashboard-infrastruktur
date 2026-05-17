// src/FinancialCharts.jsx
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart, LabelList } from "recharts";

// Import dataset terpisah dari data.js
import { chartDataPU, chartDataLabaKotor, chartDataBKPU, chartDataLabaBersih, topUnachievedPU, topUnachievedLK, topUnachievedDefault } from "./data";

export default function FinancialCharts() {
  const [activeChartTab, setActiveChartTab] = useState("PU");

  // Logika pembacaan konfigurasi grafik & sinkronisasi data tabel samping
  const getComponentConfig = () => {
    switch (activeChartTab) {
      case "PU": 
        return { 
          data: chartDataPU, 
          name: "PU (Milyar)", 
          color: "#000075", 
          tableData: topUnachievedPU, 
          title: "Top 5 PU Tidak Tercapai" 
        };
      case "LK": 
        return { 
          data: chartDataLabaKotor, 
          name: "Laba Kotor (M)", 
          color: "#BD002F", 
          tableData: topUnachievedLK, 
          title: "Top 5 LK Tidak Tercapai" 
        };
      case "BKPU": 
        return { 
          data: chartDataBKPU, 
          name: "Rasio BK/PU (%)", 
          color: "#f97316", 
          tableData: topUnachievedDefault, 
          title: "Peringatan Rasio BK/PU" 
        };
      case "LB": 
        return { 
          data: chartDataLabaBersih, 
          name: "Laba Bersih (M)", 
          color: "#10b981", 
          tableData: topUnachievedDefault, 
          title: "Peringatan Laba Bersih" 
        };
      default: 
        return { 
          data: chartDataPU, 
          name: "PU", 
          color: "#000075", 
          tableData: topUnachievedPU, 
          title: "Top 5 PU Tidak Tercapai" 
        };
    }
  };

  const current = getComponentConfig();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 break-inside-avoid">
      {/* SEKSI GRAFIK 12 BULAN (LEBAR 2 KOLOM) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <h3 className="text-base font-bold text-slate-900">Analisis Tren Keuangan 12 Bulan</h3>
            <p className="text-slate-400 text-xs">Klik tab untuk mengubah visualisasi data kinerja dan tabel evaluasi samping</p>
          </div>
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
            <button onClick={() => setActiveChartTab("PU")} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeChartTab === "PU" ? "bg-[#000075] text-white shadow-sm" : "text-slate-600"}`}>PU</button>
            <button onClick={() => setActiveChartTab("LK")} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeChartTab === "LK" ? "bg-[#BD002F] text-white shadow-sm" : "text-slate-600"}`}>Laba Kotor</button>
            <button onClick={() => setActiveChartTab("BKPU")} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeChartTab === "BKPU" ? "bg-orange-50 text-white shadow-sm" : "text-slate-600"}`}>BK/PU</button>
            <button onClick={() => setActiveChartTab("LB")} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeChartTab === "LB" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600"}`}>Laba Bersih</button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={current.data} margin={{ top: 20, right: 25, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 10 }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="rencana" stroke="#94a3b8" strokeWidth={1.5} name="RKAP '26" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="realisasi" stroke={current.color} strokeWidth={3} connectNulls dot={{ fill: current.color, r: 4 }} name={current.name}>
              <LabelList dataKey="realisasi" position="top" style={{ fill: current.color, fontSize: 9, fontWeight: 'bold' }} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AUTOMATIC LINKED LIST: SEKSI KANAN BERUBAH MENGIKUTI TAB GRAFIK DIKREASI */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="text-[#BD002F]" size={16} />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight transition-all">{current.title}</h3>
          </div>
          <p className="text-slate-400 text-[11px] mb-4">Evaluasi daftar deviasi negatif terhadap parameter target RKAP</p>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto max-h-[250px] pr-1 scrollbar-thin">
          {current.tableData.map((proj, idx) => (
            <div key={idx} className="p-2.5 bg-red-50/50 border border-red-100 rounded-xl text-xs transition-all duration-300 animate-fadeIn">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[9px] font-bold text-slate-400">{proj.id}</span>
                <span className="text-[10px] font-extrabold text-[#BD002F]">{proj.deviasi}</span>
              </div>
              <h4 className="font-bold text-slate-800 truncate" title={proj.name}>{proj.name}</h4>
              <p className="text-slate-500 text-[10px] mt-0.5 font-medium italic">Kendala: {proj.kategori}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
