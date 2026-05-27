// src/components/FinancialWarningList.jsx

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useFilter } from "../context/FilterContext";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;

  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);

  return isNaN(num) ? 0 : num;
};

export default function FinancialWarningList({ current }) {
  const { excelData } = useFilter();

  // AMANKAN DATA AGAR TIDAK UNDEFINED
  const rawData = excelData?.db_rkap_awal || [];

  // JIKA DATA KOSONG
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-2 text-slate-400" size={28} />
          <p className="text-sm font-semibold text-slate-500">
            Data belum tersedia
          </p>
        </div>
      </div>
    );
  }

  // CONTOH WARNING LIST
  const warningList = rawData
    .map((item) => {
      const puRkap =
        safeParseNumber(item.pu_rkap_parsial || item.PU_RKAP_Parsial);

      const puReal =
        safeParseNumber(item.pu_realisasi_parsial || item.PU_Realisasi_Parsial);

      const deviasi = puRkap - puReal;

      return {
        nama:
          item.nama_project ||
          item.project_name ||
          item.kode_project ||
          "Project",
        deviasi,
      };
    })
    .sort((a, b) => b.deviasi - a.deviasi)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden max-h-[400px]">
      <div className="mb-4 flex-shrink-0">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          {current?.title || "Warning List"}
        </h4>

        <p className="text-[10px] text-slate-400">
          Top deviasi performa proyek
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
        {warningList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Tidak ada data warning
          </div>
        ) : (
          warningList.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl p-3 bg-slate-50"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">
                    {item.nama}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    Deviasi:
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-red-600">
                    {item.deviasi.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}