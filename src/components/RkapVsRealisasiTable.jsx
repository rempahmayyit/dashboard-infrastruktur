import React, { useState, useMemo } from "react";
import { formatNumber } from "../utils/formatters";
import { Maximize2, Minimize2, Activity } from "lucide-react";
import { useFilter } from "../context/FilterContext";

// Helper Penyeragaman ID Proyek
const getProjectId = (row) =>
  row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

export default function RkapVsRealisasiTable() {
  const { excelData, globalFilter } = useFilter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ==========================================================
  // PENGOLAHAN DATA DINAMIS (Berdasarkan 4 Aturan + ABAIKAN ONGOING)
  // ==========================================================
  const tableData = useMemo(() => {
    const masterData = excelData?.db_master_data || [];
    const rkapData = excelData?.db_rkap_awal || [];
    const realisasiData = excelData?.db_realisasi || [];

    // Konversi bulan ke angka
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
    const selectedYear = Number(globalFilter?.tahun || 2026);
    const selectedMonth =
      monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

    const projectMap = {};

    // 1. Inisialisasi Proyek dari Master Data (SEMUA STATUS MASUK)
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (!id) return;

      projectMap[id] = {
        id,
        nama: p.nama_proyek_current || p.nama_paket || p.project_name || "-",
        nk: Number(p.nk_current || p.nilai_kontrak || 0),
        rkapPu: 0,
        rkapBk: 0,
        realPu: 0,
        realBk: 0,
      };
    });

    // 2. Agregasi Data (S.D Bulan Terpilih) - VERSI KETAT
    const aggregateData = (sourceData, prefix) => {
      sourceData.forEach((row) => {
        const id = getProjectId(row);

        // Buat on-the-fly jika ada di transaksi tapi tidak ada di master
        if (id && !projectMap[id]) {
          projectMap[id] = {
            id,
            nama:
              row.nama_proyek ||
              row.project_name ||
              `Proyek Tidak Dikenal (${id})`,
            nk: 0,
            rkapPu: 0,
            rkapBk: 0,
            realPu: 0,
            realBk: 0,
          };
        }

        if (!id || !projectMap[id]) return;

        // FILTER 1: Pastikan Bulan Valid (Cegah null/0 masuk kehitungan)
        let rowMonth = Number(row.bulan_index);
        if (!rowMonth && row.bulan) {
          const textBulan = String(row.bulan).toLowerCase().substring(0, 3);
          const bMap = {
            jan: 1,
            feb: 2,
            mar: 3,
            apr: 4,
            may: 5,
            mei: 5,
            jun: 6,
            jul: 7,
            agu: 8,
            aug: 8,
            sep: 9,
            okt: 10,
            nov: 11,
            des: 12,
            dec: 12,
          };
          rowMonth = bMap[textBulan] || 0;
        }

        const rowYear = Number(row.tahun);

        // FILTER 2: Pastikan hanya status "Awal" yang dihitung untuk RKAP (Sesuai filter Excel-mu)
        let isStatusValid = true;
        if (prefix === "rkap" && row.rkap_status) {
          isStatusValid = String(row.rkap_status)
            .toLowerCase()
            .includes("awal");
        }

        // EKSEKUSI PENJUMLAHAN
        if (
          rowYear === selectedYear &&
          rowMonth > 0 &&
          rowMonth <= selectedMonth &&
          isStatusValid
        ) {
          if (prefix === "rkap") {
            const valPu = Number(row.pu_rkap_parsial || 0);
            const valBk = Number(row.bk_rkap_parsial || 0);

            projectMap[id].rkapPu += valPu;
            projectMap[id].rkapBk += valBk;

            // ==========================================
            // RADAR DEBUGGING (Cek Console F12 di Browser)
            // ==========================================
            /* if (id == "1425010") {
              console.log(
                `[CEK TOL KAPB] Bln: ${rowMonth} | Ditambah PU: ${valPu} | Total Sementara: ${projectMap[id].rkapPu}`,
              );
            }*/
          } else {
            projectMap[id].realPu += Number(row.pu_real_parsial || 0);
            projectMap[id].realBk += Number(row.bk_real_parsial || 0);
          }
        }
      });
    };

    aggregateData(rkapData, "rkap"); // Memasukkan target (Aturan 1)
    aggregateData(realisasiData, "real"); // Memasukkan realisasi (Aturan 2)

    // 3. Kalkulasi Deviasi & Pembentukan Array Akhir (Aturan 3)
    const processedData = Object.values(projectMap)
      .map((p) => {
        // Kalkulasi BK/PU
        p.rkapBkpu = p.rkapPu > 0 ? (p.rkapBk / p.rkapPu) * 100 : 0;
        p.realBkpu = p.realPu > 0 ? (p.realBk / p.realPu) * 100 : 0;

        // Kalkulasi Deviasi
        p.devPu = p.realPu - p.rkapPu;
        p.devBk = p.realBk - p.rkapBk;
        p.devLk = p.devPu - p.devBk;

        // Pembagi Jutaan
        p.nk /= 1000000;

        p.rkapPu /= 1000000;
        p.rkapBk /= 1000000;

        p.realPu /= 1000000;
        p.realBk /= 1000000;

        p.devPu /= 1000000;
        p.devBk /= 1000000;
        p.devLk /= 1000000;

        return p;
      })
      // Saring proyek yang benar-benar punya angka RKAP atau Realisasi s.d bulan tersebut
      .filter(
        (p) =>
          p.rkapPu !== 0 || p.rkapBk !== 0 || p.realPu !== 0 || p.realBk !== 0,
      )

      // 4. Urutkan berdasarkan minus (-) LK terbesar ke positif (Aturan 4)
      .sort((a, b) => a.devLk - b.devLk);

    return processedData;
  }, [excelData, globalFilter]);

  // ==========================================================
  // HELPER FORMAT TAMPILAN
  // ==========================================================
  const renderFinancial = (num, isPercent = false) => {
    if (!num && num !== 0) return "-";
    const formatted = formatNumber(Math.abs(num), isPercent ? 2 : 0);
    const suffix = isPercent ? "%" : "";

    // Format Akuntansi: Minus diberi kurung siku berwarna merah
    if (num < 0) {
      return (
        <span className="text-red-600 font-semibold">
          ({formatted}
          {suffix})
        </span>
      );
    }
    return (
      <span className="text-slate-700">
        {formatted}
        {suffix}
      </span>
    );
  };

  const RenderTableContent = ({ isFullView = false }) => (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white scrollbar-thin">
      <table
        className={`w-full text-left border-collapse min-w-[1000px] ${isFullView ? "text-[12px]" : "text-[11px]"}`}
      >
        <thead className="sticky top-0 z-10 shadow-sm">
          <tr>
            <th
              rowSpan={2}
              className="bg-[#000075] text-white p-2.5 font-bold text-center border-b border-slate-300 border-r border-white/20 w-12"
            >
              No
            </th>
            <th
              rowSpan={2}
              className="bg-[#000075] text-white p-2.5 font-bold text-left border-b border-slate-300 border-r border-white/20 min-w-[200px]"
            >
              Nama Proyek
            </th>
            <th
              rowSpan={2}
              className="bg-[#000075] text-white p-2.5 font-bold text-right border-b border-slate-300 border-r border-slate-300 w-24"
            >
              NK
            </th>
            <th
              colSpan={3}
              className="bg-blue-50 text-blue-900 p-2.5 font-bold text-center border-b border-blue-200 border-r border-white/20"
            >
              RKAP S.D BULAN INI
            </th>
            <th
              colSpan={3}
              className="bg-emerald-50 text-emerald-900 p-2.5 font-bold text-center border-b border-emerald-200 border-r border-white/20"
            >
              REALISASI S.D BULAN INI
            </th>
            <th
              colSpan={3}
              className="bg-rose-50 text-rose-900 p-2.5 font-bold text-center border-b border-rose-200"
            >
              DEVIASI
            </th>
          </tr>

          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <th className="p-2.5 text-right bg-blue-50/50 border-r border-slate-200 w-24">
              PU
            </th>
            <th className="p-2.5 text-right bg-blue-50/50 border-r border-slate-200 w-24">
              BK
            </th>
            <th className="p-2.5 text-right bg-blue-50/50 border-r border-slate-200 w-20">
              BK/PU
            </th>

            <th className="p-2.5 text-right bg-emerald-50/50 border-r border-slate-200 w-24">
              PU
            </th>
            <th className="p-2.5 text-right bg-emerald-50/50 border-r border-slate-200 w-24">
              BK
            </th>
            <th className="p-2.5 text-right bg-emerald-50/50 border-r border-slate-200 w-20">
              BK/PU
            </th>

            <th className="p-2.5 text-right bg-rose-50/50 border-r border-slate-200 w-24">
              PU
            </th>
            <th className="p-2.5 text-right bg-rose-50/50 border-r border-slate-200 w-24">
              BK
            </th>
            <th className="p-2.5 text-right bg-rose-50/50 w-24">LK</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tableData.length === 0 ? (
            <tr>
              <td
                colSpan="12"
                className="p-8 text-center text-slate-400 font-medium"
              >
                Tidak ada data proyek untuk periode ini
              </td>
            </tr>
          ) : (
            tableData.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 text-center text-slate-500 border-r border-slate-100">
                  {idx + 1}
                </td>
                <td className="p-2.5 font-bold text-slate-800 border-r border-slate-100 break-words whitespace-normal">
                  {item.nama}
                </td>
                <td className="p-2.5 text-right font-semibold text-slate-700 border-r border-slate-100 font-mono">
                  {formatNumber(item.nk)}
                </td>

                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.rkapPu)}
                </td>
                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.rkapBk)}
                </td>
                <td className="p-2.5 text-right font-medium text-slate-500 border-r border-slate-100 bg-blue-50/30 font-mono">
                  {renderFinancial(item.rkapBkpu, true)}
                </td>

                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.realPu)}
                </td>
                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.realBk)}
                </td>
                <td className="p-2.5 text-right font-medium text-slate-500 border-r border-slate-100 bg-emerald-50/30 font-mono">
                  {renderFinancial(item.realBkpu, true)}
                </td>

                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.devPu)}
                </td>
                <td className="p-2.5 text-right font-mono">
                  {renderFinancial(item.devBk)}
                </td>
                <td className="p-2.5 text-right font-bold bg-rose-50/30 font-mono">
                  {renderFinancial(item.devLk)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[360px]">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity
                size={14}
                className="text-[#000075]"
                strokeWidth={2.5}
              />
              RKAP VS REALISASI
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">
              Perbandingan budget anggaran dan realisasi proyek diurutkan
              defisit LK
            </p>
          </div>
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

      {/* MODAL VIEW */}
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
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  MATRIKS RKAP VS REALISASI
                </h3>
                <p className="text-xs text-slate-500">
                  Menampilkan data kumulatif s.d bulan berjalan
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Minimize2 size={16} />
              </button>
            </div>
            <RenderTableContent isFullView />
          </div>
        </div>
      )}
    </>
  );
}
