import React, { useState } from "react";
import { Layers, PieChart as PieIcon, Calculator } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function PiutangKategori() {
  // State untuk mengontrol Lembar Kerja Kategori yang Aktif
  const [activeSubTab, setActiveSubTab] = useState("owner");

  // DATA SUMMARY RESUME PIUTANG KATEGORI (Milyar)
  const categorySummary = [
    { id: "owner", name: "Klaster Owner (Pemerintah/BUMN)", total: 1030.5, proyekActive: 3, color: "#000075" },
    { id: "pengembangan", name: "Pengembangan Bisnis", total: 547.0, proyekActive: 2, color: "#00A4EF" },
    { id: "non_pengembangan", name: "Non-Pengembangan Bisnis", total: 285.8, proyekActive: 2, color: "#64748b" },
    { id: "pdpk", name: "PDPK (Penanganan Khusus)", total: 236.2, proyekActive: 2, color: "#BD002F" },
  ];

  // DATA DETAIL LEMBAR KERJA DENGAN BREAKDOWN FINANSIAL (Dalam Milyar)
  const detailLembarKerja = {
    owner: [
      { no: 1, proyek: "Probolinggo-Banyuwangi Pkt 3", piutang: 366.2, retensi: 62.5, bruto: 236.2, total: 664.9, umur: "0-30 hari", kendala: "Pekerjaan tanah dalam review MC100." },
      { no: 2, proyek: "Bendungan Jragung Paket 1", piutang: 68.8, retensi: 3.9, bruto: 112.6, total: 185.3, umur: "> 90 hari", kendala: "Proses amandemen nilai kontrak tambahan." },
      { no: 3, proyek: "Irigasi Belitang Lempuing Pkt 2", piutang: 52.1, retensi: 42.7, bruto: 85.5, total: 180.3, umur: "> 180 hari", kendala: "Verifikasi dokumen pembayaran oleh PPK." },
    ],
    pengembangan: [
      { no: 1, proyek: "Tol Ciawi Sukabumi Seksi 3A", piutang: 66.5, retensi: 33.5, bruto: 136.2, total: 236.2, umur: "30-90 hari", kendala: "Proses kelengkapan backup fisik konsultan." },
      { no: 2, proyek: "Tol Ciawi Sukabumi Seksi 3B", piutang: 115.0, retensi: 45.8, bruto: 150.0, total: 310.8, umur: "30-90 hari", kendala: "Administrasi penagihan termin awal." },
    ],
    non_pengembangan: [
      { no: 1, proyek: "Perbaikan Jalan Tol KAPB", piutang: 35.0, retensi: 15.5, bruto: 55.0, total: 105.5, umur: "> 180 hari", kendala: "Dispute sharing dana dengan member KSO." },
      { no: 2, proyek: "Struktur Jembatan Musi", piutang: 68.0, retensi: 42.3, bruto: 70.0, total: 180.3, umur: "> 360 hari", kendala: "Menunggu pencairan anggaran daerah." },
    ],
    pdpk: [
      { no: 1, proyek: "Proyek Infrastruktur Lama X (Dispute)", piutang: 50.0, retensi: 30.0, bruto: 70.0, total: 150.0, umur: "> 360 hari", kendala: "Sedang dalam tahap mediasi hukum/arbitrase." },
      { no: 2, proyek: "Proyek Y (Klaim Kontraktor)", piutang: 26.2, retensi: 20.0, bruto: 40.0, total: 86.2, umur: "> 360 hari", kendala: "Proses verifikasi ulang dokumen opname fisik." },
    ],
  };

  const activeData = detailLembarKerja[activeSubTab] || [];

  // Hitung total keseluruhan untuk baris paling bawah (Footer Tabel Lembar Kerja)
  const totalPiutangSub = activeData.reduce((sum, item) => sum + item.piutang, 0);
  const totalRetensiSub = activeData.reduce((sum, item) => sum + item.retensi, 0);
  const totalBrutoSub = activeData.reduce((sum, item) => sum + item.bruto, 0);
  const totalJumlahSub = activeData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      
      {/* =========================================
          SISI ATAS: RESUME KATEGORI (GRID & PIE CHART)
          ========================================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        
        {/* KIRI: KARTU SUMMARY TOTAL PIUTANG PER KATEGORI */}
        <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categorySummary.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                activeSubTab === item.id 
                  ? "bg-white shadow-md scale-[1.02] border-l-8" 
                  : "bg-slate-50/60 hover:bg-white hover:shadow-sm border-slate-200"
              }`}
              style={{ borderLeftColor: item.color }}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Kategori Klasifikasi
                </span>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-snug">
                  {item.name}
                </h4>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">
                  {item.total.toLocaleString("id-ID", { minimumFractionDigits: 1 })} <span className="text-xs font-bold text-slate-400">M</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                  {item.proyekActive} Proyek
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* KANAN: PIE CHART PROPORSI PIUTANG KATEGORI */}
        <div className="w-full lg:w-[40%] bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between min-h-[220px]">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <PieIcon size={14} className="text-[#000075]" />
            Komposisi Portofolio Piutang
          </h3>
          <div className="flex-1 w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySummary}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString("id-ID")} M`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend Mini Custom */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-[9px] font-bold text-slate-500">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#000075]"/> Owner</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00A4EF]"/> Peng. Bisnis</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#64748b]"/> Non-Peng.</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#BD002F]"/> PDPK</div>
          </div>
        </div>
      </div>

      {/* =========================================
          SISI BAWAH: DATA SHEET / LEMBAR KERJA AKTIF
          ========================================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 w-full">
        {/* Navigasi Mini ala Lembar Kerja Excel */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#000075]" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Lembar Kerja: {categorySummary.find(c => c.id === activeSubTab)?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <Calculator size={14} className="text-slate-400" />
            <span>Satuan: Milyar Rupiah (M)</span>
          </div>
        </div>

        {/* Struktur Tabel Rincian Lembar Kerja */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto text-[11px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12 border-r border-slate-200">No</th>
                <th className="p-3 w-64 border-r border-slate-200">Nama Proyek Kontraktor</th>
                <th className="p-3 text-right border-r border-slate-200 bg-red-50/30 text-red-900">Piutang (Termin)</th>
                <th className="p-3 text-right border-r border-slate-200 bg-blue-50/30 text-blue-900">Piutang Retensi</th>
                <th className="p-3 text-right border-r border-slate-200 bg-emerald-50/30 text-emerald-900">Tagihan Bruto (WIP)</th>
                <th className="p-3 text-right border-r border-slate-200 bg-slate-100/50 font-bold text-slate-900">Jumlah Total</th>
                <th className="p-3 text-center border-r border-slate-200 w-24">Klaster Umur</th>
                <th className="p-3 pl-4">Kendala Utama / Rencana Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {activeData.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-center font-mono text-slate-400 border-r border-slate-200">{row.no}</td>
                  <td className="p-3 font-bold text-slate-800 border-r border-slate-200">{row.proyek}</td>
                  <td className="p-3 text-right font-mono text-red-600 border-r border-slate-200">{row.piutang.toFixed(1)}</td>
                  <td className="p-3 text-right font-mono text-blue-600 border-r border-slate-200">{row.retensi.toFixed(1)}</td>
                  <td className="p-3 text-right font-mono text-emerald-600 border-r border-slate-200">{row.bruto.toFixed(1)}</td>
                  <td className="p-3 text-right font-mono font-black text-slate-900 border-r border-slate-200 bg-slate-50/40">{row.total.toFixed(1)}</td>
                  <td className="p-3 text-center border-r border-slate-200">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      row.umur.includes('0-30') ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {row.umur}
                    </span>
                  </td>
                  <td className="p-3 pl-4 text-slate-500 italic max-w-xs truncate" title={row.kendala}>
                    {row.kendala}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* FOOTER TOTAL OTOMATIS PER LEMBAR KERJA */}
            <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="p-3 text-center border-r border-slate-200" colSpan="2">TOTAL</td>
                <td className="p-3 text-right font-mono text-red-700 border-r border-slate-200">{totalPiutangSub.toFixed(1)}</td>
                <td className="p-3 text-right font-mono text-blue-700 border-r border-slate-200">{totalRetensiSub.toFixed(1)}</td>
                <td className="p-3 text-right font-mono text-emerald-700 border-r border-slate-200">{totalBrutoSub.toFixed(1)}</td>
                <td className="p-3 text-right font-mono text-slate-900 border-r border-slate-200 bg-slate-200/50">{totalJumlahSub.toFixed(1)}</td>
                <td className="p-3 border-r border-slate-200" colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}