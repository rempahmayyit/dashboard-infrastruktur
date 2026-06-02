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
  console.log("CURRENT WARNING:", current);
  const { excelData, selectedMonth } = useFilter();

  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    Mei: 5,
    Jun: 6,
    Jul: 7,
    Agu: 8,
    Sep: 9,
    Okt: 10,
    Nov: 11,
    Des: 12,
  };

  const selectedMonthNumber =
    typeof selectedMonth === "string" ? monthMap[selectedMonth] : selectedMonth;

  const rawData = excelData?.db_rkap_awal || [];

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

  const rkapData = excelData?.db_rkap_awal || [];
  const realisasiData = excelData?.db_realisasi || [];
  const masterData = excelData?.db_master_data || [];

  const warningMap = {};

  // =========================
  // RKAP
  // =========================
  rkapData.forEach((row) => {
    const bulan = Number(row.bulan_index || 0);

    if (bulan > selectedMonthNumber) return;

    const id = row.id_project;

    if (!id) return;

    if (!warningMap[id]) {
      const master = masterData.find(
        (m) => String(m.id_project) === String(id),
      );

      warningMap[id] = {
        id_project: id,
        nama: row.project_name || master?.project_name || "Project",
        puRkap: 0,
        puReal: 0,
        note: "-",
      };
    }

    warningMap[id].puRkap += safeParseNumber(row.pu_rkap_parsial);
  });

  // =========================
  // REALISASI
  // =========================
  realisasiData.forEach((row) => {
    const bulan = Number(row.bulan_index || 0);

    if (bulan > selectedMonthNumber) return;

    const id = row.id_project;

    if (!warningMap[id]) return;

    warningMap[id].puReal += safeParseNumber(row.pu_real_parsial);
  });

  // =========================
  // FINAL LIST
  // =========================
  const warningList = Object.values(warningMap)
    .map((item) => ({
      ...item,
      deviasi: item.puReal - item.puRkap,
    }))
    .sort((a, b) => a.deviasi - b.deviasi)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden max-h-[400px]">
      {/* HEADER */}
      <div className="mb-4 flex-shrink-0">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          {current?.title || "Warning List"}
        </h4>

        <p className="text-[10px] text-slate-400">
          Top deviasi performa proyek
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
        {warningList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Tidak ada data warning
          </div>
        ) : (
          warningList.map((item, index) => (
            <div
              key={index}
              className="
                border border-slate-200
                rounded-2xl
                px-3 py-3
                bg-white
                hover:shadow-md
                transition-all
                cursor-pointer
              "
            >
              <div className="flex justify-between items-start gap-3">
                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium mb-1">
                    {item.id_project}
                  </div>

                  <p
                    className="
                      text-[13px]
                      font-bold
                      text-slate-800
                      leading-snug
                      line-clamp-2
                    "
                  >
                    {item.nama}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-2">
                    Penyebab deviasi belum diinput
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end flex-shrink-0 pt-1">
                  <p
                    className={`
                      text-[18px]
                      font-black
                      leading-none
                      ${item.deviasi < 0 ? "text-red-500" : "text-emerald-500"}
                    `}
                  >
                    {`${Math.round(item.deviasi / 1000000000)} M`}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">Deviasi</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
