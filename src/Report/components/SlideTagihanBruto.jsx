import React, { useMemo, useState } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

// ==========================================================
// HELPERS PENGOLAHAN DATA
// ==========================================================
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const getProjectId = (row) =>
  row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

const getValidMonth = (row) => {
  let m = safeParseNumber(row.bulan_index);
  if (!m && row.bulan) {
    const tBulan = String(row.bulan).toLowerCase().substring(0, 3);
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
      sep: 9,
      okt: 10,
      nov: 11,
      des: 12,
    };
    m = bMap[tBulan] || 0;
  }
  if (!m && row.periode) {
    const d = new Date(row.periode);
    if (!isNaN(d.getTime())) m = d.getMonth() + 1;
  }
  return m;
};

const getDynamicValue = (item, typeKey) => {
  let exactMatch =
    item[`${typeKey}_realisasi_parsial`] ??
    item[`${typeKey}_Realisasi_Parsial`] ??
    item[`${typeKey}_realisasi`];
  if (exactMatch !== undefined && exactMatch !== null)
    return safeParseNumber(exactMatch);

  const keys = Object.keys(item);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i].toLowerCase();
    if (k.includes(typeKey) && (k.includes("real") || k.includes("parsial"))) {
      return safeParseNumber(item[keys[i]]);
    }
  }
  return 0;
};

