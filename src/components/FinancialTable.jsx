// src/components/FinancialTable.jsx

import React from "react";

export default function FinancialTable({ popupMode = false }) {
  const textSize = popupMode ? "text-xl" : "text-[10px]";
  const headerSize = popupMode ? "text-base" : "text-[9px]";
  const subHeaderSize = popupMode ? "text-sm" : "text-[8px]";
  const paddingMain = popupMode ? "p-5" : "p-2";
  const paddingSub = popupMode ? "p-4" : "p-1.5";
  const stickyWidth = popupMode ? "min-w-[340px]" : "min-w-[120px]";

  return (
    <div
      className="
        w-max
        min-w-full
        overflow-visible
        border border-slate-100
        rounded-2xl
        bg-white
        shadow-sm
      "
    >
      <table
        className={`
          text-left
          border-separate
          border-spacing-0
          w-max
          min-w-full
          ${textSize}
        `}
      >
        {/* HEADER */}
        <thead
          className={`
            sticky top-0 z-30
            text-white font-bold text-center
            ${headerSize}
          `}
        >
          <tr className="bg-slate-800">
            <th
              className={`
                ${paddingMain}
                pl-4
                text-left
                sticky left-0 top-0
                bg-slate-800
                z-40
                ${stickyWidth}
                border-b border-slate-700
              `}
            >
              Uraian
            </th>

            <th
              className={`${paddingMain} bg-[#000051] border-b border-slate-700`}
            >
              <div>RKAP Jan-Apr</div>
              <div className={`${subHeaderSize} font-normal opacity-70`}>1</div>
            </th>

            <th
              className={`${paddingMain} bg-red-600 border-b border-slate-700`}
            >
              <div>Real Jan-Apr</div>
              <div className={`${subHeaderSize} font-normal opacity-70`}>2</div>
            </th>

            <th
              className={`${paddingMain} bg-[#000075] border-b border-slate-700`}
            >
              <div>% thd RKAP</div>
              <div className={`${subHeaderSize} font-normal opacity-70`}>
                3=2/1
              </div>
            </th>

            <th
              className={`${paddingMain} bg-emerald-600 border-b border-slate-700`}
            >
              <div>RKAP Jan-Des</div>
              <div className={`${subHeaderSize} font-normal opacity-70`}>4</div>
            </th>

            <th
              className={`${paddingMain} bg-red-700 border-b border-slate-700`}
            >
              <div>Sisa thd RKAP</div>
              <div className={`${subHeaderSize} font-normal opacity-70`}>
                5=4-2
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {/* BARIS PU */}
          <tr className="bg-slate-100 font-bold text-slate-900">
            <td
              className={`
                ${paddingMain}
                pl-4
                text-left
                sticky left-0
                bg-slate-100
                z-20
                border-b border-slate-200
              `}
            >
              PU
            </td>

            <td className={`${paddingMain} text-right`}>1,045.80</td>

            <td className={`${paddingMain} text-right`}>1,227.93</td>

            <td className={`${paddingMain} text-right text-blue-700`}>
              117.42%
            </td>

            <td className={`${paddingMain} text-right`}>5,589.64</td>

            <td className={`${paddingMain} text-right text-emerald-600`}>
              4,361.71
            </td>
          </tr>

          <tr className="hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-white
                z-20
              `}
            >
              a. Non JO & JOP
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              721.67
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              749.16
            </td>

            <td className={`${paddingSub} text-right`}>103.81%</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              4,010.45
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              3,261.29
            </td>
          </tr>

          <tr className="hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-white
                z-20
              `}
            >
              b. JOI
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              324.13
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              478.78
            </td>

            <td className={`${paddingSub} text-right`}>147.71%</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              1,579.20
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              1,100.42
            </td>
          </tr>

          {/* BARIS BK */}
          <tr className="bg-slate-100 font-bold text-slate-900">
            <td
              className={`
                ${paddingMain}
                pl-4
                text-left
                sticky left-0
                bg-slate-100
                z-20
                border-b border-slate-200
              `}
            >
              BK
            </td>

            <td className={`${paddingMain} text-right`}>1,066.27</td>

            <td className={`${paddingMain} text-right`}>1,378.63</td>

            <td className={`${paddingMain} text-right text-slate-400`}>-</td>

            <td className={`${paddingMain} text-right`}>5,172.31</td>

            <td className={`${paddingMain} text-right text-emerald-600`}>
              3,793.69
            </td>
          </tr>

          <tr className="hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-white
                z-20
              `}
            >
              a. Non JO & JOP
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              716.98
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              930.81
            </td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              3,732.13
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              2,801.32
            </td>
          </tr>

          <tr className="hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-white
                z-20
              `}
            >
              b. JOI
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              349.29
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              447.82
            </td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              1,440.18
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              992.36
            </td>
          </tr>

          {/* BK/PU */}
          <tr className="bg-blue-50/60 font-bold text-blue-950">
            <td
              className={`
                ${paddingMain}
                pl-4
                text-left
                sticky left-0
                bg-blue-50
                z-20
              `}
            >
              BK/PU
            </td>

            <td className={`${paddingMain} text-right`}>101.96%</td>

            <td className={`${paddingMain} text-right text-red-600`}>
              112.27%
            </td>

            <td className={`${paddingMain} text-right text-slate-400`}>-</td>

            <td className={`${paddingMain} text-right`}>92.53%</td>

            <td className={`${paddingMain} text-right text-blue-900`}>
              86.98%
            </td>
          </tr>

          <tr className="bg-blue-50/20 hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-[#fbfcfe]
                z-20
              `}
            >
              a. Non JO & JOP
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              99.35%
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              124.25%
            </td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              93.06%
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              85.90%
            </td>
          </tr>

          <tr className="bg-blue-50/20 hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-[#fbfcfe]
                z-20
              `}
            >
              b. JOI
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              107.76%
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              93.53%
            </td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              91.20%
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              90.18%
            </td>
          </tr>

          {/* LK */}
          <tr className="bg-red-50/60 font-bold text-slate-900">
            <td
              className={`
                ${paddingMain}
                pl-4
                text-left
                sticky left-0
                bg-red-50
                z-20
              `}
            >
              LK
            </td>

            <td className={`${paddingMain} text-right text-red-600`}>
              (20.47)
            </td>

            <td className={`${paddingMain} text-right text-red-600`}>
              (150.69)
            </td>

            <td className={`${paddingMain} text-right`}>13.58%</td>

            <td className={`${paddingMain} text-right`}>417.33</td>

            <td className={`${paddingMain} text-right text-emerald-600`}>
              568.03
            </td>
          </tr>

          <tr className="bg-red-50/10 hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-[#fffbfa]
                z-20
              `}
            >
              a. Non JO & JOP
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>4.69</td>

            <td className={`${paddingSub} text-right text-red-600`}>
              (181.65)
            </td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              278.32
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              459.97
            </td>
          </tr>

          <tr className="bg-red-50/10 hover:bg-slate-50/80">
            <td
              className={`
                ${paddingSub}
                pl-6
                text-left
                text-slate-500
                sticky left-0
                bg-[#fffbfa]
                z-20
              `}
            >
              b. JOI
            </td>

            <td className={`${paddingSub} text-right text-red-600`}>(25.16)</td>

            <td className={`${paddingSub} text-right text-slate-800`}>30.96</td>

            <td className={`${paddingSub} text-right text-slate-400`}>-</td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              139.01
            </td>

            <td className={`${paddingSub} text-right text-slate-500`}>
              108.06
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
