// src/LegalManrisk.jsx
import React from "react";
import { ShieldCheck, Scale, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function LegalManrisk() {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#64748b"];

  // DATA KPI CLAIMS CASE (Sisi Kiri Dokumen)
  const caseDataInfra1 = [
    { name: "Approved", value: 5 },
    { name: "Identified", value: 5 },
    { name: "Negotiation", value: 4 },
    { name: "Settlement", value: 4 },
    { name: "Submitted", value: 3 },
  ];

  // DATA TABEL RISK REGISTER (Treated Risk - Sesuai Tabel Bawah Matriks)
  const riskRegister = [
    { no: 1, risiko: "Keterlambatan Penyelesaian Proyek", dampak: "Bisa Terjadi", tingkat: "Tinggi", km: 4, tm: 4, tr: "Moderate to High", score: 16 },
    { no: 2, risiko: "BK/PU melebihi MAPP", deviasi: "Sering Terjadi", tingkat: "Moderat", km: 4, tm: 3, tr: "Moderate", score: 12 },
    { no: 3, risiko: "Tidak tercapainya target pendapatan usaha", deviasi: "Sering Terjadi", tingkat: "Moderat", km: 4, tm: 3, tr: "Moderate", score: 12 },
    { no: 4, risiko: "Keterlambatan penagihan fisik (WIP menjadi piutang)", deviasi: "Bisa Terjadi", tingkat: "Moderat", km: 3, tm: 3, tr: "Moderate", score: 9 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* SEKSI CORE ATAS (2 KOLOM: MONITORING KLAIM VS MATRIKS MANRISK KUSTOM) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        
        {/* SISI KIRI: EVALUASI TARGET KPI KLAIM (EX-INFRA 1) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-1">
              <Scale size={16} className="text-[#000075]" />
              Evaluasi Target KPI VO / Klaim (Cut-Off April)
            </h3>
            <p className="text-slate-400 text-xs mb-4">Jumlah status sebaran data kasus klaim aktif komposit penutupan parsial</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={caseDataInfra1} dataKey="value" outerRadius={65} innerRadius={45} label={{ fontSize: 10, fontWeight: 'bold' }}>
                    {caseDataInfra1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* KPI GAUGE REPLICA */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center min-w-[140px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">KPI Claim Rate</span>
              <span className="text-3xl font-black text-emerald-600 block mt-1">50.00</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5" style={{ width: "50%" }}></div>
              </div>
              <span className="text-[9px] text-slate-500 font-medium mt-1 block">Target Efisiensi: 80.00</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] pt-4 border-t border-slate-100 font-semibold text-slate-500">
            <div>Identified: <span className="text-blue-600">116,62 M</span></div>
            <div>Negotiation: <span className="text-amber-600">114,53 M</span></div>
            <div>Approved: <span className="text-emerald-600">37,67 M</span></div>
          </div>
        </div>

        {/* SISI KANAN: HEATMAP SEBARAN RISIKO / MATRIKS MANRISK UTUH */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-emerald-600" />
              Matriks Korporat Manajemen Risiko (WaRM April)
            </h3>
            <p className="text-slate-400 text-xs mb-4">Pemetaan tingkat konsekuensi dampak versus peluang kejadian fatal lapangan</p>
          </div>
          
          {/* REPLIKA GRID HEATMAP 5x5 */}
          <div className="grid grid-cols-6 gap-1 font-mono text-[9px] text-center font-bold text-slate-700">
            {/* Row 5 */}
            <span className="text-slate-400 flex items-center justify-end pr-1 text-right font-sans">Sering</span>
            <div className="p-2 bg-yellow-400 rounded">11</div><div className="p-2 bg-yellow-400 rounded">12</div><div className="p-2 bg-orange-500 text-white rounded">16</div><div className="p-2 bg-red-600 text-white rounded">21</div><div className="p-2 bg-red-600 text-white rounded">25</div>
            {/* Row 4 */}
            <span className="text-slate-400 flex items-center justify-end pr-1 text-right font-sans">Bisa Tjd</span>
            <div className="p-2 bg-green-500 text-white rounded">7</div><div className="p-2 bg-yellow-400 rounded">8</div><div className="p-2 bg-orange-500 text-white rounded">13</div><div className="p-2 bg-orange-500 text-white rounded font-black border-2 border-slate-900 shadow">17 (2.2)</div><div className="p-2 bg-red-600 text-white rounded">22</div>
            {/* Row 3 */}
            <span className="text-slate-400 flex items-center justify-end pr-1 text-right font-sans">Mungkin</span>
            <div className="p-2 bg-green-500 text-white rounded">4</div><div className="p-2 bg-green-500 text-white rounded">5</div><div className="p-2 bg-yellow-400 rounded">9</div><div className="p-2 bg-orange-500 text-white rounded">14</div><div className="p-2 bg-orange-500 text-white rounded">18</div>
            {/* Row 2 */}
            <span className="text-slate-400 flex items-center justify-end pr-1 text-right font-sans">Jarang</span>
            <div className="p-2 bg-green-500 text-white rounded">2</div><div className="p-2 bg-green-500 text-white rounded">3</div><div className="p-2 bg-green-500 text-white rounded">6</div><div className="p-2 bg-yellow-400 rounded">10</div><div className="p-2 bg-orange-500 text-white rounded">15</div>
            {/* Axis Label */}
            <span></span>
            <span className="text-slate-400 font-sans mt-1">Sgt Kecil</span><span className="text-slate-400 font-sans mt-1">Kecil</span><span className="text-slate-400 font-sans mt-1">Moderat</span><span className="text-slate-400 font-sans mt-1">Besar</span><span className="text-slate-400 font-sans mt-1">Sgt Besar</span>
          </div>

          <div className="flex justify-between items-center bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 text-[11px] font-semibold text-[#000075] mt-4">
            <span className="flex items-center gap-1"><AlertTriangle size={13} /> Kepatuhan Laporan On Going:</span>
            <span className="font-black text-xs bg-blue-600 text-white px-2 py-0.5 rounded">62.00%</span>
          </div>
        </div>

      </div>

      {/* SEKSI BAWAH: DATA REGISTER RISK (TREATED RISK TABLE) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
          <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
            <FileText size={14} className="text-[#000075]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Daftar Register Risiko Kritis Hasil Intervensi (Treated Risk)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 pl-4 w-12 text-center">No</th>
                  <th className="p-3">Identifikasi Isu / Risiko Utama Proyek</th>
                  <th className="p-3 text-center">Peluang Kejadian</th>
                  <th className="p-3 text-center">Dampak Finansial</th>
                  <th className="p-3 text-center">Tingkat Risiko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {riskRegister.map((r) => (
                  <tr key={r.no} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center text-slate-400 font-mono">{r.no}</td>
                    <td className="p-3 font-bold text-slate-900">{r.risiko}</td>
                    <td className="p-3 text-center text-slate-600">{r.dampak}</td>
                    <td className="p-3 text-center text-slate-600">{r.tingkat}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.tr === "Moderate to High" 
                          ? "bg-orange-50 text-orange-700 border border-orange-200" 
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}>{r.tr}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-slate-700 leading-relaxed">
          <span className="font-bold text-amber-800 uppercase tracking-wide block mb-1">Nota Kesimpulan Manajemen Risiko:</span>
          Laporan periode April 2026 masih terkendala pembaruan di aplikasi WaRM menyesuaikan struktur organisasi baru, sehingga berdampak pada tingkat kepatuhan pengiriman laporan proyek yang belum menggambarkan secara menyeluruh. Perbaikan laporan diselesaikan pasca-pembaruan selesai.
        </div>
      </div>

    </div>
  );
}
