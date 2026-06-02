import React, { useState } from "react";
import ModuleOverlay from "./components/ModuleOverlay";

function PdpkMonitoring() {
  // Data Riil Berdasarkan Laporan Piutang Bermasalah Dokumen Lampiran Resmi
  const pdpkData = [
    {
      no: 1,
      project: "Proyek Jalan 3 Ruas Kab. Boalemo",
      owner: "Dinas Pekerjaan Umum Kab. Boalemo",
      source: "APBD",
      wip: "-",
      pu: "-",
      piutang: "1.304",
      retensi: "1.304",
      total: "1.304",
      status: "Arbitrase Inkracht",
      issue: "Belum tersedianya Anggaran APBD Tahun 2026",
      update: "Telah terbit Putusan BANI No. 46035/VIII/ARB-BANI/2023. Dinas PU Boalemo wajib membayar retensi & ganti rugi total ±Rp2,816 M. Waskita telah mengirimkan surat reminder pelaksanaan putusan ke-4 pada 19 Mei 2025 dan somasi melalui Lawyer Sequoia pada Desember 2025."
    },
    {
      no: 2,
      project: "Pembangunan Graving Dock & Dermaga Noahtu Lampung",
      owner: "PT. Daya Radar Utama / The Capitol Group",
      source: "Swasta",
      wip: "-",
      pu: "4.612",
      piutang: "-",
      retensi: "4.612",
      total: "4.612",
      status: "Proses PKPU / Homologasi",
      issue: "Keterbatasan kemampuan pembayaran akibat tekanan keuangan internal",
      update: "Telah terbit Surat Putusan Homologasi No. 346/Pdt.Sus-PKPU/2022. Pembayaran pertama 30 Maret 2026 sebesar Rp1,97 M telah dibayar. Terus melakukan komunikasi aktif untuk menagih pembayaran kedua yang jatuh tempo pada 30 Maret 2027."
    },
    {
      no: 3,
      project: "Proyek Pembangunan Jakarta Monorail",
      owner: "PT. Jakarta Monorail",
      source: "Swasta",
      wip: "-",
      pu: "5.102",
      piutang: "-",
      retensi: "5.102",
      total: "5.102",
      status: "Mediasi & Gugatan Pemprov",
      issue: "Kesulitan likuiditas parah & kelayakan proyek diragukan",
      update: "Berita Acara Pengakuan Hutang Rp5,1 M disepakati lewat mediasi KBUMN 2023. Realisasi masih nihil karena bergantung penjualan aset. Saat ini PT JM sedang menggugat Pemprov DKI di BANI, hasilnya diharapkan jadi sumber dana bayar Waskita."
    },
    {
      no: 4,
      project: "Iglas, PT",
      owner: "PT. Iglas (Persero)",
      source: "BUMN",
      wip: "-",
      pu: "7.019",
      piutang: "-",
      retensi: "7.019",
      total: "7.019",
      status: "Pailit (Proses Kurator)",
      issue: "Owner bangkrut/pailit",
      update: "Pembayaran tahap pertama Rp62,3 Juta telah diterima pada 29 Oktober 2025. Proses pembayaran selanjutnya sepenuhnya menunggu keberhasilan penjualan aset tidak bergerak milik PT Iglas oleh kurator."
    },
    {
      no: 5,
      project: "Bendung Batang Asai",
      owner: "SNVT Jaringan Pemanfaatan Air Sumatera VI",
      source: "APBN",
      wip: "2.678",
      pu: "-",
      piutang: "306",
      retensi: "2.983",
      total: "2.983",
      status: "Usulan Penghapusan",
      issue: "Proyek gagal berjalan total karena masalah sengketa lahan (Lahan 0%) hingga kontrak diputus Jan 2015",
      update: "Terjadi kesalahan pembukuan lama sesuai surat pernyataan PM tanggal 08 November 2019. Status direkomendasikan untuk pembersihan neraca buku melalui usulan penghapusan piutang."
    },
    {
      no: 6,
      project: "SOR Buton Utara",
      owner: "Dinas Pekerjaan Umum Kab. Buton Utara",
      source: "APBD",
      wip: "4.590",
      pu: "-",
      piutang: "-",
      retensi: "-",
      total: "4.590",
      status: "Usulan Penghapusan",
      issue: "Pekerjaan dilakukan sepihak di lapangan tanpa adanya Surat Instruksi (SI) resmi",
      update: "Kesalahan pembukuan internal sebelum progress fisik diakui secara sah oleh pemilik proyek. Diajukan ke komite untuk usulan penghapusan."
    },
    {
      no: 7,
      project: "Jalan Cilegon Pasauran",
      owner: "PT. Istaka Karya (Persero)",
      source: "BUMN",
      wip: "1.813",
      pu: "5.979",
      piutang: "-",
      retensi: "-",
      total: "7.792",
      status: "Usulan Penghapusan",
      issue: "BUMN Istaka Karya dinyatakan pailit oleh pengadilan sejak 2022",
      update: "Berdasarkan Putusan Kepailitan No: 26/Pdt.Sus-Pembatalan Perdamaian/2022/PN.Niaga.Jkt.Pst. Penagihan langsung sudah tidak memungkinkan, masuk usulan penghapusan."
    },
    {
      no: 8,
      project: "New Consulate Compound (NCC) Surabaya",
      owner: "First Kuwaiti Trading and Contracting Co. (FKTC)",
      source: "Swasta",
      wip: "-",
      pu: "1.871",
      piutang: "1.319",
      retensi: "-",
      total: "3.191",
      status: "Usulan Penghapusan",
      issue: "Main kontraktor asing (FKTC) menutup operasionalnya dan keluar dari Indonesia",
      update: "Waskita bertindak sebagai subkontraktor. Somasi hukum resmi telah dilayangkan pada Oktober 2022 namun tidak mendapat respons/jawaban. Diusulkan hapus buku."
    }
  ];

  // State untuk filter tab status di dashboard
  const [activeTab, setActiveTab] = useState("SEMUA");

  const filteredData = activeTab === "SEMUA" 
    ? pdpkData 
    : pdpkData.filter(item => item.status.includes(activeTab) || (activeTab === "PENGHAPUSAN" && item.status === "Usulan Penghapusan"));

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* 1. ATAS: RINGKASAN METRIK UTAMA (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Kasus PDPK</span>
          <div className="text-2xl font-black text-gray-800 mt-1">8 Proyek</div>
          <p className="text-[10px] text-gray-400 mt-1">Divisi Infrastruktur </p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Nilai Buku Macet</span>
          <div className="text-2xl font-black text-red-500 mt-1">36.57 M</div>
          <p className="text-[10px] text-amber-600 mt-1">⚠️ Membutuhkan Cadangan Kerugian</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Status Inkaso Hukum</span>
          <div className="text-2xl font-black text-blue-600 mt-1">4 Proyek</div>
          <p className="text-[10px] text-slate-500 mt-1">BANI, PKPU & Mediasi Aktif</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Rekomendasi Komite</span>
          <div className="text-2xl font-black text-slate-700 mt-1">4 Proyek</div>
          <p className="text-[10px] text-gray-400 mt-1">Usulan Penghapusan (Write-off)</p>
        </div>
      </div>

      {/* 2. TENGAH: FILTER STRATEGI PENYELESAIAN */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
          {["SEMUA", "Arbitrase", "PKPU", "PENGHAPUSAN"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                activeTab === tab 
                  ? "bg-[#0B1936] text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab === "PENGHAPUSAN" ? "Usulan Penghapusan" : tab}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
          Cut-Off : 19 Mei 2026
        </span>
      </div>

      {/* 3. BAWAH: TABEL MONITORING UTAMA MONITORING PDPK */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Matriks Log Pengawasan Proyek Penanganan Khusus</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Daftar piutang bermasalah, kronologis sengketa hukum, dan aksi recovery korporat</p>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-[11px] text-left border-collapse min-w-[1250px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold text-[10px] tracking-wider uppercase">
                <th className="p-3 text-center w-10">NO</th>
                <th className="p-3 min-w-[220px]">Informasi Proyek / Debitur</th>
                <th className="p-3 text-center w-16">Dana</th>
                <th className="p-3 text-right w-16">WIP</th>
                <th className="p-3 text-right w-16">Piutang</th>
                <th className="p-3 text-right w-16">Retensi</th>
                <th className="p-3 text-right w-20 text-red-700 bg-red-50/40 font-black">Total (M)</th>
                <th className="p-3 text-center w-36">Strategi / Status</th>
                <th className="p-3 min-w-[320px]">Akar Masalah & Update Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, index) => {
                const isWriteOff = row.status === "Usulan Penghapusan";
                
                return (
                  <tr key={index} className="hover:bg-slate-50/40 transition-colors align-top group">
                    {/* Nomor */}
                    <td className="p-3.5 text-center text-gray-400 font-medium">{row.no}</td>
                    
                    {/* Nama Proyek */}
                    <td className="p-3.5">
                      <div className="font-bold text-gray-800 leading-snug group-hover:text-blue-900 transition-colors">{row.project}</div>
                      <div className="text-[10px] text-gray-400 mt-1 font-medium">{row.owner}</div>
                    </td>
                    
                    {/* Sumber Dana */}
                    <td className="p-3.5 text-center">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                        row.source === "APBN" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        row.source === "APBD" ? "bg-purple-50 text-purple-700 border-purple-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {row.source}
                      </span>
                    </td>
                    
                    {/* Angka Keuangan */}
                    <td className="p-3.5 text-right font-mono text-gray-400">{row.wip}</td>
                    <td className="p-3.5 text-right font-mono text-gray-400">{row.piutang}</td>
                    <td className="p-3.5 text-right font-mono text-gray-400">{row.retensi}</td>
                    <td className="p-3.5 text-right font-mono font-black bg-red-50/10 text-red-600 pr-4">{row.total}</td>
                    
                    {/* Badge Status Hukum */}
                    <td className="p-3.5 text-center">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold block border ${
                        isWriteOff 
                          ? "bg-gray-100 text-gray-500 border-gray-200" 
                          : "bg-red-50 text-red-700 border-red-100 animate-pulse"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    
                    {/* Rincian Masalah & Update Kronologi */}
                    <td className="p-3.5 text-gray-600 leading-relaxed text-[10.5px]">
                      <div className="mb-1.5">
                        <span className="font-bold text-amber-700 bg-amber-50/60 text-[9.5px] px-1 py-0.2 rounded border border-amber-100 mr-1">MASALAH:</span>
                        {row.issue}
                      </div>
                      <div className="border-t border-gray-100 pt-1.5 mt-1.5">
                        <span className="font-bold text-emerald-700 bg-emerald-50/60 text-[9.5px] px-1 py-0.2 rounded border border-emerald-100 mr-1">LOG UPDATE:</span>
                        <span className="text-gray-500">{row.update}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ModuleOverlay/>
      </div>
      
    </div>
  );
  
}

export default PdpkMonitoring;
