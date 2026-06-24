import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideEvaluasiSisaRkap = () => {
  // ==========================================
  // DATA & TABLE COMPONENTS
  // ==========================================

  const tableData = [
    {
      id: 1,
      no: "1",
      nama: "Perbaikan KAPB",
      nk: "856,594",
      rkapProg: "91.59%",
      pu1: "415,818",
      bk1: "374,236",
      lk1: "41,582",
      realProg: "46.21%",
      pu2: "175,519",
      bk2: "225,956",
      lk2: "(50,437)",
      pu3: "240,299",
      bk3: "148,280",
      lk3: "92,019",
      real: "35,104",
      sisa: "34,328",
      pencapaian: "102.26%",
    },
    {
      id: 2,
      no: "2",
      nama: "Bocimi 3B",
      nk: "1,254,254",
      rkapProg: "100.00%",
      pu1: "409,567",
      bk1: "382,646",
      lk1: "26,921",
      realProg: "77.05%",
      pu2: "176,566",
      bk2: "167,554",
      lk2: "9,012",
      pu3: "233,002",
      bk3: "215,093",
      lk3: "17,909",
      real: "35,313",
      sisa: "33,286",
      pencapaian: "106.09%",
    },
    {
      id: 3,
      no: "3",
      nama: "Bocimi 3A",
      nk: "897,832",
      rkapProg: "112.07%",
      pu1: "287,981",
      bk1: "256,201",
      lk1: "31,780",
      realProg: "86.65%",
      pu2: "76,334",
      bk2: "83,853",
      lk2: "(7,519)",
      pu3: "211,648",
      bk3: "172,348",
      lk3: "39,299",
      real: "15,267",
      sisa: "30,235",
      pencapaian: "50.49%",
    },
    {
      id: 4,
      no: "4",
      nama: "Oplah Banten Thp 3",
      nk: "200,000",
      rkapProg: "100.00%",
      pu1: "200,000",
      bk1: "186,000",
      lk1: "14,000",
      realProg: "0.00%",
      pu2: "-",
      bk2: "-",
      lk2: "-",
      pu3: "200,000",
      bk3: "186,000",
      lk3: "14,000",
      real: "-",
      sisa: "28,571",
      pencapaian: "0.00%",
    },
    {
      id: 5,
      no: "5",
      nama: "KSCS 1",
      nk: "507,425",
      rkapProg: "57.27%",
      pu1: "266,390",
      bk1: "238,782",
      lk1: "27,608",
      realProg: "21.31%",
      pu2: "91,994",
      bk2: "82,016",
      lk2: "9,979",
      pu3: "174,395",
      bk3: "156,766",
      lk3: "17,629",
      real: "18,399",
      sisa: "24,914",
      pencapaian: "73.85%",
    },
    {
      id: 6,
      no: "6",
      nama: "Irg. Lempuing 3",
      nk: "218,628",
      rkapProg: "99.97%",
      pu1: "103,015",
      bk1: "83,947",
      lk1: "19,068",
      realProg: "71.01%",
      pu2: "16,799",
      bk2: "14,796",
      lk2: "2,003",
      pu3: "86,216",
      bk3: "69,151",
      lk3: "17,065",
      real: "3,360",
      sisa: "12,317",
      pencapaian: "27.28%",
    },
    {
      id: 7,
      no: "7",
      nama: "KSPP Merauke",
      nk: "238,390",
      rkapProg: "54.58%",
      pu1: "130,123",
      bk1: "121,014",
      lk1: "9,109",
      realProg: "27.24%",
      pu2: "55,110",
      bk2: "52,882",
      lk2: "2,227",
      pu3: "75,013",
      bk3: "68,132",
      lk3: "6,881",
      real: "11,022",
      sisa: "10,716",
      pencapaian: "102.85%",
    },
    {
      id: 8,
      no: "8",
      nama: "Lempuing II JOP",
      nk: "234,732",
      rkapProg: "100.00%",
      pu1: "78,781",
      bk1: "59,853",
      lk1: "18,928",
      realProg: "75.00%",
      pu2: "17,203",
      bk2: "22,723",
      lk2: "(5,520)",
      pu3: "61,578",
      bk3: "37,130",
      lk3: "24,448",
      real: "3,441",
      sisa: "8,797",
      pencapaian: "39.11%",
    },
    {
      id: 9,
      no: "9",
      nama: "Struktur Musi",
      nk: "345,105",
      rkapProg: "113.04%",
      pu1: "79,510",
      bk1: "83,141",
      lk1: "(3,630)",
      realProg: "100.34%",
      pu2: "18,376",
      bk2: "33,773",
      lk2: "(15,397)",
      pu3: "61,134",
      bk3: "49,368",
      lk3: "11,766",
      real: "3,675",
      sisa: "8,733",
      pencapaian: "42.08%",
    },
    {
      id: 10,
      no: "10",
      nama: "Japeksel 3 Induk",
      nk: "3,938,464",
      rkapProg: "100.00%",
      pu1: "56,505",
      bk1: "137,854",
      lk1: "(81,349)",
      realProg: "98.57%",
      pu2: "-",
      bk2: "59,764",
      lk2: "(59,764)",
      pu3: "56,505",
      bk3: "78,090",
      lk3: "(21,584)",
      real: "-",
      sisa: "8,072",
      pencapaian: "0.00%",
    },
    {
      id: 11,
      no: "11",
      nama: "Proban Pkt. 3",
      nk: "996,822",
      rkapProg: "108.73%",
      pu1: "87,050",
      bk1: "91,422",
      lk1: "(4,372)",
      realProg: "95.70%",
      pu2: "32,958",
      bk2: "53,964",
      lk2: "(21,006)",
      pu3: "54,092",
      bk3: "37,458",
      lk3: "16,634",
      real: "6,592",
      sisa: "7,727",
      pencapaian: "85.30%",
    },
    {
      id: 12,
      no: "12",
      nama: "Bend. Jragung I",
      nk: "799,473",
      rkapProg: "100.00%",
      pu1: "71,857",
      bk1: "58,782",
      lk1: "13,076",
      realProg: "93.69%",
      pu2: "26,460",
      bk2: "25,489",
      lk2: "972",
      pu3: "45,397",
      bk3: "33,293",
      lk3: "12,104",
      real: "5,292",
      sisa: "6,485",
      pencapaian: "81.60%",
    },
    {
      id: 13,
      no: "13",
      nama: "Irg. Lempuing 1",
      nk: "83,812",
      rkapProg: "64.61%",
      pu1: "48,737",
      bk1: "45,798",
      lk1: "2,939",
      realProg: "14.70%",
      pu2: "5,458",
      bk2: "8,597",
      lk2: "(3,139)",
      pu3: "43,279",
      bk3: "37,201",
      lk3: "6,078",
      real: "1,092",
      sisa: "6,183",
      pencapaian: "17.66%",
    },
    {
      id: 14,
      no: "14",
      nama: "Bend. Jragung 4",
      nk: "60,553",
      rkapProg: "100.00%",
      pu1: "42,302",
      bk1: "36,061",
      lk1: "6,241",
      realProg: "42.88%",
      pu2: "5,638",
      bk2: "4,662",
      lk2: "976",
      pu3: "36,664",
      bk3: "31,399",
      lk3: "5,265",
      real: "1,128",
      sisa: "5,238",
      pencapaian: "21.53%",
    },
    {
      id: 15,
      no: "15",
      nama: "Bend. Mbay",
      nk: "485,958",
      rkapProg: "100.00%",
      pu1: "38,391",
      bk1: "35,032",
      lk1: "3,359",
      realProg: "96.84%",
      pu2: "4,784",
      bk2: "5,704",
      lk2: "(920)",
      pu3: "33,607",
      bk3: "29,328",
      lk3: "4,279",
      real: "957",
      sisa: "4,801",
      pencapaian: "19.93%",
    },
    {
      id: 16,
      no: "16",
      nama: "Bend. Bener",
      nk: "589,747",
      rkapProg: "81.30%",
      pu1: "43,145",
      bk1: "51,463",
      lk1: "(8,319)",
      realProg: "81.53%",
      pu2: "24,678",
      bk2: "32,612",
      lk2: "(7,935)",
      pu3: "18,467",
      bk3: "18,851",
      lk3: "(384)",
      real: "4,936",
      sisa: "2,638",
      pencapaian: "187.08%",
    },
    {
      id: 17,
      no: "17",
      nama: "Pengarah Rukoh",
      nk: "411,452",
      rkapProg: "57.01%",
      pu1: "17,692",
      bk1: "18,337",
      lk1: "(645)",
      realProg: "55.09%",
      pu2: "9,760",
      bk2: "20,917",
      lk2: "(11,157)",
      pu3: "7,933",
      bk3: "(2,580)",
      lk3: "10,512",
      real: "1,952",
      sisa: "1,133",
      pencapaian: "172.24%",
    },
    {
      id: 18,
      no: "18",
      nama: "Bend. Jlantah",
      nk: "566,919",
      rkapProg: "100.00%",
      pu1: "-",
      bk1: "-",
      lk1: "-",
      realProg: "100.00%",
      pu2: "-",
      bk2: "17,334",
      lk2: "(17,334)",
      pu3: "-",
      bk3: "(17,334)",
      lk3: "17,334",
      real: "-",
      sisa: "-",
      pencapaian: "0.00%",
    },
    {
      id: 19,
      no: "19",
      nama: "Irg. Rentang",
      nk: "571,101",
      rkapProg: "100.93%",
      pu1: "-",
      bk1: "1",
      lk1: "(1)",
      realProg: "100.00%",
      pu2: "-",
      bk2: "-",
      lk2: "-",
      pu3: "-",
      bk3: "1",
      lk3: "(1)",
      real: "-",
      sisa: "-",
      pencapaian: "0.00%",
    },
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
      sectionNumber="12"
      slideTitle={'SISA TARGET DES. 2026 "PU & LK" (1/3)'}
    >
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "10.5px",
            fontFamily: "Arial, sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <thead>
            {/* MAIN HEADERS */}
            <tr>
              <th rowSpan={2} style={thStyle}>
                No.
              </th>
              <th rowSpan={2} style={thStyle}>
                Nama Proyek
              </th>
              <th
                rowSpan={2}
                style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
              >
                NK
              </th>
              <th
                rowSpan={2}
                style={{
                  ...thStyle,
                  borderRight: "4px solid #ffffff",
                }}
              >
                RKAP Prog.
                <br />
                Sd. Des.
                <br />
                '26
                <br />1
              </th>
              <th
                colSpan={3}
                style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
              >
                RKAP Sd. Des. 2026
                <br />
                Annual
              </th>
              <th
                rowSpan={2}
                style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
              >
                Real. Prog.
                <br />
                Sd Bln. Ini
                <br />5
              </th>
              <th
                colSpan={3}
                style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
              >
                Real. Sd. Bulan Ini
              </th>
              <th
                colSpan={3}
                style={{ ...thStyle, borderRight: "4px solid #ffffff" }}
              >
                Sisa Thd. RKAP Des. '26
              </th>
              <th colSpan={3} style={thStyle}>
                Rata2 PU Per Bulan
              </th>
            </tr>
            {/* SUB HEADERS */}
            <tr>
              <th style={thStyle}>
                PU
                <br />2
              </th>
              <th style={thStyle}>
                BK
                <br />3
              </th>
              <th style={{ ...thStyle, borderRight: "4px solid #ffffff" }}>
                LK
                <br />
                4=2-3
              </th>
              <th style={thStyle}>
                PU
                <br />6
              </th>
              <th style={thStyle}>
                BK
                <br />7
              </th>
              <th style={{ ...thStyle, borderRight: "4px solid #ffffff" }}>
                LK
                <br />
                8=6-7
              </th>
              <th style={thStyle}>
                PU
                <br />
                10
              </th>
              <th style={thStyle}>
                BK
                <br />
                11
              </th>
              <th style={{ ...thStyle, borderRight: "4px solid #ffffff" }}>
                LK
                <br />
                12=11/10
              </th>
              <th style={thStyle}>
                Real.
                <br />
                13
              </th>
              <th style={thStyle}>
                Sisa
                <br />
                14
              </th>
              <th style={thStyle}>
                Pencapaian
                <br />
                15=13/14
              </th>
            </tr>
          </thead>
          <tbody>
            {/* SUMMARY ROW */}
            <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
              <td
                style={{ ...tdStyle, textAlign: "center", border: "none" }}
              ></td>
              <td
                colSpan={3}
                style={{ ...tdStyle, textAlign: "center", borderLeft: "none" }}
              >
                Non JO & JOP
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>2,392,101</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>2,275,956</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>116,145</td>
              <td style={{ ...tdStyle, textAlign: "center" }}></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>868,125</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1,079,768</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>(211,643)</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1,523,976</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1,196,188</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>327,788</td>
              <td style={{ ...tdStyle, textAlign: "center" }}></td>
              <td style={{ ...tdStyle, textAlign: "center" }}></td>
              <td style={{ ...tdStyle, textAlign: "center" }}></td>
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
                <td style={{ ...tdStyle, textAlign: "left", width: "100%" }}>
                  {row.nama}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.nk}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {row.rkapProg}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.pu1}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.bk1}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.lk1}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {row.realProg}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.pu2}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.bk2}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.lk2}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.pu3}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.bk3}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.lk3}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.real}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{row.sisa}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {row.pencapaian}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
};
export default SlideEvaluasiSisaRkap;