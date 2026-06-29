import React, { useMemo } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";

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
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5,
      jun: 6, jul: 7, agu: 8, sep: 9, okt: 10, nov: 11, des: 12,
    };
    m = bMap[tBulan] || 0;
  }
  if (!m && row.periode) {
    const d = new Date(row.periode);
    if (!isNaN(d.getTime())) m = d.getMonth() + 1;
  }
  return m;
};

// ==========================================================
// KOMPONEN UTAMA
// ==========================================================
const SlideMonitoringBudget = () => {
  const { excelData, globalFilter } = useFilter();

  const monthMap = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6,
    Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12,
  };
  const currentMonthNum = monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;
  const selectedYear = Number(globalFilter?.tahun || 2026);

  // ==========================================================
  // KALKULASI DATA DINAMIS & PENGELOMPOKAN
  // ==========================================================
  const tableData = useMemo(() => {
    const sapData = excelData?.db_sap || [];
    const realisasiData = excelData?.db_realisasi || [];
    const masterData = excelData?.db_master_data || [];

    // 1. Mapping Master Data (Nama Proyek, NK, JO Status)
    const projectInfo = {};
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (id) {
        const nonJoJoiValue = String(p.nonjo_joi || "").toUpperCase().trim();
        let isJO = false;
        if (nonJoJoiValue) {
          isJO = (nonJoJoiValue.includes("JOI") || nonJoJoiValue.includes("JO")) && !nonJoJoiValue.includes("NON");
        } else {
          const namaProyek = getDisplayName(p).toUpperCase();
          isJO = namaProyek.includes(" JO") || namaProyek.includes(" JOP") || namaProyek.includes(" JOI");
        }

        projectInfo[id] = {
          name: getDisplayName(p),
          isJO,
          nk: safeParseNumber(p.nk_current || p.nilai_kontrak || 0),
        };
      }
    });

    // 2. Mapping Progress Fisik dari db_realisasi
    const progressMap = {};
    realisasiData.forEach((r) => {
      if (safeParseNumber(r.tahun) === selectedYear && getValidMonth(r) === currentMonthNum) {
        const id = getProjectId(r);
        if (id) {
          progressMap[id] = safeParseNumber(r.prog_real ?? r.progress_real ?? r.progres_fisik ?? r.progress ?? 0);
        }
      }
    });

    // 3. Agregasi Data SAP
    const sapMap = {};
    sapData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      const m = getValidMonth(row);

      if (y === selectedYear && m === currentMonthNum) {
        const id = getProjectId(row);
        if (!id) return;

        if (!sapMap[id]) {
          sapMap[id] = {
            id,
            nama: projectInfo[id]?.name || row.nama_proyek || id,
            isJO: projectInfo[id]?.isJO || false,
            nk: projectInfo[id]?.nk || 0,
            prog: progressMap[id] || 0,
            mapp: 0,
            cost: 0,
            preq: 0,
            pord: 0,
          };
        }

        sapMap[id].mapp += safeParseNumber(row.budget_sap);
        sapMap[id].cost += safeParseNumber(row.bk_sap_kumulatif);
        sapMap[id].preq += safeParseNumber(row.preq);
        sapMap[id].pord += safeParseNumber(row.pord);
      }
    });

    // 4. Kalkulasi Kolom Turunan
    const processedData = Object.values(sapMap).map((item) => {
      const terpakai = item.mapp > 0 ? (item.cost / item.mapp) * 100 : 0;
      const dev = item.prog - terpakai;
      const available = item.mapp - item.cost - item.preq - item.pord;

      return {
        ...item,
        terpakai,
        dev,
        available,
        weightedProg: item.prog * item.nk, // Untuk perhitungan rata-rata progres di level grup
      };
    });

    // 5. Split & Sort (Non JO / JO) - Diurutkan berdasarkan Deviasi (Minus Terbesar di Atas)
    const nonJoList = processedData.filter((p) => !p.isJO).sort((a, b) => a.dev - b.dev);
    const joList = processedData.filter((p) => p.isJO).sort((a, b) => a.dev - b.dev);

    let urut = 1;
    nonJoList.forEach((item) => (item.displayNo = urut++));
    joList.forEach((item) => (item.displayNo = urut++));

    // Helper Summary Per Grup
    const calcSummary = (list) => {
      const sum = list.reduce((acc, c) => {
        acc.nk += c.nk;
        acc.weightedProg += c.weightedProg;
        acc.mapp += c.mapp;
        acc.cost += c.cost;
        acc.preq += c.preq;
        acc.pord += c.pord;
        acc.available += c.available;
        return acc;
      }, { nk: 0, weightedProg: 0, mapp: 0, cost: 0, preq: 0, pord: 0, available: 0 });

      sum.prog = sum.nk > 0 ? (sum.weightedProg / sum.nk) : 0;
      sum.terpakai = sum.mapp > 0 ? (sum.cost / sum.mapp) * 100 : 0;
      sum.dev = sum.prog - sum.terpakai;
      return sum;
    };

    const finalData = [];
    if (nonJoList.length > 0) {
      finalData.push({ isSubHeader: true, id: "sub-non-jo", nama: "NON JO / JOP", ...calcSummary(nonJoList) });
      finalData.push(...nonJoList);
    }
    if (joList.length > 0) {
      finalData.push({ isSubHeader: true, id: "sub-jo", nama: "JOI", ...calcSummary(joList) });
      finalData.push(...joList);
    }

    return finalData;
  }, [excelData, selectedYear, currentMonthNum]);

  // ==========================================================
  // KALKULASI TOTAL KUMULATIF KESELURUHAN
  // ==========================================================
  const summaryTotal = useMemo(() => {
    const rawData = tableData.filter((r) => !r.isSubHeader);
    const sum = rawData.reduce((acc, c) => {
      acc.nk += c.nk;
      acc.weightedProg += c.weightedProg;
      acc.mapp += c.mapp;
      acc.cost += c.cost;
      acc.preq += c.preq;
      acc.pord += c.pord;
      acc.available += c.available;
      return acc;
    }, { nk: 0, weightedProg: 0, mapp: 0, cost: 0, preq: 0, pord: 0, available: 0 });

    sum.prog = sum.nk > 0 ? (sum.weightedProg / sum.nk) : 0;
    sum.terpakai = sum.mapp > 0 ? (sum.cost / sum.mapp) * 100 : 0;
    sum.dev = sum.prog - sum.terpakai;
    return sum;
  }, [tableData]);

  // ==========================================================
  // HELPER FORMAT TAMPILAN
  // ==========================================================
  const formatVal = (val) => {
    if (!val || val === 0) return "-";
    return formatNumber(val / 1e6, 0);
  };

  const formatPct = (val) => {
    if (val === null || isNaN(val)) return "0.00%";
    return `${val.toFixed(2)}%`;
  };

  // Styles
  const thStyle = { padding: "8px 4px", border: "1px solid #fff", color: "#fff", textAlign: "center", fontSize: "10px", backgroundColor: "#002060" };
  const tdStyle = { padding: "6px 4px", border: "1px solid #E5E7EB", fontSize: "10px", textAlign: "right", whiteSpace: "nowrap" };

  // ==========================================================
  // PAGINATION LOGIC
  // ==========================================================
  const ROWS_PER_PAGE = 18;
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
          sectionNumber="14"
          slideTitle={`MONITORING PEMAKAIAN BUDGET (${pageIndex}/${totalPages})`}
        >
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, overflow: "hidden", marginTop: "10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
                <thead>
                  <tr>
                    <th rowSpan={3} style={thStyle}>No.</th>
                    <th rowSpan={3} style={thStyle}>ID Project</th>
                    <th rowSpan={3} style={{ ...thStyle, minWidth: "150px" }}>Nama Proyek</th>
                    <th rowSpan={3} style={thStyle}>Progres<br />Fisik</th>
                    <th colSpan={7} style={thStyle}>Monitoring Budget</th>
                  </tr>
                  <tr>
                    <th rowSpan={2} style={thStyle}>Budget MAPP</th>
                    <th rowSpan={2} style={thStyle}>Actual Cost</th>
                    <th rowSpan={2} style={thStyle}>% Terpakai</th>
                    <th rowSpan={2} style={{ ...thStyle, background: "#C00000" }}>Dev.</th>
                    <th colSpan={2} style={thStyle}>Cost Commitment</th>
                    <th rowSpan={2} style={thStyle}>Available<br />Budget</th>
                  </tr>
                  <tr>
                    <th style={thStyle}>PReq</th>
                    <th style={thStyle}>POrd</th>
                  </tr>
                </thead>
                <tbody>
                  {/* SUMMARY ROW KESELURUHAN (Hanya muncul di halaman pertama untuk konteks, atau bisa di setiap halaman) */}
                  <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: "#0F172A" }}>TOTAL KUMULATIF</td>
                    <td style={{ ...tdStyle, textAlign: "center", color: "#16A34A" }}>{formatPct(summaryTotal.prog)}</td>
                    <td style={tdStyle}>{formatVal(summaryTotal.mapp)}</td>
                    <td style={tdStyle}>{formatVal(summaryTotal.cost)}</td>
                    <td style={tdStyle}>{formatPct(summaryTotal.terpakai)}</td>
                    <td style={{ ...tdStyle, color: summaryTotal.dev < 0 ? "#C00000" : "#16A34A" }}>{formatPct(summaryTotal.dev)}</td>
                    <td style={tdStyle}>{formatVal(summaryTotal.preq)}</td>
                    <td style={tdStyle}>{formatVal(summaryTotal.pord)}</td>
                    <td style={{ ...tdStyle, color: summaryTotal.available < 0 ? "#C00000" : "#0F172A" }}>{formatVal(summaryTotal.available)}</td>
                  </tr>
                  
                  {/* SECTION HEADER ON GOING */}
                  <tr style={{ background: "#F1F5F9", fontWeight: "bold" }}>
                    <td colSpan={11} style={{ ...tdStyle, textAlign: "left", paddingLeft: "15px", color: "#002060" }}>
                      On Going
                    </td>
                  </tr>

                  {/* DATA ROWS */}
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ ...tdStyle, textAlign: "center", padding: "20px", color: "#64748B" }}>
                        Tidak ada data untuk periode ini.
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => {
                      const isDevMinus = row.dev < 0;

                      if (row.isSubHeader) {
                        return (
                          <tr key={row.id} style={{ backgroundColor: "#F8FAFC", fontWeight: "bold" }}>
                            <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: "#0F172A" }}>{row.nama}</td>
                            <td style={{ ...tdStyle, textAlign: "center", color: "#16A34A" }}>{formatPct(row.prog)}</td>
                            <td style={tdStyle}>{formatVal(row.mapp)}</td>
                            <td style={tdStyle}>{formatVal(row.cost)}</td>
                            <td style={tdStyle}>{formatPct(row.terpakai)}</td>
                            <td style={{ ...tdStyle, color: isDevMinus ? "#C00000" : "#16A34A" }}>{formatPct(row.dev)}</td>
                            <td style={tdStyle}>{formatVal(row.preq)}</td>
                            <td style={tdStyle}>{formatVal(row.pord)}</td>
                            <td style={{ ...tdStyle, color: row.available < 0 ? "#C00000" : "#0F172A" }}>{formatVal(row.available)}</td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? "#e6f0fa" : "#ffffff" }}>
                          <td style={{ ...tdStyle, textAlign: "center" }}>{row.displayNo}</td>
                          <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>{row.id}</td>
                          <td style={{ ...tdStyle, textAlign: "left", whiteSpace: "normal" }}>{row.nama}</td>
                          <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold", color: "#16A34A" }}>{formatPct(row.prog)}</td>
                          <td style={tdStyle}>{formatVal(row.mapp)}</td>
                          <td style={tdStyle}>{formatVal(row.cost)}</td>
                          <td style={{ ...tdStyle, fontWeight: "bold" }}>{formatPct(row.terpakai)}</td>
                          <td style={{ 
                            ...tdStyle, 
                            color: isDevMinus ? "#C00000" : "#16A34A", 
                            background: isDevMinus ? "#FFE4E1" : "transparent", 
                            fontWeight: "bold" 
                          }}>
                            {formatPct(row.dev)}
                          </td>
                          <td style={tdStyle}>{formatVal(row.preq)}</td>
                          <td style={tdStyle}>{formatVal(row.pord)}</td>
                          <td style={{ ...tdStyle, fontWeight: "bold", color: row.available < 0 ? "#C00000" : "#0F172A" }}>
                            {formatVal(row.available)}
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

export default SlideMonitoringBudget;