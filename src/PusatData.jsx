import React, { useState, useRef } from "react";
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
} from "lucide-react";

import { useFilter } from "./context/FilterContext";
import * as XLSX from "xlsx";
import { supabase } from "./lib/supabase";
import RestrictedAccess from "./components/RestrictedAccess";

function PusatDataComponent() {

  // =========================================================
  // SIMULASI HAK AKSES
  // =========================================================

  const hasAccess = false;

  // =========================================================
  // RESTRICTED ACCESS
  // =========================================================

  if (!hasAccess) {
    return <RestrictedAccess />;
  }

  // =========================================================
  // STATE
  // =========================================================

  const [isUploading, setIsUploading] = useState(false);

  const [logLogs, setLogLogs] = useState([]);

  const { excelData, setExcelData } = useFilter();

  const fileInputRef = useRef(null);

  // =========================================================
  // DOWNLOAD TEMPLATE
  // =========================================================

  const downloadMasterTemplate = () => {
    const workbook = XLSX.utils.book_new();

    const sampleData = [
      {
        id_project: "PRJ-001",
        nama_project: "Pembangunan Jalan Tol",
        wilayah: "Jawa Tengah",
        progres: 75,
        deviasi: -3,
      },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sampleData),
      "db_pengendalian",
    );

    XLSX.writeFile(workbook, "db_pengendalian_template.xlsx");
  };

  // =========================================================
  // HANDLE UPLOAD
  // =========================================================

  const handleMasterUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      setLogLogs([
        "Memulai sinkronisasi database pengendalian proyek...",
      ]);

      const reader = new FileReader();

      reader.onload = async (evt) => {
        try {
          const bstr = evt.target.result;

          const wb = XLSX.read(bstr, {
            type: "binary",
          });

          // =================================================
          // CONTOH SHEET
          // =================================================

          const allSheets = {};

          wb.SheetNames.forEach((sheetName) => {
            const ws = wb.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(ws, {
              defval: "",
            });

            allSheets[sheetName] = jsonData;

            console.log("SHEET:", sheetName);

            console.log(jsonData);
          });

          // =================================================
          // SIMPAN KE STATE
          // =================================================

          setExcelData((prev) => {
            const prevRealisasi =
              prev["db_pengendalian_realisasi"] || [];

            const newRealisasi =
              allSheets["db_pengendalian_realisasi"] || [];

            // ambil periode upload

            const uploadPeriode =
              newRealisasi[0]?.periode;

            // hapus periode lama yang sama

            const filteredPrev = prevRealisasi.filter(
              (item) =>
                item.periode !== uploadPeriode,
            );

            // gabungkan

            const mergedRealisasi = [
              ...filteredPrev,
              ...newRealisasi,
            ];

            return {
              ...prev,
              ...allSheets,

              db_pengendalian_realisasi:
                mergedRealisasi,
            };
          });

          // =================================================
          // LOG
          // =================================================

          setLogLogs([
            "✅ Excel berhasil dibaca",

            `📄 Total Sheet: ${wb.SheetNames.length}`,

            ...wb.SheetNames.map(
              (s) => `📦 ${s}`,
            ),
          ]);

          console.log("FINAL DATA:", allSheets);

        } catch (err) {

          setLogLogs([
            `❌ Error membaca file : ${err.message}`,
          ]);

        } finally {

          setIsUploading(false);

        }
      };

      reader.readAsBinaryString(file);

    } catch (err) {

      setLogLogs([
        `❌ Error upload : ${err.message}`,
      ]);

      setIsUploading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-sans">

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">

        {/* HEADER */}

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">

          <div className="p-3 bg-blue-50 rounded-2xl text-[#000075]">

            <Database size={26} />

          </div>

          <div>

            <h2 className="text-2xl font-black text-slate-900">
              Pusat Data Pengendalian Proyek
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Upload database utama untuk seluruh dashboard monitoring
            </p>

          </div>
        </div>

        {/* CARD */}

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

          <div className="flex items-start justify-between mb-8">

            <div>

              <h3 className="font-black text-slate-800 text-3xl">
                Database Pengendalian
              </h3>

              <p className="text-emerald-600 text-base font-semibold mt-3">
                ● Modul Aktif
              </p>

            </div>

            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">

              <Database
                size={34}
                className="text-[#000075]"
              />

            </div>
          </div>

          <div className="flex justify-between text-base text-slate-500 mb-8">

            <span>1 Database Terhubung</span>

            <span>Updated Today</span>

          </div>

          {/* BUTTON */}

          <label className="w-full flex items-center justify-center gap-3 py-5 bg-[#000075] text-white text-xl font-bold rounded-3xl hover:bg-blue-900 transition-all cursor-pointer">

            <Upload size={24} />

            {isUploading
              ? "Uploading Database..."
              : "Upload Database"}

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleMasterUpload}
            />

          </label>

          {/* DOWNLOAD TEMPLATE */}

          <button
            onClick={downloadMasterTemplate}
            className="mt-5 w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-700 font-semibold"
          >

            <Download size={18} />

            Download Template Database

          </button>

        </div>

        {/* LOG */}

        {logLogs.length > 0 && (

          <div className="mt-6 p-4 bg-slate-900 rounded-2xl font-mono text-[12px] text-slate-300 space-y-2 shadow-inner">

            <p className="text-slate-500 font-bold border-b border-slate-800 pb-2 flex items-center gap-2">

              <CheckCircle2 size={14} />

              SYSTEM DATABASE LOG

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

export default PusatDataComponent;