// ==========================================================
// KOMPONEN UTAMA
// ==========================================================
const SlideTagihanBruto = () => {
  const { excelData, globalFilter } = useFilter();
  
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jenisFilter, setJenisFilter] = useState("ALL");

  const monthShortNames = [
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

  const currentMonthNum =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;
  const selectedYear = Number(globalFilter?.tahun || 2026);

  // Menentukan bulan lalu untuk komparasi tabel
  const prevMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
  const prevYearNum = currentMonthNum === 1 ? selectedYear - 1 : selectedYear;

  const currentMonthName = monthShortNames[currentMonthNum - 1];
  const prevMonthName = monthShortNames[prevMonthNum - 1];
  const shortYear = String(selectedYear).slice(-2);
  const shortPrevYear = String(prevYearNum).slice(-2);

  // ==========================================================
  // KALKULASI DATA TABEL & GRAFIK
  // ==========================================================
  const {
    tableLancar,
    tableTidakLancar,
    chartData,
    summaryLancar,
    summaryTidakLancar,
  } = useMemo(() => {
    const brutoData = excelData?.db_bruto_sap || [];
    const realisasiData = excelData?.db_realisasi || [];
    const masterData = excelData?.db_master_data || [];

    // --- 1. Mapping Informasi Dasar Proyek ---
    const projectInfo = {};
    masterData.forEach((p) => {
      const id = String(getProjectId(p));
      if (!id) return;

      projectInfo[id] = {
        id,
        name:
          p.display_name ||
          p.short_project_name ||
          p.project_name ||
          getDisplayName(p) ||
          id,

        status: String(p.status_proyek || "").toUpperCase(),

        jenisJo: String(p.nonjo_joi || "").toUpperCase(),
      };
    });

    const progressMap = {};
    realisasiData.forEach((r) => {
      if (
        safeParseNumber(r.tahun) === selectedYear &&
        getValidMonth(r) === currentMonthNum
      ) {
        const id = String(getProjectId(r));
        if (id) {
          progressMap[id] = safeParseNumber(
            r.prog_real ??
              r.progress_real ??
              r.progres_fisik ??
              r.progress ??
              0,
          );
        }
      }
    });

    // --- Helper Parsing Kolom Bruto ---
    const parseBrutoCols = (row) => {
      const g1 = safeParseNumber(
        row.aging_0_60 ?? row.g1 ?? row["0_60"] ?? row["0-60"],
      );
      const g2 = safeParseNumber(
        row.aging_60_180 ?? row.g2 ?? row["60_180"] ?? row["60-180"],
      );
      const g3 = safeParseNumber(
        row.aging_above180 ?? row.g3 ?? row["180_up"] ?? row[">180"],
      );
      const total = g1 + g2 + g3;
      return { g1, g2, g3, total };
    };

    const isLancarKategori = (row) => {
      const stat = String(
        row.status || row.kategori || row.keterangan || "",
      ).toLowerCase();
      if (
        stat.includes("tidak") ||
        stat.includes("kendala") ||
        stat.includes("macet") ||
        stat.includes("masalah")
      ) {
        return false;
      }
      return true;
    };

    // --- 2. Agregasi Data Tabel (Bulan Ini & Bulan Lalu) ---
    const projectMap = {};

    brutoData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      const m = getValidMonth(row);
      const id = String(getProjectId(row));
      if (!id) return;

      const { g1, g2, g3, total } = parseBrutoCols(row);
      const isLancar = isLancarKategori(row);

      if (!projectMap[id]) {
        projectMap[id] = {
          id,
          nama: projectInfo[id]?.name || row.project_name || id,
          status: projectInfo[id]?.status || "",
          jenisJo: projectInfo[id]?.jenisJo || "",
          progres: progressMap[id] || 0,
          isLancar,
          g1: 0,
          g2: 0,
          g3: 0,
          totalMei: 0,
          totalApr: 0, // Menggunakan totalMei/totalApr sebagai variabel current/prev
        };
      }

      // Jika data bulan ini
      if (y === selectedYear && m === currentMonthNum) {
        projectMap[id].isLancar = isLancar;
        projectMap[id].g1 += g1 / 1e6;
        projectMap[id].g2 += g2 / 1e6;
        projectMap[id].g3 += g3 / 1e6;
        projectMap[id].totalMei += total / 1e6;
      }

      // Jika data bulan lalu
      if (y === prevYearNum && m === prevMonthNum) {
        projectMap[id].totalApr += total / 1e6;
      }
    });

    const processedTable = Object.values(projectMap)
      .map((p) => ({ ...p, deviasi: p.totalMei - p.totalApr }))
      .filter((p) => p.totalMei !== 0 || p.totalApr !== 0)
      .filter((p) => {
        if (statusFilter === "ONGOING" && p.status !== "ON GOING") {
          return false;
        }

        // Filter jenis
        if (jenisFilter === "NON_JO" && p.jenisJo !== "NON JO") {
          return false;
        }

        if (jenisFilter === "JOI" && p.jenisJo !== "JOI") {
          return false;
        }

        return true;
      });

    // Sort descending berdasarkan Total Bruto Bulan Ini
    const listLancar = processedTable
      .filter((p) => p.isLancar)
      .sort((a, b) => b.totalMei - a.totalMei);
    const listTidakLancar = processedTable
      .filter((p) => !p.isLancar)
      .sort((a, b) => b.totalMei - a.totalMei);

    // Tambahkan Nomor Urut
    let urutL = 1;
    listLancar.forEach((p) => (p.no = urutL++));
    let urutTL = 1;
    listTidakLancar.forEach((p) => (p.no = urutTL++));

    // Summary
    const sumLancar = listLancar.reduce(
      (acc, c) => {
        acc.totalMei += c.totalMei;
        acc.totalApr += c.totalApr;
        acc.deviasi += c.deviasi;
        return acc;
      },
      { totalMei: 0, totalApr: 0, deviasi: 0 },
    );

    const sumTidakLancar = listTidakLancar.reduce(
      (acc, c) => {
        acc.totalMei += c.totalMei;
        acc.totalApr += c.totalApr;
        acc.deviasi += c.deviasi;
        return acc;
      },
      { totalMei: 0, totalApr: 0, deviasi: 0 },
    );

    // --- 3. Agregasi Data Chart Tren ---
    const trendArr = [];
    let cumPu = 0;

    for (let i = 1; i <= 12; i++) {
      let tagBrutoBulanIni = 0;
      let rawPuParsial = 0;

      brutoData.forEach((r) => {
        if (
          safeParseNumber(r.tahun) === selectedYear &&
          getValidMonth(r) === i
        ) {
          const { total } = parseBrutoCols(r);
          tagBrutoBulanIni += total / 1e6;
        }
      });

      realisasiData.forEach((r) => {
        if (
          safeParseNumber(r.tahun) === selectedYear &&
          getValidMonth(r) === i
        ) {
          rawPuParsial += getDynamicValue(r, "pu") / 1e6;
        }
      });
      cumPu += rawPuParsial;

      if (i <= currentMonthNum) {
        trendArr.push({
          name: monthShortNames[i - 1],
          tagBruto: Math.round(tagBrutoBulanIni),
          pu: Math.round(cumPu),
        });
      }
    }

    return {
      tableLancar: listLancar,
      tableTidakLancar: listTidakLancar,
      summaryLancar: sumLancar,
      summaryTidakLancar: sumTidakLancar,
      chartData: trendArr,
    };
  }, [
    excelData,
    selectedYear,
    currentMonthNum,
    prevMonthNum,
    prevYearNum,
    statusFilter,
    jenisFilter,
  ]);

  // ==========================================================
  // HELPER FORMAT & STYLE
  // ==========================================================
  const renderVal = (num) => {
    if (!num && num !== 0) return "-";
    return formatNumber(num, 0);
  };

  const renderPct = (num) => {
    if (!num || num === 0) return "-";
    return `${formatNumber(num, 2)}%`;
  };

  const SquareDot = (props) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <rect
        x={cx - 5}
        y={cy - 5}
        width={10}
        height={10}
        fill="#c80000"
        stroke="none"
      />
    );
  };

  const thStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "8px 4px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    lineHeight: "1.3",
    fontSize: "11px",
  };

  const tdStyle = {
    padding: "6px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    lineHeight: "1.2",
    fontSize: "11px",
  };

  const btnStyle = (active) => ({
    padding: "4px 12px",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "1px solid #163261",
    backgroundColor: active ? "#163261" : "#ffffff",
    color: active ? "#ffffff" : "#163261",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="15"
      slideTitle={"MONITORING TAGIHAN BRUTO"}
    >
      <div
        style={{ display: "flex", gap: "25px", width: "100%", height: "100%" }}
      >
        {/* LEFT SIDE: TABLE */}
        <div
          className="scrollbar-thin"
          style={{ flex: 1.6, overflowY: "auto", maxHeight: "100%" }}
        >
          {/* FILTER BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <button
              style={btnStyle(statusFilter === "ALL")}
              onClick={() => setStatusFilter("ALL")}
            >
              Semua
            </button>

            <button
              style={btnStyle(statusFilter === "ONGOING")}
              onClick={() => setStatusFilter("ONGOING")}
            >
              On Going
            </button>
            <button
              style={btnStyle(jenisFilter === "ALL")}
              onClick={() => setJenisFilter("ALL")}
            >
              Semua
            </button>

            <button
              style={btnStyle(jenisFilter === "JOI")}
              onClick={() => setJenisFilter("JOI")}
            >
              JOI
            </button>

            <button
              style={btnStyle(jenisFilter === "NON_JO")}
              onClick={() => setJenisFilter("NON_JO")}
            >
              Non JO
            </button>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <tr>
                <th rowSpan={2} style={thStyle}>
                  No.
                </th>
                <th rowSpan={2} style={{ ...thStyle, width: "180px" }}>
                  Nama Proyek
                </th>
                <th rowSpan={2} style={thStyle}>
                  Progres
                </th>
                <th colSpan={3} style={thStyle}>
                  Aging Tagihan Bruto
                </th>
                <th
                  rowSpan={2}
                  style={{
                    ...thStyle,
                    backgroundColor: "#a50000",
                    width: "78px",
                  }}
                >
                  Total Bruto
                  <br />
                  {currentMonthName} '{shortYear}
                  <br />
                  4=1+2+3
                </th>
                <th
                  rowSpan={2}
                  style={{
                    ...thStyle,
                    backgroundColor: "#008000",
                    width: "78px",
                  }}
                >
                  Total Bruto
                  <br />
                  {prevMonthName} '{shortPrevYear}
                  <br />5
                </th>
                <th
                  rowSpan={2}
                  style={{
                    ...thStyle,
                    backgroundColor: "#005b96",
                    width: "68px",
                  }}
                >
                  Deviasi
                  <br />
                  4-5
                </th>
              </tr>
              <tr>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>
                  0-60
                  <br />1
                </th>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>
                  60-180
                  <br />2
                </th>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>
                  {">180"}
                  <br />3
                </th>
              </tr>
            </thead>
            <tbody>
              {/* SECTION: LANCAR */}
              <tr style={{ backgroundColor: "#f3f4f6", fontWeight: "bold" }}>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td
                  style={{ ...tdStyle, textAlign: "left", fontWeight: "bold" }}
                >
                  Lancar
                </td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td
                  style={{ ...tdStyle, textAlign: "right", color: "#163261" }}
                >
                  {renderVal(summaryLancar.totalMei)}
                </td>
                <td
                  style={{ ...tdStyle, textAlign: "right", color: "#008000" }}
                >
                  {renderVal(summaryLancar.totalApr)}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    fontWeight: "bold",
                    color: summaryLancar.deviasi >= 0 ? "#c00000" : "#0b8f3d",
                  }}
                >
                  {renderVal(Math.abs(summaryLancar.deviasi))}
                </td>
              </tr>
              {tableLancar.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                tableLancar.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#e6f0fa" : "#ffffff",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {row.no}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "left",
                        whiteSpace: "normal",
                      }}
                    >
                      {row.nama}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#16A34A",
                      }}
                    >
                      {renderPct(row.progres)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g1)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g2)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g3)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {renderVal(row.totalMei)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {renderVal(row.totalApr)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                        color: row.deviasi >= 0 ? "#c00000" : "#0b8f3d",
                      }}
                    >
                      {renderVal(Math.abs(row.deviasi))}
                    </td>
                  </tr>
                ))
              )}

              {/* SECTION: TIDAK LANCAR */}
              <tr style={{ height: "15px" }}>
                <td
                  colSpan={9}
                  style={{ border: "none", backgroundColor: "#fff" }}
                ></td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6", fontWeight: "bold" }}>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "left",
                    whiteSpace: "normal",
                  }}
                >
                  Tidak Lancar (Kendala DIPA/Anggaran)
                </td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td
                  style={{ ...tdStyle, textAlign: "right", color: "#163261" }}
                >
                  {renderVal(summaryTidakLancar.totalMei)}
                </td>
                <td
                  style={{ ...tdStyle, textAlign: "right", color: "#008000" }}
                >
                  {renderVal(summaryTidakLancar.totalApr)}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    fontWeight: "bold",
                    color:
                      summaryTidakLancar.deviasi >= 0 ? "#c00000" : "#0b8f3d",
                  }}
                >
                  {renderVal(Math.abs(summaryTidakLancar.deviasi))}
                </td>
              </tr>
              {tableTidakLancar.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                tableTidakLancar.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#e6f0fa" : "#ffffff",
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {row.no}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "left",
                        whiteSpace: "normal",
                      }}
                    >
                      {row.nama}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#16A34A",
                      }}
                    >
                      {renderPct(row.progres)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g1)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g2)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderVal(row.g3)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {renderVal(row.totalMei)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {renderVal(row.totalApr)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                        color: row.deviasi >= 0 ? "#c00000" : "#0b8f3d",
                      }}
                    >
                      {renderVal(Math.abs(row.deviasi))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: CHART & NOTES */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              position: "relative",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "16px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                fontWeight: "900",
                fontSize: "16px",
                marginBottom: "10px",
                color: "#1e293b",
                textAlign: "center",
              }}
            >
              Tren Tagihan Bruto vs PU
            </div>
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 30, right: 20, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontWeight: "bold",
                      fill: "#475569",
                      dy: 10,
                    }}
                  />
                  <YAxis hide={true} domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(value) => formatNumber(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      fontWeight: "bold",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="plainline"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  />
                  <Line
                    type="linear"
                    dataKey="tagBruto"
                    name="Tag. Bruto"
                    stroke="#163261"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: "#163261", stroke: "none" }}
                  >
                    <LabelList
                      dataKey="tagBruto"
                      position="top"
                      offset={12}
                      formatter={(val) => formatNumber(val, 0)}
                      style={{ fill: "#163261", fontSize: 11, fontWeight: 900 }}
                    />
                  </Line>
                  <Line
                    type="linear"
                    dataKey="pu"
                    name="PU (Kumulatif)"
                    stroke="#c80000"
                    strokeWidth={2.5}
                    dot={<SquareDot />}
                  >
                    <LabelList
                      dataKey="pu"
                      position="bottom"
                      offset={12}
                      formatter={(val) => formatNumber(val, 0)}
                      style={{ fill: "#e05a2b", fontSize: 11, fontWeight: 900 }}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px dashed #cbd5e1",
              fontSize: "11px",
              color: "#475569",
              lineHeight: "1.5",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: "4px",
              }}
            >
              Note :
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ fontWeight: "bold" }}>1.</span>
              <span>
                Monitoring Tagihan bruto hanya proyek on going, diluar PDPK, JOI
                & Maintenance
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ fontWeight: "bold" }}>2.</span>
              <span>
                Data otomatis tersinkronisasi berdasarkan database terkini
                (Tahun {selectedYear}).
              </span>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideTagihanBruto;
