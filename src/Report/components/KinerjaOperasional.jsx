import React, { useMemo } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";

// Helper Keamanan Angka
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

// Helper Penyeragaman ID Proyek
const getProjectId = (row) =>
  row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

const SlideKinerjaOperasional = () => {
  const { excelData, globalFilter } = useFilter();

  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    Mei: 5,
    Jun: 6,
    Jul: 7,
    Agu: 8,
    Sep: 9,
    Okt: 10,
    Nov: 11,
    Des: 12,
  };
  const currentMonthNum =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;
  const selectedYear = Number(globalFilter?.tahun || 2026);
  const selectedMonthName = globalFilter?.bulan || "Bulan Ini";

  // ==========================================================
  // PENGOLAHAN DATA DINAMIS
  // ==========================================================
  const tableData = useMemo(() => {
    const masterData = excelData?.db_master_data || [];
    const rkapData = excelData?.db_rkap_awal || [];
    const realData = excelData?.db_realisasi || [];
    const bebanData = excelData?.db_beban_bawah || [];

    // 1. Pemetaan Master Data untuk Tipe Proyek (JO vs Non-JO)
    const projectMap = {};
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (!id) return;

      const nonJoJoiValue = String(p.nonjo_joi || "")
        .toUpperCase()
        .trim();
      let isJO = false;
      if (nonJoJoiValue) {
        isJO =
          (nonJoJoiValue.includes("JOI") || nonJoJoiValue.includes("JO")) &&
          !nonJoJoiValue.includes("NON");
      } else {
        const namaProyek = getDisplayName(p).toUpperCase();
        isJO =
          namaProyek.includes(" JO") ||
          namaProyek.includes(" JOP") ||
          namaProyek.includes(" JOI");
      }
      projectMap[id] = isJO;
    });

    // Wadah Kalkulasi
    const res = {
      pu: {
        nonJo: { rkapSd: 0, realSd: 0, rkapDes: 0 },
        jo: { rkapSd: 0, realSd: 0, rkapDes: 0 },
      },
      bk: {
        nonJo: { rkapSd: 0, realSd: 0, rkapDes: 0 },
        jo: { rkapSd: 0, realSd: 0, rkapDes: 0 },
      },
      bebanTotal: { rkapSd: 0, realSd: 0, rkapDes: 0 },
    };

    // Wadah khusus rincian beban
    const bebanMap = {};

    // Helper Ekstraksi Nilai Dinamis
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
        if (
          k.includes(typeKey) &&
          (k.includes("real") || k.includes("parsial"))
        ) {
          return safeParseNumber(item[keys[i]]);
        }
      }
      return 0;
    };

    const getBebanValue = (row, keyPart) => {
      let exact =
        row[`beban_bawah_${keyPart}_parsial`] ?? row[`beban_${keyPart}`];
      if (exact !== undefined && exact !== null) return safeParseNumber(exact);
      const keys = Object.keys(row);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i].toLowerCase();
        if (
          k.includes(keyPart) &&
          (k.includes("beban") || k.includes("parsial"))
        ) {
          return safeParseNumber(row[keys[i]]);
        }
      }
      return 0;
    };

    const getValidMonth = (row) => {
      let m = safeParseNumber(row.bulan_index);
      if (!m && row.bulan) {
        const tBulan = String(row.bulan).toLowerCase().substring(0, 3);
        const bMap = {
          jan: 1,
          feb: 2,
          mar: 3,
          apr: 4,
          may: 5,
          mei: 5,
          jun: 6,
          jul: 7,
          agu: 8,
          sep: 9,
          okt: 10,
          nov: 11,
          des: 12,
        };
        m = bMap[tBulan] || 0;
      }
      if (!m && row.periode) {
        const d = new Date(row.periode);
        if (!isNaN(d.getTime())) m = d.getMonth() + 1;
      }
      return m;
    };

    // 2. Agregasi RKAP Awal
    rkapData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      if (y !== selectedYear) return;
      if (
        !String(row.rkap_status || "")
          .toLowerCase()
          .includes("awal")
      )
        return;

      const m = getValidMonth(row);
      const id = getProjectId(row);

      let isJO = projectMap[id];
      if (isJO === undefined) {
        const category = String(
          row.jenis_jo_current || row.nonjo_joi || "",
        ).toUpperCase();
        isJO =
          (category.includes("JOI") || category.includes("JO")) &&
          !category.includes("NON");
      }

      const puVal =
        safeParseNumber(row.pu_rkap_parsial || row.PU_RKAP_Parsial) / 1e9;
      const bkVal =
        safeParseNumber(row.bk_rkap_parsial || row.BK_RKAP_Parsial) / 1e9;

      const targetRef = isJO ? res.pu.jo : res.pu.nonJo;
      const targetRefBk = isJO ? res.bk.jo : res.bk.nonJo;

      targetRef.rkapDes += puVal;
      targetRefBk.rkapDes += bkVal;

      if (m > 0 && m <= currentMonthNum) {
        targetRef.rkapSd += puVal;
        targetRefBk.rkapSd += bkVal;
      }
    });

    // 3. Agregasi Realisasi
    realData.forEach((row) => {
      const y = safeParseNumber(row.tahun);
      const m = getValidMonth(row);
      if (y !== selectedYear) return;

      if (m > 0 && m <= currentMonthNum) {
        const id = getProjectId(row);
        let isJO = projectMap[id];
        if (isJO === undefined) {
          const category = String(
            row.jenis_jo_current || row.nonjo_joi || "",
          ).toUpperCase();
          isJO =
            (category.includes("JOI") || category.includes("JO")) &&
            !category.includes("NON");
        }

        const puVal = getDynamicValue(row, "pu") / 1e9;
        const bkVal = getDynamicValue(row, "bk") / 1e9;

        if (isJO) {
          res.pu.jo.realSd += puVal;
          res.bk.jo.realSd += bkVal;
        } else {
          res.pu.nonJo.realSd += puVal;
          res.bk.nonJo.realSd += bkVal;
        }
      }
    });

    // 4. Agregasi Beban Bawah & Rinciannya
    bebanData.forEach((row) => {
      let y = safeParseNumber(row.tahun);
      if (!y && row.periode) y = new Date(row.periode).getFullYear();
      if (y !== selectedYear) return;

      const m = getValidMonth(row);
      const rkapVal = getBebanValue(row, "rkap") / 1e9;
      const realVal = getBebanValue(row, "real") / 1e9;

      const rawName = String(
        row.uraian ||
          row.keterangan ||
          row.nama_beban ||
          row.item ||
          "Beban Lainnya",
      ).trim();

      if (!bebanMap[rawName]) {
        bebanMap[rawName] = { rkapSd: 0, realSd: 0, rkapDes: 0 };
      }

      // Rincian per nama beban
      bebanMap[rawName].rkapDes += rkapVal;
      res.bebanTotal.rkapDes += rkapVal;

      if (m > 0 && m <= currentMonthNum) {
        bebanMap[rawName].rkapSd += rkapVal;
        bebanMap[rawName].realSd += realVal;

        res.bebanTotal.rkapSd += rkapVal;
        res.bebanTotal.realSd += realVal;
      }
    });

    // 5. Kalkulasi Kumulatif & Margin
    const puTotal = {
      rkapSd: res.pu.nonJo.rkapSd + res.pu.jo.rkapSd,
      realSd: res.pu.nonJo.realSd + res.pu.jo.realSd,
      rkapDes: res.pu.nonJo.rkapDes + res.pu.jo.rkapDes,
    };

    const bkTotal = {
      rkapSd: res.bk.nonJo.rkapSd + res.bk.jo.rkapSd,
      realSd: res.bk.nonJo.realSd + res.bk.jo.realSd,
      rkapDes: res.bk.nonJo.rkapDes + res.bk.jo.rkapDes,
    };

    const lkTotal = {
      rkapSd: puTotal.rkapSd - bkTotal.rkapSd,
      realSd: puTotal.realSd - bkTotal.realSd,
      rkapDes: puTotal.rkapDes - bkTotal.rkapDes,
    };

    const lbTotal = {
      rkapSd: lkTotal.rkapSd + res.bebanTotal.rkapSd,
      realSd: lkTotal.realSd + res.bebanTotal.realSd,
      rkapDes: lkTotal.rkapDes + res.bebanTotal.rkapDes,
    };

    // Helper Rasio %
    const calcPct = (num, den) => (den !== 0 ? (num / den) * 100 : 0);

    const bkpuTotal = {
      rkapSd: calcPct(bkTotal.rkapSd, puTotal.rkapSd),
      realSd: calcPct(bkTotal.realSd, puTotal.realSd),
      rkapDes: calcPct(bkTotal.rkapDes, puTotal.rkapDes),
    };
    const bkpuNonJo = {
      rkapSd: calcPct(res.bk.nonJo.rkapSd, res.pu.nonJo.rkapSd),
      realSd: calcPct(res.bk.nonJo.realSd, res.pu.nonJo.realSd),
      rkapDes: calcPct(res.bk.nonJo.rkapDes, res.pu.nonJo.rkapDes),
    };
    const bkpuJo = {
      rkapSd: calcPct(res.bk.jo.rkapSd, res.pu.jo.rkapSd),
      realSd: calcPct(res.bk.jo.realSd, res.pu.jo.realSd),
      rkapDes: calcPct(res.bk.jo.rkapDes, res.pu.jo.rkapDes),
    };

    const gpmTotal = {
      rkapSd: calcPct(lkTotal.rkapSd, puTotal.rkapSd),
      realSd: calcPct(lkTotal.realSd, puTotal.realSd),
      rkapDes: calcPct(lkTotal.rkapDes, puTotal.rkapDes),
    };

    const npmTotal = {
      rkapSd: calcPct(lbTotal.rkapSd, puTotal.rkapSd),
      realSd: calcPct(lbTotal.realSd, puTotal.realSd),
      rkapDes: calcPct(lbTotal.rkapDes, puTotal.rkapDes),
    };

    // Helper pembentukan baris array
    const generateRow = (
      uraian,
      dataObj,
      isBold = false,
      isIndent = false,
      isPctRow = false,
    ) => {
      const { rkapSd, realSd, rkapDes } = dataObj;
      const persen = !isPctRow && rkapSd !== 0 ? (realSd / rkapSd) * 100 : null;
      const sisa = !isPctRow ? rkapDes - realSd : null;
      return {
        uraian,
        rkapSd,
        realSd,
        persen,
        rkapDes,
        sisa,
        isBold,
        isIndent,
        isPctRow,
      };
    };

    // Mapping dinamis untuk anak-anak Beban Usaha
    const bebanRows = Object.keys(bebanMap).map((key, index) => {
      const b = bebanMap[key];
      const prefix = String.fromCharCode(97 + index); // a, b, c...
      return generateRow(`${prefix}. ${key}`, b, false, true, false);
    });

    return [
      generateRow("PU", puTotal, true, false, false),
      generateRow("a. Non JO & JOP", res.pu.nonJo, false, true, false),
      generateRow("b. JOI", res.pu.jo, false, true, false),

      generateRow("BK", bkTotal, true, false, false),
      generateRow("a. Non JO & JOP", res.bk.nonJo, false, true, false),
      generateRow("b. JOI", res.bk.jo, false, true, false),

      generateRow("BK/PU", bkpuTotal, true, false, true),
      generateRow("a. Non JO & JOP", bkpuNonJo, false, true, true),
      generateRow("b. JOI", bkpuJo, false, true, true),

      generateRow("LK", lkTotal, true, false, false),
      generateRow(
        "a. Non JO & JOP",
        {
          rkapSd: res.pu.nonJo.rkapSd - res.bk.nonJo.rkapSd,
          realSd: res.pu.nonJo.realSd - res.bk.nonJo.realSd,
          rkapDes: res.pu.nonJo.rkapDes - res.bk.nonJo.rkapDes,
        },
        false,
        true,
        false,
      ),
      generateRow(
        "b. JOI",
        {
          rkapSd: res.pu.jo.rkapSd - res.bk.jo.rkapSd,
          realSd: res.pu.jo.realSd - res.bk.jo.realSd,
          rkapDes: res.pu.jo.rkapDes - res.bk.jo.rkapDes,
        },
        false,
        true,
        false,
      ),

      generateRow("GPM", gpmTotal, true, false, true),
      generateRow("BEBAN USAHA", res.bebanTotal, true, false, false),

      // Sisipkan baris rincian beban secara dinamis di sini
      ...bebanRows,

      generateRow("LABA BERSIH", lbTotal, true, false, false),
      generateRow("NPM", npmTotal, true, false, true),
    ];
  }, [excelData, globalFilter, selectedYear, currentMonthNum]);

  // ==========================================================
  // HELPER FORMAT TAMPILAN ANGKA
  // ==========================================================
  const renderFinancial = (num, isPercent = false, isNull = false) => {
    if (isNull || num === null) return ""; // Kosongkan sel untuk baris berjenis persentase murni
    if (!num && num !== 0) return "-";

    const formatted = formatNumber(Math.abs(num), 2);
    const suffix = isPercent ? "%" : "";

    // Beri tanda kurung merah jika nilainya negatif
    if (num < 0) {
      return (
        <span style={{ color: "#DC2626" }}>
          ({formatted}
          {suffix})
        </span>
      );
    }
    return `${formatted}${suffix}`;
  };

  const thStyle = {
    padding: "8px",
    border: "1px solid #fff",
    color: "#fff",
    textAlign: "center",
    fontSize: "11px",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "5px 6px",
    border: "1px solid #E2E8F0",
    fontSize: "11px",
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  return (
    <ContentLayout
      pageNumber={3}
      sectionNumber={3}
      slideTitle="EVALUASI KINERJA OPERASIONAL"
    >
      <div style={{ display: "flex", gap: "20px", height: "100%" }}>
        {/* KOLOM KIRI (Tabel & Top 5) */}
        <div
          style={{
            flex: "0 0 52%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              flexShrink: 0,
            }}
          >
            {" "}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#0F172A",
              }}
            >
              <span>Kinerja sd. {selectedMonthName} (Annual)</span>
              <span>Rp. Milyar</span>
            </div>
            {/* WRAPPER TABEL DENGAN AUTO SCROLL SETELAH LABA KOTOR / GPM */}
            <div
              className="scrollbar-thin"
              style={{
                maxHeight: "340px", // Tinggi pas untuk memotong tabel dan memicu scroll
                overflowY: "auto",
                borderBottom: "2px solid #CBD5E1",
                borderTop: "2px solid #CBD5E1",
                borderRadius: "4px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        ...thStyle,
                        background: "#000050",
                        width: "36%",
                      }}
                    >
                      Uraian
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        background: "#000050",
                        width: "12.8%",
                      }}
                    >
                      RKAP
                      <br />
                      Jan - {selectedMonthName.substring(0, 3)}
                      <br />1
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        background: "#BD002F",
                        width: "12.8%",
                      }}
                    >
                      Real
                      <br />
                      Jan - {selectedMonthName.substring(0, 3)}
                      <br />2
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        background: "#000050",
                        width: "12.8%",
                      }}
                    >
                      % thd RKAP
                      <br />
                      sd {selectedMonthName.substring(0, 3)}
                      <br />
                      3=2/1
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        background: "#16A34A",
                        width: "12.8%",
                      }}
                    >
                      RKAP
                      <br />
                      Jan - Des
                      <br />4
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        background: "#BD002F",
                        width: "12.8%",
                      }}
                    >
                      Sisa thd
                      <br />
                      RKAP
                      <br />
                      5=4-2
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tableData.map((row, i) => {
                    let bgRow = row.isBold ? "#EFF6FF" : "#FFFFFF";

                    if (
                      row.uraian.includes("LABA") ||
                      row.uraian.includes("GPM") ||
                      row.uraian.includes("NPM")
                    ) {
                      bgRow = row.isBold ? "#FEF9C3" : "#FEFCE8";
                    }

                    return (
                      <tr
                        key={i}
                        style={{
                          backgroundColor: bgRow,
                          fontWeight: row.isBold ? "800" : "500",
                        }}
                      >
                        <td
                          style={{
                            ...tdStyle,
                            width: "36%",
                            textAlign: "left",
                            paddingLeft: row.isIndent ? "20px" : "6px",
                            color: row.isBold ? "#0F172A" : "#475569",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.uraian}
                        </td>

                        <td style={{ ...tdStyle, width: "12.8%" }}>
                          {renderFinancial(row.rkapSd, row.isPctRow)}
                        </td>

                        <td style={{ ...tdStyle, width: "12.8%" }}>
                          {renderFinancial(row.realSd, row.isPctRow)}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            width: "12.8%",
                            fontWeight: "800",
                          }}
                        >
                          {renderFinancial(row.persen, true, row.isPctRow)}
                        </td>

                        <td style={{ ...tdStyle, width: "12.8%" }}>
                          {renderFinancial(row.rkapDes, row.isPctRow)}
                        </td>

                        <td style={{ ...tdStyle, width: "12.8%" }}>
                          {renderFinancial(row.sisa, false, row.isPctRow)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tempat untuk Chart Bar Horizontal Top 5 */}
          <div
            style={{
              flex: 1,
              minHeight: "120px",
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <span
              style={{ color: "#999", fontSize: "12px", fontWeight: "bold" }}
            >
              [ Area Chart Top 5 Tidak Tercapai ]
            </span>
          </div>
        </div>

        {/* KOLOM KANAN (Grafik Tren) */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            gridTemplateRows: "1fr 1fr 1fr",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((chart) => (
            <div
              key={chart}
              style={{
                border: "1px dashed #ccc",
                background: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <span
                style={{ color: "#999", fontSize: "12px", fontWeight: "bold" }}
              >
                [ Chart Area {chart} ]
              </span>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideKinerjaOperasional;
