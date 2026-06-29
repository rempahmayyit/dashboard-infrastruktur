import React, { useMemo, useState } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";

// Helper Penyeragaman ID Proyek
const getProjectId = (row) =>
  row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

const SlideEvaluasiRkap = () => {
  const { excelData, globalFilter } = useFilter();
  const [sortMode, setSortMode] = useState("LK");

  // ==========================================================
  // PENGOLAHAN DATA DINAMIS & PENGELOMPOKAN SUB-HEADER
  // ==========================================================
  const tableData = useMemo(() => {
    const masterData = excelData?.db_master_data || [];
    const rkapData = excelData?.db_rkap_awal || [];
    const realisasiData = excelData?.db_realisasi || [];

    const monthMap = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6,
      Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12,
    };
    const selectedYear = Number(globalFilter?.tahun || 2026);
    const selectedMonth = monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

    const projectMap = {};

    // 1. Inisialisasi dari Master Data + Lookup kolom nonjo_joi
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (!id) return;

      const namaProyek = getDisplayName(p);
      
      // Lookup nilai spesifik dari kolom nonjo_joi
      const nonJoJoiValue = String(p.nonjo_joi || "").toUpperCase().trim();
      let isJO = false;
      
      if (nonJoJoiValue) {
        // Jika datanya ada, baca dari kolom (JOI / JO, tapi bukan NON JO)
        isJO = (nonJoJoiValue.includes("JOI") || nonJoJoiValue.includes("JO")) && !nonJoJoiValue.includes("NON");
      } else {
        // Fallback jika di master data kolom tersebut masih kosong
        isJO = namaProyek.toUpperCase().includes(" JO") || namaProyek.toUpperCase().includes(" JOP") || namaProyek.toUpperCase().includes(" JOI");
      }

      projectMap[id] = {
        id,
        nama: namaProyek,
        nk: Number(p.nk_current || p.nilai_kontrak || 0),
        isJO: isJO,
        rkapPu: 0, rkapBk: 0,
        realPu: 0, realBk: 0,
      };
    });

    const aggregateData = (sourceData, prefix) => {
      sourceData.forEach((row) => {
        const id = getProjectId(row);

        if (id && !projectMap[id]) {
          const rawName = row.nama_proyek || row.project_name || `Proyek Tidak Dikenal (${id})`;
          
          // Lookup susulan ke masterData jika proyek muncul on-the-fly di transaksi
          const masterRow = masterData.find((m) => getProjectId(m) === id);
          const nonJoJoiValue = masterRow ? String(masterRow.nonjo_joi || "").toUpperCase().trim() : "";
          
          let isJO = false;
          if (nonJoJoiValue) {
            isJO = (nonJoJoiValue.includes("JOI") || nonJoJoiValue.includes("JO")) && !nonJoJoiValue.includes("NON");
          } else {
            isJO = rawName.toUpperCase().includes(" JO") || rawName.toUpperCase().includes(" JOP") || rawName.toUpperCase().includes(" JOI");
          }
          
          projectMap[id] = {
            id,
            nama: rawName,
            nk: 0, isJO: isJO,
            rkapPu: 0, rkapBk: 0, realPu: 0, realBk: 0,
          };
        }

        if (!id || !projectMap[id]) return;

        let rowMonth = Number(row.bulan_index);
        if (!rowMonth && row.bulan) {
          const textBulan = String(row.bulan).toLowerCase().substring(0, 3);
          const bMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6, jul: 7, agu: 8, aug: 8, sep: 9, okt: 10, nov: 11, des: 12, dec: 12 };
          rowMonth = bMap[textBulan] || 0;
        }

        const rowYear = Number(row.tahun);
        let isStatusValid = true;
        if (prefix === "rkap" && row.rkap_status) {
          isStatusValid = String(row.rkap_status).toLowerCase().includes("awal");
        }

        if (rowYear === selectedYear && rowMonth > 0 && rowMonth <= selectedMonth && isStatusValid) {
          if (prefix === "rkap") {
            projectMap[id].rkapPu += Number(row.pu_rkap_parsial || 0);
            projectMap[id].rkapBk += Number(row.bk_rkap_parsial || 0);
          } else {
            projectMap[id].realPu += Number(row.pu_real_parsial || 0);
            projectMap[id].realBk += Number(row.bk_real_parsial || 0);
          }
        }
      });
    };

    aggregateData(rkapData, "rkap");
    aggregateData(realisasiData, "real");

    const processedData = Object.values(projectMap)
      .map((p) => {
        p.rkapBkpu = p.rkapPu > 0 ? (p.rkapBk / p.rkapPu) * 100 : 0;
        p.realBkpu = p.realPu > 0 ? (p.realBk / p.realPu) * 100 : 0;

        p.devPu = p.realPu - p.rkapPu;
        p.devBk = p.realBk - p.rkapBk;
        p.devLk = p.devPu - p.devBk;

        p.nk /= 1000000; p.rkapPu /= 1000000; p.rkapBk /= 1000000;
        p.realPu /= 1000000; p.realBk /= 1000000;
        p.devPu /= 1000000; p.devBk /= 1000000; p.devLk /= 1000000;

        return p;
      })
      .filter((p) => p.rkapPu !== 0 || p.rkapBk !== 0 || p.realPu !== 0 || p.realBk !== 0);

    const nonJoList = processedData.filter(p => !p.isJO).sort((a, b) => sortMode === "PU" ? a.devPu - b.devPu : a.devLk - b.devLk);
    const joList = processedData.filter(p => p.isJO).sort((a, b) => sortMode === "PU" ? a.devPu - b.devPu : a.devLk - b.devLk);

    let urut = 1;
    nonJoList.forEach(item => item.displayNo = urut++);
    joList.forEach(item => item.displayNo = urut++);

    const calcSummary = (list) => {
      const acc = list.reduce(
        (sum, curr) => {
          sum.nk += curr.nk; sum.rkapPu += curr.rkapPu; sum.rkapBk += curr.rkapBk;
          sum.realPu += curr.realPu; sum.realBk += curr.realBk;
          sum.devPu += curr.devPu; sum.devBk += curr.devBk; sum.devLk += curr.devLk;
          return sum;
        },
        { nk: 0, rkapPu: 0, rkapBk: 0, realPu: 0, realBk: 0, devPu: 0, devBk: 0, devLk: 0 }
      );
      acc.rkapBkpu = acc.rkapPu > 0 ? (acc.rkapBk / acc.rkapPu) * 100 : 0;
      acc.realBkpu = acc.realPu > 0 ? (acc.realBk / acc.realPu) * 100 : 0;
      return acc;
    };

    const finalData = [];
    
    if (nonJoList.length > 0) {
      finalData.push({ isSubHeader: true, id: "sub-non-jo", nama: "NON JO", ...calcSummary(nonJoList) });
      finalData.push(...nonJoList);
    }
    
    if (joList.length > 0) {
      finalData.push({ isSubHeader: true, id: "sub-jo", nama: "JOI", ...calcSummary(joList) });
      finalData.push(...joList);
    }

    return finalData;
  }, [excelData, globalFilter, sortMode]);

  // ==========================================================
  // KALKULASI TOTAL KUMULATIF
  // ==========================================================
  const summary = useMemo(() => {
    const rawData = tableData.filter(r => !r.isSubHeader);
    const total = rawData.reduce(
      (acc, curr) => {
        acc.nk += curr.nk; acc.rkapPu += curr.rkapPu; acc.rkapBk += curr.rkapBk;
        acc.realPu += curr.realPu; acc.realBk += curr.realBk;
        acc.devPu += curr.devPu; acc.devBk += curr.devBk; acc.devLk += curr.devLk;
        return acc;
      },
      { nk: 0, rkapPu: 0, rkapBk: 0, realPu: 0, realBk: 0, devPu: 0, devBk: 0, devLk: 0 }
    );

    total.rkapPct = total.rkapPu > 0 ? (total.rkapBk / total.rkapPu) * 100 : 0;
    total.realPct = total.realPu > 0 ? (total.realBk / total.realPu) * 100 : 0;

    return total;
  }, [tableData]);

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
          ({formatted}{suffix})
        </span>
      );
    }
    return `${formatted}${suffix}`;
  };

  const thStyle = {
    backgroundColor: "#163261", color: "white", textAlign: "center",
    padding: "5px 3px", border: "1px solid #ffffff", fontWeight: "bold",
    lineHeight: "1.2", fontSize: "11px",
  };
  const thRedStyle = { ...thStyle, backgroundColor: "#a50000" };
  const thGreenStyle = { ...thStyle, backgroundColor: "#22c55e" };
  const tdStyle = {
    padding: "4px 6px", border: "1px solid #e5e7eb", whiteSpace: "nowrap",
    lineHeight: "1.1", fontSize: "10.5px", fontVariantNumeric: "tabular-nums",
  };

  // ==========================================================
  // PAGINATION LOGIC
  // ==========================================================
  const ROWS_PER_PAGE = 21; 
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
          sectionNumber="6"
          slideTitle={`EVALUASI "RKAP VS REALISASI" (${pageIndex}/${totalPages})`}
        >
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            
            {/* TOOLBAR: TOMBOL FILTER */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px", gap: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#64748B", alignSelf: "center", marginRight: "4px" }}>
                Urutkan berdasarkan:
              </span>
              <button
                onClick={() => setSortMode("LK")}
                style={{
                  padding: "4px 10px", fontSize: "10px", fontWeight: "bold",
                  cursor: "pointer", borderRadius: "4px", border: "1px solid",
                  backgroundColor: sortMode === "LK" ? "#DC2626" : "#ffffff",
                  color: sortMode === "LK" ? "#ffffff" : "#64748B",
                  borderColor: sortMode === "LK" ? "#DC2626" : "#CBD5E1"
                }}
              >
                Dev. LK
              </button>
              <button
                onClick={() => setSortMode("PU")}
                style={{
                  padding: "4px 10px", fontSize: "10px", fontWeight: "bold",
                  cursor: "pointer", borderRadius: "4px", border: "1px solid",
                  backgroundColor: sortMode === "PU" ? "#2563EB" : "#ffffff",
                  color: sortMode === "PU" ? "#ffffff" : "#64748B",
                  borderColor: sortMode === "PU" ? "#2563EB" : "#CBD5E1"
                }}
              >
                Dev. PU
              </button>
            </div>

            <div style={{ overflow: "hidden" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <thead>
                  <tr>
                    <th rowSpan={2} style={thStyle}>No.</th>
                    <th rowSpan={2} style={thStyle}>Nama Proyek</th>
                    <th rowSpan={2} style={thStyle}>NK</th>
                    <th colSpan={3} style={thStyle}>RKAP S.d Bulan Ini</th>
                    <th colSpan={3} style={thRedStyle}>Real S.d Bulan Ini</th>
                    <th colSpan={3} style={thGreenStyle}>Dev.</th>
                  </tr>
                  <tr>
                    <th style={thStyle}>PU<br />1</th>
                    <th style={thStyle}>BK<br />2</th>
                    <th style={thStyle}>BK/PU<br />3=2/1</th>
                    <th style={thRedStyle}>PU<br />4</th>
                    <th style={thRedStyle}>BK<br />5</th>
                    <th style={thRedStyle}>BK/PU<br />6=5/4</th>
                    <th style={thGreenStyle}>PU<br />7=4-1</th>
                    <th style={thGreenStyle}>BK<br />8=5-2</th>
                    <th style={thGreenStyle}>LK<br />9=7-8</th>
                  </tr>
                </thead>
                <tbody>
                  {/* SUMMARY ROW DINAMIS KESELURUHAN */}
                  <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    <td colSpan={2} style={{ ...tdStyle, textAlign: "center" }}>
                      TOTAL NON JO/JOP & JOI
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.nk)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.rkapPu)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.rkapBk)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.rkapPct, true)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.realPu)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.realBk)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.realPct, true)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.devPu)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.devBk)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(summary.devLk)}</td>
                  </tr>

                  {/* DATA ROWS (Termasuk Sub-Header) */}
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="12" style={{ ...tdStyle, textAlign: "center", padding: "20px", color: "#64748b" }}>
                        Tidak ada data proyek untuk periode ini
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => {
                      if (row.isSubHeader) {
                        return (
                          <tr key={row.id} style={{ backgroundColor: "#F8FAFC", fontWeight: "bold" }}>
                            <td colSpan={2} style={{ ...tdStyle, textAlign: "center", color: "#0F172A", padding: "6px" }}>
                              {row.nama}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.nk)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapPu)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapBk)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapBkpu, true)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realPu)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realBk)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realBkpu, true)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devPu)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devBk)}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devLk)}</td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={row.id}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#e6f0fa" : "#ffffff",
                          }}
                        >
                          <td style={{ ...tdStyle, textAlign: "center" }}>{row.displayNo}</td>
                          <td style={{ ...tdStyle, textAlign: "left", width: "250px", whiteSpace: "normal" }}>
                            {row.nama}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.nk)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapPu)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapBk)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.rkapBkpu, true)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realPu)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realBk)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.realBkpu, true)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devPu)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devBk)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{renderFinancial(row.devLk)}</td>
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

export default SlideEvaluasiRkap;