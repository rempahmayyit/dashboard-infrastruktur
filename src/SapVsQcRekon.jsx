import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Search,
} from "lucide-react";
import { usePengendalianData } from "./hooks/usePengendalianData"; // Sesuaikan path jika berbeda
import { useFilter } from "./context/FilterContext"; // Sesuaikan path jika berbeda

export default function RealisasiSapTable() {
  // Panggil data hasil kalkulasi dari hook
  const { rekonsiliasiTableData } = usePengendalianData();
  const { dataStatus } = useFilter();

  // State untuk Search dan Toggle JO/JOI
  const [searchTerm, setSearchTerm] = useState("");
  const [showJoJoi, setShowJoJoi] = useState(true); // true = Tampilkan Semua, false = Hanya Non JO/JOI

  // Helper Format Angka Full Amount (Rupiah Standard)
  const formatFullAmount = (val) => {
    const num = Number(val);
    if (!num || num === 0) return "-";
    // Jika minus, pakai format (X.XXX.XXX)
    if (num < 0) return `(${Math.abs(num).toLocaleString("id-ID")})`;
    return num.toLocaleString("id-ID");
  };

  // Helper khusus Deviasi agar UI lebih intuitif
  const renderDeviasiCell = (val) => {
    const num = Number(val);
    if (!num || num === 0)
      return <span className="text-slate-300 font-normal">-</span>;
    if (num < 0) {
      return (
        <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
          ({Math.abs(num).toLocaleString("id-ID")})
        </span>
      );
    }
    return (
      <span className="text-slate-700 font-semibold">
        {num.toLocaleString("id-ID")}
      </span>
    );
  };

  // Helper untuk render lencana (badge) status yang cantik
  const renderBadge = (ket) => {
    const text = ket?.toLowerCase() || "";
    if (text.includes("sinkron")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle2 size={12} /> {ket}
        </span>
      );
    }
    if (text.includes("deviasi")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider">
          <AlertCircle size={12} /> {ket}
        </span>
      );
    }
    if (text.includes("review")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold uppercase tracking-wider">
          <AlertTriangle size={12} /> {ket}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
        <Info size={12} /> {ket}
      </span>
    );
  };

  // FILTERING DATA: Berdasarkan Search Box dan Toggle JO/JOI
  const filteredData = useMemo(() => {
    if (!rekonsiliasiTableData) return [];

    return rekonsiliasiTableData.filter((row) => {
      // 1. Logika Pencarian (Search by Project Name atau ID)
      const matchesSearch =
        row.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id?.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Logika Filter JO / JOI
      // Asumsi: Kita mengecek dari nama project. Jika punya field khusus (misal: row.tipe_proyek), silakan disesuaikan.
      const kategori = String(row.nonjo_joi || "")
        .trim()
        .toUpperCase();

      const isJoOrJoi = kategori === "JOI";

      const matchesJoJoi = showJoJoi ? true : !isJoOrJoi;

      return matchesSearch && matchesJoJoi;
    });
  }, [rekonsiliasiTableData, searchTerm, showJoJoi]);

  // KALKULASI SUMMARY (TOTAL) DARI DATA YANG SUDAH DI-FILTER
  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => ({
        nk: acc.nk + (Number(row.nk) || 0),
        qc_pu: acc.qc_pu + (Number(row.qc_pu) || 0),
        qc_bk: acc.qc_bk + (Number(row.qc_bk) || 0),
        sap_pu: acc.sap_pu + (Number(row.sap_pu) || 0),
        sap_bk: acc.sap_bk + (Number(row.sap_bk) || 0),
        dev_pu: acc.dev_pu + (Number(row.dev_pu) || 0),
        dev_bk: acc.dev_bk + (Number(row.dev_bk) || 0),
      }),
      { nk: 0, qc_pu: 0, qc_bk: 0, sap_pu: 0, sap_bk: 0, dev_pu: 0, dev_bk: 0 },
    );
  }, [filteredData]);

  // State loading atau empty
  if (!rekonsiliasiTableData || rekonsiliasiTableData.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center text-slate-500 flex flex-col items-center">
        <RefreshCw size={24} className="animate-spin text-blue-500 mb-3" />
        <p>Memuat / Mengkalkulasi Data Rekonsiliasi...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* HEADER CARD */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
            <RefreshCw size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
              Rekonsiliasi Data SAP vs Quick Count
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring anomali dan sinkronisasi realisasi keuangan proyek
              (YTD)
            </p>
          </div>
        </div>

        {/* Action Section (Search, Toggle, Status) */}
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          {/* Toggle Non JO & JOI */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg h-[42px]">
            <span className="text-xs font-semibold text-slate-600">
              Tampilkan JOI
            </span>
            <button
              onClick={() => setShowJoJoi(!showJoJoi)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${showJoJoi ? "bg-blue-600" : "bg-slate-300"}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${showJoJoi ? "translate-x-4.5" : "translate-x-1"}`}
                style={{
                  transform: showJoJoi ? "translateX(18px)" : "translateX(4px)",
                }}
              />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari Proyek / ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2.5 h-[42px] outline-none transition-all"
            />
          </div>

          {/* Data Status Badge */}
          <div className="flex flex-col items-end justify-center bg-slate-50 border border-slate-200 px-3 rounded-lg h-[42px] min-w-[120px]">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Data Status
            </div>
            <div className="text-xs font-black text-slate-700">
              {dataStatus
                ? `${dataStatus.type} - ${dataStatus.bulan} ${dataStatus.tahun}`
                : "LIVE"}
            </div>
          </div>
        </div>
      </div>

      {/* WRAPPER TABEL DENGAN SCROLLBAR KUSTOM */}
      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left text-xs whitespace-nowrap border-collapse relative">
          {/* HEADER TABEL */}
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
              <th
                rowSpan="2"
                className="px-5 py-3 border-b border-slate-200 bg-slate-50 sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
              >
                Informasi Proyek
              </th>
              <th
                rowSpan="2"
                className="px-4 py-3 text-right border-b border-slate-200 bg-slate-50"
              >
                Nilai Kontrak
              </th>
              <th
                colSpan="2"
                className="px-4 py-2 text-center border-b border-l border-slate-200 bg-slate-50/80"
              >
                Quick Count (YTD)
              </th>
              <th
                colSpan="2"
                className="px-4 py-2 text-center border-b border-l border-slate-200 bg-blue-50/50 text-[#000075]"
              >
                SAP Realisasi (Annual)
              </th>
              <th
                colSpan="2"
                className="px-4 py-2 text-center border-b border-l border-slate-200 bg-red-50/50 text-red-700"
              >
                Deviasi (QC - SAP)
              </th>
              <th
                rowSpan="2"
                className="px-5 py-3 border-b border-l border-slate-200 bg-slate-50 text-center"
              >
                Status Validasi
              </th>
            </tr>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
              <th className="px-4 py-2 text-right border-b border-l border-slate-200 bg-slate-50/80">
                PU
              </th>
              <th className="px-4 py-2 text-right border-b border-slate-200 bg-slate-50/80">
                BK
              </th>
              <th className="px-4 py-2 text-right border-b border-l border-slate-200 bg-blue-50/50">
                PU
              </th>
              <th className="px-4 py-2 text-right border-b border-slate-200 bg-blue-50/50">
                BK
              </th>
              <th className="px-4 py-2 text-right border-b border-l border-slate-200 bg-red-50/50">
                PU
              </th>
              <th className="px-4 py-2 text-right border-b border-slate-200 bg-red-50/50">
                BK
              </th>
            </tr>
          </thead>

          {/* ISI TABEL */}
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* INFO PROYEK */}
                  <td className="px-5 py-3 bg-white group-hover:bg-slate-50/80 transition-colors sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="font-bold text-slate-800 break-words whitespace-normal max-w-[280px] leading-snug">
                      {row.project}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      ID: {row.id}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-slate-600 font-medium">
                    {formatFullAmount(row.nk)}
                  </td>

                  {/* QUICK COUNT */}
                  <td className="px-4 py-3 text-right font-mono text-slate-600 border-l border-slate-100">
                    {formatFullAmount(row.qc_pu)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">
                    {formatFullAmount(row.qc_bk)}
                  </td>

                  {/* SAP REALISASI */}
                  <td className="px-4 py-3 text-right font-mono text-slate-800 font-semibold border-l border-slate-100 bg-blue-50/10">
                    {formatFullAmount(row.sap_pu)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800 font-semibold bg-blue-50/10">
                    {formatFullAmount(row.sap_bk)}
                  </td>

                  {/* DEVIASI */}
                  <td className="px-4 py-3 text-right font-mono border-l border-slate-100 bg-red-50/10">
                    {renderDeviasiCell(row.dev_pu)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono bg-red-50/10">
                    {renderDeviasiCell(row.dev_bk)}
                  </td>

                  {/* KETERANGAN BADGE */}
                  <td className="px-5 py-3 text-center border-l border-slate-100">
                    {renderBadge(row.ket)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-5 py-10 text-center text-slate-400"
                >
                  Data tidak ditemukan berdasarkan filter / pencarian.
                </td>
              </tr>
            )}
          </tbody>

          {/* FOOTER TABEL: SUMMARY TOTAL */}
          <tfoot className="sticky bottom-0 z-20 shadow-[0_-2px_10px_-2px_rgba(0,0,0,0.1)]">
            <tr className="bg-slate-100 font-black text-slate-800 uppercase tracking-wide">
              <td className="px-5 py-3 bg-slate-100 sticky left-0 z-30 border-t border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-right">
                TOTAL KESELURUHAN
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-slate-300 text-blue-700">
                {formatFullAmount(summary.nk)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-l border-slate-300">
                {formatFullAmount(summary.qc_pu)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-slate-300">
                {formatFullAmount(summary.qc_bk)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-l border-slate-300 bg-blue-100/50">
                {formatFullAmount(summary.sap_pu)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-slate-300 bg-blue-100/50">
                {formatFullAmount(summary.sap_bk)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-l border-slate-300 bg-red-100/50">
                {renderDeviasiCell(summary.dev_pu)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] border-t border-slate-300 bg-red-100/50">
                {renderDeviasiCell(summary.dev_bk)}
              </td>
              <td className="px-5 py-3 border-t border-l border-slate-300 bg-slate-100 text-center">
                -
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
