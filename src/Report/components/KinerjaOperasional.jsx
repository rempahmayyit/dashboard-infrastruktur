import React from "react";
import ContentLayout from "../pages/ContentLayout"; // Sesuaikan path import

const SlideKinerjaOperasional = () => {
  const tableData = [
    { uraian: "PU", rkap: "1,045.80", real: "1,309.48", persen: "125.21%", rkapDes: "5,589.64", sisa: "4,280.16", isBold: true },
    { uraian: "a. Non JO & JOP", rkap: "721.67", real: "868.95", persen: "120.41%", rkapDes: "4,010.45", sisa: "3,141.50" },
    { uraian: "b. JOI", rkap: "324.13", real: "440.53", persen: "135.91%", rkapDes: "1,579.20", sisa: "1,138.66" },
  ];

  const thStyle = { padding: "8px", border: "1px solid #fff", color: "#fff", textAlign: "center", fontSize: "11px" };
  const tdStyle = { padding: "6px", border: "1px solid #ccc", fontSize: "11px", textAlign: "right" };

  return (
    <ContentLayout pageNumber={3} sectionNumber={3} slideTitle="EVALUASI KINERJA OPERASIONAL">
      <div style={{ display: "flex", gap: "20px", height: "100%" }}>
        {/* KOLOM KIRI (Tabel & Top 5) */}
        <div style={{ flex: "0 0 45%", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "5px" }}>
              <span>Kinerja sd, Bulan Ini (annual)</span>
              <span>Rp. Milyar</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, background: "#002060" }}>Uraian</th>
                  <th style={{ ...thStyle, background: "#002060" }}>RKAP<br/>Jan - Mei<br/>1</th>
                  <th style={{ ...thStyle, background: "#C00000" }}>Real<br/>Jan - Mei<br/>2</th>
                  <th style={{ ...thStyle, background: "#002060" }}>% thd RKAP<br/>sd Mei<br/>3=2/1</th>
                  <th style={{ ...thStyle, background: "#00B050" }}>RKAP<br/>Jan - Des<br/>4</th>
                  <th style={{ ...thStyle, background: "#C00000" }}>Sisa thd<br/>RKAP<br/>5=4-2</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff", fontWeight: row.isBold ? "bold" : "normal" }}>
                    <td style={{ ...tdStyle, textAlign: "left" }}>{row.uraian}</td>
                    <td style={tdStyle}>{row.rkap}</td>
                    <td style={tdStyle}>{row.real}</td>
                    <td style={tdStyle}>{row.persen}</td>
                    <td style={tdStyle}>{row.rkapDes}</td>
                    <td style={tdStyle}>{row.sisa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tempat untuk Chart Bar Horizontal Top 5 */}
          <div style={{ flex: 1, border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
            <span style={{ color: "#999" }}>[ Area Chart Top 5 Tidak Tercapai ]</span>
          </div>
        </div>

        {/* KOLOM KANAN (Grafik Tren) */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", gridTemplateRows: "1fr 1fr 1fr" }}>
          {[1, 2, 3, 4, 5, 6].map((chart) => (
            <div key={chart} style={{ border: "1px dashed #ccc", background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#999", fontSize: "12px" }}>[ Chart Area {chart} ]</span>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideKinerjaOperasional;