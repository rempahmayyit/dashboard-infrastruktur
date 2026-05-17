// src/TeknikMutuK3L.jsx
import React from "react";
import { HardHat, CheckCircle2, AlertTriangle, ShieldAlert, Award, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";

export default function TeknikMutuK3L() {
  const BLUE_DARK = "#000075";
  const RED_WASKITA = "#BD002F";
  const AMBER_COLOR = "#f59e0b";
  const GREEN_SUCCESS = "#10b981";

  // DATA GRAFIK DONAT KEPATUHAN (KOLOM TEKNIK)
  const bimData = [
    { name: "Comply", value: 20, color: BLUE_DARK },
    { name: "Not Comply", value: 1, color: RED_WASKITA },
    { name: "New Project", value: 4, color: AMBER_COLOR },
  ];

  // DATA GRAFIK BATANG KATEGORI KETIDAKSESUAIAN MUTU (KOLOM TENGAH)
  const ncrCategoryData = [
    { name: "Semen/Beton", ncr: 11 },
    { name: "Tanah", ncr: 2 },
    { name: "Besi/Baja", ncr: 0 },
    { name: "Bekisting", ncr: 0 },
    { name: "Finishing", ncr: 3 },
    { name: "MEP", ncr: 0 },
  ];

  // DATA TREN KECELAKAAN KERJA K3L (KOLOM KANAN)
  const k3lTrendData = [
    { month: "Jan", nearmiss: 2, fac: 1 },
    { month: "Feb", nearmiss: 5, fac: 1 },
    { month: "Mar", nearmiss: 3, fac: 2 },
    { month: "Apr", nearmiss: 1, fac: 1 },
    { month: "Mei", nearmiss: 1, fac: 0 },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch animate-fadeIn font-sans text-xs">
      
      {/* ==================== 1. KOLOM KIRI: TEKNIK ==================== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
        <div className="bg-[#000075] text-white font-bold p-2.5 rounded-xl text-center uppercase tracking-wider text-[11px]">
          Sektor Evaluasi Teknik &amp; Inovasi
        </div>

        {/* GRAFIK DONAT BIM COMPLIANCE */}
        <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <p className="font-bold text-slate-800 mb-1 uppercase tracking-wide text-[10px]">Implementasi BIM Compliance</p>
          <div className="flex items-center justify-between gap-2">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bimData} dataKey="value" innerRadius={22} outerRadius={38} paddingAngle={2}>
                    {bimData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1 text-[10px] font-medium text-slate-600 pl-2">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#000075]" /> 20 Comply</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#BD002F] animate-pulse" /> 1 Not Comply (KSPP Merauke)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-am-50" style={{ backgroundColor: AMBER_COLOR }} /> 4 New Project (0-10%)</div>
            </div>
          </div>
        </div>

        {/* LOG KENDALA KEPATUHAN SURVEYING DIGITAL */}
        <div className="border border-slate-100 rounded-xl p-3 space-y-2">
          <p className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Digital Surveying Compliance</p>
          <div className="p-2 bg-red-50 rounded-lg text-slate-700 border border-red-100 font-medium">
            <span className="font-black text-[#BD002F] block mb-0.5">⚠️ Not Comply (Drone Obstacle):</span>
            Irigasi KSPP Merauke Paket 1 (Kendala Personil Lapangan) &amp; Struktur Jembatan Musi (Cuaca Buruk).
          </div>
        </div>

        {/* PENDAMPINGAN WMS SPESIFIK */}
        <div className="border border-slate-100 rounded-xl p-3 space-y-1.5 bg-slate-50/30">
          <p className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Pendampingan WMS Spesifik</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
            <div className="bg-white p-2 rounded border border-slate-100">
              <span className="text-blue-700 font-black block text-[11px]">7 Proyek</span>
              Jalan &amp; Akses Tol (Japek, Kretek, Patimban, Bocimi 3A/3B)
            </div>
            <div className="bg-white p-2 rounded border border-slate-100">
              <span className="text-amber-600 font-black block text-[11px]">3 Proyek</span>
              Bangunan Bendungan (Rukoh, Tiga Dihaji, Libek)
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. KOLOM TENGAH: MUTU ==================== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
        <div className="bg-[#000075] text-white font-bold p-2.5 rounded-xl text-center uppercase tracking-wider text-[11px]">
          Sektor Pengendalian Mutu &amp; Audit NCR
        </div>

        {/* KOTAK RINGKASAN BIAYA NCR */}
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-3.5 border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wide">Jumlah NCR Not Comply</p>
            <h4 className="text-2xl font-black text-[#BD002F] mt-0.5">15 Temuan</h4>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wide">Total Biaya Kerugian</p>
            <span className="text-base font-mono font-black text-slate-900 block mt-0.5">Rp 168.236.000</span>
          </div>
        </div>

        {/* GRAFIK BATANG KATEGORI TEMUAN NCR */}
        <div className="w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ncrCategoryData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 9, fontWeight: '600' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="ncr" fill="#BD002F" radius={[3, 3, 0, 0]} barSize={18} name="Temuan NCR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PENILAIAN BULANAN MUTU */}
        <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <p className="font-bold text-slate-800 mb-1.5 uppercase tracking-wide text-[10px]">Penilaian Kinerja Mutu (Target &ge; 80)</p>
          <div className="p-2 bg-white rounded border border-slate-100 space-y-1">
            <div className="flex justify-between font-bold text-red-600">
              <span>Belum Mencapai Target:</span>
              <span>2 Proyek</span>
            </div>
            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">
              • **Irigasi KSPP Merauke** (Nilai Mutu: 33)<br />
              • **IPAL 1,2,3 IKN** (Proses perbaikan lapangan, Nilai Mutu: 23)
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 3. KOLOM KANAN: K3L ==================== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
        <div className="bg-[#000075] text-white font-bold p-2.5 rounded-xl text-center uppercase tracking-wider text-[11px]">
          Sektor Proteksi Keselamatan K3L
        </div>

        {/* MATRIKS JAM KERJA AMAN */}
        <div className="border border-slate-100 rounded-xl p-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white font-mono text-[10px] space-y-1">
          <div className="text-emerald-400 font-bold tracking-wider uppercase font-sans text-[9px] mb-1">√ STATISTIK KECELAKAAN KERJA</div>
          <div className="flex justify-between border-b border-white/5 pb-0.5"><span className="text-slate-400">Jumlah Nearmiss:</span><span className="font-bold text-white">12 Kasus</span></div>
          <div className="flex justify-between border-b border-white/5 pb-0.5"><span className="text-slate-400">Jumlah Jam Kerja:</span><span className="font-bold text-white">4.937.647 Jam</span></div>
          <div className="flex justify-between text-emerald-400 font-bold"><span className="font-sans">STATUS UTAMA:</span><span>ZERO ACCIDENT</span></div>
        </div>

        {/* GRAFIK LINE TREN KECELAKAAN KERJA */}
        <div className="w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={k3lTrendData} margin={{ top: 10, right: 15, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 9, fontWeight: 'bold' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 9 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 9, paddingTop: 4 }} />
              <Line type="monotone" dataKey="nearmiss" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Nearmiss" />
              <Line type="monotone" dataKey="fac" stroke="#BD002F" strokeWidth={2.5} dot={{ r: 3 }} name="FAC" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PROYEK BELUM MEMENUHI K3L */}
        <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <p className="font-bold text-slate-800 mb-1.5 uppercase tracking-wide text-[10px]">Penilaian Kinerja K3L (Target &ge; 80)</p>
          <div className="p-2 bg-white rounded border border-slate-100 text-slate-600 font-medium space-y-1">
            <span className="text-[#BD002F] font-black block">Akar Masalah Lapangan:</span>
            Dokumen eksternal masih tertahan di owner, aktivitas di site belum memiliki direksi keet permanen, serta keterbatasan akses jalan kerja utama (IKN &amp; Merauke).
          </div>
        </div>
      </div>

    </div>
  );
}
