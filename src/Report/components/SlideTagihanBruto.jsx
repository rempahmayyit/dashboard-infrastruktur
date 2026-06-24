import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideTagihanBruto = () => {
  // ==========================================
  // DATA & TABLE COMPONENTS
  // ==========================================

  const tableDataLancar = [
    { id: 1, no: "1", nama: "Proban Pkt. 3", progres: "95.70%", g1: "16,193", g2: "40,140", g3: "113,649", totalMei: "169,983", totalApr: "171,313", deviasi: "(1,331)" },
    { id: 2, no: "2", nama: "Bocimi 3B", progres: "77.05%", g1: "89,610", g2: "11,156", g3: "-", totalMei: "100,767", totalApr: "70,263", deviasi: "30,503" },
    { id: 3, no: "3", nama: "Perbaikan KAPB", progres: "46.21%", g1: "36,982", g2: "19,681", g3: "-", totalMei: "56,663", totalApr: "49,521", deviasi: "7,142" },
    { id: 4, no: "4", nama: "Bocimi 3A", progres: "86.65%", g1: "34,201", g2: "15,588", g3: "-", totalMei: "49,789", totalApr: "47,878", deviasi: "1,911" },
    { id: 5, no: "5", nama: "Rentang LOS-01", progres: "100.00%", g1: "-", g2: "-", g3: "-", totalMei: "-", totalApr: "32,346", deviasi: "(32,346)" },
    { id: 6, no: "6", nama: "KSCS 1", progres: "21.31%", g1: "23,413", g2: "26,850", g3: "-", totalMei: "50,263", totalApr: "26,850", deviasi: "23,413" },
    { id: 7, no: "7", nama: "Struktur Musi", progres: "100.34%", g1: "-", g2: "13,505", g3: "-", totalMei: "13,505", totalApr: "34,867", deviasi: "(21,362)" },
    { id: 8, no: "8", nama: "Bend. Bener", progres: "81.53%", g1: "12,191", g2: "20,395", g3: "-", totalMei: "32,586", totalApr: "21,937", deviasi: "10,649" },
    { id: 9, no: "9", nama: "KSPP Merauke", progres: "27.24%", g1: "33,412", g2: "10,738", g3: "-", totalMei: "44,150", totalApr: "28,123", deviasi: "16,028" },
    { id: 10, no: "10", nama: "Lempuing II JOP", progres: "75.00%", g1: "9,969", g2: "7,334", g3: "-", totalMei: "17,302", totalApr: "7,334", deviasi: "9,969" },
    { id: 11, no: "11", nama: "Irg. Lempuing 3", progres: "71.01%", g1: "10,439", g2: "7,015", g3: "-", totalMei: "17,454", totalApr: "7,015", deviasi: "10,439" },
    { id: 12, no: "12", nama: "Oplah 3 Sumut", progres: "91.40%", g1: "7,425", g2: "-", g3: "-", totalMei: "7,425", totalApr: "160", deviasi: "7,264" },
    { id: 13, no: "13", nama: "Bend. Jragung I", progres: "93.69%", g1: "15,703", g2: "1,886", g3: "-", totalMei: "17,589", totalApr: "29,867", deviasi: "(12,278)" },
    { id: 14, no: "14", nama: "Bend. Mbay", progres: "96.84%", g1: "2,604", g2: "2,647", g3: "-", totalMei: "5,251", totalApr: "2,647", deviasi: "2,604" },
    { id: 15, no: "15", nama: "Bend. Jragung 4", progres: "42.88%", g1: "3,156", g2: "-", g3: "-", totalMei: "3,156", totalApr: "2,198", deviasi: "957" },
    { id: 16, no: "16", nama: "Irg. Lempuing 1", progres: "14.70%", g1: "1,842", g2: "627", g3: "-", totalMei: "2,470", totalApr: "627", deviasi: "1,842" },
  ];

  const thStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "5px 3px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    lineHeight: "1.2",
  };

  const tdStyle = {
    padding: "4px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
  };

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="15"
      slideTitle={"MONITORING TAGIHAN BRUTO"}
    >
      <div style={{ display: "flex", gap: "20px", width: "100%", height: "100%" }}>
        {/* LEFT SIDE: TABLE */}
        <div style={{ flex: 1.8, overflow: "hidden" }}>
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
              <tr>
                <th rowSpan={2} style={thStyle}>No.</th>
                <th rowSpan={2} style={thStyle}>Nama Proyek</th>
                <th rowSpan={2} style={thStyle}>Progres</th>
                <th colSpan={3} style={thStyle}>Aging Tagihan Bruto</th>
                <th rowSpan={2} style={{ ...thStyle, backgroundColor: "#a50000" }}>Total Bruto<br />Mei '26<br />4=1+2+3</th>
                <th rowSpan={2} style={{ ...thStyle, backgroundColor: "#008000" }}>Total Bruto Apr<br />'26<br />5</th>
                <th rowSpan={2} style={thStyle}>Deviasi<br /><br />6=4-5</th>
              </tr>
              <tr>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>0-60<br />1</th>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>60-180<br />2</th>
                <th style={{ ...thStyle, backgroundColor: "#a50000" }}>{">180"}<br />3</th>
              </tr>
            </thead>
            <tbody>
              {/* SECTION: LANCAR */}
              <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, textAlign: "left", fontWeight: "bold" }}>Lancar</td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, textAlign: "right" }}>588,352</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>532,947</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>55,405</td>
              </tr>
              {tableDataLancar.map((row, index) => (
                <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? "#e6f0fa" : "#ffffff" }}>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{row.no}</td>
                  <td style={{ ...tdStyle, textAlign: "left" }}>{row.nama}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.progres}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.g1}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.g2}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.g3}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.totalMei}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.totalApr}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.deviasi}</td>
                </tr>
              ))}
              {/* SECTION: TIDAK LANCAR */}
              <tr style={{ height: "10px" }}><td colSpan={9} style={{ border: "none" }}></td></tr>
              <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, textAlign: "left" }}>Tidak Lancar (Kendala DIPA/Anggaran)</td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, border: "none" }}></td>
                <td style={{ ...tdStyle, textAlign: "right" }}>22,753</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>25,459</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>(2,706)</td>
              </tr>
              <tr style={{ backgroundColor: "#e6f0fa" }}>
                <td style={{ ...tdStyle, textAlign: "center" }}>1</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>Pengarah Rukoh</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>-</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>4,563</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>7,707</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>10,484</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>22,753</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>25,459</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>(2,706)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: CHART & NOTES */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* CHART PLACEHOLDER */}
          <div style={{ flex: 1, textAlign: "center", padding: "10px", position: "relative" }}>
             <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "20px" }}>Tren Tag. Bruto vs PU</div>
             {/* Simulasi Chart menggunakan SVG sederhana agar mirip gambar */}
             <svg width="100%" height="200" viewBox="0 0 400 200">
                {/* Lines */}
                <path d="M 50 50 L 130 80 L 210 110 L 290 110 L 370 100" fill="none" stroke="#163261" strokeWidth="2" />
                <path d="M 50 160 L 130 130 L 210 110 L 290 80 L 370 60" fill="none" stroke="#a50000" strokeWidth="2" />
                {/* Dots & Labels */}
                <circle cx="210" cy="110" r="4" fill="#163261" />
                <text x="50" y="200" fontSize="10" textAnchor="middle">Jan</text>
                <text x="130" y="200" fontSize="10" textAnchor="middle">Feb</text>
                <text x="210" y="200" fontSize="10" textAnchor="middle">Mar</text>
                <text x="290" y="200" fontSize="10" textAnchor="middle">Apr</text>
                <text x="370" y="200" fontSize="10" textAnchor="middle">Mei</text>
                {/* Legend */}
                <rect x="150" y="215" width="10" height="10" fill="#163261" />
                <text x="165" y="224" fontSize="10">Tag. Bruto</text>
                <rect x="230" y="215" width="10" height="10" fill="#a50000" />
                <text x="245" y="224" fontSize="10">PU</text>
             </svg>
          </div>

          {/* NOTES SECTION */}
          <div style={{ marginTop: "auto", fontSize: "11px", color: "#163261", lineHeight: "1.4" }}>
            <div style={{ fontWeight: "bold", fontStyle: "italic", marginBottom: "5px" }}>Note :</div>
            <div style={{ display: "flex", gap: "5px" }}>
              <span>1.</span>
              <span>Monitoring Tagihan bruto hanya proyek on going, diluar PDPK, JOI & Maintenance</span>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <span>2.</span>
              <span>Data SAP 05 Juni 2026 17.00 WIB</span>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideTagihanBruto;