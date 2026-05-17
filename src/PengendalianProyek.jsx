// src/PengendalianProyek.jsx
import React from "react";
import { Clock, AlertTriangle, TrendingDown, ShieldAlert, Activity } from "lucide-react";
import FinancialCharts from "./FinancialCharts";

export default function PengendalianProyek() {
  
  // DATA COL 1: TIME OVERRUN (0/45) & ALMOST OVERRUN (5/45)
  const timeOverrunData = [
    { name: "Oplah 3 Sumut", prog: "82.10%", endDate: "31-May-26", remain: "31" },
    { name: "Japeksel 3 Induk", prog: "98.57%", endDate: "23-Jun-26", remain: "54" },
    { name: "KSPP Merauke", prog: "21.20%", endDate: "06-Jul-26", remain: "67" },
    { name: "Patimban Port", prog: "69.94%", endDate: "17-Jul-26", remain: "78" },
  ];

  // DATA COL 2: BEHIND SCHEDULE (13/45 - RATIO 28%)
  const behindScheduleData = [
    { name: "BA Serdang-Berdagai", ra: "67.58%", ri: "-", dev: "-67.58%" },
    { name: "Patimban Port", ra: "96.82%", ri: "69.94%", dev: "-26.88%" },
    { name: "Patimban Akses", ra: "71.11%", ri: "66.28%", dev: "-4.83%" },
    { name: "Bend. Cibeet", ra: "11.35%", ri: "8.84%", dev: "-2.51%" },
    { name: "KSCS 1", ra: "20.66%", ri: "18.30%", dev: "-2.36%" },
    { name: "Oplah 3 Sumut", ra: "84.35%", ri: "82.10%", dev: "-2.25%" },
    { name: "Irg. Lempuing 3", ra: "71.26%", ri: "69.17%", dev: "-2.09%" },
    { name: "Bocimi 3A", ra: "86.87%", ri: "84.86%", dev: "-2.00%" },
    { name: "Bend. Jragung 4", ra: "43.42%", ri: "41.91%", dev: "-1.51%" },
    { name: "Bend. Tiga Dihaji", ra: "52.06%", ri: "50.84%", dev: "-1.22%" },
    { name: "Lempuing II JOP", ra: "74.62%", ri: "73.58%", dev: "-1.04%" },
    { name: "Bend. Jragung I", ra: "93.04%", ri: "92.30%", dev: "-0.74%" },
    { name: "BA Lubuk Siduap", ra: "0.03%", ri: "-", dev: "-0.03%" },
  ];

  // DATA COL 3: COST OVERRUN BK/PU > MAPP (22/45 - RATIO 49%)
  const costOverrunData = [
    { name: "CWIS", prog: "0.14%", mapp: "93.00%", real: "259.62%", dev: "-166.62%" },
    { name: "Pengarah Rukoh", prog: "54.37%", mapp: "105.20%", real: "131.72%", dev: "-26.52%" },
    { name: "Bend. Cibeet", prog: "8.84%", mapp: "84.97%", real: "99.35%", dev: "-14.38%" },
    { name: "Bend. Karangnongko", prog: "31.33%", mapp: "87.58%", real: "100.19%", dev: "-12.61%" },
    { name: "Fas. Pengarah Rukoh JOI", prog: "67.37%", mapp: "88.81%", real: "100.08%", dev: "-11.26%" },
    { name: "Perbaikan KAPB", prog: "44.34%", mapp: "88.99%", real: "100.20%", dev: "-11.21%" },
    { name: "Jln. Singaraja-Mengwitani", prog: "6.69%", mapp: "90.97%", real: "97.86%", dev: "-6.89%" },
    { id: "BIM", name: "IPAL IKN", prog: "88.06%", mapp: "124.35%", real: "130.38%", dev: "-6.03%" },
    { name: "Irg. Lempuing 3", prog: "69.17%", mapp: "88.03%", real: "92.22%", dev: "-4.18%" },
    { name: "Bocimi 3A", prog: "84.86%", mapp: "88.82%", real: "92.90%", dev: "-4.08%" },
    { name: "KSPP Merauke", prog: "21.20%", mapp: "92.29%", real: "95.35%", dev: "-3.05%" },
    { name: "Bend. Tiga Dihaji", prog: "50.84%", mapp: "81.42%", real: "84.37%", dev: "-2.95%" },
    { name: "Tol IKN 3B-2", prog: "89.34%", mapp: "90.20%", real: "92.81%", dev: "-2.61%" },
    { name: "Rentang LOS-01", prog: "100.00%", mapp: "94.87%", real: "97.46%", dev: "-2.59%" },
    { name: "Bend. Bener", prog: "80.89%", mapp: "92.72%", real: "95.12%", dev: "-2.39%" },
    { name: "Patimban Port", prog: "69.94%", mapp: "91.36%", real: "93.54%", dev: "-2.18%" },
    { name: "Lempuing II JOP", prog: "73.58%", mapp: "88.62%", real: "90.14%", dev: "-1.52%" },
    { name: "Bend. Mbay", prog: "96.61%", mapp: "96.45%", real: "97.91%", dev: "-1.46%" },
    { name: "Bocimi 3B", prog: "73.69%", mapp: "90.90%", real: "92.18%", dev: "-1.28%" },
    { name: "Bend. Jragung I", prog: "92.30%", mapp: "81.65%", real: "82.68%", dev: "-1.03%" },
    { name: "BA Bireun-Takengon", prog: "2.66%", mapp: "90.00%", real: "90.95%", dev: "-0.95%" },
    { name: "Irg. Cibaliung", prog: "79.37%", mapp: "85.86%", real: "86.71%", dev: "-0.84%" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* SEKSI ATAS: GRAFIK FINANSIAL MULTI-TAB TERPADU */}
      <FinancialCharts />

      {/* TITEL OPERASIONAL UTAMA */}
      <div className="border-b border-slate-200 pb-3 mt-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity size={20} className="text-blue-800" />
          Matriks Monitoring & Pengendalian Operasional Proyek Strategis
        </h2>
        <p className="text-slate-500 text-xs mt-0.5">Lembar Kerja Evaluasi Kritis Produksi Divisi Infrastruktur s.d Bulan Ini</p>
      </div>

      {/* ==================== PANEL UTAMA 3 KOLOM SEJAJAR (PERSIS FORMAT SLIDE) ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        
        {/* KOLOM 1: TIME OVERRUN (TEMA TEGAS - MERAH WASKITA) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header & Indikator Donut Persentase */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-[#BD002F]" size={18} />
              <div>
                <h3 className="text-sm font-black text-slate-900">TIME OVERRUN</h3>
                <p className="text-[10px] font-bold text-slate-400">Rasio Kasus: 0/45 Proyek</p>
              </div>
            </div>
            {/* Visual Indikator Lingkaran 0% */}
            <div className="relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-slate-200 font-mono text-xs font-black text-slate-500">
              0%
            </div>
          </div>
          {/* Wadah Tabel Scrollable */}
          <div className="p-3 flex-1 flex flex-col justify-between max-h-[380px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#008080] text-white font-bold sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="p-2 pl-3">Proyek</th>
                  <th className="p-2 text-center">Prog. (%)</th>
                  <th className="p-2 text-center">End Date</th>
                  <th className="p-2 text-center pr-3">Remain. (day)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black"><td colSpan="4" className="p-2 pl-3 uppercase">Time Overrun</td></tr>
                <tr className="bg-white"><td colSpan="4" className="p-3 text-center text-slate-400 italic">0 Proyek Terdeteksi</td></tr>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black"><td colSpan="4" className="p-2 pl-3 uppercase">Almost Overrun</td></tr>
                {timeOverrunData.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 pl-3 font-bold text-slate-800 truncate max-w-[110px]">{p.name}</td>
                    <td className="p-2 text-center">{p.prog}</td>
                    <td className="p-2 text-center text-slate-500 font-mono">{p.endDate}</td>
                    <td className="p-2 text-center font-black text-red-600 pr-3">{p.remain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KOLOM 2: BEHIND SCHEDULE (TEMA PERINGATAN - COKLAT/ORANYE OPERASIONAL) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header & Indikator Donut Persentase */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-orange-600" size={18} />
              <div>
                <h3 className="text-sm font-black text-slate-900">BEHIND SCHEDULE</h3>
                <p className="text-[10px] font-bold text-slate-400">Rasio Kasus: 13/45 Proyek</p>
              </div>
            </div>
            {/* Visual Indikator Lingkaran 28% */}
            <div className="relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-slate-200 border-t-orange-500 font-mono text-xs font-black text-orange-600">
              28%
            </div>
          </div>
          {/* Wadah Tabel Scrollable */}
          <div className="p-3 flex-1 flex flex-col justify-between max-h-[380px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#995100] text-white font-bold sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="p-2 pl-3">Proyek</th>
                  <th className="p-2 text-center">Ra. (%)</th>
                  <th className="p-2 text-center">Ri. (%)</th>
                  <th className="p-2 text-center pr-3">Dev. (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {behindScheduleData.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 pl-3 font-bold text-slate-800 truncate max-w-[120px]">{p.name}</td>
                    <td className="p-2.5 text-center text-slate-500">{p.ra}</td>
                    <td className="p-2.5 text-center text-[#000075]">{p.ri}</td>
                    <td className="p-2.5 text-center font-black text-red-600 pr-3">{p.dev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KOLOM 3: COST OVERRUN (TEMA MONITORING ANGGARAN - BIRU HOLDING) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header & Indikator Donut Persentase */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="text-[#000075]" size={18} />
              <div>
                <h3 className="text-sm font-black text-slate-900">BK/PU &gt; MAPP</h3>
                <p className="text-[10px] font-bold text-slate-400">Rasio Kasus: 22/45 Proyek</p>
              </div>
            </div>
            {/* Visual Indikator Lingkaran 49% */}
            <div className="relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-slate-200 border-y-[#000075] font-mono text-xs font-black text-[#000075]">
              49%
            </div>
          </div>
          {/* Wadah Tabel Scrollable */}
          <div className="p-3 flex-1 flex flex-col justify-between max-h-[380px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#000050] text-white font-bold sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="p-2 pl-3">Proyek</th>
                  <th className="p-2 text-center">Prog. (%)</th>
                  <th className="p-2 text-center">MAPP (%)</th>
                  <th className="p-2 text-center">Real. (%)</th>
                  <th className="p-2 text-center pr-3">Dev. (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {costOverrunData.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 pl-3 font-bold text-slate-800 truncate max-w-[100px]" title={p.name}>
                      {p.name}
                      {p.id === "BIM" && <span className="ml-1 text-[8px] bg-red-100 text-red-700 px-1 rounded font-black uppercase tracking-wider animate-pulse">BIM</span>}
                    </td>
                    <td className="p-2 text-center text-slate-500">{p.prog}</td>
                    <td className="p-2 text-center text-slate-500">{p.mapp}</td>
                    <td className="p-2 text-center text-[#000075] font-bold">{p.real}</td>
                    <td className="p-2 text-center font-black text-red-600 pr-3 bg-red-50/20">{p.dev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      {/* =========================================================================================== */}

      {/* LOWER FOOTER: INSTRUCTIONAL ACTION BANNER */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3">
        <ShieldAlert size={18} className="text-[#000075] shrink-0" />
        <p className="text-slate-700 text-xs font-medium">
          <span className="font-bold text-[#000075]">Nota Pengendalian SCM:</span> Sebanyak 22 proyek terindikasi pembengkakan anggaran operasional kerja lapangan (<span className="italic font-bold">BK/PU &gt; Batas MAPP</span>). Diperlukan evaluasi skema subkontraktor dan percepatan penyerapan termin klaim sesegera mungkin.
        </p>
      </div>

    </div>
  );
}
