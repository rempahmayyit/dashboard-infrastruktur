import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export default function RkapRealisasiTable({
  selectedMonthName = "April",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DATA DUMMY
  const projectData = [
    {
      no: 1,
      name: "Perbaikan KAPB",
      nk: "856.594",
      rkap_pu: "64.914",
      rkap_bk: "53.607",
      rkap_ratio: "82.58%",
      real_pu: "159.515",
      real_bk: "196.505",
      real_ratio: "123.19%",
      dev_pu: "94.600",
      dev_bk: "142.898",
      dev_lk: "(48.298)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
    {
      no: 2,
      name: "Bend. Jlantah",
      nk: "566.919",
      rkap_pu: "-",
      rkap_bk: "-",
      rkap_ratio: "0.00%",
      real_pu: "-",
      real_bk: "17.334",
      real_ratio: "0.00%",
      dev_pu: "-",
      dev_bk: "17.334",
      dev_lk: "(17.334)",
    },
  ];

  // COMPONENT ISI TABEL
  const RenderTableContent = ({ isFullView }) => (
    <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-150 rounded-xl shadow-inner bg-slate-50/30">
      <table
        className={`w-full text-left border-separate border-spacing-0 min-w-[1200px] ${
          isFullView ? "text-xs" : "text-[11px]"
        }`}
      >
        {/* HEADER */}
        <thead className="sticky top-0 z-30 text-white font-bold text-center select-none">
          {/* HEADER LEVEL 1 */}
          <tr className="bg-[#002060]">
            <th className="p-3 text-center sticky left-0 bg-[#002060] z-40 border-r border-slate-600 w-[50px]">
              No
            </th>

            <th className="p-3 text-left sticky left-[50px] bg-[#002060] z-40 border-r border-slate-600 min-w-[220px]">
              Nama Proyek
            </th>

            <th className="p-3 text-right border-r border-slate-600">
              NK
            </th>

            <th
              colSpan="3"
              className="p-3 bg-[#1f4e78] border-r border-slate-600"
            >
              RKAP Jan - Apr
            </th>

            <th
              colSpan="3"
              className="p-3 bg-[#c00000] border-r border-slate-600"
            >
              Realisasi Jan - Apr
            </th>

            <th colSpan="3" className="p-3 bg-[#00b050]">
              Deviasi
            </th>
          </tr>

          {/* HEADER LEVEL 2 */}
          <tr className="bg-[#17375e] text-[10px] font-mono">
            <th className="p-2 sticky left-0 bg-[#17375e] z-40 border-r border-slate-600"></th>

            <th className="p-2 sticky left-[50px] bg-[#17375e] z-40 border-r border-slate-600"></th>

            <th className="p-2 border-r border-slate-600"></th>

            {/* RKAP */}
            <th className="p-2 text-right">PU</th>
            <th className="p-2 text-right">BK</th>
            <th className="p-2 text-center border-r border-slate-600">
              BK/PU
            </th>

            {/* REAL */}
            <th className="p-2 text-right">PU</th>
            <th className="p-2 text-right">BK</th>
            <th className="p-2 text-center border-r border-slate-600">
              BK/PU
            </th>

            {/* DEV */}
            <th className="p-2 text-right">PU</th>
            <th className="p-2 text-right">BK</th>
            <th className="p-2 text-right">LK</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
          {projectData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-slate-50 transition-colors"
            >
              {/* NO */}
              <td className="p-2 text-center sticky left-0 bg-white z-20 border-r border-slate-200 text-slate-500 font-mono">
                {row.no}
              </td>

              {/* NAMA */}
              <td
                className="p-2 sticky left-[50px] bg-white z-20 border-r border-slate-300 text-slate-900 font-bold"
                title={row.name}
              >
                {row.name}
              </td>

              {/* NK */}
              <td className="p-2 text-right font-mono">
                {row.nk}
              </td>

              {/* RKAP */}
              <td className="p-2 text-right font-mono">
                {row.rkap_pu}
              </td>

              <td className="p-2 text-right font-mono">
                {row.rkap_bk}
              </td>

              <td className="p-2 text-right font-black font-mono border-r border-slate-200">
                {row.rkap_ratio}
              </td>

              {/* REAL */}
              <td className="p-2 text-right font-mono">
                {row.real_pu}
              </td>

              <td className="p-2 text-right font-mono">
                {row.real_bk}
              </td>

              <td className="p-2 text-right font-black font-mono border-r border-slate-200">
                {row.real_ratio}
              </td>

              {/* DEV PU */}
              <td
                className={`p-2 text-right font-mono ${
                  row.dev_pu.includes("(")
                    ? "text-red-600"
                    : row.dev_pu === "-"
                    ? "text-slate-400"
                    : "text-emerald-600"
                }`}
              >
                {row.dev_pu}
              </td>

              {/* DEV BK */}
              <td
                className={`p-2 text-right font-mono ${
                  row.dev_bk.includes("(")
                    ? "text-emerald-600"
                    : row.dev_bk === "-"
                    ? "text-slate-400"
                    : "text-red-600"
                }`}
              >
                {row.dev_bk}
              </td>

              {/* DEV LK */}
              <td
                className={`p-2 text-right font-black font-mono ${
                  row.dev_lk.includes("(")
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {row.dev_lk}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[360px] mt-6">
        {/* HEADER */}
        <div className="mb-3 flex justify-between items-center flex-shrink-0">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              EVALUASI RKAP VS REALISASI

              <span className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                APRIL 2026
              </span>
            </h4>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Monitoring deviasi pendapatan usaha dan beban kerja proyek
            </p>
          </div>

          {/* BUTTON MAXIMIZE */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all shadow-sm flex items-center gap-1 text-[10px] font-black uppercase"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        <RenderTableContent isFullView={false} />
      </div>

      {/* MODAL FULLSCREEN */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl flex flex-col overflow-hidden w-full max-w-7xl max-h-[90vh]"
          >
            {/* MODAL HEADER */}
            <div className="mb-4 flex justify-between items-center flex-shrink-0">
              <div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  EVALUASI RKAP VS REALISASI
                </h4>

                <p className="text-xs text-slate-400 mt-1">
                  Periode s.d. Bulan {selectedMonthName} 2026
                </p>
              </div>

              {/* BUTTON CLOSE */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            <RenderTableContent isFullView={true} />
          </div>
        </div>
      )}
    </>
  );
}