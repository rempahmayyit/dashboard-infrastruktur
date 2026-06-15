import React from "react";
import { Briefcase, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ModalKerjaNwc() {
  // SILAKAN GANTI ANGKA DUMMY INI DENGAN DATA DARI GAMBAR ANDA
  const nwcData = [
    { kategori: "Piutang Usaha", nilai: 450.2, tipe: "Aset Lancar" },
    { kategori: "Piutang Retensi", nilai: 120.5, tipe: "Aset Lancar" },
    { kategori: "Persediaan (WIP)", nilai: 310.8, tipe: "Aset Lancar" },
    { kategori: "Kas & Setara Kas", nilai: 185.9, tipe: "Aset Lancar" },
    { kategori: "Hutang Usaha (Vendor)", nilai: 580.4, tipe: "Liabilitas" },
    { kategori: "Hutang Bank Jangka Pendek", nilai: 350.0, tipe: "Liabilitas" },
    { kategori: "Hutang Pajak", nilai: 85.2, tipe: "Liabilitas" },
  ];

  const chartData = [
    { name: "Total Aset Lancar", value: 1067.4, fill: "#000075" },
    { name: "Total Liabilitas Lancar", value: 1015.6, fill: "#BD002F" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER NWC */}
      <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-lg font-black text-[#000075] flex items-center gap-2 uppercase">
            <Briefcase size={20} />
            Posisi Modal Kerja (Net Working Capital)
          </h2>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Pantauan kelancaran likuiditas proyek berdasarkan rasio aset lancar terhadap liabilitas lancar.
          </p>
        </div>
      </div>

      {/* DUA KOLOM: TABEL NWC & GRAFIK */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
        
        {/* KIRI: TABEL RINCIAN NWC */}
        <div className="w-full xl:w-[65%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Rincian Komponen NWC (Milyar Rupiah)
          </h3>
          
          <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Kategori Akun</th>
                  <th className="p-3 text-center">Tipe</th>
                  <th className="p-3 text-right">Nilai (M)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nwcData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold text-slate-700">{item.kategori}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.tipe === "Aset Lancar" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {item.tipe}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-slate-800">{item.nilai.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#000075] text-white">
                <tr>
                  <td className="p-3 font-bold uppercase" colSpan="2">Net Working Capital (NWC)</td>
                  <td className="p-3 text-right font-black text-sm">
                    {/* Ganti dengan hasil perhitungan riil */}
                    51.8 M
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* KANAN: GRAFIK KOMPARASI ASET VS LIABILITAS */}
        <div className="w-full xl:w-[35%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#BD002F]" />
            Komparasi NWC
          </h3>
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} label={{ position: 'top', fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}