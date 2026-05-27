import React, { useState } from "react";
import { Maximize2, Minimize2, Activity } from "lucide-react";

export default function EvaluasiBKPUblnIni() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData = [
    {
      no: 1,
      proyek: "Perbaikan KAPB",
      nk: "856.594",

      r_pu: "64.914",
      r_bk: "53.607",
      r_ratio: "82.58%",

      real_prog: "35%",

      b_pu: "159.515",
      b_bk: "196.505",
      b_ratio: "123.19%",

      mapp: "95%",

      f_prog: "42%",
      f_pu: "180.000",
      f_bk: "210.000",
      f_ratio: "116.67%",
    },
  ];

  const RenderTableContent = ({ isFullView = false }) => (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white">
      <table
        className={`w-full border-separate border-spacing-0 min-w-[1200px] ${
          isFullView ? "text-xs" : "text-[10px]"
        }`}
      >
        <thead className="sticky top-0 z-30 text-white uppercase tracking-wide">
          {/* HEADER LEVEL 1 */}
          <tr className="bg-slate-800 text-[9px] font-black">
            <th className="p-2 text-center sticky left-0 z-40 bg-slate-800 border-b border-slate-600 border-r border-slate-600 w-[40px]">
              No
            </th>

            <th className="p-2 text-left sticky left-[40px] z-40 bg-slate-800 border-b border-slate-600 border-r border-slate-600 min-w-[180px]">
              Nama Proyek
            </th>

            <th className="p-2 bg-slate-700 border-b border-slate-600 border-r border-slate-600 w-[90px]">
              NK
            </th>

            <th
              colSpan="3"
              className="p-2 bg-[#1f4e78] border-b border-[#153654] border-r border-slate-600"
            >
              Renc. April
            </th>

            <th className="p-2 bg-[#2f5597] border-b border-[#1c3561] border-r border-slate-600 w-[80px]">
              Prog
            </th>

            <th
              colSpan="3"
              className="p-2 bg-[#bd002f] border-b border-[#80001f] border-r border-slate-600"
            >
              Evaluasi Bulan Ini
            </th>

            <th className="p-2 bg-[#7f6000] border-b border-[#544000] border-r border-slate-600 w-[75px]">
              MAPP
            </th>

            <th className="p-2 bg-[#385723] border-b border-[#223616] border-r border-slate-600 w-[80px]">
              Forecast
            </th>

            <th
              colSpan="3"
              className="p-2 bg-[#548235] border-b border-[#375522]"
            >
              Rencana Mei
            </th>
          </tr>

          {/* HEADER LEVEL 2 */}
          <tr className="bg-slate-800 text-[8px] font-mono">
            <th className="p-1.5 sticky left-0 z-40 bg-slate-800 border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 sticky left-[40px] z-40 bg-slate-800 border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 bg-[#255c8f] border-b border-slate-600 text-right">
              PU
            </th>

            <th className="p-1.5 bg-[#255c8f] border-b border-slate-600 text-right">
              BK
            </th>

            <th className="p-1.5 bg-[#255c8f] border-b border-slate-600 border-r border-slate-600 text-center">
              BK/PU
            </th>

            <th className="p-1.5 bg-[#3763af] border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 bg-[#d10034] border-b border-slate-600 text-right">
              PU
            </th>

            <th className="p-1.5 bg-[#d10034] border-b border-slate-600 text-right">
              BK
            </th>

            <th className="p-1.5 bg-[#d10034] border-b border-slate-600 border-r border-slate-600 text-center">
              Ratio
            </th>

            <th className="p-1.5 bg-[#937000] border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 bg-[#446a2b] border-b border-slate-600 border-r border-slate-600"></th>

            <th className="p-1.5 bg-[#61953d] border-b border-slate-600 text-right">
              PU
            </th>

            <th className="p-1.5 bg-[#61953d] border-b border-slate-600 text-right">
              BK
            </th>

            <th className="p-1.5 bg-[#61953d] border-b border-slate-600 text-center">
              Ratio
            </th>
          </tr>
        </thead>

        <tbody className="bg-white text-slate-700 font-semibold">
          {tableData.map((row, idx) => {
            const isRatioKritis =
              parseFloat(row.b_ratio) > parseFloat(row.mapp);

            return (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-2 text-center sticky left-0 bg-white z-20 border-r border-slate-200 text-slate-500 font-mono">
                  {row.no}
                </td>

                <td
                  className="p-2 text-left sticky left-[40px] bg-white z-20 border-r border-slate-200 text-slate-900 font-bold"
                  title={row.proyek}
                >
                  {row.proyek}
                </td>

                <td className="p-2 text-right border-r border-slate-200 font-mono text-slate-500">
                  {row.nk}
                </td>

                {/* RKAP */}
                <td className="p-2 text-right font-mono">{row.r_pu}</td>

                <td className="p-2 text-right font-mono">{row.r_bk}</td>

                <td className="p-2 text-center font-mono border-r border-slate-200 bg-slate-50 text-slate-500">
                  {row.r_ratio}
                </td>

                {/* PROGRESS */}
                <td className="p-2 text-center font-mono border-r border-slate-200 bg-blue-50/20 text-slate-600">
                  {row.real_prog}
                </td>

                {/* EVALUASI */}
                <td className="p-2 text-right font-mono">{row.b_pu}</td>

                <td className="p-2 text-right font-mono">{row.b_bk}</td>

                <td
                  className={`p-2 text-center font-mono border-r border-slate-200 ${
                    isRatioKritis
                      ? "bg-red-50 text-red-600 font-black"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {row.b_ratio}
                </td>

                {/* MAPP */}
                <td className="p-2 text-center font-mono border-r border-slate-200">
                  {row.mapp}
                </td>

                {/* FORECAST */}
                <td className="p-2 text-center font-mono border-r border-slate-200 bg-emerald-50/20 text-slate-600">
                  {row.f_prog}
                </td>

                {/* RENCANA DEPAN */}
                <td className="p-2 text-right font-mono">{row.f_pu}</td>

                <td className="p-2 text-right font-mono">{row.f_bk}</td>

                <td className="p-2 text-center font-mono bg-slate-50 text-slate-500">
                  {row.f_ratio}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[360px]">
        {/* HEADER */}
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity
                size={14}
                className="text-indigo-700"
                strokeWidth={2.5}
              />
              EVALUASI BK/PU BULAN INI
            </h4>

            <p className="text-[10px] text-slate-400 mt-1">
              Analisis evaluasi beban kerja operasional proyek
            </p>
          </div>

          {/* TOMBOL PICU MODAL TABEL KANAN */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all shadow-sm flex items-center justify-center w-7 h-7"
            title="Maximize"
          >
            <Maximize2 size={13} strokeWidth={2.5} />
          </button>
        </div>

        <RenderTableContent />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900">
                MATRIKS EVALUASI BK/PU
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200"
              >
                <Minimize2 size={14} />
              </button>
            </div>

            <RenderTableContent isFullView />
          </div>
        </div>
      )}
    </>
  );
}
