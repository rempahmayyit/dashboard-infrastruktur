import React, { useState, useMemo } from "react";
import { TableProperties, Filter } from "lucide-react";

// Impor global formatter
import { formatFinancialMiliar } from "../../utils/formatters";

export default function DetailPiutangTable({ detailData = [] }) {
  // 1. STATE UNTUK FILTER KATEGORI (Default: KESELURUHAN)
  const [activeCategory, setActiveCategory] = useState("KESELURUHAN");
  console.log(detailData[0]);

  // 2. PIVOT DATA BERDASARKAN FILTER YANG DIPILIH
  const tableData = useMemo(() => {
    if (!detailData || detailData.length === 0) return [];

    // Filter data mentah berdasarkan tombol yang aktif
    const filteredData =
      activeCategory === "KESELURUHAN"
        ? detailData
        : detailData.filter(
            (item) => item.kategori_piutang?.toUpperCase() === activeCategory,
          );

    // Lakukan grouping / pivot pada data yang sudah difilter
    const grouped = filteredData.reduce((acc, curr) => {
      const key = curr.project_name;

      if (!acc[key]) {
        acc[key] = {
          project_name: curr.project_name,
          bucket_0_30: 0,
          bucket_30_60: 0,
          bucket_60_180: 0,
          bucket_180_360: 0,
          bucket_360_up: 0,
          total: 0,
        };
      }

      const val = Number(curr.value) || 0;

      // Alokasi ke kolom umur
      if (curr.aging_bucket === "0-30") acc[key].bucket_0_30 += val;
      else if (curr.aging_bucket === "30-60") acc[key].bucket_30_60 += val;
      else if (curr.aging_bucket === "60-180") acc[key].bucket_60_180 += val;
      else if (curr.aging_bucket === "180-360") acc[key].bucket_180_360 += val;
      else if (curr.aging_bucket === ">360") acc[key].bucket_360_up += val;

      acc[key].total += val;

      return acc;
    }, {});

    // Urutkan alfabetis nama proyek
    return Object.values(grouped).sort((a, b) =>
      a.project_name.localeCompare(b.project_name),
    );
  }, [detailData, activeCategory]);

  const grandTotal = useMemo(() => {
    return tableData.reduce(
      (acc, row) => {
        acc.bucket_0_30 += row.bucket_0_30;
        acc.bucket_30_60 += row.bucket_30_60;
        acc.bucket_60_180 += row.bucket_60_180;
        acc.bucket_180_360 += row.bucket_180_360;
        acc.bucket_360_up += row.bucket_360_up;
        acc.total += row.total;
        return acc;
      },
      {
        bucket_0_30: 0,
        bucket_30_60: 0,
        bucket_60_180: 0,
        bucket_180_360: 0,
        bucket_360_up: 0,
        total: 0,
      },
    );
  }, [tableData]);

  // Helper agar nilai 0 menjadi "-" dan angka terformat dengan rapi
  const renderCell = (value) => {
    if (!value || value === 0) return <span className="text-slate-300">-</span>;
    return formatFinancialMiliar(value, 2);
  };

  // Konfigurasi Tombol Filter
  const filterButtons = [
    {
      id: "KESELURUHAN",
      label: "Gabungan Keseluruhan",
      activeClass: "bg-slate-800 text-white border-slate-800",
      inactiveClass:
        "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
    },
    {
      id: "BRUTO",
      label: "Tagihan Bruto (WIP)",
      activeClass:
        "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20",
      inactiveClass:
        "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50",
    },
    {
      id: "TERMIN",
      label: "Piutang Termin",
      activeClass:
        "bg-[#BD002F] text-white border-[#BD002F] shadow-md shadow-red-600/20",
      inactiveClass: "bg-white text-[#BD002F] border-red-200 hover:bg-red-50",
    },
    {
      id: "RETENSI",
      label: "Piutang Retensi",
      activeClass:
        "bg-[#000075] text-white border-[#000075] shadow-md shadow-blue-800/20",
      inactiveClass: "bg-white text-[#000075] border-blue-200 hover:bg-blue-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full mt-6 flex flex-col overflow-hidden">
      {/* HEADER & FILTER BUTTONS */}
      <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TableProperties size={16} className="text-[#000075]" />
            Rincian Detail Aging per Proyek (Milyar Rp)
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Filter size={12} /> Menampilkan kategori:{" "}
            <span className="font-bold text-slate-700">
              {filterButtons.find((b) => b.id === activeCategory)?.label}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveCategory(btn.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                activeCategory === btn.id ? btn.activeClass : btn.inactiveClass
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* WRAPPER TABEL (SCROLLABLE TINGGI TETAP) */}
      <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
        <table className="w-full text-left text-sm text-slate-600 relative">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-5 py-4 font-bold w-1/3">Nama Proyek</th>
              <th className="px-4 py-4 font-bold text-right">0-30 Hari</th>
              <th className="px-4 py-4 font-bold text-right">30-60 Hari</th>
              <th className="px-4 py-4 font-bold text-right">60-180 Hari</th>
              <th className="px-4 py-4 font-bold text-right">180-360 Hari</th>
              <th className="px-4 py-4 font-bold text-right">&gt; 360 Hari</th>
              <th className="px-5 py-4 font-bold text-right text-slate-800 bg-slate-100/90">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {row.project_name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {renderCell(row.bucket_0_30)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {renderCell(row.bucket_30_60)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {renderCell(row.bucket_60_180)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {renderCell(row.bucket_180_360)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {renderCell(row.bucket_360_up)}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[#000075] bg-slate-50/50">
                    {renderCell(row.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-400"
                >
                  Tidak ada data untuk kategori ini.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="sticky bottom-0 bg-slate-100 font-bold border-t">
            <tr>
              <td className="px-5 py-3">TOTAL</td>

              <td className="px-4 py-3 text-right">
                {renderCell(grandTotal.bucket_0_30)}
              </td>

              <td className="px-4 py-3 text-right">
                {renderCell(grandTotal.bucket_30_60)}
              </td>

              <td className="px-4 py-3 text-right">
                {renderCell(grandTotal.bucket_60_180)}
              </td>

              <td className="px-4 py-3 text-right">
                {renderCell(grandTotal.bucket_180_360)}
              </td>

              <td className="px-4 py-3 text-right">
                {renderCell(grandTotal.bucket_360_up)}
              </td>

              <td className="px-5 py-3 text-right text-[#000075]">
                {renderCell(grandTotal.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
