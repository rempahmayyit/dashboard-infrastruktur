// src/components/FinancialTable.jsx

import React from "react";
import { useFilter } from "../context/FilterContext";
import { usePengendalianData } from "../hooks/usePengendalianData";
import {
  formatNumber,
  formatPercent,
  formatFinancialMiliar,
} from "../utils/formatters";

export default function FinancialTable({ popupMode = false }) {
  const textSize = popupMode ? "text-[48px]" : "text-[12px]";
  const headerSize = popupMode ? "text-[48px]" : "text-[12px]";
  const subHeaderSize = popupMode ? "text-[48px]" : "text-[12px]";

  const paddingMain = popupMode ? "p-3" : "p-2";
  const paddingSub = popupMode ? "p-2.5" : "p-1.5";

  const stickyWidth = popupMode ? "min-w-[180px]" : "min-w-[120px]";
  const { globalFilter } = useFilter();

  const { financialTableData } = usePengendalianData();

  const monthMap = {
    Januari: "Jan",
    Februari: "Feb",
    Maret: "Mar",
    April: "Apr",
    Mei: "Mei",
    Juni: "Jun",
    Juli: "Jul",
    Agustus: "Agu",
    September: "Sep",
    Oktober: "Okt",
    November: "Nov",
    Desember: "Des",
    Jan: "Jan",
    Feb: "Feb",
    Mar: "Mar",
    Apr: "Apr",
    Mei: "Mei",
    Jun: "Jun",
    Jul: "Jul",
    Agu: "Agu",
    Sep: "Sep",
    Okt: "Okt",
    Nov: "Nov",
    Des: "Des",
  };

  const currentMonth =
    monthMap[globalFilter?.bulan] || globalFilter?.bulan || "Apr";

  return (
    <div
      className={`
        relative
        inline-block
        overflow-auto
        border border-slate-200
        rounded-2xl
        bg-white
        shadow-md
        w-fit
        max-w-full
        /* KUNCI STICKY: Beri batas tinggi agar tabel punya scrollbar internal */
        ${popupMode ? "max-h-[85vh]" : "max-h-[500px] 2xl:max-h-[600px]"}
      `}
    >
      <table
        className={`
          text-left
          border-separate
          border-spacing-0
          ${textSize}
          min-w-max
        `}
      >
        {/* HEADER */}
        <thead>
          <tr>
            {/* Uraian (Sudut Kiri Atas - Sticky Top & Left z-[60]) */}
            <th
              className={`
                ${paddingMain}
                text-center align-middle
                sticky left-0 top-0
                bg-slate-900 
                z-[60]
                ${stickyWidth}
                border-b border-slate-700
              `}
            >
              {/* Teks di-set langsung agar i-catchy dan tidak tertimpa CSS global */}
              <span className="text-white font-extrabold tracking-wider uppercase drop-shadow-sm">
                Uraian
              </span>
            </th>

            <th
              className={`${paddingMain} text-center sticky top-0 z-[50] bg-[#000051] border-b border-slate-700`}
            >
              <div className="text-white font-bold tracking-wide">{`RKAP Jan-${currentMonth}`}</div>
              <div
                className={`${subHeaderSize} text-blue-200 font-black mt-0.5`}
              >
                1
              </div>
            </th>

            <th
              className={`${paddingMain} text-center sticky top-0 z-[50] bg-red-600 border-b border-slate-700`}
            >
              <div className="text-white font-bold tracking-wide">{`Real Jan-${currentMonth}`}</div>
              <div
                className={`${subHeaderSize} text-red-200 font-black mt-0.5`}
              >
                2
              </div>
            </th>

            <th
              className={`${paddingMain} text-center sticky top-0 z-[50] bg-[#000075] border-b border-slate-700`}
            >
              <div className="text-white font-bold tracking-wide">
                % thd RKAP
              </div>
              <div
                className={`${subHeaderSize} text-blue-200 font-black mt-0.5`}
              >
                3=2/1
              </div>
            </th>

            <th
              className={`${paddingMain} text-center sticky top-0 z-[50] bg-emerald-700 border-b border-slate-700`}
            >
              <div className="text-white font-bold tracking-wide">
                RKAP Jan-Des
              </div>
              <div
                className={`${subHeaderSize} text-emerald-200 font-black mt-0.5`}
              >
                4
              </div>
            </th>

            <th
              className={`${paddingMain} text-center sticky top-0 z-[50] bg-red-700 border-b border-slate-700`}
            >
              <div className="text-white font-bold tracking-wide">
                Sisa thd RKAP
              </div>
              <div
                className={`${subHeaderSize} text-red-200 font-black mt-0.5`}
              >
                5=4-2
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
          {/* BARIS PU */}
          <tr className="bg-slate-100 font-bold text-slate-900">
            <td
              className={`${paddingMain} pl-4 text-left sticky left-0 bg-slate-100 z-[20] border-b border-slate-300 drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              PU
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.puRkapTotal)}
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.puRealTotal)}
            </td>
            <td className={`${paddingMain} text-right text-blue-700 font-bold`}>
              {formatPercent(financialTableData.puPercent)}
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.puRkapTahunan)}
            </td>
            <td
              className={`${paddingMain} text-right text-emerald-700 font-bold`}
            >
              {formatFinancialMiliar(financialTableData.sisaPuTotal)}
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-white z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              a. Non JO & JOP
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRkapNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRealNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.puNonJoPercent)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRkapTahunanNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaPuNonJo)}
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-white z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              b. JOI
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRkapJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRealJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.puJoiPercent)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.puRkapTahunanJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaPuJoi)}
            </td>
          </tr>
          {/* BARIS BK */}
          <tr className="bg-slate-100 font-bold text-slate-900">
            <td
              className={`${paddingMain} pl-4 text-left sticky left-0 bg-slate-100 z-[20] border-b border-slate-300 drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              BK
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.bkTotal)}
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.bkRealTotal)}
            </td>
            <td
              className={`${paddingMain} text-right text-slate-600 font-black`}
            >
              -
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.bkRkapTahunan)}
            </td>
            <td
              className={`${paddingMain} text-right text-emerald-700 font-bold`}
            >
              {formatFinancialMiliar(financialTableData.sisaBkTotal)}
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-white z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              a. Non JO & JOP
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkRealNonJo)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkRkapTahunanNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaBkNonJo)}
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-white z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              b. JOI
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkRealJoi)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.bkRkapTahunanJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaBkJoi)}
            </td>
          </tr>
          {/* BK/PU */}
          <tr className="bg-blue-50/60 font-bold text-blue-950">
            <td
              className={`${paddingMain} pl-4 text-left sticky left-0 bg-blue-100 z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              BK/PU
            </td>
            <td className={`${paddingMain} text-right`}>
              {formatPercent(financialTableData.bkpuPercent)}
            </td>
            <td className={`${paddingMain} text-right text-red-700 font-bold`}>
              {formatPercent(financialTableData.bkpuRealPercent)}
            </td>
            <td
              className={`${paddingMain} text-right text-slate-600 font-black`}
            >
              -
            </td>
            <td className={`${paddingMain} text-right`}>{formatPercent(financialTableData.bkpuRkapTahunan)}</td>
            <td className={`${paddingMain} text-right text-blue-900 font-bold`}>
              {formatPercent(financialTableData.sisaBkpuTotal)}
            </td>
          </tr>
          <tr className="bg-blue-50/20 hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-[#fbfcfe] z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              a. Non JO & JOP
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuNonJoPercent)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuRealNonJoPercent)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuRkapTahunanNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.sisaBkpuNonJo)}
            </td>
          </tr>
          <tr className="bg-blue-50/20 hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-[#fbfcfe] z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              b. JOI
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuJoiPercent)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuRealJoiPercent)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.bkpuRkapTahunanJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatPercent(financialTableData.sisaBkpuJoi)}
            </td>
          </tr>
          {/* LK */}
          <tr className="bg-red-50/60 font-bold text-slate-900">
            <td
              className={`${paddingMain} pl-4 text-left sticky left-0 bg-red-100 z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              LK
            </td>
            <td className={`${paddingMain} text-right text-red-700 font-bold`}>
              {formatFinancialMiliar(financialTableData.lkTotal)}
            </td>
            <td className={`${paddingMain} text-right text-red-700 font-bold`}>
              {formatFinancialMiliar(financialTableData.lkRealTotal)}
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatPercent(financialTableData.lkPercent)}
            </td>
            <td className={`${paddingMain} text-right text-slate-900`}>
              {formatFinancialMiliar(financialTableData.lkRkapTahunan)}
            </td>
            <td
              className={`${paddingMain} text-right text-emerald-700 font-bold`}
            >
              {formatFinancialMiliar(financialTableData.sisaLkTotal)}
            </td>
          </tr>
          <tr className="bg-red-50/10 hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-[#fffbfa] z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              a. Non JO & JOP
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.lkNonJo)}
            </td>
            <td className={`${paddingSub} text-right text-red-700 font-bold`}>
              {formatFinancialMiliar(financialTableData.lkRealNonJo)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.lkRkapTahunanNonJo)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaLkNonJo)}
            </td>
          </tr>
          <tr className="bg-red-50/10 hover:bg-slate-50/80">
            <td
              className={`${paddingSub} pl-6 text-left text-slate-700 font-semibold sticky left-0 bg-[#fffbfa] z-[20] drop-shadow-[2px_0_2px_rgba(0,0,0,0.02)]`}
            >
              b. JOI
            </td>
            <td className={`${paddingSub} text-right text-red-700 font-bold`}>
              {formatFinancialMiliar(financialTableData.lkJoi)}
            </td>
            <td className={`${paddingSub} text-right text-slate-900 font-bold`}>
              {formatFinancialMiliar(financialTableData.lkRealJoi)}
            </td>
            <td className={`${paddingSub} text-right text-slate-600 font-bold`}>
              -
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.lkRkapTahunanJoi)}
            </td>
            <td
              className={`${paddingSub} text-right text-slate-800 font-medium`}
            >
              {formatFinancialMiliar(financialTableData.sisaLkJoi)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
