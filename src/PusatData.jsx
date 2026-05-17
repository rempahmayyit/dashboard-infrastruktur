import React, { useState } from "react";
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "./lib/supabase";

function PusatDataComponent() {
  const [isUploading, setIsUploading] = useState(false);
  const [logLogs, setLogLogs] = useState([]);

  const downloadMasterTemplate = () => {
    const workbook = XLSX.utils.book_new();

    // ================= EXECUTIVE =================
    const executiveData = [
      { month: "Jan", rencana: 100, realisasi: 120 },
      { month: "Feb", rencana: 150, realisasi: 140 },
    ];

    // ================= NKB PROJECT =================
    const nkbProjectData = [
      {
        id: "NKB-001",
        name: "Nama Proyek",
        divisi: "Infra 1",
        nilai: "120 M",
        tgl: "Jan 2026",
      },
    ];

    // ================= MARKET PIPELINE =================
    const pipelineData = [
      {
        id: "TND-01",
        paket: "Paket Tender",
        owner: "Kementerian",
        nilai: "500 M",
        status: "Evaluasi",
      },
    ];

    // ================= PROJECT PROGRESS =================
    const progressData = [
      {
        id: "1323042",
        name: "Nama Proyek",
        rencana: 80,
        realisasi: 75,
        deviasi: -5,
        lkDeviasi: "-20 M",
        bim: "Comply",
      },
    ];

    // ================= AGING INVOICE =================
    const agingData = [
      {
        id: "1323042",
        name: "Nama Proyek",
        day0_60: "10 M",
        day60_180: "5 M",
        day180: "2 M",
        total: "17 M",
        kolektibilitas: "Lancar",
      },
    ];

    // ================= COST OVERRUN =================
    const costOverrunData = [
      {
        name: "Nama Proyek",
        prog: "50%",
        mapp: "90%",
        real: "110%",
        dev: "-20%",
      },
    ];

    // ================= TIME OVERRUN =================
    const timeOverrunData = [
      {
        name: "Nama Proyek",
        prog: "75%",
        endDate: "31-Dec-26",
        remain: "120",
      },
    ];

    // ================= CASHFLOW =================
    const cashflowData = [
      {
        kategori: "Saldo Awal",
        nilai: 1000,
      },
      {
        kategori: "Cash In",
        nilai: 500,
      },
      {
        kategori: "Cash Out",
        nilai: 300,
      },
    ];

    // ================= CLAIM KPI =================
    const claimKpiData = [
      {
        status: "Approved",
        value: 5,
      },
      {
        status: "Negotiation",
        value: 3,
      },
    ];

    // ================= WARM MATRIX =================
    const warmMatrixData = [
      {
        risiko: "Keterlambatan",
        score: 16,
        level: "High",
      },
    ];

    // ================= SDM LEVEL =================
    const sdmLevelData = [
      {
        level: "BOD-1",
        jumlah: 1,
      },
    ];

    // ================= SDM GENERASI =================
    const sdmGenerasiData = [
      {
        name: "Gen Y",
        value: 77,
      },
    ];

    // ================= SDM USIA =================
    const sdmUsiaData = [
      {
        range: "26-35",
        jumlah: 519,
      },
    ];

    // ================= NCR =================
    const ncrData = [
      {
        name: "Beton",
        ncr: 11,
      },
    ];

    // ================= K3L =================
    const k3lData = [
      {
        month: "Jan",
        nearmiss: 2,
        fac: 1,
      },
    ];

    // ================= PROJECT MAP =================
    const projectMapData = [
      {
        id: "PRJ-001",
        name: "Nama Proyek",
        x: 50,
        y: 30,
        gap: "Delay",
        status: "Critical",
      },
    ];

    // ================= SDM =================
    const sdmData = [
      {
        kategori: "Kantor",
        jumlah: 206,
      },
      {
        kategori: "Proyek",
        jumlah: 848,
      },
    ];

    // ================= LEGAL RISK =================
    const riskData = [
      {
        no: 1,
        risiko: "Keterlambatan Proyek",
        tingkat: "Tinggi",
        score: 16,
      },
    ];

    // ================= BIM =================
    const bimData = [
      {
        name: "Comply",
        value: 20,
      },
      {
        name: "Not Comply",
        value: 1,
      },
    ];

    // ================= APPEND SHEETS =================

    // Executive
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(executiveData),
      "Executive PU",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(executiveData),
      "Executive LK",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(executiveData),
      "Executive BKPU",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(executiveData),
      "Executive LB",
    );

    // Project
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(nkbProjectData),
      "NKB Project",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(pipelineData),
      "Marketing Pipeline",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(progressData),
      "Project Progress",
    );

    // Finance
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(agingData),
      "Aging Invoice",
    );

    // SDM
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sdmData),
      "SDM Pegawai",
    );

    // Legal
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(riskData),
      "Legal Risk",
    );

    // Teknik
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(bimData),
      "Teknik BIM",
    );

    // COST OVERRUN
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(costOverrunData),
      "Cost Overrun",
    );

    // TIME OVERRUN
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(timeOverrunData),
      "Time Overrun",
    );

    // CASHFLOW
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(cashflowData),
      "Cashflow",
    );

    // CLAIM KPI
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(claimKpiData),
      "Claim KPI",
    );

    // WARM MATRIX
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(warmMatrixData),
      "WaRM Matrix",
    );

    // SDM LEVEL
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sdmLevelData),
      "SDM Level",
    );

    // SDM GENERASI
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sdmGenerasiData),
      "SDM Generasi",
    );

    // SDM USIA
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sdmUsiaData),
      "SDM Usia",
    );

    // NCR
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(ncrData),
      "NCR",
    );

    // K3L
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(k3lData),
      "K3L Trend",
    );

    // PROJECT MAP
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(projectMapData),
      "Project Map",
    );

    XLSX.writeFile(workbook, "Master_Template_Seluruh_Modul_Waskita.xlsx");
  };

  const handleMasterUpload = async (e) => {
    const file = e.target.files;
    if (!file || file.length === 0) return;

    setIsUploading(true);
    setLogLogs(["Memulai ekstraksi master berkas..."]);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });

        const targetSheets = [
          // ================= EXECUTIVE =================
          { name: "Executive PU", table: "tren_keuangan", key: "month" },
          { name: "Executive LK", table: "tren_laba_kotor", key: "month" },
          { name: "Executive BKPU", table: "tren_bk_pu", key: "month" },
          { name: "Executive LB", table: "tren_laba_bersih", key: "month" },

          // ================= PEMASARAN =================
          { name: "NKB Project", table: "nkb_project", key: "id" },
          {
            name: "Marketing Pipeline",
            table: "marketing_pipeline",
            key: "id",
          },

          // ================= PROJECT =================
          { name: "Project Progress", table: "project_progress", key: "id" },
          { name: "Time Overrun", table: "project_progress", key: "name" },

          // ================= FINANCE =================
          { name: "Aging Invoice", table: "aging_invoice", key: "id" },

          // ================= SDM =================
          { name: "SDM Pegawai", table: "sdm_pegawai", key: "kategori" },

          // ================= LEGAL =================
          { name: "Legal Risk", table: "legal_risk", key: "no" },

          // ================= TEKNIK =================
          { name: "Teknik BIM", table: "teknik_bim", key: "name" },
        ];

        let summary = [];
        for (const sheet of targetSheets) {
          if (wb.SheetNames.includes(sheet.name)) {
            const ws = wb.Sheets[sheet.name];
            let data = XLSX.utils.sheet_to_json(ws);

            if (sheet.name === "Time Overrun") {
              data = data.map((row) => ({
                ...row,
                endDate: row.endDate,
              }));
            }

            const { error } = await supabase
              .from(sheet.table)
              .upsert(data, { onConflict: sheet.key });
            if (!error)
              summary.push(
                `✅ Sheet [${sheet.name}] berhasil disinkronkan ke Supabase.`,
              );
            else
              summary.push(`❌ Sheet [${sheet.name}] gagal: ${error.message}`);
          }
        }
        setLogLogs(summary);
        window.location.reload();
      } catch (err) {
        setLogLogs([`❌ Gagal memproses berkas master: ${err.message}`]);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsBinaryString(file[0]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-[#000075]">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Pusat Integrasi & Sinkronisasi Data Awan
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Satu pintu pembaruan data untuk seluruh modul portofolio eksekutif
              Waskita
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* GRID MODUL INTEGRASI */}
        {/* ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* EXECUTIVE DASHBOARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Executive Dashboard
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Database size={24} className="text-[#000075]" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>1 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-[#000075] text-white font-semibold rounded-2xl hover:bg-blue-900 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "executive_dashboard")}
              />
            </label>
          </div>

          {/* PEMASARAN & ANGGARAN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Pemasaran & Anggaran
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Database size={24} className="text-emerald-600" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>3 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "marketing_anggaran")}
              />
            </label>
          </div>

          {/* PENGENDALIAN PROYEK */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Pengendalian Proyek
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Database size={24} className="text-[#000075]" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>2 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-[#000075] text-white font-semibold rounded-2xl hover:bg-blue-900 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "pengendalian_proyek")}
              />
            </label>
          </div>

          {/* KEUANGAN & AKUNTANSI */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Keuangan & Akuntansi
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Database size={24} className="text-amber-600" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>2 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-amber-500 text-white font-semibold rounded-2xl hover:bg-amber-600 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "keuangan_akuntansi")}
              />
            </label>
          </div>

          {/* TEKNIK MUTU & K3L */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Teknik, Mutu & K3L
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <Database size={24} className="text-red-600" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>1 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "teknik_mutu_k3")}
              />
            </label>
          </div>

          {/* LEGAL & MANRISK */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">
                  Legal & Manrisk
                </h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
                <Database size={24} className="text-violet-600" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>1 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-violet-600 text-white font-semibold rounded-2xl hover:bg-violet-700 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "legal_manrisk")}
              />
            </label>
          </div>

          {/* SDM & UMUM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">SDM & Umum</h3>

                <p className="text-emerald-600 text-sm font-semibold mt-2">
                  ● Modul Aktif
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Database size={24} className="text-slate-700" />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <span>1 Sheet Terhubung</span>
              <span>Updated Today</span>
            </div>

            <label className="w-full flex items-center justify-center gap-3 py-4 bg-slate-700 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all cursor-pointer">
              <Upload size={18} />
              Upload Modul
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleModuleUpload(e, "sdm_umum")}
              />
            </label>
          </div>
        </div>

        {logLogs.length > 0 && (
          <div className="mt-6 p-4 bg-slate-900 rounded-xl font-mono text-[11px] text-slate-300 space-y-1.5 shadow-inner">
            <p className="text-slate-500 font-bold border-b border-slate-800 pb-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> SYSTEM INTEGRITY SYNC LOG:
            </p>
            {logLogs.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// STRATEGI KUNCIAN EKSPOR DEFINITIF UNTUK MENGHILANGKAN SYNTAX ERROR VITE
export default PusatDataComponent;
