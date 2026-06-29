import React, { useState, useEffect } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext"; // Sesuaikan path ini
import { formatCompact } from "../../utils/formatters"; // Pastikan path ini sesuai
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

// Helper Keamanan Angka
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

// Helper Pendeteksi Kolom Otomatis
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

const SlideAgingStock = () => {
  const { excelData, globalFilter } = useFilter();
  const [chartData, setChartData] = useState([]);

  // ==========================================
  // STYLES (DIPERBESAR UNTUK KETERBACAAN)
  // ==========================================
  const thMainStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "6px 4px", // Padding diperbesar
    border: "1px solid #ffffff",
    fontWeight: "bold",
    fontSize: "12px", // Font diperbesar dari 10px
    lineHeight: "1.3",
  };

  const tdStyle = {
    padding: "5px 6px", // Padding diperbesar
    border: "1px solid #d1d5db",
    fontSize: "11px", // Font diperbesar dari 9.5px
    whiteSpace: "nowrap",
    lineHeight: "1.2",
    fontVariantNumeric: "tabular-nums",
  };

  const rightHeaderStyle = {
    backgroundColor: "#e5e7eb",
    padding: "6px 10px",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#163261",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid #163261",
  };

  // ==========================================
  // LOGIKA CHART (PU DARI FILTER + AGING DUMMY)
  // ==========================================
  const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6, Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12 };
  const currentMonthNum = monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;
  const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  useEffect(() => {
    try {
      const selectedYear = Number(globalFilter?.tahun || 2026);
      const rawRkapData = excelData?.db_rkap_awal || [];
      const rawRealisasiData = excelData?.db_realisasi || [];

      let cumulative_PU_rencana = 0;
      let cumulative_PU_realisasi = 0;

      // Data dummy untuk Aging Stock per bulan
      const dummyAgingStock = [12000, 13500, 15000, 14200, 16000, 15800, 17500, 18000, 16500, 19000, 20000, 21000];

      const resultChart = monthShortNames.map((mName, index) => {
        const monthNumber = index + 1;

        const filterDataBulanan = (rawDataArray, isRkap = false) => {
          return rawDataArray.filter((item) => {
            const itemYear = safeParseNumber(item.tahun);
            let itemMonth = safeParseNumber(item.bulan_index);
            if (itemMonth === 0 && item.bulan) {
              const textBulan = String(item.bulan).toLowerCase().substring(0, 3);
              const indexM = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"].indexOf(textBulan);
              itemMonth = indexM !== -1 ? indexM + 1 : safeParseNumber(item.bulan);
            }
            const isYearMonthMatch = itemYear === selectedYear && itemMonth === monthNumber;
            if (isRkap && isYearMonthMatch) {
              return String(item.rkap_status || "").toLowerCase().includes("awal");
            }
            return isYearMonthMatch;
          });
        };

        const rkapMonthData = filterDataBulanan(rawRkapData, true);
        const realisasiMonthData = filterDataBulanan(rawRealisasiData, false);

        cumulative_PU_rencana +=
          rkapMonthData.reduce((sum, item) => sum + safeParseNumber(item.pu_rkap_parsial || item.PU_RKAP_Parsial), 0) / 1000000000;
        
        cumulative_PU_realisasi +=
          realisasiMonthData.reduce((sum, item) => sum + getDynamicValue(item, "pu"), 0) / 1000000000;

        return {
          month: mName,
          puRencana: Number(cumulative_PU_rencana.toFixed(0)),
          puRealisasi: monthNumber <= currentMonthNum ? Number(cumulative_PU_realisasi.toFixed(0)) : null,
          agingStock: dummyAgingStock[index], // Dummy data dimasukkan ke chart
        };
      });

      setChartData(resultChart);
    } catch (error) {
      console.error("Error chart:", error);
    }
  }, [excelData, globalFilter, currentMonthNum]);

  // ==========================================
  // DATA (KOLOM PROG SEMENTARA STATIS SEBELUM ADA LOGIKA DINAMIS)
  // ==========================================
  const tableData = [
    { id: 1, idProj: "1324010", nama: "JALAN TOL CIAWI - SUKABUMI SEKSI 3B", prog: "73.04", g1: "5,348", g2: "1,058", g3: "11,425", g4: "1,083", g5: "2,430", g6: "1,972", total: "23,316", dev: "23,316" },
    { id: 2, idProj: "1425010", nama: "PERBAIKAN JALAN TOL KAPB JOP 70%", prog: "43.03", g1: "6,802", g2: "1,696", g3: "7,284", g4: "4,724", g5: "-", g6: "-", total: "20,506", dev: "20,506" },
    { id: 3, idProj: "1421046", nama: "Pengarah Rukoh", prog: "54.12", g1: "-", g2: "-", g3: "821", g4: "6,357", g5: "1,556", g6: "3,550", total: "12,283", dev: "12,283" },
    { id: 4, idProj: "1323042", nama: "Jalan Tol Ciawi Sukabumi Seksi 3A", prog: "84.49", g1: "5,972", g2: "73", g3: "1,133", g4: "1,166", g5: "2,296", g6: "-", total: "10,640", dev: "10,640" },
    { id: 5, idProj: "1424002", nama: "PEMB. BANGUNAN PENGARAH BEND. RUKOH KA", prog: "67.43", g1: "-", g2: "-", g3: "-", g4: "-", g5: "143", g6: "6,908", total: "7,051", dev: "7,051" },
    { id: 6, idProj: "1319006", nama: "PROYEK TOL JAPEK 2 SELATAN PAKET 3 INDUK", prog: "98.57", g1: "1,089", g2: "647", g3: "-", g4: "4,977", g5: "-", g6: "25", total: "6,738", dev: "6,738" },
    { id: 7, idProj: "1418021", nama: "Bendungan Tiga Dihaji (57%) JOI 57%", prog: "50.78", g1: "291", g2: "-", g3: "-", g4: "-", g5: "4,813", g6: "-", total: "5,104", dev: "5,104" },
    { id: 8, idProj: "1425027", nama: "Construction Of KSCS Package 1 JOP 55%", prog: "18.30", g1: "441", g2: "-", g3: "3,751", g4: "-", g5: "-", g6: "-", total: "4,192", dev: "4,192" },
    { id: 9, idProj: "1324001", nama: "Patimban Acces Toll Road Package 2", prog: "65.21", g1: "352", g2: "-", g3: "-", g4: "3,251", g5: "-", g6: "-", total: "3,603", dev: "3,603" },
    { id: 10, idProj: "1424021", nama: "REHABILITASI D.I CIBALIUNG KABUPATEN PAN", prog: "77.68", g1: "-", g2: "29", g3: "1,672", g4: "1,696", g5: "-", g6: "-", total: "3,396", dev: "3,396" },
  ];

  const topPersediaan = [
    { title: "Proyek Jalan Kretek - Girijati", value: "19,680,000", items: [{ n: "Geotextile Non Woven 300 Gr PET", v: "19,680,000" }] },
    { title: "PROYEK TOL JAPEK 2 SELATAN PAKET 3 INDUK", value: "25,075,400", items: [{ n: "Bearing Pad 350x400x39mm", v: "12,464,000" }, { n: "Bearing Pad Karet Alam 250x400x41mm", v: "9,761,400" }] },
    { title: "Irigasi Belitang Lempuing Pkt 2 JOP 60%", value: "232,936,237", items: [{ n: "Besi Beton Ulir U40-12m D16", v: "141,848,108" }, { n: "Besi Beton Ulir U40-12m D19", v: "47,535,629" }] },
  ];

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="20"
      slideTitle={"MONITORING UMUR PERSEDIAAN (FIORI)"}
    >
      <div style={{ display: "flex", gap: "20px", height: "100%", width: "100%" }}>
        
        {/* LEFT COLUMN: TABLE */}
        <div style={{ flex: 1.6, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", fontStyle: "italic", color: "#374151" }}>
            Periode : {globalFilter?.bulan || "April"} {globalFilter?.tahun || "2026"} 
            <span style={{ margin: "0 10px" }}>➔</span> 
            update : 30 {globalFilter?.bulan || "April"} {globalFilter?.tahun || "2026"}
          </div>
          
          <div style={{ flex: 1, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <th rowSpan={3} style={thMainStyle}>No.</th>
                  <th rowSpan={3} style={thMainStyle}>ID Project</th>
                  <th rowSpan={3} style={{ ...thMainStyle, width: "220px" }}>Nama Proyek</th>
                  <th rowSpan={3} style={thMainStyle}>Prog.<br/>(%)</th>
                  <th colSpan={9} style={thMainStyle}>Monitoring Persediaan</th>
                </tr>
                <tr>
                  <th colSpan={6} style={thMainStyle}>Umur Persediaan (Hari)</th>
                  <th rowSpan={2} style={thMainStyle}>Total</th>
                  <th rowSpan={2} style={thMainStyle}>LEP</th>
                  <th rowSpan={2} style={thMainStyle}>Deviasi</th>
                </tr>
                <tr>
                  <th style={thMainStyle}>0-30</th>
                  <th style={thMainStyle}>30-60</th>
                  <th style={thMainStyle}>60-90</th>
                  <th style={thMainStyle}>90-180</th>
                  <th style={thMainStyle}>180-360</th>
                  <th style={thMainStyle}>{"> 360"}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <td colSpan={13} style={{ ...tdStyle, fontWeight: "bold", textAlign: "center" }}>ON GOING</td>
                </tr>
                {tableData.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb", transition: "background-color 0.2s", ":hover": { backgroundColor: "#f3f4f6" } }}>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.id}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>{row.idProj}</td>
                    <td style={{ ...tdStyle, textAlign: "left", whiteSpace: "normal" }}>{row.nama}</td>
                    <td style={{ ...tdStyle, textAlign: "right", backgroundColor: "#dbeafe", fontWeight: "bold", color: "#1e40af" }}>{row.prog}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g1}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g2}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g3}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g4}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g5}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g6}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#1e3a8a", color: "white" }}>{row.total}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.lep || "-"}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#1e3a8a", color: "white" }}>{row.dev}</td>
                  </tr>
                ))}
                {/* FOOTER TOTAL */}
                <tr style={{ backgroundColor: "#e5e7eb", fontWeight: "bold" }}>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: "center" }}>Total</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>26,730</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>5,002</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>26,533</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>28,062</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>13,008</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>13,971</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>113,305</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>-</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>113,305</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: PERSEDIAAN + CHART */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", height: "100%" }}>
          
          {/* TOP PERSEDIAAN PANEL */}
          <div style={{ flex: 1, border: "1px solid #d1d5db", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden" }}>
            <div style={rightHeaderStyle}>
              <span>Top Persediaan {">"} 360 HK</span>
              <span>{"> 360"}</span>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              {topPersediaan.map((proj, pIdx) => (
                <div key={pIdx} style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    fontSize: "12px", 
                    fontWeight: "bold", 
                    backgroundColor: "#f3f4f6",
                    padding: "4px 8px",
                    borderLeft: "3px solid #163261",
                    marginBottom: "4px"
                  }}>
                    <span className="truncate pr-2" title={proj.title}>⊟ {proj.title}</span>
                    <span>{proj.value}</span>
                  </div>
                  {proj.items.map((item, iIdx) => (
                    <div key={iIdx} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      fontSize: "11px", 
                      padding: "2px 8px 2px 20px",
                      color: "#4b5563"
                    }}>
                      <span className="truncate pr-2">{item.n}</span>
                      <span className="font-semibold">{item.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* GRAND TOTAL BOX */}
            <div style={{ 
              borderTop: "2px solid #163261", 
              padding: "8px 12px", 
              display: "flex", 
              justifyContent: "space-between", 
              fontWeight: "bold", 
              fontSize: "13px",
              backgroundColor: "#163261",
              color: "white"
            }}>
              <span>Grand Total</span>
              <span>13,970,703,419</span>
            </div>
          </div>

          {/* CHART PANEL BARU */}
          <div style={{ flex: 1, border: "1px solid #d1d5db", backgroundColor: "#ffffff", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#163261", marginBottom: "10px", borderBottom: "1px solid #e5e7eb", paddingBottom: "5px" }}>
              Tren PU vs Aging Stock
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}K`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    formatter={(value, name) => {
                      if (name === "Aging Stock") return [new Intl.NumberFormat('id-ID').format(value), name];
                      return [`${new Intl.NumberFormat('id-ID').format(value)} M`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                  <Bar yAxisId="left" dataKey="agingStock" name="Aging Stock" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="puRencana" name="RKAP PU" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="puRealisasi" name="Real PU" stroke="#000075" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideAgingStock;