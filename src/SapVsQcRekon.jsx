import React from "react";

function RealisasiSapTable() {
  const tableData = [
    {
      id: "1726012",
      project: "Perkuatan Dermaga JICT Tj Priok JOI 60%",
      nk: "903,000",
      qc_pu: "39",
      qc_bk: "15",
      sap_pu: "64",
      sap_bk: "24",
      dev_pu: "(25,786,100)",
      dev_bk: "(8,677,502)",
      ket: "Deviasi PU & BK",
    },

    {
      id: "1425023",
      project: "Irigasi Belitang Lempuing Pkt 1 JOP 34%",
      nk: "83,812",
      qc_pu: "4,762",
      qc_bk: "7,800",
      sap_pu: "4,762",
      sap_bk: "7,800",
      dev_pu: "-",
      dev_bk: "-",
      ket: "Sinkron",
    },

    {
      id: "1425034",
      project: "Irigasi KSPP Kab. Merauke Pkt 1 JOP 50%",
      nk: "238,390",
      qc_pu: "40,705",
      qc_bk: "38,401",
      sap_pu: "40,705",
      sap_bk: "38,401",
      dev_pu: "-",
      dev_bk: "-",
      ket: "Sinkron",
    },

    {
      id: "1424022",
      project: "Bendungan Jragung Paket 4",
      nk: "60,553",
      qc_pu: "5,054",
      qc_bk: "4,164",
      sap_pu: "5,054",
      sap_bk: "4,164",
      dev_pu: "(0)",
      dev_bk: "(0)",
      ket: "Sinkron",
    },

    {
      id: "1418018",
      project: "Bendungan Bener Paket II JOP 83,5%",
      nk: "589,747",
      qc_pu: "20,929",
      qc_bk: "28,209",
      sap_pu: "20,929",
      sap_bk: "28,209",
      dev_pu: "(0)",
      dev_bk: "(0)",
      ket: "Sinkron",
    },

    {
      id: "1323020",
      project: "Probolinggo-Banyuwangi Paket 3 (JOP 25%)",
      nk: "996,822",
      qc_pu: "25,227",
      qc_bk: "47,470",
      sap_pu: "25,227",
      sap_bk: "47,470",
      dev_pu: "(0)",
      dev_bk: "(0)",
      ket: "Sinkron",
    },

    {
      id: "1421039",
      project: "PROYEK BENDUNGAN MBAY JOP 70%",
      nk: "485,958",
      qc_pu: "3,664",
      qc_bk: "4,787",
      sap_pu: "3,664",
      sap_bk: "4,787",
      dev_pu: "0",
      dev_bk: "(0)",
      ket: "Sinkron",
    },

    {
      id: "1424020",
      project: "Pembangunan Struktur Jembatan Musi",
      nk: "345,105",
      qc_pu: "18,376",
      qc_bk: "33,773",
      sap_pu: "18,376",
      sap_bk: "33,773",
      dev_pu: "0",
      dev_bk: "-",
      ket: "Sinkron",
    },

    {
      id: "1526008",
      project: "Semarang Sewerage - CWIS JOI 50%",
      nk: "290,628",
      qc_pu: "100",
      qc_bk: "(932)",
      sap_pu: "100",
      sap_bk: "258",
      dev_pu: "-",
      dev_bk: "(1,190,697,162)",
      ket: "JOI Leader",
    },

    {
      id: "1423029",
      project: "Bendungan Cibeet JOI 57,9%",
      nk: "1,325,526",
      qc_pu: "6,490",
      qc_bk: "6,568",
      sap_pu: "6,490",
      sap_bk: "6,412",
      dev_pu: "0",
      dev_bk: "(155,631,472)",
      ket: "Deviasi BK",
    },

    {
      id: "1424021",
      project: "Rehabilitasi D.I Cibaliung JOI 49%",
      nk: "233,828",
      qc_pu: "17,632",
      qc_bk: "15,871",
      sap_pu: "17,632",
      sap_bk: "15,911",
      dev_pu: "(0)",
      dev_bk: "(39,258,907)",
      ket: "Perlu Review",
    },

    {
      id: "1323026",
      project: "Pembangunan Jalan Baru Kretek - Girijati",
      nk: "341,092",
      qc_pu: "2,292",
      qc_bk: "3,507",
      sap_pu: "2,292",
      sap_bk: "3,517",
      dev_pu: "0",
      dev_bk: "(9,164,631)",
      ket: "Closing Minor",
    },
  ];

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* HEADER BIRU */}
        <div className="bg-[#000075] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">
              Matriks Realisasi SAP vs Quick Count
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Annual Monitoring PU & BK Tahun 2026
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">
              Last Update
            </p>

            <p className="text-white font-black text-sm mt-1">
              04 Mei 2026 • 23:09
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            {/* HEADER */}
            <thead className="sticky top-0 z-10">
              {/* HEADER ATAS */}
              <tr className="bg-slate-100 text-slate-700 uppercase text-[11px] tracking-wider">
                <th
                  rowSpan="2"
                  className="px-4 py-4 text-left border-b border-slate-200"
                >
                  ID Project
                </th>

                <th
                  rowSpan="2"
                  className="px-4 py-4 text-left border-b border-slate-200 min-w-[280px]"
                >
                  Nama Proyek
                </th>

                <th
                  rowSpan="2"
                  className="px-4 py-4 text-right border-b border-slate-200"
                >
                  Nilai Kontrak
                </th>

                <th
                  colSpan="2"
                  className="px-4 py-3 text-center border-b border-slate-200"
                >
                  Quick Count
                </th>

                <th
                  colSpan="2"
                  className="px-4 py-3 text-center border-b border-slate-200"
                >
                  SAP Realisasi
                </th>

                <th
                  colSpan="2"
                  className="px-4 py-3 text-center border-b border-slate-200"
                >
                  Deviasi (SAP - QC)
                </th>

                <th
                  rowSpan="2"
                  className="px-4 py-4 text-left border-b border-slate-200 min-w-[240px]"
                >
                  Keterangan
                </th>
              </tr>

              {/* SUB HEADER */}
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-right border-b border-slate-200">
                  PU
                </th>

                <th className="px-4 py-3 text-right border-b border-slate-200">
                  BK
                </th>

                <th className="px-4 py-3 text-right border-b border-slate-200">
                  PU
                </th>

                <th className="px-4 py-3 text-right border-b border-slate-200">
                  BK
                </th>

                <th className="px-4 py-3 text-right border-b border-slate-200 bg-red-50/40">
                  PU
                </th>

                <th className="px-4 py-3 text-right border-b border-slate-200 bg-red-50/40">
                  BK
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {tableData.map((row, index) => {
                const isDevPuMinus = row.dev_pu.includes("(");
                const isDevBkMinus = row.dev_bk.includes("(");

                return (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    {/* ID */}
                    <td className="px-4 py-4 text-slate-500 font-semibold">
                      {row.id}
                    </td>

                    {/* PROJECT */}
                    <td className="px-4 py-4 font-bold text-slate-800">
                      {row.project}
                    </td>

                    {/* NK */}
                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {row.nk}
                    </td>

                    {/* QC */}
                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {row.qc_pu}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {row.qc_bk}
                    </td>

                    {/* SAP */}
                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {row.sap_pu}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {row.sap_bk}
                    </td>

                    {/* DEV PU */}
                    <td
                      className={`px-4 py-4 text-right font-mono font-bold bg-red-50/20 ${
                        isDevPuMinus ? "text-red-600" : "text-slate-400"
                      }`}
                    >
                      {row.dev_pu}
                    </td>

                    {/* DEV BK */}
                    <td
                      className={`px-4 py-4 text-right font-mono font-bold bg-red-50/20 ${
                        isDevBkMinus ? "text-red-600" : "text-slate-400"
                      }`}
                    >
                      {row.dev_bk}
                    </td>

                    {/* KETERANGAN */}
                    <td className="px-4 py-4">
                      {row.ket === "Member" ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          Member
                        </span>
                      ) : (
                        <span className="text-slate-600">{row.ket}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RealisasiSapTable;
