import React, { useState, useRef } from "react";
import {
  Database,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Lock,
  Folders,
  Briefcase,
  LayoutGrid,
  ServerCog,
} from "lucide-react";
import { useFilter } from "./context/FilterContext";
import * as XLSX from "xlsx";
import RestrictedAccess from "./components/RestrictedAccess";
import { usePengendalianData } from "./hooks/usePengendalianData";
import MasterProjectList from "./components/MasterProjectList"; // Import komponen baru

function PusatDataComponent() {
  const hasAccess = true;

  if (!hasAccess) {
    return <RestrictedAccess />;
  }

  // =========================================================
  // SIMULASI AUTH & HAK AKSES UPLOAD
  // =========================================================
  const currentUserEmail = "vidi.handoko@waskita.co.id";

  // Cek apakah user adalah admin
  const isAdmin =
    currentUserEmail === "vidi.handoko@waskita.co.id" ||
    currentUserEmail === "admin@local.com";

  // MASTER SWITCH: Ubah ke `true` jika fitur upload sudah mau dinyalakan
  const isUploadFeatureActive = false;

  // Kondisi final apakah tombol bisa diklik atau tidak
  const canUpload = isUploadFeatureActive && isAdmin;

  // =========================================================
  // STATE & HOOKS
  // =========================================================
  const [isUploading, setIsUploading] = useState(false);
  const [logLogs, setLogLogs] = useState([]);
  const { excelData, setExcelData } = useFilter();
  const fileInputRef = useRef(null);

  const { unmappedProjects } = usePengendalianData();

  const exportUnmappedToExcel = () => {
    if (!unmappedProjects || unmappedProjects.length === 0) return;
    const dataToExport = unmappedProjects.map((p) => ({
      "ID Project": p.id,
      "Nama Project": p.name,
      "Ditemukan Pada File": p.sources,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = [{ wch: 25 }, { wch: 60 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unmapped_Projects");
    XLSX.writeFile(workbook, "Daftar_Project_Belum_Terdaftar.xlsx");
  };

  const handleMasterUpload = async (e, moduleName, dbName) => {
    if (!canUpload) {
      alert("Fitur upload sedang dikunci. Silakan upload via Supabase.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setLogLogs([
        `Memulai sinkronisasi tabel ${dbName} untuk modul ${moduleName}...`,
      ]);
    } catch (err) {
      setLogLogs([`❌ Error upload : ${err.message}`]);
      setIsUploading(false);
    }
  };

  // =========================================================
  // KONFIGURASI TOMBOL MODUL
  // =========================================================
  const uploadModules = [
    {
      title: "Master Data",
      icon: <Database size={24} className="text-blue-600" />,
      desc: "Database referensi (Master Project)",
      buttons: [{ label: "Upload db_master_data", id: "db_master_data" }],
    },
    {
      title: "Modul Operasional",
      icon: <Folders size={24} className="text-orange-600" />,
      desc: "Data teknis & pengendalian proyek",
      buttons: [
        { label: "Upload db_realisasi", id: "db_realisasi" },
        { label: "Upload db_rkap", id: "db_rkap" },
        { label: "Upload db_prognosa", id: "db_prognosa" },
      ],
    },
    {
      title: "Modul Commercial",
      icon: <Briefcase size={24} className="text-emerald-600" />,
      desc: "Data komersial & pemasaran",
      buttons: [
        { label: "Upload db_realisasi", id: "comm_realisasi" },
        { label: "Upload db_rkap", id: "comm_rkap" },
        { label: "Upload db_prognosa", id: "comm_prognosa" },
      ],
    },
    {
      title: "Modul Lainnya",
      icon: <LayoutGrid size={24} className="text-purple-600" />,
      desc: "Data pendukung departemen lain",
      buttons: [
        { label: "Upload db_realisasi", id: "other_realisasi" },
        { label: "Upload db_rkap", id: "other_rkap" },
        { label: "Upload db_prognosa", id: "other_prognosa" },
      ],
    },
  ];

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn font-sans pb-10">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        {/* HEADER UTAMA */}
        <div className="flex items-center justify-between pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-[#000075]">
              <ServerCog size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Pusat Data & Integrasi
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Validasi sinkronisasi dan manajemen berkas database
              </p>
            </div>
          </div>

          {/* STATUS UPLOAD INDICATOR */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
            {canUpload ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                <span className="text-xs font-bold text-slate-600">
                  Upload Active (Admin)
                </span>
              </>
            ) : (
              <>
                <Lock size={14} className="text-slate-400" />{" "}
                <span className="text-xs font-bold text-slate-500">
                  Upload Locked
                </span>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BLOK 1: AREA UPLOAD FILE (GRID MODUL) - DIPINDAH KE ATAS */}
        {/* ========================================================= */}
        <div className="mb-10 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Upload className="text-[#000075]" size={20} />
            <h2 className="text-xl font-black text-slate-800">
              Manajemen Upload Database
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadModules.map((module, mIdx) => (
              <div
                key={mIdx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                    {module.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {module.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 mb-5 ml-14">
                  {module.desc}
                </p>

                <div className="mt-auto space-y-3">
                  {module.buttons.map((btn, bIdx) => (
                    <label
                      key={bIdx}
                      className={`relative w-full flex items-center justify-between px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                        canUpload
                          ? "bg-white border-slate-200 text-slate-700 hover:border-[#000075] hover:text-[#000075] cursor-pointer shadow-sm hover:shadow-md"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {canUpload ? <Upload size={16} /> : <Lock size={16} />}
                        {btn.label}
                      </div>

                      {canUpload && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                          .xlsx / .csv
                        </span>
                      )}

                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        disabled={!canUpload}
                        onChange={(e) =>
                          handleMasterUpload(e, module.title, btn.id)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GARIS PEMISAH VISUAL ANTAR BLOK */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Monitoring & Validasi Master Data
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* ========================================================= */}
        {/* BLOK 2: AREA MONITORING & VALIDASI MASTER DATA */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* CARD VALIDASI MASTER DATA (Unmapped Projects) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="text-[#000075]" size={20} />
                Status Validasi ID Project
              </h2>
              {unmappedProjects && unmappedProjects.length > 0 && (
                <button
                  onClick={exportUnmappedToExcel}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <FileSpreadsheet size={16} />
                  Export Data Error
                </button>
              )}
            </div>

            {!unmappedProjects || unmappedProjects.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-800 text-lg">
                    Sinkronisasi 100% Valid
                  </h3>
                  <p className="text-sm text-emerald-600 mt-1">
                    Seluruh data transaksi dari Modul Operasional berhasil
                    dipetakan dengan Master Project.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                  <AlertTriangle className="w-7 h-7 text-red-600 mt-0.5 shrink-0 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-red-800 text-lg">
                      Ditemukan {unmappedProjects.length} Unmapped Project!
                    </h3>
                    <p className="text-sm text-red-600 mt-1 leading-relaxed">
                      Data di bawah ini ditemukan di file realisasi
                      (Operasional/Commercial) namun{" "}
                      <strong>ID-nya tidak terdaftar di Master Data</strong>.
                      Angka keuangannya akan diabaikan dari perhitungan utama.
                      Silakan tambahkan ke database Master Project.
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-y-auto max-h-[300px]">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 py-4 w-[25%] border-b border-slate-200">
                            ID Project
                          </th>
                          <th className="px-6 py-4 w-[55%] border-b border-slate-200">
                            Nama Project (Dari File)
                          </th>
                          <th className="px-6 py-4 w-[20%] text-center border-b border-slate-200">
                            Sumber Berkas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {unmappedProjects.map((proj, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-800 align-top break-words font-mono">
                              {proj.id}
                            </td>
                            <td className="px-6 py-4 align-top whitespace-normal break-words leading-relaxed">
                              {proj.name}
                            </td>
                            <td className="px-6 py-4 text-center align-top">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                                {proj.sources}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DAFTAR MASTER PROJECT & FILTER STATUS (Termasuk Peringatan Koordinat) */}
          <MasterProjectList />
        </div>

        {/* ========================================================= */}
        {/* LOG SYSTEM */}
        {/* ========================================================= */}
        {logLogs.length > 0 && (
          <div className="mt-8 p-5 bg-slate-900 rounded-3xl font-mono text-[13px] text-slate-300 space-y-2 shadow-inner">
            <p className="text-slate-500 font-bold border-b border-slate-800 pb-3 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} />
              SYSTEM DATABASE LOG
            </p>
            {logLogs.map((log, i) => (
              <p key={i} className="leading-relaxed">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PusatDataComponent;
