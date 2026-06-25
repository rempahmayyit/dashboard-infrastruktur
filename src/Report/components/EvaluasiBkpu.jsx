import React, { useMemo } from "react";
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

const SlideEvaluasiBkpu = () => {
  const { excelData, globalFilter } = useFilter();

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
  const nextMonthNum = currentMonthNum + 1; // Untuk rencana bulan depan

  // ==========================================================
  // PENGOLAHAN DATA DINAMIS
  // ==========================================================
  const tableData = useMemo(() => {
    const masterData = excelData?.db_master_data || [];
    const realData = excelData?.db_realisasi || [];
    const rencEbData = excelData?.db_renc_eb || []; // Data EB

    const projectMap = {};

    // 1. INISIALISASI MASTER DATA
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

      const puMapp = safeParseNumber(p.pu_mapp_kumulatif_current);
      const bkMapp = safeParseNumber(p.bk_mapp_kumulatif_current);

      projectMap[id] = {
        id,
        nama: getDisplayName(p),
        nk: safeParseNumber(p.nk_current || p.nilai_kontrak || 0),
        isJO: isJO,
        progressFisikMaster: safeParseNumber(
          p.progress || p.progres || p.prog || 0,
        ),
        // MAPP = BK MAPP / PU MAPP
        mapp: puMapp > 0 ? (bkMapp / puMapp) * 100 : 0,

        puLalu: 0,
        realPuSd: 0, // Realisasi Kumulatif s.d Bulan Ini

        r1Pu: 0,
        r1Bk: 0, // Rencana Bulan Ini (Parsial)
        evPu: 0,
        evBk: 0, // Evaluasi Bulan Ini (Realisasi Parsial)
        r2Pu: 0,
        r2Bk: 0, // Rencana Bulan Depan (Parsial)
      };
    });

    // Helper Pencarian Bulan yang Aman
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

    const getDynamicValue = (item, typeKey, sourceName) => {
      // Prioritaskan nama kolom eksplisit jika sourceName diberikan
      if (sourceName === "real") {
        let exact =
          item[`${typeKey}_realisasi_parsial`] ??
          item[`${typeKey}_Realisasi_Parsial`];
        if (exact !== undefined && exact !== null)
          return safeParseNumber(exact);
      } else if (sourceName === "renc") {
        let exact =
          item[`${typeKey}_renc_parsial`] ?? item[`${typeKey}_Renc_Parsial`];
        if (exact !== undefined && exact !== null)
          return safeParseNumber(exact);
      }

      // Fallback sapu jagat
      const keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i].toLowerCase();
        if (k.includes(typeKey) && k.includes("parsial")) {
          return safeParseNumber(item[keys[i]]);
        }
      }
      return safeParseNumber(item[typeKey] || 0);
    };

    // 2. AGREGASI REALISASI (Historis, Kumulatif s.d Bulan Ini, dan Parsial Bulan Ini)
    realData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      const id = getProjectId(row);
      if (!id || !projectMap[id]) return;

      if (y < selectedYear) {
        projectMap[id].puLalu += getDynamicValue(row, "pu", "real");
      } else if (y === selectedYear) {
        const m = getValidMonth(row);
        const puVal = getDynamicValue(row, "pu", "real");
        const bkVal = getDynamicValue(row, "bk", "real");

        // Kumulatif s.d Bulan Terpilih
        if (m > 0 && m <= currentMonthNum) {
          projectMap[id].realPuSd += puVal;
        }

        // Evaluasi Parsial Bulan Ini
        if (m === currentMonthNum) {
          projectMap[id].evPu += puVal;
          projectMap[id].evBk += bkVal;
        }
      }
    });

    // 3. AGREGASI RENCANA EB (Bulan Ini & Bulan Depan Parsial)
    rencEbData.forEach((row) => {
      if (safeParseNumber(row.tahun) !== selectedYear) return;

      const id = getProjectId(row);
      if (!id || !projectMap[id]) return;

      const m = getValidMonth(row);
      const puVal = getDynamicValue(row, "pu", "renc");
      const bkVal = getDynamicValue(row, "bk", "renc");

      if (m === currentMonthNum) {
        projectMap[id].r1Pu += puVal;
        projectMap[id].r1Bk += bkVal;
      } else if (m === nextMonthNum) {
        projectMap[id].r2Pu += puVal;
        projectMap[id].r2Bk += bkVal;
      }
    });

    // 4. KALKULASI TURUNAN & PEMBAGIAN KE JUTAAN (1 Juta = /1000000)
    const processedData = Object.values(projectMap)
      .map((p) => {
        p.nk /= 1e6;
        p.puLalu /= 1e6;
        p.realPuSd /= 1e6;

        p.r1Pu /= 1e6;
        p.r1Bk /= 1e6;
        p.evPu /= 1e6;
        p.evBk /= 1e6;
        p.r2Pu /= 1e6;
        p.r2Bk /= 1e6;

        // Hitung Persentase BK/PU
        p.r1Pct = p.r1Pu > 0 ? (p.r1Bk / p.r1Pu) * 100 : 0;
        p.evPct = p.evPu > 0 ? (p.evBk / p.evPu) * 100 : 0;
        p.r2Pct = p.r2Pu > 0 ? (p.r2Bk / p.r2Pu) * 100 : 0;

        // Real Prog s.d Bulan Ini
        if (p.progressFisikMaster > 0) {
          p.realProg = p.progressFisikMaster;
        } else {
          p.realProg = p.nk > 0 ? ((p.puLalu + p.realPuSd) / p.nk) * 100 : 0;
        }

        // Renc Prog s.d Bulan Depan (Asumsi: Realisasi s.d Saat Ini + Rencana Parsial Bulan Depan)
        p.rencProg =
          p.nk > 0 ? ((p.puLalu + p.realPuSd + p.r2Pu) / p.nk) * 100 : 0;

        return p;
      })
      // Hanya tampilkan jika ada aktivitas transaksi (di Realisasi atau Rencana EB)
      .filter(
        (p) =>
          p.r1Pu !== 0 ||
          p.r1Bk !== 0 ||
          p.evPu !== 0 ||
          p.evBk !== 0 ||
          p.r2Pu !== 0 ||
          p.r2Bk !== 0,
      );

    // 5. SPLIT & SORT (Non JO / JO)
    // Diurutkan berdasarkan deviasi evaluasi (misal: evBk/evPu terbesar, atau evBk terbesar)
    // Di sini saya urutkan default berdasarkan Evaluasi BK terbesar
    const nonJoList = processedData
      .filter((p) => !p.isJO)
      .sort((a, b) => b.evBk - a.evBk);
    const joList = processedData
      .filter((p) => p.isJO)
      .sort((a, b) => b.evBk - a.evBk);

    let urut = 1;
    nonJoList.forEach((item) => (item.displayNo = urut++));
    joList.forEach((item) => (item.displayNo = urut++));

    // Helper Summary Per Grup
    const calcSummary = (list) => {
      const acc = list.reduce(
        (sum, c) => {
          sum.nk += c.nk;
          sum.puLalu += c.puLalu;
          sum.realPuSd += c.realPuSd;
          sum.r1Pu += c.r1Pu;
          sum.r1Bk += c.r1Bk;
          sum.evPu += c.evPu;
          sum.evBk += c.evBk;
          sum.r2Pu += c.r2Pu;
          sum.r2Bk += c.r2Bk;
          // Note: MAPP is an average percentage, so we don't strictly sum it,
          // we'll leave it blank for group headers or average it. Leaving it 0 is safer.
          return sum;
        },
        {
          nk: 0,
          puLalu: 0,
          realPuSd: 0,
          r1Pu: 0,
          r1Bk: 0,
          evPu: 0,
          evBk: 0,
          r2Pu: 0,
          r2Bk: 0,
        },
      );

      acc.r1Pct = acc.r1Pu > 0 ? (acc.r1Bk / acc.r1Pu) * 100 : 0;
      acc.evPct = acc.evPu > 0 ? (acc.evBk / acc.evPu) * 100 : 0;
      acc.r2Pct = acc.r2Pu > 0 ? (acc.r2Bk / acc.r2Pu) * 100 : 0;

      acc.realProg =
        acc.nk > 0 ? ((acc.puLalu + acc.realPuSd) / acc.nk) * 100 : 0;
      acc.rencProg =
        acc.nk > 0
          ? ((acc.puLalu + acc.realPuSd + acc.r2Pu) / acc.nk) * 100
          : 0;
      acc.mapp = null; // Tidak relevan di-sum untuk grup total

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
  }, [excelData, globalFilter, selectedYear, currentMonthNum, nextMonthNum]);

  // ==========================================================
  // KALKULASI TOTAL KUMULATIF KESELURUHAN
  // ==========================================================
  const summary = useMemo(() => {
    const rawData = tableData.filter((r) => !r.isSubHeader);
    const acc = rawData.reduce(
      (sum, c) => {
        sum.nk += c.nk;
        sum.puLalu += c.puLalu;
        sum.realPuSd += c.realPuSd;
        sum.r1Pu += c.r1Pu;
        sum.r1Bk += c.r1Bk;
        sum.evPu += c.evPu;
        sum.evBk += c.evBk;
        sum.r2Pu += c.r2Pu;
        sum.r2Bk += c.r2Bk;
        return sum;
      },
      {
        nk: 0,
        puLalu: 0,
        realPuSd: 0,
        r1Pu: 0,
        r1Bk: 0,
        evPu: 0,
        evBk: 0,
        r2Pu: 0,
        r2Bk: 0,
      },
    );

    acc.r1Pct = acc.r1Pu > 0 ? (acc.r1Bk / acc.r1Pu) * 100 : 0;
    acc.evPct = acc.evPu > 0 ? (acc.evBk / acc.evPu) * 100 : 0;
    acc.r2Pct = acc.r2Pu > 0 ? (acc.r2Bk / acc.r2Pu) * 100 : 0;
    acc.realProg =
      acc.nk > 0 ? ((acc.puLalu + acc.realPuSd) / acc.nk) * 100 : 0;
    acc.rencProg =
      acc.nk > 0 ? ((acc.puLalu + acc.realPuSd + acc.r2Pu) / acc.nk) * 100 : 0;
    acc.mapp = null;

    return acc;
  }, [tableData]);

  // ==========================================================
  // HELPER FORMAT & STYLING
  // ==========================================================
  const renderFinancial = (num, isPercent = false) => {
    if (num === null) return ""; // Untuk nilai MAPP di baris total
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
  const thRedStyle = { ...thStyle, backgroundColor: "#a50000" };
  const thGreenStyle = { ...thStyle, backgroundColor: "#22c55e" };
  const tdStyle = {
    padding: "4px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
    fontSize: "9.5px",
    fontVariantNumeric: "tabular-nums",
  };

  // ==========================================================
  // PAGINATION LOGIC
  // ==========================================================
  const ROWS_PER_PAGE = 22;
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
          sectionNumber="9"
          slideTitle={`EVALUASI BK/PU BULAN INI (${pageIndex}/${totalPages})`}
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
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <thead>
                  {/* MAIN HEADERS */}
                  <tr>
                    <th rowSpan={2} style={thStyle}>
                      No.
                    </th>
                    <th rowSpan={2} style={thStyle}>
                      Nama Proyek
                    </th>
                    <th rowSpan={2} style={thStyle}>
                      NK
                    </th>
                    <th colSpan={3} style={thStyle}>
                      Renc. Bln. Ini EB-01 (Parsial)
                    </th>
                    <th rowSpan={2} style={thStyle}>
                      Real. Prog.
                      <br />
                      Sd Bln. Ini
                      <br />
                      <br />2
                    </th>
                    <th colSpan={3} style={thRedStyle}>
                      Evaluasi Bulan Ini (Parsial)
                    </th>
                    <th rowSpan={2} style={thStyle}>
                      MAPP
                      <br />
                      <br />
                      <br />6
                    </th>
                    <th rowSpan={2} style={thGreenStyle}>
                      Renc.
                      <br />
                      Prog. Sd
                      <br />
                      Bln Depan
                      <br />7
                    </th>
                    <th colSpan={3} style={thGreenStyle}>
                      Rencana Bulan Depan (Parsial)
                    </th>
                  </tr>
                  {/* SUB HEADERS */}
                  <tr>
                    <th style={thStyle}>
                      PU
                      <br />1
                    </th>
                    <th style={thStyle}>
                      BK
                      <br />2
                    </th>
                    <th style={thStyle}>
                      BK/PU
                      <br />2
                    </th>

                    <th style={thRedStyle}>
                      PU
                      <br />3
                    </th>
                    <th style={thRedStyle}>
                      BK
                      <br />4
                    </th>
                    <th style={thRedStyle}>
                      BK/PU
                      <br />
                      5=4/3
                    </th>

                    <th style={thGreenStyle}>
                      PU
                      <br />8
                    </th>
                    <th style={thGreenStyle}>
                      BK
                      <br />9
                    </th>
                    <th style={thGreenStyle}>
                      BK/PU
                      <br />
                      10=9/8
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
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.r1Pu)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.r1Bk)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {renderFinancial(summary.r1Pct, true)}
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
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#DC2626",
                      }}
                    >
                      {renderFinancial(summary.evPu)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#DC2626",
                      }}
                    >
                      {renderFinancial(summary.evBk)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#DC2626",
                      }}
                    >
                      {renderFinancial(summary.evPct, true)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}></td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#16A34A",
                      }}
                    >
                      {renderFinancial(summary.rencProg, true)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#000075",
                      }}
                    >
                      {renderFinancial(summary.r2Pu)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#000075",
                      }}
                    >
                      {renderFinancial(summary.r2Bk)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        color: "#000075",
                      }}
                    >
                      {renderFinancial(summary.r2Pct, true)}
                    </td>
                  </tr>

                  {/* DATA ROWS */}
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="15"
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
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.r1Pu)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.r1Bk)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              {renderFinancial(row.r1Pct, true)}
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
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#DC2626",
                              }}
                            >
                              {renderFinancial(row.evPu)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#DC2626",
                              }}
                            >
                              {renderFinancial(row.evBk)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#DC2626",
                              }}
                            >
                              {renderFinancial(row.evPct, true)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}></td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#16A34A",
                              }}
                            >
                              {renderFinancial(row.rencProg, true)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#000075",
                              }}
                            >
                              {renderFinancial(row.r2Pu)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#000075",
                              }}
                            >
                              {renderFinancial(row.r2Bk)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                color: "#000075",
                              }}
                            >
                              {renderFinancial(row.r2Pct, true)}
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
                              width: "180px",
                              whiteSpace: "normal",
                            }}
                          >
                            {row.nama}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.nk)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.r1Pu)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.r1Bk)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.r1Pct, true)}
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
                            {renderFinancial(row.evPu)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.evBk)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.evPct, true)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.mapp, true)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.rencProg, true)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.r2Pu)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {renderFinancial(row.r2Bk)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {renderFinancial(row.r2Pct, true)}
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

export default SlideEvaluasiBkpu;
