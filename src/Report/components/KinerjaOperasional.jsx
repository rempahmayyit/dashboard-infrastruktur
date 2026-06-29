import React, { useMemo, useState } from "react";
import ContentLayout from "../pages/ContentLayout";
import { useFilter } from "../../context/FilterContext";
import { formatNumber, formatCompact } from "../../utils/formatters";
import { getDisplayName } from "../../utils/projectName";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  Tooltip,
} from "recharts";

// ==========================================================
// HELPERS PENGOLAHAN DATA
// ==========================================================
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const getProjectId = (row) => row?.id_project || row?.id_proyek || row?.project_id || row?.id || null;

const getValidMonth = (row) => {
  let m = safeParseNumber(row.bulan_index);
  if (!m && row.bulan) {
    const tBulan = String(row.bulan).toLowerCase().substring(0, 3);
    const bMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6, jul: 7, agu: 8, sep: 9, okt: 10, nov: 11, des: 12 };
    m = bMap[tBulan] || 0;
  }
  if (!m && row.periode) {
    const d = new Date(row.periode);
    if (!isNaN(d.getTime())) m = d.getMonth() + 1;
  }
  return m;
};

const getDynamicValue = (item, typeKey) => {
  let exactMatch = item[`${typeKey}_realisasi_parsial`] ?? item[`${typeKey}_Realisasi_Parsial`] ?? item[`${typeKey}_realisasi`];
  if (exactMatch !== undefined && exactMatch !== null) return safeParseNumber(exactMatch);
  
  const keys = Object.keys(item);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i].toLowerCase();
    if (k.includes(typeKey) && (k.includes("real") || k.includes("parsial"))) {
      return safeParseNumber(item[keys[i]]);
    }
  }
  return 0;
};

// ==========================================================
// UI COMPONENTS KECIL (DIEKSTRAK AGAR TIDAK RE-RENDER)
// ==========================================================
const ChartHeader = ({ title }) => (
  <div style={{
    background: "#163261", color: "#fff", fontWeight: "bold", fontSize: "11px", textAlign: "center",
    padding: "4px 0", marginBottom: 4, clipPath: "polygon(5% 0%,95% 0%,100% 50%,95% 100%,5% 100%,0% 50%)"
  }}>
    {title}
  </div>
);

const FilterToggle = ({ value, onChange }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 4 }}>
    <button
      onClick={() => onChange({ ...value, nonJo: !value.nonJo })}
      style={{ padding: "2px 8px", fontSize: 9, borderRadius: 12, border: "1px solid #163261", background: value.nonJo ? "#163261" : "#fff", color: value.nonJo ? "#fff" : "#163261", cursor: "pointer" }}
    >
      Non JO
    </button>
    <button
      onClick={() => onChange({ ...value, joi: !value.joi })}
      style={{ padding: "2px 8px", fontSize: 9, borderRadius: 12, border: "1px solid #163261", background: value.joi ? "#163261" : "#fff", color: value.joi ? "#fff" : "#163261", cursor: "pointer" }}
    >
      JOI
    </button>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", boxShadow: "0 4px 10px rgba(0,0,0,.15)", fontSize: 11 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#002b7f" }}>{label}</div>
      {payload.map((entry, index) => (
        <div key={index} style={{ color: entry.color, marginBottom: 3 }}>
          {entry.name} : <b>{Number(entry.value).toLocaleString("id-ID")}</b>
        </div>
      ))}
    </div>
  );
};

const FinancialTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #d9d9d9", borderRadius: 4, padding: "8px 10px", boxShadow: "0 2px 8px rgba(0,0,0,.12)", fontSize: 12, lineHeight: 1.5, minWidth: 130 }}>
      <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 6 }}>{label}</div>
      {payload.map((item) => {
        const isPercent = item.dataKey?.toLowerCase().includes("pct") || item.dataKey?.toLowerCase().includes("bkpu");
        return (
          <div key={item.dataKey} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 3 }}>
            <span style={{ color: item.color, fontWeight: 500 }}>{item.name}</span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {isPercent ? `${Number(item.value).toFixed(2)}%` : formatCompact(item.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================================
// KOMPONEN UTAMA
// ==========================================================
const SlideKinerjaOperasional = () => {
  const [chartFilter, setChartFilter] = useState({
    pu: { nonJo: true, joi: false },
    bkpu: { nonJo: true, joi: false },
    lk: { nonJo: true, joi: true },
  });

  const { excelData, globalFilter } = useFilter();

  const currentMonthNum = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6, Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12 }[globalFilter?.bulan] || new Date().getMonth() + 1;
  const selectedYear = Number(globalFilter?.tahun || 2026);
  const selectedMonthName = globalFilter?.bulan || "Bulan Ini";

  // --------------------------------------------------------
  // MASTER DATA MAPPING (DIJADIKAN SATU SUMBER KEBENARAN)
  // --------------------------------------------------------
  const projectMaps = useMemo(() => {
    const isJoMap = {};
    const nameMap = {};
    const masterData = excelData?.db_master_data || [];
    
    masterData.forEach((p) => {
      const id = getProjectId(p);
      if (!id) return;
      
      const category = String(p.nonjo_joi || "").toUpperCase().trim();
      if (category) {
        isJoMap[id] = (category.includes("JOI") || category.includes("JO")) && !category.includes("NON");
      } else {
        const namaProyek = getDisplayName(p).toUpperCase();
        isJoMap[id] = namaProyek.includes(" JO") || namaProyek.includes(" JOP") || namaProyek.includes(" JOI");
      }
      
      nameMap[id] = p.short_project_name || p.display_name || p.project_name || id;
    });
    
    return { isJoMap, nameMap };
  }, [excelData]);

  // Helper Dinamis untuk Cek Status JO dari Row
  const checkJoStatus = (row) => {
    const id = getProjectId(row);
    let isJO = projectMaps.isJoMap[id];
    if (isJO === undefined) {
      const category = String(row.jenis_jo_current || row.nonjo_joi || "").toUpperCase();
      isJO = (category.includes("JOI") || category.includes("JO")) && !category.includes("NON");
    }
    return isJO;
  };

  // --------------------------------------------------------
  // LOGIKA TABEL UTAMA
  // --------------------------------------------------------
  const tableData = useMemo(() => {
    const rkapData = excelData?.db_rkap_awal || [];
    const realData = excelData?.db_realisasi || [];
    const bebanData = excelData?.db_beban_bawah || [];

    const res = {
      pu: { nonJo: { rkapSd: 0, realSd: 0, rkapDes: 0 }, jo: { rkapSd: 0, realSd: 0, rkapDes: 0 } },
      bk: { nonJo: { rkapSd: 0, realSd: 0, rkapDes: 0 }, jo: { rkapSd: 0, realSd: 0, rkapDes: 0 } },
      bebanTotal: { rkapSd: 0, realSd: 0, rkapDes: 0 },
    };
    const bebanMap = {};

    const getBebanValue = (row, keyPart) => {
      let exact = row[`beban_bawah_${keyPart}_parsial`] ?? row[`beban_${keyPart}`];
      if (exact !== undefined && exact !== null) return safeParseNumber(exact);
      const keys = Object.keys(row);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i].toLowerCase();
        if (k.includes(keyPart) && (k.includes("beban") || k.includes("parsial"))) return safeParseNumber(row[keys[i]]);
      }
      return 0;
    };

    rkapData.forEach((row) => {
      if (safeParseNumber(row.tahun) !== selectedYear || !String(row.rkap_status || "").toLowerCase().includes("awal")) return;
      
      const m = getValidMonth(row);
      const isJO = checkJoStatus(row);
      const puVal = safeParseNumber(row.pu_rkap_parsial || row.PU_RKAP_Parsial) / 1e9;
      const bkVal = safeParseNumber(row.bk_rkap_parsial || row.BK_RKAP_Parsial) / 1e9;
      
      const targetPu = isJO ? res.pu.jo : res.pu.nonJo;
      const targetBk = isJO ? res.bk.jo : res.bk.nonJo;
      
      targetPu.rkapDes += puVal;
      targetBk.rkapDes += bkVal;
      if (m > 0 && m <= currentMonthNum) {
        targetPu.rkapSd += puVal;
        targetBk.rkapSd += bkVal;
      }
    });

    realData.forEach((row) => {
      if (safeParseNumber(row.tahun) !== selectedYear) return;
      const m = getValidMonth(row);
      if (m > 0 && m <= currentMonthNum) {
        const isJO = checkJoStatus(row);
        const puVal = getDynamicValue(row, "pu") / 1e9;
        const bkVal = getDynamicValue(row, "bk") / 1e9;
        
        if (isJO) { res.pu.jo.realSd += puVal; res.bk.jo.realSd += bkVal; } 
        else { res.pu.nonJo.realSd += puVal; res.bk.nonJo.realSd += bkVal; }
      }
    });

    bebanData.forEach((row) => {
      let y = safeParseNumber(row.tahun);
      if (!y && row.periode) y = new Date(row.periode).getFullYear();
      if (y !== selectedYear) return;
      
      const m = getValidMonth(row);
      const rkapVal = getBebanValue(row, "rkap") / 1e9;
      const realVal = getBebanValue(row, "real") / 1e9;
      const rawName = String(row.uraian || row.keterangan || row.nama_beban || row.item || "Beban Lainnya").trim();

      if (!bebanMap[rawName]) bebanMap[rawName] = { rkapSd: 0, realSd: 0, rkapDes: 0 };
      
      bebanMap[rawName].rkapDes += rkapVal;
      res.bebanTotal.rkapDes += rkapVal;
      if (m > 0 && m <= currentMonthNum) {
        bebanMap[rawName].rkapSd += rkapVal;
        bebanMap[rawName].realSd += realVal;
        res.bebanTotal.rkapSd += rkapVal;
        res.bebanTotal.realSd += realVal;
      }
    });

    const puTotal = { rkapSd: res.pu.nonJo.rkapSd + res.pu.jo.rkapSd, realSd: res.pu.nonJo.realSd + res.pu.jo.realSd, rkapDes: res.pu.nonJo.rkapDes + res.pu.jo.rkapDes };
    const bkTotal = { rkapSd: res.bk.nonJo.rkapSd + res.bk.jo.rkapSd, realSd: res.bk.nonJo.realSd + res.bk.jo.realSd, rkapDes: res.bk.nonJo.rkapDes + res.bk.jo.rkapDes };
    const lkTotal = { rkapSd: puTotal.rkapSd - bkTotal.rkapSd, realSd: puTotal.realSd - bkTotal.realSd, rkapDes: puTotal.rkapDes - bkTotal.rkapDes };
    const lbTotal = { rkapSd: lkTotal.rkapSd + res.bebanTotal.rkapSd, realSd: lkTotal.realSd + res.bebanTotal.realSd, rkapDes: lkTotal.rkapDes + res.bebanTotal.rkapDes };

    const calcPct = (num, den) => (den !== 0 ? (num / den) * 100 : 0);
    const bkpuTotal = { rkapSd: calcPct(bkTotal.rkapSd, puTotal.rkapSd), realSd: calcPct(bkTotal.realSd, puTotal.realSd), rkapDes: calcPct(bkTotal.rkapDes, puTotal.rkapDes) };
    const bkpuNonJo = { rkapSd: calcPct(res.bk.nonJo.rkapSd, res.pu.nonJo.rkapSd), realSd: calcPct(res.bk.nonJo.realSd, res.pu.nonJo.realSd), rkapDes: calcPct(res.bk.nonJo.rkapDes, res.pu.nonJo.rkapDes) };
    const bkpuJo = { rkapSd: calcPct(res.bk.jo.rkapSd, res.pu.jo.rkapSd), realSd: calcPct(res.bk.jo.realSd, res.pu.jo.realSd), rkapDes: calcPct(res.bk.jo.rkapDes, res.pu.jo.rkapDes) };
    const gpmTotal = { rkapSd: calcPct(lkTotal.rkapSd, puTotal.rkapSd), realSd: calcPct(lkTotal.realSd, puTotal.realSd), rkapDes: calcPct(lkTotal.rkapDes, puTotal.rkapDes) };
    const npmTotal = { rkapSd: calcPct(lbTotal.rkapSd, puTotal.rkapSd), realSd: calcPct(lbTotal.realSd, puTotal.realSd), rkapDes: calcPct(lbTotal.rkapDes, puTotal.rkapDes) };

    const generateRow = (uraian, d, isBold = false, isIndent = false, isPctRow = false) => ({
      uraian, rkapSd: d.rkapSd, realSd: d.realSd, rkapDes: d.rkapDes,
      persen: !isPctRow && d.rkapSd !== 0 ? (d.realSd / d.rkapSd) * 100 : null,
      sisa: !isPctRow ? d.rkapDes - d.realSd : null, isBold, isIndent, isPctRow
    });

    const bebanRows = Object.keys(bebanMap).map((key, index) => generateRow(`${String.fromCharCode(97 + index)}. ${key}`, bebanMap[key], false, true, false));

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
      generateRow("a. Non JO & JOP", { rkapSd: res.pu.nonJo.rkapSd - res.bk.nonJo.rkapSd, realSd: res.pu.nonJo.realSd - res.bk.nonJo.realSd, rkapDes: res.pu.nonJo.rkapDes - res.bk.nonJo.rkapDes }, false, true, false),
      generateRow("b. JOI", { rkapSd: res.pu.jo.rkapSd - res.bk.jo.rkapSd, realSd: res.pu.jo.realSd - res.bk.jo.realSd, rkapDes: res.pu.jo.rkapDes - res.bk.jo.rkapDes }, false, true, false),
      generateRow("GPM", gpmTotal, true, false, true),
      generateRow("BEBAN USAHA", res.bebanTotal, true, false, false),
      ...bebanRows,
      generateRow("LABA BERSIH", lbTotal, true, false, false),
      generateRow("NPM", npmTotal, true, false, true),
    ];
  }, [excelData, selectedYear, currentMonthNum, projectMaps]);

  // --------------------------------------------------------
  // LOGIKA CHART & TOP 5 (TERHUBUNG KE TOGGLE FILTER)
  // --------------------------------------------------------
  const { chartData, top5Pu, top5Lk } = useMemo(() => {
    const rkapData = excelData?.db_rkap_awal || [];
    const realData = excelData?.db_realisasi || [];
    const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    // -- Kalkulasi Chart Tren --
    let cPuRkap_pu = 0, cPuReal_pu = 0;
    let cPuRkap_bkpu = 0, cBkRkap_bkpu = 0, cPuReal_bkpu = 0, cBkReal_bkpu = 0;
    let cPuRkap_lk = 0, cBkRkap_lk = 0, cPuReal_lk = 0, cBkReal_lk = 0;
    
    const trendArr = [];

    for (let i = 1; i <= 12; i++) {
      let mPuRkap_pu = 0, mPuReal_pu = 0;
      let mPuRkap_bkpu = 0, mBkRkap_bkpu = 0, mPuReal_bkpu = 0, mBkReal_bkpu = 0;
      let mPuRkap_lk = 0, mBkRkap_lk = 0, mPuReal_lk = 0, mBkReal_lk = 0;

      rkapData.forEach((r) => {
        if (safeParseNumber(r.tahun) === selectedYear && getValidMonth(r) === i && String(r.rkap_status || "").toLowerCase().includes("awal")) {
          const isJO = checkJoStatus(r);
          const puVal = safeParseNumber(r.pu_rkap_parsial || r.PU_RKAP_Parsial) / 1e9;
          const bkVal = safeParseNumber(r.bk_rkap_parsial || r.BK_RKAP_Parsial) / 1e9;

          if ((isJO && chartFilter.pu.joi) || (!isJO && chartFilter.pu.nonJo)) mPuRkap_pu += puVal;
          if ((isJO && chartFilter.bkpu.joi) || (!isJO && chartFilter.bkpu.nonJo)) { mPuRkap_bkpu += puVal; mBkRkap_bkpu += bkVal; }
          if ((isJO && chartFilter.lk.joi) || (!isJO && chartFilter.lk.nonJo)) { mPuRkap_lk += puVal; mBkRkap_lk += bkVal; }
        }
      });

      realData.forEach((r) => {
        if (safeParseNumber(r.tahun) === selectedYear && getValidMonth(r) === i) {
          const isJO = checkJoStatus(r);
          const puVal = getDynamicValue(r, "pu") / 1e9;
          const bkVal = getDynamicValue(r, "bk") / 1e9;

          if ((isJO && chartFilter.pu.joi) || (!isJO && chartFilter.pu.nonJo)) mPuReal_pu += puVal;
          if ((isJO && chartFilter.bkpu.joi) || (!isJO && chartFilter.bkpu.nonJo)) { mPuReal_bkpu += puVal; mBkReal_bkpu += bkVal; }
          if ((isJO && chartFilter.lk.joi) || (!isJO && chartFilter.lk.nonJo)) { mPuReal_lk += puVal; mBkReal_lk += bkVal; }
        }
      });

      cPuRkap_pu += mPuRkap_pu; cPuRkap_bkpu += mPuRkap_bkpu; cBkRkap_bkpu += mBkRkap_bkpu; cPuRkap_lk += mPuRkap_lk; cBkRkap_lk += mBkRkap_lk;
      if (i <= currentMonthNum) {
        cPuReal_pu += mPuReal_pu; cPuReal_bkpu += mPuReal_bkpu; cBkReal_bkpu += mBkReal_bkpu; cPuReal_lk += mPuReal_lk; cBkReal_lk += mBkReal_lk;
      }

      trendArr.push({
        name: monthShortNames[i - 1],
        puRkapKum: Math.round(cPuRkap_pu), puRealKum: i <= currentMonthNum ? Math.round(cPuReal_pu) : null,
        puRkapPar: Math.round(mPuRkap_pu), puRealPar: i <= currentMonthNum ? Math.round(mPuReal_pu) : null,
        puPctPar: mPuRkap_pu > 0 && i <= currentMonthNum ? Math.round((mPuReal_pu / mPuRkap_pu) * 100) : null,
        
        bkpuRkapKum: cPuRkap_bkpu > 0 ? Number(((cBkRkap_bkpu / cPuRkap_bkpu) * 100).toFixed(2)) : 0,
        bkpuRealKum: cPuReal_bkpu > 0 && i <= currentMonthNum ? Number(((cBkReal_bkpu / cPuReal_bkpu) * 100).toFixed(2)) : null,
        bkpuRkapPar: mPuRkap_bkpu > 0 ? Number(((mBkRkap_bkpu / mPuRkap_bkpu) * 100).toFixed(2)) : 0,
        bkpuRealPar: mPuReal_bkpu > 0 && i <= currentMonthNum ? Number(((mBkReal_bkpu / mPuReal_bkpu) * 100).toFixed(2)) : null,
        
        lkRkapKum: Math.round(cPuRkap_lk - cBkRkap_lk), lkRealKum: i <= currentMonthNum ? Math.round(cPuReal_lk - cBkReal_lk) : null,
        lkRkapPar: Math.round(mPuRkap_lk - mBkRkap_lk), lkRealPar: i <= currentMonthNum ? Math.round(mPuReal_lk - mBkReal_lk) : null,
        lkPctPar: Math.abs(mPuRkap_lk - mBkRkap_lk) > 0 && i <= currentMonthNum ? Number((((mPuReal_lk - mBkReal_lk) / (mPuRkap_lk - mBkRkap_lk)) * 100).toFixed(2)) : null,
      });
    }

    // -- Kalkulasi Top 5 --
    const projMap = {};
    const processTop5 = (dataArray, isRkap) => {
      dataArray.forEach((r) => {
        if (safeParseNumber(r.tahun) === selectedYear && getValidMonth(r) > 0 && getValidMonth(r) <= currentMonthNum) {
          if (isRkap && !String(r.rkap_status || "").toLowerCase().includes("awal")) return;
          
          const id = getProjectId(r);
          const isJO = checkJoStatus(r);
          if (!id) return;
          
          if (!projMap[id]) projMap[id] = { name: projectMaps.nameMap[id] || id, isJO, rPu: 0, rBk: 0, aPu: 0, aBk: 0 };

          if (isRkap) {
            projMap[id].rPu += safeParseNumber(r.pu_rkap_parsial || r.PU_RKAP_Parsial) / 1e6; // -> Juta
            projMap[id].rBk += safeParseNumber(r.bk_rkap_parsial || r.BK_RKAP_Parsial) / 1e6;
          } else {
            projMap[id].aPu += getDynamicValue(r, "pu") / 1e6;
            projMap[id].aBk += getDynamicValue(r, "bk") / 1e6;
          }
        }
      });
    };
    processTop5(rkapData, true);
    processTop5(realData, false);

    let listPu = [];
    let listLk = [];
    Object.values(projMap).forEach((p) => {
      p.devPu = p.aPu - p.rPu;
      p.devLk = p.aPu - p.aBk - (p.rPu - p.rBk);
      p.absDevPu = Math.abs(p.devPu); 
      p.absDevLk = Math.abs(p.devLk); 

      // Filter berdasarkan chartFilter aktif untuk konsistensi layar
      if ((p.isJO && chartFilter.pu.joi) || (!p.isJO && chartFilter.pu.nonJo)) listPu.push(p);
      if ((p.isJO && chartFilter.lk.joi) || (!p.isJO && chartFilter.lk.nonJo)) listLk.push(p);
    });

    return {
      chartData: trendArr,
      top5Pu: listPu.filter((p) => p.devPu < 0).sort((a, b) => a.devPu - b.devPu).slice(0, 5),
      top5Lk: listLk.filter((p) => p.devLk < 0).sort((a, b) => a.devLk - b.devLk).slice(0, 5)
    };
  }, [excelData, chartFilter, selectedYear, currentMonthNum, projectMaps]);

  // ==========================================================
  // HELPER FORMAT RENDER UI
  // ==========================================================
  const renderFinancial = (num, isPercent = false, isNull = false) => {
    if (isNull || num === null) return "";
    if (!num && num !== 0) return "-";
    const formatted = formatNumber(Math.abs(num), 2);
    const suffix = isPercent ? "%" : "";
    if (num < 0) return <span style={{ color: "#DC2626" }}>({formatted}{suffix})</span>;
    return `${formatted}${suffix}`;
  };

  const thStyle = { padding: "8px", border: "1px solid #fff", color: "#fff", textAlign: "center", fontSize: "11px", whiteSpace: "nowrap" };
  const tdStyle = { padding: "5px 6px", border: "1px solid #E2E8F0", fontSize: "11px", textAlign: "right", whiteSpace: "nowrap" };

  return (
    <ContentLayout pageNumber={3} sectionNumber={3} slideTitle="EVALUASI KINERJA OPERASIONAL">
      <div style={{ display: "flex", gap: "8px", height: "100%" }}>
        
        {/* KOLOM KIRI (Tabel & Top 5) */}
        <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          
          {/* TABEL */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "6px", fontSize: "12px", color: "#0F172A" }}>
              <span>Kinerja sd. {selectedMonthName} (Annual)</span>
              <span>Rp. Milyar</span>
            </div>
            <div className="scrollbar-thin" style={{ maxHeight: "340px", overflowY: "auto", borderBottom: "2px solid #CBD5E1", borderTop: "2px solid #CBD5E1", borderRadius: "4px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}>
                  <tr>
                    <th style={{ ...thStyle, background: "#000050", width: "31%" }}>Uraian</th>
                    <th style={{ ...thStyle, background: "#000050", width: "13.8%" }}>RKAP<br />Jan - {selectedMonthName.substring(0, 3)}<br />1</th>
                    <th style={{ ...thStyle, background: "#BD002F", width: "13.8%" }}>Real<br />Jan - {selectedMonthName.substring(0, 3)}<br />2</th>
                    <th style={{ ...thStyle, background: "#000050", width: "13.8%" }}>% thd RKAP<br />sd {selectedMonthName.substring(0, 3)}<br />3=2/1</th>
                    <th style={{ ...thStyle, background: "#16A34A", width: "13.8%" }}>RKAP<br />Jan - Des<br />4</th>
                    <th style={{ ...thStyle, background: "#BD002F", width: "13.8%" }}>Sisa thd<br />RKAP<br />5=4-2</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => {
                    let bgRow = row.isBold ? "#EFF6FF" : "#FFFFFF";
                    if (row.uraian.includes("LABA") || row.uraian.includes("GPM") || row.uraian.includes("NPM")) bgRow = row.isBold ? "#FEF9C3" : "#FEFCE8";
                    return (
                      <tr key={i} style={{ backgroundColor: bgRow, fontWeight: row.isBold ? "800" : "500" }}>
                        <td style={{ ...tdStyle, width: "36%", textAlign: "left", paddingLeft: row.isIndent ? "20px" : "6px", color: row.isBold ? "#0F172A" : "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.uraian}
                        </td>
                        <td style={{ ...tdStyle, width: "12.8%" }}>{renderFinancial(row.rkapSd, row.isPctRow)}</td>
                        <td style={{ ...tdStyle, width: "12.8%" }}>{renderFinancial(row.realSd, row.isPctRow)}</td>
                        <td style={{ ...tdStyle, width: "12.8%", fontWeight: "800" }}>{renderFinancial(row.persen, true, row.isPctRow)}</td>
                        <td style={{ ...tdStyle, width: "12.8%" }}>{renderFinancial(row.rkapDes, row.isPctRow)}</td>
                        <td style={{ ...tdStyle, width: "12.8%" }}>{renderFinancial(row.sisa, false, row.isPctRow)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP 5 CHARTS */}
          <div style={{ flex: 1, minHeight: "150px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", background: "#fff", borderRadius: "8px", padding: "8px" }}>
            <span style={{ color: "#1e293b", fontSize: "12px", fontWeight: "bold", paddingLeft: "5px" }}>
              Top 5 tidak tercapai thd RKAP :
            </span>
            <div style={{ display: "flex", gap: "10px", flex: 1, marginTop: "5px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", textAlign: "center", marginBottom: "5px" }}>PU</span>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5Pu} layout="vertical" margin={{ top: 18, right: 50, left: -5, bottom: 8 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "#334155" }} axisLine={false} tickLine={false} />
                    <Bar dataKey="absDevPu" fill="#163261" barSize={15} radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="devPu" position="right" formatter={(val) => `(${formatNumber(Math.abs(val), 0)})`} style={{ fontSize: 10, fontWeight: "bold", fill: "#163261" }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ width: "1px", background: "#e2e8f0" }}></div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", marginBottom: "5px" }}>LK</span>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5Lk} layout="vertical" margin={{ top: 18, right: 40, left: -5, bottom: 8 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "#334155" }} axisLine={false} tickLine={false} />
                    <Bar dataKey="absDevLk" fill="#BD002F" barSize={15} radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="devLk" position="right" formatter={(val) => `(${formatNumber(Math.abs(val), 0)})`} style={{ fontSize: 11, fontWeight: "bold", fill: "#BD002F" }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (Grafik Tren) */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", gridAutoRows: "1fr" }}>
          
          {/* 1. Tren PU Kumulatif */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren PU Kumulatif" />
            <FilterToggle value={chartFilter.pu} onChange={(v) => setChartFilter({ ...chartFilter, pu: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Line dataKey="puRkapKum" name="RKAP '26" stroke="#163261" strokeWidth={2} dot={{ r: 2 }}>
                  <LabelList dataKey="puRkapKum" position="top" style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                </Line>
                <Line dataKey="puRealKum" name="Realisasi" stroke="#BD002F" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="puRealKum" position="bottom" style={{ fontSize: "9px", fill: "#BD002F", fontWeight: "bold" }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Tren PU Parsial */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren PU Parsial" />
            <FilterToggle value={chartFilter.pu} onChange={(v) => setChartFilter({ ...chartFilter, pu: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Legend iconType="square" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Bar yAxisId="left" dataKey="puRkapPar" name="RKAP" fill="#163261" barSize={8}>
                  <LabelList dataKey="puRkapPar" position="top" style={{ fontSize: "9px", fill: "#163261" }} />
                </Bar>
                <Bar yAxisId="left" dataKey="puRealPar" name="Realisasi" fill="#BD002F" barSize={8}>
                  <LabelList dataKey="puRealPar" position="top" style={{ fontSize: "9px", fill: "#BD002F" }} />
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="puPctPar" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} legendType="none">
                  <LabelList dataKey="puPctPar" position="top" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                  <Tooltip content={<FinancialTooltip />} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Tren BK/PU Kumulatif */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren BK/PU Kumulatif" />
            <FilterToggle value={chartFilter.bkpu} onChange={(v) => setChartFilter({ ...chartFilter, bkpu: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Line dataKey="bkpuRkapKum" name="RKAP '26" stroke="#163261" strokeWidth={2} dot={{ r: 2 }}>
                  <LabelList dataKey="bkpuRkapKum" position="bottom" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                </Line>
                <Line dataKey="bkpuRealKum" name="Realisasi" stroke="#BD002F" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="bkpuRealKum" position="top" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#BD002F", fontWeight: "bold" }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Tren BK/PU Parsial */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren BK/PU Parsial" />
            <FilterToggle value={chartFilter.bkpu} onChange={(v) => setChartFilter({ ...chartFilter, bkpu: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Line dataKey="bkpuRkapPar" name="RKAP '26" stroke="#163261" strokeWidth={2} dot={{ r: 2 }}>
                  <LabelList dataKey="bkpuRkapPar" position="bottom" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                  <Tooltip content={<FinancialTooltip />} />
                </Line>
                <Line dataKey="bkpuRealPar" name="Realisasi" stroke="#BD002F" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="bkpuRealPar" position="top" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#BD002F", fontWeight: "bold" }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 5. Tren LK Kumulatif */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren LK Kumulatif" />
            <FilterToggle value={chartFilter.lk} onChange={(v) => setChartFilter({ ...chartFilter, lk: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Line dataKey="lkRkapKum" name="RKAP '26" stroke="#163261" strokeWidth={2} dot={{ r: 2 }}>
                  <LabelList dataKey="lkRkapKum" position="top" style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                </Line>
                <Line dataKey="lkRealKum" name="Realisasi" stroke="#BD002F" strokeWidth={2} dot={{ r: 3 }}>
                  <LabelList dataKey="lkRealKum" position="bottom" style={{ fontSize: "9px", fill: "#BD002F", fontWeight: "bold" }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 6. Tren LK Parsial */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChartHeader title="Tren LK Parsial" />
            <FilterToggle value={chartFilter.lk} onChange={(v) => setChartFilter({ ...chartFilter, lk: v })} />
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 18, right: 15, left: 15, bottom: 8 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Legend iconType="square" wrapperStyle={{ fontSize: "9px", marginTop: "-10px" }} />
                <Bar yAxisId="left" dataKey="lkRkapPar" name="RKAP" fill="#163261" barSize={8}>
                  <LabelList dataKey="lkRkapPar" position="top" style={{ fontSize: "9px", fill: "#163261" }} />
                </Bar>
                <Bar yAxisId="left" dataKey="lkRealPar" name="Realisasi" fill="#BD002F" barSize={8}>
                  <LabelList dataKey="lkRealPar" position={(d) => (d.lkRealPar < 0 ? "bottom" : "top")} style={{ fontSize: "9px", fill: "#BD002F" }} />
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="lkPctPar" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} legendType="none">
                  <LabelList dataKey="lkPctPar" position="top" formatter={(v) => `${v}%`} style={{ fontSize: "9px", fill: "#163261", fontWeight: "bold" }} />
                  <Tooltip content={<FinancialTooltip />} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideKinerjaOperasional;