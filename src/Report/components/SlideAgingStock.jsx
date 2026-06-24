import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideAgingStock = () => {
  // ==========================================
  // STYLES
  // ==========================================
  const thMainStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "4px 2px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    fontSize: "10px",
    lineHeight: "1.2",
  };

  const tdStyle = {
    padding: "3px 4px",
    border: "1px solid #d1d5db",
    fontSize: "9.5px",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
    fontVariantNumeric: "tabular-nums",
  };

  const rightHeaderStyle = {
    backgroundColor: "#e5e7eb",
    padding: "4px 10px",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#163261",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid #163261",
  };

  // ==========================================
  // DATA
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
      <div style={{ display: "flex", gap: "15px", height: "100%", width: "100%" }}>
        
        {/* LEFT COLUMN: TABLE */}
        <div style={{ flex: 1.6, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", fontStyle: "italic" }}>
            Periode : April 2026 <span style={{ margin: "0 10px" }}>➔</span> update : 30 April 2026
          </div>
          
          <div style={{ flex: 1, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
              <thead>
                <tr>
                  <th rowSpan={3} style={thMainStyle}>No.</th>
                  <th rowSpan={3} style={thMainStyle}>ID Project</th>
                  <th rowSpan={3} style={{ ...thMainStyle, width: "180px" }}>Nama Proyek</th>
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
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.id}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.idProj}</td>
                    <td style={{ ...tdStyle, textAlign: "left", whiteSpace: "normal" }}>{row.nama}</td>
                    <td style={{ ...tdStyle, textAlign: "right", backgroundColor: "#dbeafe" }}>{row.prog}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g1}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g2}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g3}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g4}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g5}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{row.g6}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#1e3a8a", color: "white" }}>{row.total}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>-</td>
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
                <tr style={{ backgroundColor: "#ffffff" }}>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: "center" }}>Prosentase</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>23.59%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>4.41%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>23.42%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>24.77%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>11.48%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>12.33%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>100.00%</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}></td>
                  <td style={{ ...tdStyle, textAlign: "right" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: TOP PERSEDIAAN */}
        <div style={{ flex: 1, border: "1px solid #d1d5db", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
          <div style={rightHeaderStyle}>
            <span>Top Persediaan {">"} 360 HK</span>
            <span>{"> 360"}</span>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "5px" }}>
            {topPersediaan.map((proj, pIdx) => (
              <div key={pIdx} style={{ marginBottom: "10px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontSize: "10.5px", 
                  fontWeight: "bold", 
                  backgroundColor: "#f3f4f6",
                  padding: "2px 5px",
                  borderLeft: "3px solid #163261"
                }}>
                  <span>⊟ {proj.title}</span>
                  <span>{proj.value}</span>
                </div>
                {proj.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    fontSize: "10px", 
                    padding: "1px 5px 1px 20px",
                    color: "#374151"
                  }}>
                    <span>{item.n}</span>
                    <span>{item.v}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* GRAND TOTAL BOX */}
            <div style={{ 
              marginTop: "20px", 
              borderTop: "2px solid #163261", 
              padding: "5px", 
              display: "flex", 
              justifyContent: "space-between", 
              fontWeight: "bold", 
              fontSize: "12px",
              backgroundColor: "#163261",
              color: "white"
            }}>
              <span>Grand Total</span>
              <span>13,970,703,419</span>
            </div>
          </div>
        </div>

      </div>
    </ContentLayout>
  );
};

export default SlideAgingStock;