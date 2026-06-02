// src/PemasaranAnggaran.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FileText, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { supabase } from "./lib/supabase";
import { useFilter } from "./context/FilterContext";
import ModuleOverlay from "./components/ModuleOverlay";

// TETAP IMPORT DATA STATIS UNTUK KPI, TABEL & PIE CHART (Sesuai permintaan)
import { marketingPipeline, marketClusterData } from "./data";

const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const formatCurr = (val) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(val);

export default function PemasaranAnggaran() {
  const COLORS = ["#000075", "#3b82f6", "#eab308", "#64748b"];

  // Ambil RKAP Pemasaran dari FilterContext
  const { excelData } = useFilter();

  // State khusus untuk menarik Realisasi
  const [realisasiData, setRealisasiData] = useState([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  const currentMonthNum = new Date().getMonth() + 1; // 1 - 12

  // ======================================================================
  // 1. FETCH DATA REALISASI KHUSUS UNTUK GRAFIK (Tanpa sentuh yang bawah)
  // ======================================================================
  useEffect(() => {
    const fetchRealisasi = async () => {
      setIsLoadingChart(true);
      const { data, error } = await supabase
        .from("db_pemasaran_realisasi")
        .select("*");
      if (!error && data) {
        setRealisasiData(data);
      }
      setIsLoadingChart(false);
    };

    fetchRealisasi();

    const channel = supabase
      .channel("pemasaran-grafik-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_pemasaran_realisasi" },
        () => {
          fetchRealisasi();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ======================================================================
  // 2. ENGINE KALKULASI HANYA UNTUK GRAFIK ATAS
  // ======================================================================
  const { chartData, totalPrognosaDes } = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const rkapData = excelData?.db_pemasaran_rkap || [];

    const getMonthNum = (mStr) => {
      const str = String(mStr || "")
        .toLowerCase()
        .trim();
      const parsed = parseInt(str, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) return parsed;
      const arrayBulan = [
        "jan",
        "feb",
        "mar",
        "apr",
        "mei",
        "jun",
        "jul",
        "agu",
        "sep",
        "okt",
        "nov",
        "des",
      ];
      const idx = arrayBulan.findIndex((b) => str.startsWith(b));
      if (idx !== -1) return idx + 1;
      return 0;
    };

    let kumulatifRKAP = 0;
    let kumulatifReal = 0;
    let kumulatifProg = 0;

    const generatedChartData = monthNames.map((mName, index) => {
      const targetBulanAngka = index + 1;

      const rkapBulanIni =
        rkapData
          .filter(
            (item) =>
              getMonthNum(item.bulan_perolehan || item.periode) ===
              targetBulanAngka,
          )
          .reduce(
            (sum, item) => sum + safeParseNumber(item.estimasi_nilai),
            0,
          ) / 1_000_000_000;

      const dataRelBulanIni = realisasiData.filter(
        (item) => getMonthNum(item.bulan_perolehan) === targetBulanAngka,
      );
      const realisasiA0 =
        dataRelBulanIni
          .filter((i) => i.status_perolehan === "A0")
          .reduce(
            (sum, item) => sum + safeParseNumber(item.nilai_perolehan),
            0,
          ) / 1_000_000_000;
      const prognosaTotal =
        dataRelBulanIni
          .filter((i) =>
            ["A0", "A1", "A2", "B1", "B2"].includes(i.status_perolehan),
          )
          .reduce(
            (sum, item) => sum + safeParseNumber(item.nilai_perolehan),
            0,
          ) / 1_000_000_000;

      kumulatifRKAP += rkapBulanIni;
      kumulatifProg += prognosaTotal;

      let result = {
        month: mName,
        bulananRKAP: Number(rkapBulanIni.toFixed(1)),
        bulananPrognosa: Number(prognosaTotal.toFixed(1)),
        rkapKumulatif: Number(kumulatifRKAP.toFixed(1)),
        prognosaKumulatif: Number(kumulatifProg.toFixed(1)),
      };

      if (targetBulanAngka <= currentMonthNum) {
        kumulatifReal += realisasiA0;
        result.realisasiKumulatif = Number(kumulatifReal.toFixed(1));
      } else {
        result.realisasiKumulatif = null; // Putuskan garis realisasi di bulan berjalan
      }

      return result;
    });

    const progDes = generatedChartData[11]?.prognosaKumulatif || 0;

    return { chartData: generatedChartData, totalPrognosaDes: progDes };
  }, [excelData, realisasiData, currentMonthNum]);

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${isLoadingChart ? "opacity-60 pointer-events-none" : "opacity-100 animate-fadeIn"}`}
    >
      {/* ================================================================= */}
      {/* BAGIAN ATAS: GRAFIK (SUDAH DINAMIS DARI SUPABASE)                 */}
      {/* ================================================================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#000075]" />
              Monitoring Perolehan NKB, Realisasi & Prognosa 12 Bulan (Jan -
              Des)
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Sumbu Kiri (Batang): Nilai Bulanan // Sumbu Kanan (Garis Kurva-S):
              Nilai Akumulatif (Milyar)
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-600">
            Total Prognosa Des:{" "}
            <span className="font-bold text-emerald-600">
              {formatCurr(totalPrognosaDes)} M
            </span>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 25, right: 15, bottom: 5, left: -5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                style={{ fontSize: 11, fontWeight: "bold" }}
              />

              <YAxis yAxisId="left" stroke="#94a3b8" style={{ fontSize: 10 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                style={{ fontSize: 10 }}
              />

              <Tooltip formatter={(value) => formatCurr(value) + " M"} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />

              <Bar
                yAxisId="left"
                dataKey="bulananRKAP"
                fill="#93c5fd"
                opacity={0.75}
                barSize={16}
                name="RKAP Bulanan"
              >
                <LabelList
                  dataKey="bulananRKAP"
                  position="top"
                  formatter={(val) => (val > 0 ? formatCurr(val) : "")}
                  style={{ fill: "#1e40af", fontSize: 9, fontWeight: "600" }}
                />
              </Bar>
              <Bar
                yAxisId="left"
                dataKey="bulananPrognosa"
                fill="#86efac"
                opacity={0.85}
                barSize={16}
                name="Prognosa Bulanan"
              >
                <LabelList
                  dataKey="bulananPrognosa"
                  position="top"
                  formatter={(val) => (val > 0 ? formatCurr(val) : "")}
                  style={{ fill: "#166534", fontSize: 9, fontWeight: "600" }}
                />
              </Bar>

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rkapKumulatif"
                stroke="#3b82f6"
                strokeWidth={2.5}
                name="Garis RKAP Kumulatif"
              >
                <LabelList
                  dataKey="rkapKumulatif"
                  position="left"
                  formatter={(val) => (val > 0 ? formatCurr(val) : "")}
                  style={{ fill: "#1d4ed8", fontSize: 9, fontWeight: "bold" }}
                />
              </Line>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="realisasiKumulatif"
                stroke="#BD002F"
                strokeWidth={3}
                connectNulls
                dot={{ fill: "#BD002F", r: 4 }}
                name="Garis Realisasi Kumulatif"
              >
                <LabelList
                  dataKey="realisasiKumulatif"
                  position="right"
                  formatter={(val) => (val > 0 ? formatCurr(val) : "")}
                  style={{ fill: "#BD002F", fontSize: 10, fontWeight: "black" }}
                />
              </Line>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="prognosaKumulatif"
                stroke="#10b981"
                strokeWidth={2.5}
                name="Garis Prognosa Kumulatif"
              >
                <LabelList
                  dataKey="prognosaKumulatif"
                  position="top"
                  formatter={(val) => (val > 0 ? formatCurr(val) : "")}
                  style={{ fill: "#0f766e", fontSize: 10, fontWeight: "black" }}
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BAGIAN BAWAH: KARTU, TABEL, PIE CHART (TETAP STATIS)              */}
      {/* ================================================================= */}

      {/* KARTU METRIK UTAMA PEMASARAN */}
      <div className="dashboard-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Total Pipeline Tender
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">2.930 M</h3>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            5 Paket Proyek Strategis
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Win Rate Tender YTD
          </p>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">64.2 %</h3>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Di atas standar target BUMN
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Sisa Target NKB '26
          </p>
          <h3 className="text-2xl font-black text-[#BD002F] mt-2">5.416,4 M</h3>
          <span className="text-[11px] text-red-500 font-semibold mt-1 block">
            Target Akhir Tahun: 6.690 M
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Total Jaminan (Bid Bond)
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">146,5 M</h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            4 Bank BUMN aktif
          </span>
        </div>
      </div>

      {/* STRUKTUR GRID BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="dashboard-card lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-full flex flex-col">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
              <FileText size={14} className="text-[#000075]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Monitoring Prospek Pasar & Penawaran Aktif
              </span>
            </div>
            <div className="overflow-y-auto max-h-[220px] flex-1 scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 shadow-sm z-10">
                  <tr>
                    <th className="p-2.5 pl-4">Nama Paket Tender</th>
                    <th className="p-2.5">Pemberi Tugas</th>
                    <th className="p-2.5 text-right">Estimasi Nilai</th>
                    <th className="p-2.5 text-center">Status Tender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marketingPipeline.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td
                        className="p-2.5 pl-4 font-bold text-slate-800 truncate max-w-[220px]"
                        title={item.paket}
                      >
                        {item.paket}
                      </td>
                      <td className="p-2.5 text-slate-600 font-medium">
                        {item.owner}
                      </td>
                      <td className="p-2.5 text-right font-black text-blue-700">
                        {item.nilai}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "Tahap Evaluasi" ||
                            item.status === "Klarifikasi Teknis"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Klaster Komposisi Pasar
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Segmentasi Owner proyek divisi infrastruktur
            </p>
          </div>

          <div className="w-full h-[180px] my-2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={marketClusterData}
                  dataKey="value"
                  outerRadius={60}
                  innerRadius={35}
                >
                  {marketClusterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
            {marketClusterData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 truncate"
                title={item.name}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: COLORS[idx] }}
                ></span>
                <span className="truncate">
                  {item.value}% {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModuleOverlay/>
    </div>
  );
}
