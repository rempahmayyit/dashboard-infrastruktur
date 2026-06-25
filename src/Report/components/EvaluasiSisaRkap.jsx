import React, { useMemo, useState } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";

// Helper Penyeragaman ID Proyek
const getProjectId = (row) =>
  row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

// Helper Keamanan Angka
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const SlideEvaluasiSisaRkap = () => {
  const { excelData, globalFilter } = useFilter();

  const [showOngoingOnly, setShowOngoingOnly] = useState(true);
  const [sortMode, setSortMode] = useState("sisa"); // sisa | pencapaian

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
  const currentMonthNum =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;
  const sisaBulanNum = 12 - currentMonthNum;

  // ==========================================================
  // PENGOLAHAN DATA DINAMIS
  // ==========================================================
  const tableData = useMemo(() => {
    const masterData = excelData?.db_master_data || [];
    const rkapData = excelData?.db_rkap_awal || [];
    const realData = excelData?.db_realisasi || [];

    const projectMap = {};

    // 1. Inisialisasi & Lookup Master Data
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (!id) return;

      const nonJoJoiValue = String(p.nonjo_joi || "")
        .toUpperCase()
        .trim();
      let isJO = false;
      if (nonJoJoiValue) {
        isJO =
          (nonJoJoiValue.includes("JOI") || nonJoJoiValue.includes("JO")) &&
          !nonJoJoiValue.includes("NON");
      } else {
        const namaProyek = getDisplayName(p).toUpperCase();
        isJO =
          namaProyek.includes(" JO") ||
          namaProyek.includes(" JOP") ||
          namaProyek.includes(" JOI");
      }

      projectMap[id] = {
        id,
        nama: getDisplayName(p),
        statusProject: String(
          p.status_proyek ?? p.status_project ?? p.status_project_current ?? "",
        )
          .trim()
          .toUpperCase(),
        nk: safeParseNumber(p.nk_current || p.nilai_kontrak || 0),
        isJO: isJO,
        progressFisikMaster: safeParseNumber(
          p.progress || p.progres || p.prog || 0,
        ), // Dari db_master jika ada
        puLalu: 0,
        rkapPuAn: 0,
        rkapBkAn: 0,
        realPuSd: 0,
        realBkSd: 0,
      };
    });

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
        if (
          k.includes(typeKey) &&
          (k.includes("real") || k.includes("parsial"))
        ) {
          return safeParseNumber(item[keys[i]]);
        }
      }
      return 0;
    };

    const getValidMonth = (row) => {
      let m = safeParseNumber(row.bulan_index);
      if (!m && row.bulan) {
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
          sep: 9,
          okt: 10,
          nov: 11,
          des: 12,
        };
        m = bMap[textBulan] || 0;
      }
      return m;
    };

    // 2. Agregasi RKAP ANNUAL (Mengambil seluruh bulan dalam tahun terpilih)
    rkapData.forEach((row) => {
      if (safeParseNumber(row.tahun) !== selectedYear) return;
      if (
        !String(row.rkap_status || "")
          .toLowerCase()
          .includes("awal")
      )
        return;

      const id = getProjectId(row);
      if (!id || !projectMap[id]) return;

      projectMap[id].rkapPuAn += safeParseNumber(
        row.pu_rkap_parsial || row.PU_RKAP_Parsial,
      );
      projectMap[id].rkapBkAn += safeParseNumber(
        row.bk_rkap_parsial || row.BK_RKAP_Parsial,
      );
    });

    // 3. Agregasi REALISASI (Termasuk historis tahun lalu)
    realData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      const id = getProjectId(row);
      if (!id || !projectMap[id]) return;

      if (y < selectedYear) {
        // Kalkulasi PU Tahun Lalu
        projectMap[id].puLalu += getDynamicValue(row, "pu");
      } else if (y === selectedYear) {
        const m = getValidMonth(row);
        if (m > 0 && m <= currentMonthNum) {
          projectMap[id].realPuSd += getDynamicValue(row, "pu");
          projectMap[id].realBkSd += getDynamicValue(row, "bk");
        }
      }
    });

    // 4. KALKULASI TURUNAN & PEMBAGIAN KE JUTAAN
    let processedData = Object.values(projectMap)
      .map((p) => {
        // Normalisasi ke Milyar / Juta sesuai kebutuhan Anda (di sini dibagi 1 juta)
        p.nk /= 1e6;
        p.puLalu /= 1e6;
        p.rkapPuAn /= 1e6;
        p.rkapBkAn /= 1e6;
        p.realPuSd /= 1e6;
        p.realBkSd /= 1e6;

        p.rkapLkAn = p.rkapPuAn - p.rkapBkAn;
        p.realLkSd = p.realPuSd - p.realBkSd;

        // Sisa Thd RKAP Annual
        p.sisaPu = p.rkapPuAn - p.realPuSd;
        p.sisaBk = p.rkapBkAn - p.realBkSd;
        p.sisaLk = p.rkapLkAn - p.realLkSd;

        // RKAP Prog: (PU Historis + RKAP Target Annual) / NK
        p.rkapProg = p.nk > 0 ? ((p.puLalu + p.rkapPuAn) / p.nk) * 100 : 0;

        // Real Prog: Gunakan data progress DB jika ada, jika tidak fallback ke hitungan agregat
        if (p.progressFisikMaster > 0) {
          p.realProg = p.progressFisikMaster;
        } else {
          p.realProg = p.nk > 0 ? ((p.puLalu + p.realPuSd) / p.nk) * 100 : 0;
        }

        // Rata-rata PU
        p.rataReal = p.realPuSd / currentMonthNum;
        p.rataSisa = sisaBulanNum > 0 ? p.sisaPu / sisaBulanNum : 0;
        p.pencapaian = p.rataSisa !== 0 ? (p.rataReal / p.rataSisa) * 100 : 0;

        return p;
      })
      .filter((p) => p.rkapPuAn !== 0 || p.realPuSd !== 0);

    // ==========================================================
    // FILTER & SORT
    // ==========================================================

    // Filter On Going
    if (showOngoingOnly) {
      processedData = processedData.filter((p) =>
        p.statusProject.replace(/\s+/g, "").includes("ONGOING"),
      );
    }

    // Sort
    const sorter =
      sortMode === "sisa"
        ? (a, b) => b.sisaPu - a.sisaPu
        : (a, b) => a.pencapaian - b.pencapaian;

    // Group
    const nonJoList = processedData.filter((p) => !p.isJO).sort(sorter);

    const joList = processedData.filter((p) => p.isJO).sort(sorter);

    let urut = 1;
    nonJoList.forEach((item) => (item.displayNo = urut++));
    joList.forEach((item) => (item.displayNo = urut++));

    const calcSummary = (list) => {
      const acc = list.reduce(
        (sum, c) => {
          sum.nk += c.nk;
          sum.puLalu += c.puLalu;
          sum.rkapPuAn += c.rkapPuAn;
          sum.rkapBkAn += c.rkapBkAn;
          sum.rkapLkAn += c.rkapLkAn;
          sum.realPuSd += c.realPuSd;
          sum.realBkSd += c.realBkSd;
          sum.realLkSd += c.realLkSd;
          sum.sisaPu += c.sisaPu;
          sum.sisaBk += c.sisaBk;
          sum.sisaLk += c.sisaLk;
          return sum;
        },
        {
          nk: 0,
          puLalu: 0,
          rkapPuAn: 0,
          rkapBkAn: 0,
          rkapLkAn: 0,
          realPuSd: 0,
          realBkSd: 0,
          realLkSd: 0,
          sisaPu: 0,
          sisaBk: 0,
          sisaLk: 0,
        },
      );

      acc.rkapProg =
        acc.nk > 0 ? ((acc.puLalu + acc.rkapPuAn) / acc.nk) * 100 : 0;
      acc.realProg =
        acc.nk > 0 ? ((acc.puLalu + acc.realPuSd) / acc.nk) * 100 : 0; // Summary selalu agregat matematis
      acc.rataReal = acc.realPuSd / currentMonthNum;
      acc.rataSisa = sisaBulanNum > 0 ? acc.sisaPu / sisaBulanNum : 0;
      acc.pencapaian =
        acc.rataSisa !== 0 ? (acc.rataReal / acc.rataSisa) * 100 : 0;

      return acc;
    };

    const finalData = [];
    if (nonJoList.length > 0) {
      finalData.push({
        isSubHeader: true,
        id: "sub-non-jo",
        nama: "NON JO / JOP",
        ...calcSummary(nonJoList),
      });
      finalData.push(...nonJoList);
    }
    if (joList.length > 0) {
      finalData.push({
        isSubHeader: true,
        id: "sub-jo",
        nama: "JOI",
        ...calcSummary(joList),
      });
      finalData.push(...joList);
    }

    return finalData;
  }, [
    excelData,
    globalFilter,
    selectedYear,
    currentMonthNum,
    sisaBulanNum,
    showOngoingOnly,
    sortMode,
  ]);

  // ==========================================================
  // KALKULASI TOTAL KUMULATIF SELURUHNYA
  // ==========================================================
  const summary = useMemo(() => {
    const rawData = tableData.filter((r) => !r.isSubHeader);
    const acc = rawData.reduce(
      (sum, c) => {
        sum.nk += c.nk;
        sum.puLalu += c.puLalu;
        sum.rkapPuAn += c.rkapPuAn;
        sum.rkapBkAn += c.rkapBkAn;
        sum.rkapLkAn += c.rkapLkAn;
        sum.realPuSd += c.realPuSd;
        sum.realBkSd += c.realBkSd;
        sum.realLkSd += c.realLkSd;
        sum.sisaPu += c.sisaPu;
        sum.sisaBk += c.sisaBk;
        sum.sisaLk += c.sisaLk;
        return sum;
      },
      {
        nk: 0,
        puLalu: 0,
        rkapPuAn: 0,
        rkapBkAn: 0,
        rkapLkAn: 0,
        realPuSd: 0,
        realBkSd: 0,
        realLkSd: 0,
        sisaPu: 0,
        sisaBk: 0,
        sisaLk: 0,
      },
    );

    acc.rkapProg =
      acc.nk > 0 ? ((acc.puLalu + acc.rkapPuAn) / acc.nk) * 100 : 0;
    acc.realProg =
      acc.nk > 0 ? ((acc.puLalu + acc.realPuSd) / acc.nk) * 100 : 0;
    acc.rataReal = acc.realPuSd / currentMonthNum;
    acc.rataSisa = sisaBulanNum > 0 ? acc.sisaPu / sisaBulanNum : 0;
    acc.pencapaian =
      acc.rataSisa !== 0 ? (acc.rataReal / acc.rataSisa) * 100 : 0;

    return acc;
  }, [tableData, currentMonthNum, sisaBulanNum]);

  // ==========================================================
  // HELPER FORMAT & STYLING
  // ==========================================================
  const renderFinancial = (num, isPercent = false) => {
    if (!num && num !== 0) return "-";
    const formatted = formatNumber(Math.abs(num), isPercent ? 2 : 0);
    const suffix = isPercent ? "%" : "";

    if (num < 0) {
      return (
        <span style={{ color: "#DC2626", fontWeight: "bold" }}>
          ({formatted}
          {suffix})
        </span>
      );
    }
    return `${formatted}${suffix}`;
  };

  const thStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "5px 3px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    lineHeight: "1.2",
    fontSize: "10px",
  };
  const tdStyle = {
    padding: "4px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
  };

  // ==========================================================
  // PAGINATION LOGIC
  // ==========================================================
  const ROWS_PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(tableData.length / ROWS_PER_PAGE));

  const pages = Array.from({ length: totalPages }).map((_, i) => {
    const startIndex = i * ROWS_PER_PAGE;
    return {
      pageIndex: i + 1,
      startIndex,
      data: tableData.slice(startIndex, startIndex + ROWS_PER_PAGE),
    };
  });

  return (
    <>
      {pages.map(({ pageIndex, data }) => (
        <ContentLayout
          key={pageIndex}
          pageNumber=""
          sectionNumber="12"
          slideTitle={`SISA TARGET DES. ${selectedYear} "PU & LK" (${pageIndex}/${totalPages})`}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                {/* FILTER */}
                <button
                  onClick={() => setShowOngoingOnly((v) => !v)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 15,
                    border: "1px solid #CBD5E1",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 10,
                    background: showOngoingOnly ? "#dc2626" : "#ffffff",
                    color: showOngoingOnly ? "#ffffff" : "#334155",
                  }}
                >
                  {showOngoingOnly ? "On Going" : "Semua"}
                </button>

                {/* SORT SISA PU */}
                <button
                  onClick={() => setSortMode("sisa")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 15,
                    border: "1px solid #CBD5E1",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 10,
                    background: sortMode === "sisa" ? "#dc2626" : "#ffffff",
                    color: sortMode === "sisa" ? "#ffffff" : "#334155",
                  }}
                >
                  Sisa PU
                </button>

                {/* SORT PENCAPAIAN */}
                <button
                  onClick={() => setSortMode("pencapaian")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 15,
                    border: "1px solid #CBD5E1",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 10,
                    background:
                      sortMode === "pencapaian" ? "#dc2626" : "#ffffff",
                    color: sortMode === "pencapaian" ? "#ffffff" : "#334155",
                  }}
                >
                  Pencapaian
                </button>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "10px",
                  fontFamily: "Arial, sans-serif",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <thead>
                  {/* MAIN HEADERS */}
                  <tr>
                    <th rowSpan={2} style={thStyle}>
                      No.
                    </th>
                    <th rowSpan={2} style={{ ...thStyle, minWidth: "160px" }}>
                      Nama Proyek
                    </th>
                    <th
                      rowSpan={2}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      NK
                    </th>
                    <th
                      rowSpan={2}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      RKAP Prog.
                      <br />
                      Sd. Des.
                      <br />'{String(selectedYear).substring(2)}
                      <br />1
                    </th>
                    <th
                      colSpan={3}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      RKAP Sd. Des. {selectedYear}
                      <br />
                      Annual
                    </th>
                    <th
                      rowSpan={2}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      Real. Prog.
                      <br />
                      Sd Bln. Ini
                      <br />5
                    </th>
                    <th
                      colSpan={3}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      Real. Sd. Bulan Ini
                    </th>
                    <th
                      colSpan={3}
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      Sisa Thd. RKAP Des. '{String(selectedYear).substring(2)}
                    </th>
                    <th colSpan={3} style={thStyle}>
                      Rata2 PU Per Bulan
                    </th>
                  </tr>
                  {/* SUB HEADERS */}
                  <tr>
                    <th style={thStyle}>
                      PU
                      <br />2
                    </th>
                    <th style={thStyle}>
                      BK
                      <br />3
                    </th>
                    <th
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      LK
                      <br />
                      4=2-3
                    </th>

                    <th style={thStyle}>
                      PU
                      <br />6
                    </th>
                    <th style={thStyle}>
                      BK
                      <br />7
                    </th>
                    <th
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      LK
                      <br />
                      8=6-7
                    </th>

                    <th style={thStyle}>
                      PU
                      <br />
                      10
                    </th>
                    <th style={thStyle}>
                      BK
                      <br />
                      11
                    </th>
                    <th
                      style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
                    >
                      LK
                      <br />
                      12=10-11
                    </th>

                    <th style={thStyle}>
                      Real.
                      <br />
                      13
                    </th>
                    <th style={thStyle}>
                      Sisa
                      <br />
                      14
                    </th>
                    <th style={thStyle}>
                      Pencapaian
                      <br />
                      15=13/14
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* SUMMARY ROW KESELURUHAN */}
                  <tr
                    style={{
                      backgroundColor: "#ffffff",
                      fontWeight: "bold",
                      borderBottom: "2px solid #000",
                    }}
                  >
                    <td colSpan={2} style={{ ...tdStyle, textAlign: "center" }}>
                      TOTAL KUMULATIF
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.nk)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#000075",
                      }}
                    >
                      {renderFinancial(summary.rkapProg, true)}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.rkapPuAn)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.rkapBkAn)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.rkapLkAn)}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#16A34A",
                      }}
                    >
                      {renderFinancial(summary.realProg, true)}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.realPuSd)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.realBkSd)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.realLkSd)}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.sisaPu)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.sisaBk)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.sisaLk)}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.rataReal)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.rataSisa)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.pencapaian, true)}
                    </td>
                  </tr>

                  {/* DATA ROWS */}
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="17"
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          padding: "20px",
                          color: "#64748b",
                        }}
                      >
                        Tidak ada data proyek untuk periode ini
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => {
                      if (row.isSubHeader) {
                        return (
                          <tr
                            key={row.id}
                            style={{
                              backgroundColor: "#F8FAFC",
                              fontWeight: "bold",
                            }}
                          >
                            <td
                              colSpan={2}
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                                color: "#0F172A",
                                padding: "6px",
                              }}
                            >
                              {row.nama}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.nk)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#000075",
                              }}
                            >
                              {renderFinancial(row.rkapProg, true)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.rkapPuAn)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.rkapBkAn)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.rkapLkAn)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#16A34A",
                              }}
                            >
                              {renderFinancial(row.realProg, true)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.realPuSd)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.realBkSd)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.realLkSd)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#DC2626",
                              }}
                            >
                              {renderFinancial(row.sisaPu)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.sisaBk)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.sisaLk)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.rataReal)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.rataSisa)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.pencapaian, true)}
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={row.id}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#e6f0fa" : "#ffffff",
                          }}
                        >
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {row.displayNo}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "left",
                              width: "100%",
                              whiteSpace: "normal",
                            }}
                          >
                            {row.nama}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.nk)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.rkapProg, true)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.rkapPuAn)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.rkapBkAn)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.rkapLkAn)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.realProg, true)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.realPuSd)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.realBkSd)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.realLkSd)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              color: "#DC2626",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.sisaPu)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.sisaBk)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.sisaLk)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.rataReal)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              color: "#16A34A",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.rataSisa)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.pencapaian, true)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ContentLayout>
      ))}
    </>
  );
};
export default SlideEvaluasiSisaRkap;
