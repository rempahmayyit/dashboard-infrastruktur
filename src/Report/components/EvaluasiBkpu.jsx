import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideEvaluasiBkpu = () => {
  // ==========================================
  // DATA & TABLE COMPONENTS
  // ==========================================

  const tableData = [
    { id: 1, no: "1", nama: "Perbaikan KAPB", nk: "856,594", r1Pu: "52,030", r1Bk: "45,376", r1Pct: "87.21%", realProg: "46.21%", evPu: "16,004", evBk: "29,442", evPct: "183.96%", mapp: "88.95%", rencProg: "55.53%", r2Pu: "79,837", r2Bk: "67,004", r2Pct: "83.93%" },
    { id: 2, no: "2", nama: "Pengarah Rukoh", nk: "411,452", r1Pu: "2,271", r1Bk: "1,894", r1Pct: "83.39%", realProg: "55.09%", evPu: "2,991", evBk: "3,834", evPct: "128.19%", mapp: "105.20%", rencProg: "55.77%", r2Pu: "2,805", r2Bk: "2,684", r2Pct: "95.69%" },
    { id: 3, no: "3", nama: "Bend. Bener", nk: "589,747", r1Pu: "6,786", r1Bk: "6,725", r1Pct: "99.10%", realProg: "81.53%", evPu: "3,748", evBk: "4,403", evPct: "117.47%", mapp: "95.45%", rencProg: "82.35%", r2Pu: "4,854", r2Bk: "4,844", r2Pct: "99.80%" },
    { id: 4, no: "4", nama: "Irg. Lempuing 3", nk: "218,628", r1Pu: "8,330", r1Bk: "6,925", r1Pct: "83.13%", realProg: "71.01%", evPu: "4,008", evBk: "4,707", evPct: "117.44%", mapp: "88.03%", rencProg: "74.06%", r2Pu: "6,677", r2Bk: "2,218", r2Pct: "33.21%" },
    { id: 5, no: "5", nama: "Bocimi 3A", nk: "897,832", r1Pu: "41,164", r1Bk: "46,674", r1Pct: "113.38%", realProg: "86.65%", evPu: "16,013", evBk: "18,724", evPct: "116.93%", mapp: "88.82%", rencProg: "90.40%", r2Pu: "33,697", r2Bk: "31,393", r2Pct: "93.16%" },
    { id: 6, no: "6", nama: "Irg. Lempuing 1", nk: "83,812", r1Pu: "926", r1Bk: "1,119", r1Pct: "120.79%", realProg: "14.70%", evPu: "696", evBk: "798", evPct: "114.65%", mapp: "88.73%", rencProg: "15.83%", r2Pu: "945", r2Bk: "1,139", r2Pct: "120.54%" },
    { id: 7, no: "7", nama: "KSPP Merauke", nk: "238,390", r1Pu: "31,587", r1Bk: "29,202", r1Pct: "92.45%", realProg: "27.24%", evPu: "14,405", evBk: "14,481", evPct: "100.53%", mapp: "92.29%", rencProg: "41.79%", r2Pu: "34,686", r2Bk: "32,958", r2Pct: "95.02%" },
    { id: 8, no: "8", nama: "Oplah 3 Sumut", nk: "78,986", r1Pu: "-", r1Bk: "-", r1Pct: "0.00%", realProg: "91.40%", evPu: "7,345", evBk: "6,828", evPct: "92.96%", mapp: "92.96%", rencProg: "100.00%", r2Pu: "6,793", r2Bk: "6,324", r2Pct: "93.09%" },
    { id: 9, no: "9", nama: "KSCS 1", nk: "507,425", r1Pu: "26,591", r1Bk: "23,823", r1Pct: "89.59%", realProg: "21.31%", evPu: "15,294", evBk: "13,635", evPct: "89.16%", mapp: "89.58%", rencProg: "25.64%", r2Pu: "21,952", r2Bk: "19,702", r2Pct: "89.75%" },
    { id: 10, no: "10", nama: "Lempuing II JOP", nk: "234,732", r1Pu: "9,490", r1Bk: "7,661", r1Pct: "80.73%", realProg: "75.00%", evPu: "3,341", evBk: "2,920", evPct: "87.40%", mapp: "88.62%", rencProg: "80.04%", r2Pu: "11,836", r2Bk: "10,586", r2Pct: "89.44%" },
    { id: 11, no: "11", nama: "Bend. Mbay", nk: "485,958", r1Pu: "2,321", r1Bk: "2,162", r1Pct: "93.14%", realProg: "96.84%", evPu: "1,120", evBk: "917", evPct: "81.87%", mapp: "96.45%", rencProg: "97.11%", r2Pu: "1,331", r2Bk: "1,207", r2Pct: "90.73%" },
    { id: 12, no: "12", nama: "Bend. Jragung 4", nk: "60,553", r1Pu: "1,291", r1Bk: "1,021", r1Pct: "79.08%", realProg: "42.88%", evPu: "583", evBk: "498", evPct: "85.28%", mapp: "85.23%", rencProg: "44.51%", r2Pu: "991", r2Bk: "1,446", r2Pct: "145.83%" },
    { id: 13, no: "13", nama: "Proban Pkt. 3", nk: "996,822", r1Pu: "8,853", r1Bk: "25,166", r1Pct: "284.28%", realProg: "95.70%", evPu: "7,731", evBk: "6,494", evPct: "84.00%", mapp: "84.15%", rencProg: "95.81%", r2Pu: "1,122", r2Bk: "18,672", r2Pct: "1664.43%" },
    { id: 14, no: "14", nama: "Bend. Jragung I", nk: "799,473", r1Pu: "11,571", r1Bk: "9,370", r1Pct: "80.98%", realProg: "93.69%", evPu: "11,138", evBk: "8,960", evPct: "80.45%", mapp: "81.65%", rencProg: "95.23%", r2Pu: "12,290", r2Bk: "10,075", r2Pct: "81.98%" },
    { id: 15, no: "15", nama: "Bocimi 3B", nk: "1,254,254", r1Pu: "90,555", r1Bk: "83,347", r1Pct: "92.04%", realProg: "77.05%", evPu: "42,079", evBk: "30,644", evPct: "72.83%", mapp: "90.90%", rencProg: "80.85%", r2Pu: "47,730", r2Bk: "42,747", r2Pct: "89.56%" },
    { id: 16, no: "16", nama: "Rentang LOS-01", nk: "147,338", r1Pu: "-", r1Bk: "19,854", r1Pct: "0.00%", realProg: "100.00%", evPu: "-", evBk: "20,133", evPct: "0.00%", mapp: "91.50%", rencProg: "100.00%", r2Pu: "-", r2Bk: "-", r2Pct: "0.00%" },
    { id: 17, no: "17", nama: "BA Serdang-Berdagai", nk: "100,000", r1Pu: "9,209", r1Bk: "8,339", r1Pct: "90.55%", realProg: "0.00%", evPu: "-", evBk: "21,037", evPct: "0.00%", mapp: "90.00%", rencProg: "31.01%", r2Pu: "31,009", r2Bk: "6,871", r2Pct: "22.16%" },
    { id: 18, no: "18", nama: "BA Bireun-Takengon", nk: "400,000", r1Pu: "11,404", r1Bk: "206", r1Pct: "1.81%", realProg: "0.00%", evPu: "-", evBk: "893", evPct: "0.00%", mapp: "90.00%", rencProg: "0.00%", r2Pu: "-", r2Bk: "297", r2Pct: "0.00%" },
  ];

  const thStyle = {
    backgroundColor: "#163261", // Dark Blue
    color: "white",
    textAlign: "center",
    padding: "5px 3px",
    border: "1px solid #ffffff",
    fontWeight: "bold",
    lineHeight: "1.2",
    fontSize: "10px",
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
    fontSize: "9.5px",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <ContentLayout
      pageNumber=""
      sectionNumber="9"
      slideTitle={"EVALUASI BK/PU BULAN INI (1/3)"}
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
              <th colSpan={3} style={thStyle}>Renc. Bln. Ini EB-01 (Parsial)</th>
              <th rowSpan={2} style={thStyle}>Real. Prog.<br />Sd Bln. Ini<br /><br />2</th>
              <th colSpan={3} style={thRedStyle}>Evaluasi Bulan Ini (Parsial)</th>
              <th rowSpan={2} style={thStyle}>MAPP<br /><br /><br />6</th>
              <th rowSpan={2} style={thGreenStyle}>Renc.<br />Prog. Sd<br />Bln Depan<br />7</th>
              <th colSpan={3} style={thGreenStyle}>Rencana Bulan Depan (Parsial)</th>
            </tr>
            {/* SUB HEADERS */}
            <tr>
              <th style={thStyle}>PU<br />1</th>
              <th style={thStyle}>BK<br />2</th>
              <th style={thStyle}>BK/PU<br />2</th>
              
              <th style={thRedStyle}>PU<br />3</th>
              <th style={thRedStyle}>BK<br />4</th>
              <th style={thRedStyle}>BK/PU<br />5=4/3</th>
              
              <th style={thGreenStyle}>PU<br />8</th>
              <th style={thGreenStyle}>BK<br />9</th>
              <th style={thGreenStyle}>BK/PU<br />10=9/8</th>
            </tr>
          </thead>
          <tbody>
            {/* SUMMARY ROW */}
            <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
              <td style={{ ...tdStyle, border: "none" }}></td>
              <td colSpan={2} style={{ ...tdStyle, textAlign: "center", borderLeft: "none" }}>
                Non JO & JOP
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>346,373</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>345,371</td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>146,496</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>200,176</td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>317,334</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>293,656</td>
              <td style={{ ...tdStyle, textAlign: "right" }}></td>
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
                <td style={{ ...tdStyle, textAlign: "left", width: "180px", whiteSpace: "normal" }}>
                  {row.nama}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.nk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r1Pu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r1Bk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r1Pct}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.realProg}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.evPu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.evBk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.evPct}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.mapp}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.rencProg}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r2Pu}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r2Bk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.r2Pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
};

export default SlideEvaluasiBkpu;