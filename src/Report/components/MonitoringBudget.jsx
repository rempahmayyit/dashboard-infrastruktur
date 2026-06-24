import React from "react";
import ContentLayout from "../pages/ContentLayout";

const Slide14MonitoringBudget = () => {
  const dummyData = [
    { no: "1", id: "1325039", nama: "BA Sumatera", prog: "0.00%", mapp: "15,000", cost: "4,740", terpakai: "31.60%", dev: "-31.60%", preq: "-", pord: "968", available: "9,292" },
    { no: "2", id: "1421046", nama: "Pengarah Rukoh", prog: "54.37%", mapp: "432,847", cost: "294,634", terpakai: "68.07%", dev: "-13.70%", preq: "-", pord: "2,344", available: "135,869" },
    { no: "18", id: "1425023", nama: "Irg. Lempuing 1", prog: "13.87%", mapp: "74,367", cost: "10,309", terpakai: "13.86%", dev: "0.01%", preq: "1,151", pord: "206", available: "62,701" }, // Contoh data positif
  ];

  const thStyle = { padding: "8px 4px", border: "1px solid #fff", color: "#fff", textAlign: "center", fontSize: "10px" };
  const tdStyle = { padding: "6px 4px", border: "1px solid #E5E7EB", fontSize: "10px", textAlign: "right" };

  return (
    <ContentLayout pageNumber={14} sectionNumber={14} slideTitle="MONITORING PEMAKAIAN BUDGET (1/2)">
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th rowSpan={3} style={{ ...thStyle, background: "#002060" }}>No.</th>
            <th rowSpan={3} style={{ ...thStyle, background: "#002060" }}>ID Project</th>
            <th rowSpan={3} style={{ ...thStyle, background: "#002060" }}>Nama Proyek</th>
            <th rowSpan={3} style={{ ...thStyle, background: "#002060" }}>Progres<br/>Fisik</th>
            <th colSpan={7} style={{ ...thStyle, background: "#002060" }}>Monitoring Budget</th>
          </tr>
          <tr>
            <th rowSpan={2} style={{ ...thStyle, background: "#002060" }}>Budget MAPP</th>
            <th rowSpan={2} style={{ ...thStyle, background: "#002060" }}>Actual Cost</th>
            <th rowSpan={2} style={{ ...thStyle, background: "#002060" }}>% Terpakai</th>
            <th rowSpan={2} style={{ ...thStyle, background: "#C00000" }}>Dev.</th>
            <th colSpan={2} style={{ ...thStyle, background: "#002060" }}>Cost Commitment</th>
            <th rowSpan={2} style={{ ...thStyle, background: "#002060" }}>Available<br/>Budget</th>
          </tr>
          <tr>
            <th style={{ ...thStyle, background: "#002060" }}>PReq</th>
            <th style={{ ...thStyle, background: "#002060" }}>POrd</th>
          </tr>
        </thead>
        <tbody>
          {/* Section Header */}
          <tr style={{ background: "#F1F5F9", fontWeight: "bold" }}>
            <td colSpan={11} style={{ ...tdStyle, textAlign: "left", paddingLeft: "30px" }}>On Going</td>
          </tr>
          {/* Data List */}
          {dummyData.map((row, i) => {
            const isDevMinus = row.dev.includes("-");
            return (
              <tr key={i}>
                <td style={{ ...tdStyle, textAlign: "center" }}>{row.no}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{row.id}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>{row.nama}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{row.prog}</td>
                <td style={tdStyle}>{row.mapp}</td>
                <td style={tdStyle}>{row.cost}</td>
                <td style={tdStyle}>{row.terpakai}</td>
                {/* Kolom Merah jika minus */}
                <td style={{ ...tdStyle, color: isDevMinus ? "#C00000" : "#000", background: isDevMinus ? "#FFE4E1" : "transparent", fontWeight: isDevMinus ? "bold" : "normal" }}>
                  {row.dev}
                </td>
                <td style={tdStyle}>{row.preq}</td>
                <td style={tdStyle}>{row.pord}</td>
                <td style={tdStyle}>{row.available}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ContentLayout>
  );
};

export default Slide14MonitoringBudget;