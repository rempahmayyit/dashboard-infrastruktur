import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideEvaluasiRkap = () => {
  // ==========================================
  // DATA & TABLE COMPONENTS
  // ==========================================

  const tableData = [
    { id: 1, no: "1", nama: "Perbaikan KAPB", nk: "856,594", rkapPu: "112,933", rkapBk: "95,877", rkapPct: "84.90%", realPu: "175,519", realBk: "225,956", realPct: "128.74%", devPu: "62,586", devBk: "130,080", devLk: "(67,493)" },
    { id: 2, no: "2", nama: "BA Serdang-Berdagai", nk: "100,000", rkapPu: "-", rkapBk: "-", rkapPct: "0.00%", realPu: "-", realBk: "21,037", realPct: "0.00%", devPu: "-", devBk: "21,037", devLk: "(21,037)" },
    { id: 3, no: "3", nama: "BA Langsa", nk: "253,000", rkapPu: "-", rkapBk: "-", rkapPct: "0.00%", realPu: "-", realBk: "20,231", realPct: "0.00%", devPu: "-", devBk: "20,231", devLk: "(20,231)" },
    { id: 4, no: "4", nama: "Lempuing II JOP", nk: "234,732", rkapPu: "21,384", rkapBk: "8,793", rkapPct: "41.12%", realPu: "17,203", realBk: "22,723", realPct: "132.09%", devPu: "(4,181)", devBk: "13,930", devLk: "(18,111)" },
    { id: 5, no: "5", nama: "Bend. Jlantah", nk: "566,919", rkapPu: "-", rkapBk: "-", rkapPct: "0.00%", realPu: "-", realBk: "17,334", realPct: "0.00%", devPu: "-", devBk: "17,334", devLk: "(17,334)" },
    { id: 6, no: "6", nama: "Oplah Banten Thp 3", nk: "200,000", rkapPu: "200,000", rkapBk: "186,000", rkapPct: "93.00%", realPu: "-", realBk: "-", realPct: "0.00%", devPu: "(200,000)", devBk: "(186,000)", devLk: "(14,000)" },
    { id: 7, no: "7", nama: "Proban Pkt. 3", nk: "996,822", rkapPu: "41,498", rkapBk: "49,366", rkapPct: "118.96%", realPu: "32,958", realBk: "53,964", realPct: "163.74%", devPu: "(8,540)", devBk: "4,598", devLk: "(13,138)" },
    { id: 8, no: "8", nama: "Pengarah Rukoh", nk: "411,452", rkapPu: "11,027", rkapBk: "10,766", rkapPct: "97.63%", realPu: "9,760", realBk: "20,917", realPct: "214.32%", devPu: "(1,267)", devBk: "10,151", devLk: "(11,418)" },
    { id: 9, no: "9", nama: "BA Bireun-Takengon", nk: "400,000", rkapPu: "-", rkapBk: "-", rkapPct: "0.00%", realPu: "-", realBk: "10,956", realPct: "0.00%", devPu: "-", devBk: "10,956", devLk: "(10,956)" },
    { id: 10, no: "10", nama: "Struktur Musi", nk: "345,105", rkapPu: "34,510", rkapBk: "39,692", rkapPct: "115.02%", realPu: "18,376", realBk: "33,773", realPct: "183.78%", devPu: "(16,134)", devBk: "(5,919)", devLk: "(10,215)" },
    { id: 11, no: "11", nama: "Bend. Jragung I", nk: "799,473", rkapPu: "54,349", rkapBk: "44,370", rkapPct: "81.64%", realPu: "26,460", realBk: "25,555", realPct: "96.58%", devPu: "(27,889)", devBk: "(18,815)", devLk: "(9,074)" },
    { id: 12, no: "12", nama: "Bend. Bener", nk: "589,747", rkapPu: "1,828", rkapBk: "1,762", rkapPct: "96.39%", realPu: "24,678", realBk: "32,612", realPct: "132.15%", devPu: "22,850", devBk: "30,850", devLk: "(8,001)" },
    { id: 13, no: "13", nama: "Bocimi 3A", nk: "897,832", rkapPu: "132,068", rkapBk: "131,991", rkapPct: "99.94%", realPu: "76,334", realBk: "83,853", realPct: "109.85%", devPu: "(55,734)", devBk: "(48,139)", devLk: "(7,596)" },
    { id: 14, no: "14", nama: "BA Sumatera", nk: "15,000", rkapPu: "-", rkapBk: "-", rkapPct: "0.00%", realPu: "-", realBk: "4,632", realPct: "0.00%", devPu: "-", devBk: "4,632", devLk: "(4,632)" },
    { id: 15, no: "15", nama: "Bend. Mbay", nk: "485,958", rkapPu: "38,391", rkapBk: "35,032", rkapPct: "91.25%", realPu: "4,784", realBk: "5,757", realPct: "120.35%", devPu: "(33,607)", devBk: "(29,274)", devLk: "(4,333)" },
    { id: 16, no: "16", nama: "Irg. Lempuing 3", nk: "218,628", rkapPu: "19,917", rkapBk: "13,920", rkapPct: "69.89%", realPu: "16,799", realBk: "14,796", realPct: "88.08%", devPu: "(3,118)", devBk: "877", devLk: "(3,994)" },
  ];

  const thStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "5px 3px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    lineHeight: "1.2",
    fontSize: "11px",
  };

  const thRedStyle = {
    ...thStyle,
    backgroundColor: "#a50000", // Dark Red
  };

  const thGreenStyle = {
    ...thStyle,
    backgroundColor: "#22c55e", // Green
  };

  const tdStyle = {
    padding: "4px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
    fontSize: "10.5px",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="6"
      slideTitle={'EVALUASI "RKAP VS REALISASI" (1/3)'}
    >
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
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
              <th rowSpan={2} style={thStyle}>No.</th>
              <th rowSpan={2} style={thStyle}>Nama Proyek</th>
              <th rowSpan={2} style={thStyle}>NK</th>
              <th colSpan={3} style={thStyle}>RKAP Jan - Mei</th>
              <th colSpan={3} style={thRedStyle}>Real Jan - Mei</th>
              <th colSpan={3} style={thGreenStyle}>Dev.</th>
            </tr>
            {/* SUB HEADERS */}
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
            {/* SUMMARY ROW */}
            <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
              <td style={{ ...tdStyle, border: "none" }}></td>
              <td colSpan={2} style={{ ...tdStyle, textAlign: "center", borderLeft: "none" }}>
                Non JO & JOP
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>976,437</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1,003,350</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>102.76%</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>868,125</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1,090,838</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>125.65%</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>(108,312)</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>87,488</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>(249,238)</td>
            </tr>

            {/* DATA ROWS */}
            {tableData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#e6f0fa" : "#ffffff",
                }}
              >
                <td style={{ ...tdStyle, textAlign: "center" }}>{row.no}</td>
                <td style={{ ...tdStyle, textAlign: "left", width: "250px", whiteSpace: "normal" }}>
                  {row.nama}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.nk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.rkapPu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.rkapBk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.rkapPct}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.realPu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.realBk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.realPct}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.devPu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.devBk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.devLk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
};

export default SlideEvaluasiRkap;