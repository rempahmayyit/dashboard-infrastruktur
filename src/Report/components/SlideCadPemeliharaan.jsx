import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideCadPemeliharaan = () => {
  // ==========================================
  // STYLES
  // ==========================================
  const thMainStyle = {
    backgroundColor: "#163261",
    color: "white",
    textAlign: "center",
    padding: "6px 4px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    fontSize: "10.5px",
    lineHeight: "1.2",
  };

  const thRedStyle = {
    ...thMainStyle,
    backgroundColor: "#a50000",
  };

  const tdStyle = {
    padding: "4px 6px",
    border: "1px solid #d1d5db",
    fontSize: "10px",
    whiteSpace: "nowrap",
    lineHeight: "1.1",
    fontVariantNumeric: "tabular-nums",
  };

  // ==========================================
  // DATA
  // ==========================================
  const tableData = [
    { id: 1, idProj: "1323042", nama: "Bocimi 3A", progFisik: "84.86%", bkd: "-", bdd: "228", totalBkd: "228", wbs: "3,776", sdhDibuku: "-", persen: "0.00%", dev: "-84.86%", minusPlus: "-3,205", stok: "5,106", hutBruto: "4,535" },
    { id: 2, idProj: "1424022", nama: "Bend. Jragung 4", progFisik: "40.53%", bkd: "-", bdd: "569", totalBkd: "569", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "-40.53%", minusPlus: "0", stok: "-", hutBruto: "4,653" },
    { id: 3, idProj: "1425013", nama: "Lempuing II JOP", progFisik: "73.58%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "731", sdhDibuku: "374", persen: "51.14%", dev: "-22.44%", minusPlus: "-164", stok: "747", hutBruto: "15,869" },
    { id: 4, idProj: "1425034", nama: "KSPP Merauke", progFisik: "21.20%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "163", sdhDibuku: "-", persen: "0.00%", dev: "-21.20%", minusPlus: "-35", stok: "-", hutBruto: "172" },
    { id: 5, idProj: "1425023", nama: "Irg. Lempuing 1", progFisik: "13.87%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "419", sdhDibuku: "-", persen: "0.00%", dev: "-13.87%", minusPlus: "-58", stok: "419", hutBruto: "1,482" },
    { id: 6, idProj: "1425014", nama: "Irg. Lempuing 3", progFisik: "69.17%", bkd: "-", bdd: "1,033", totalBkd: "1,033", wbs: "421", sdhDibuku: "254", persen: "60.40%", dev: "-8.77%", minusPlus: "-37", stok: "1,478", hutBruto: "5,570" },
    { id: 7, idProj: "1423006", nama: "Rentang LOS-01", progFisik: "100.00%", bkd: "-", bdd: "247", totalBkd: "247", wbs: "775", sdhDibuku: "718", persen: "92.72%", dev: "-7.28%", minusPlus: "-56", stok: "527", hutBruto: "4,495" },
    { id: 8, idProj: "1425028", nama: "Oplah 3 Sumut", progFisik: "82.10%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "877", sdhDibuku: "704", persen: "80.25%", dev: "-1.85%", minusPlus: "-16", stok: "-", hutBruto: "8,900" },
    { id: 9, idProj: "1425010", nama: "Perbaikan KAPB", progFisik: "44.34%", bkd: "-", bdd: "4,867", totalBkd: "4,867", wbs: "17,171", sdhDibuku: "7,388", persen: "43.03%", dev: "-1.32%", minusPlus: "-226", stok: "4,004", hutBruto: "72,770" },
    { id: 10, idProj: "1323020", nama: "Proban Pkt. 3", progFisik: "94.92%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "10,879", sdhDibuku: "10,234", persen: "94.07%", dev: "-0.85%", minusPlus: "-92", stok: "558", hutBruto: "13,316" },
    { id: 11, idProj: "1424020", nama: "Struktur Musi", progFisik: "100.34%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "3,451", sdhDibuku: "3,451", persen: "100.00%", dev: "-0.34%", minusPlus: "-12", stok: "-", hutBruto: "12,971" },
    { id: 12, idProj: "1325039", nama: "BA Sumatera", progFisik: "0.00%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "-", hutBruto: "-" },
    { id: 13, idProj: "1326003", nama: "BA Langsa", progFisik: "0.00%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "10", hutBruto: "3,595" },
    { id: 14, idProj: "1326006", nama: "BA Bireun-Takengon", progFisik: "0.00%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "-", hutBruto: "-" },
    { id: 15, idProj: "1326009", nama: "BA Lubuk Sidup", progFisik: "0.00%", bkd: "1,346", bdd: "-", totalBkd: "1,346", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "-", hutBruto: "-" },
    { id: 16, idProj: "1425044", nama: "BA Serdang-Berdagai", progFisik: "0.00%", bkd: "15,984", bdd: "-", totalBkd: "15,984", wbs: "-", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "-", hutBruto: "-" },
    { id: 17, idProj: "1426012", nama: "Pelabuhan JICT", progFisik: "0.00%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "0", sdhDibuku: "-", persen: "0.00%", dev: "0.00%", minusPlus: "0", stok: "-", hutBruto: "-" },
    { id: 18, idProj: "1425027", nama: "KSCS 1", progFisik: "18.30%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "6,641", sdhDibuku: "1,215", persen: "18.30%", dev: "0.00%", minusPlus: "0", stok: "2,311", hutBruto: "48,132" },
    { id: 19, idProj: "1418018", nama: "Bend. Bener", progFisik: "80.89%", bkd: "-", bdd: "568", totalBkd: "568", wbs: "2,993", sdhDibuku: "2,436", persen: "81.37%", dev: "0.48%", minusPlus: "14", stok: "1,117", hutBruto: "6,368" },
    { id: 20, idProj: "1421039", nama: "Bend. Mbay", progFisik: "96.61%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "1,075", sdhDibuku: "1,050", persen: "97.59%", dev: "0.98%", minusPlus: "11", stok: "825", hutBruto: "2,584" },
    { id: 21, idProj: "1319006", nama: "Japeksel 3 Induk", progFisik: "98.57%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "9,389", sdhDibuku: "9,389", persen: "100.00%", dev: "1.43%", minusPlus: "135", stok: "4,949", hutBruto: "7,529" },
    { id: 22, idProj: "1420033", nama: "Bend. Jragung I", progFisik: "92.30%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "3,193", sdhDibuku: "3,114", persen: "97.51%", dev: "5.21%", minusPlus: "166", stok: "1,634", hutBruto: "23,214" },
    { id: 23, idProj: "1324010", nama: "Bocimi 3B", progFisik: "73.69%", bkd: "-", bdd: "944", totalBkd: "944", wbs: "3,257", sdhDibuku: "3,059", persen: "93.92%", dev: "20.23%", minusPlus: "659", stok: "11,493", hutBruto: "14,715" },
    { id: 24, idProj: "1421046", nama: "Pengarah Rukoh", progFisik: "54.37%", bkd: "-", bdd: "-", totalBkd: "-", wbs: "2,081", sdhDibuku: "2,033", persen: "97.68%", dev: "43.32%", minusPlus: "902", stok: "12,283", hutBruto: "101" },
  ];

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="21"
      slideTitle={"MONITORING PEMBUKUAN CAD. PEMEL."}
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
            {/* TIER 1 HEADERS */}
            <tr>
              <th rowSpan={2} style={thMainStyle}>No.</th>
              <th rowSpan={2} style={thMainStyle}>ID Project</th>
              <th rowSpan={2} style={thMainStyle}>Nama Proyek</th>
              <th rowSpan={2} style={thMainStyle}>Progres<br />Fisik</th>
              <th colSpan={3} style={thRedStyle}>Monitoring BKD & BDD</th>
              <th colSpan={4} style={thMainStyle}>Monitoring Cadangan Pemeliharaan</th>
              <th rowSpan={2} style={thMainStyle}>-/+ dibuku</th>
              <th colSpan={2} style={thMainStyle}>Monit. Stok & WIP BK</th>
            </tr>
            {/* TIER 2 HEADERS */}
            <tr>
              <th style={thRedStyle}>BKD</th>
              <th style={thRedStyle}>BDD</th>
              <th style={thRedStyle}>Total</th>
              <th style={thMainStyle}>Pemeliharaan<br />WBS -66</th>
              <th style={thMainStyle}>Sdh Dibuku</th>
              <th style={thMainStyle}>%</th>
              <th style={thMainStyle}>Dev.</th>
              <th style={thMainStyle}>Stok</th>
              <th style={thMainStyle}>Hut. Bruto<br />(WIP BK)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
              <td colSpan={14} style={{ ...tdStyle, border: "none", textAlign: "left", paddingLeft: "45px" }}>On Going</td>
            </tr>
            {tableData.map((row, idx) => {
              // Menentukan warna background untuk sel Deviasi jika nilainya negatif
              const isDeviasiNegative = row.dev.startsWith("-") && row.dev !== "0.00%";
              const devCellStyle = isDeviasiNegative 
                ? { ...tdStyle, textAlign: "right", backgroundColor: "#fecaca", color: "#a50000" } 
                : { ...tdStyle, textAlign: "right" };

              return (
                <tr
                  key={row.id}
                  style={{ backgroundColor: idx % 2 === 0 ? "#e6f0fa" : "#ffffff" }}
                >
                  <td style={{ ...tdStyle, textAlign: "center" }}>{row.id}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{row.idProj}</td>
                  <td style={{ ...tdStyle, textAlign: "left" }}>{row.nama}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{row.progFisik}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.bkd}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.bdd}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.totalBkd}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.wbs}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.sdhDibuku}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.persen}</td>
                  <td style={devCellStyle}>{row.dev}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.minusPlus}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.stok}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.hutBruto}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
};

export default SlideCadPemeliharaan;