// src/hooks/usePengendalianData.js

import { useFilter } from "../context/FilterContext";
import {
  calculateRiProgress,
  calculateRaProgress,
  getProjectRealisasi,
  getSelectedDate,
  getCumulativeValue,
} from "../utils/projectCalculations";

// =====================================================
// SAFE HELPERS
// =====================================================
export const safeNumber = (value) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
};

export const safePercent = (value) => {
  const num = safeNumber(value);
  return Math.max(0, Math.min(num, 100));
};

export const safeDateConvert = (rawDate) => {
  if (!rawDate) return null;

  let result = null;

  if (typeof rawDate === "number" && rawDate > 10000) {
    result = new Date((rawDate - 25569) * 86400 * 1000);
  } else {
    result = new Date(rawDate);
  }

  if (!result || isNaN(result.getTime())) {
    return null;
  }

  return result;
};

const getProjectId = (item) => {
  return (
    item?.id_project ||
    item?.id_proyect ||
    item?.id_proyek ||
    item?.project_id ||
    item?.id ||
    null
  );
};

const getProjectCategory = (item) => {
  return String(item?.nonjo_joi || item?.jenis_jo_current || "")
    .trim()
    .toUpperCase();
};

// =====================================================
// CUSTOM HOOK
// =====================================================
export function usePengendalianData() {
  const { excelData, globalFilter } = useFilter();
  console.log("EXCEL DATA KEYS", Object.keys(excelData || {}));

  const masterData = excelData?.db_master_data || [];
  const realisasiData =
    excelData?.db_realisasi || excelData?.db_realisasi || [];

  console.log("REALISASI DATA", realisasiData);
  console.log("REALISASI LENGTH", realisasiData.length);
  const db_rkap_awal = excelData?.db_rkap_awal || [];
  const projectMap = {};

  masterData.forEach((item) => {
    const id = getProjectId(item);

    if (!id) return;

    projectMap[id] = item;
  });

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

  const selectedYear = safeNumber(globalFilter?.tahun || 2026);

  const selectedMonth =
    monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

  // =====================================================
  // 1. LATEST PROGRESS MAP
  // =====================================================

  const latestProgressMap = {};

  const filteredRealisasiData = realisasiData.filter((row) => {
    const rowYear = safeNumber(row?.tahun);
    const rowMonth = safeNumber(row?.bulan_index);

    return rowYear === selectedYear && rowMonth <= selectedMonth;
  });

  filteredRealisasiData.forEach((row) => {
    const id = row?.id_project || row?.id_proyect || row?.id_proyek;

    if (!id) return;

    if (!latestProgressMap[id]) {
      latestProgressMap[id] = {
        latestYear: 0,
        latestMonth: 0,
        progress: 0,
      };
    }

    const rowYear = safeNumber(row?.tahun);
    const rowMonth = safeNumber(row?.bulan_index);

    const isLatest =
      rowYear > latestProgressMap[id].latestYear ||
      (rowYear === latestProgressMap[id].latestYear &&
        rowMonth > latestProgressMap[id].latestMonth);

    if (isLatest) {
      latestProgressMap[id] = {
        latestYear: rowYear,
        latestMonth: rowMonth,
        progress: safePercent(row?.prog_real),
      };
    }
  });

  // =====================================================
  // FINANCIAL TABLE DATA PU RKAP
  // =====================================================

  const filteredRkap = db_rkap_awal.filter((row) => {
    const year = safeNumber(row?.tahun);
    const month = safeNumber(row?.bulan_index);

    return year === selectedYear && month <= selectedMonth;
  });

  const puRkapNonJo = filteredRkap.reduce((sum, row) => {
    const master = projectMap[getProjectId(row)];

    if (!master) return sum;

    const kategori = getProjectCategory(master);

    if (!kategori.includes("NON")) return sum;

    return sum + safeNumber(row?.pu_rkap_parsial);
  }, 0);

  const puRkapJoi = filteredRkap.reduce((sum, row) => {
    const master = projectMap[getProjectId(row)];

    if (!master) return sum;

    const kategori = getProjectCategory(master);

    if (!kategori.includes("JOI")) return sum;

    return sum + safeNumber(row?.pu_rkap_parsial);
  }, 0);

  const puRkapTotal = puRkapNonJo + puRkapJoi;

  // =====================================================
  // FINANCIAL TABLE DATA BK RKAP
  // =====================================================

  console.log("SELECTED YEAR", selectedYear);

  console.log("BK YEARS", [...new Set(db_rkap_awal.map((x) => x.tahun))]);
  console.log("BK 2026 MONTHS", [
    ...new Set(
      db_rkap_awal
        .filter((x) => Number(x.tahun) === 2026)
        .map((x) => x.bulan_index),
    ),
  ]);

  const bkNonJo = db_rkap_awal
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      const kategori = String(
        project?.nonjo_joi || project?.jenis_jo_current || "",
      )
        .replace(/\s+/g, "")
        .toUpperCase();

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        kategori.includes("NON")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.bk_rkap_parsial || 0);
    }, 0);

  const bkJoi = db_rkap_awal
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      const kategori = String(
        project?.nonjo_joi || project?.jenis_jo_current || "",
      )
        .replace(/\s+/g, "")
        .toUpperCase();

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        kategori.includes("JOI")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.bk_rkap_parsial || 0);
    }, 0);

  const bkTotal = Number(bkNonJo || 0) + Number(bkJoi || 0);

  // =====================================================
  // FINANCIAL TABLE DATA BK/PU RKAP
  // =====================================================

  const bkpuPercent = puRkapTotal > 0 ? (bkTotal / puRkapTotal) * 100 : 0;

  const bkpuNonJoPercent = puRkapNonJo > 0 ? (bkNonJo / puRkapNonJo) * 100 : 0;

  const bkpuJoiPercent = puRkapJoi > 0 ? (bkJoi / puRkapJoi) * 100 : 0;

  // =====================================================
  // FINANCIAL TABLE DATA LK RKAP
  // =====================================================

  const lkTotal = puRkapTotal - bkTotal;

  const lkNonJo = puRkapNonJo - bkNonJo;

  const lkJoi = puRkapJoi - bkJoi;

  // =====================================================
  // FINANCIAL TABLE DATA PU REAL
  // =====================================================

  const puRealNonJo = realisasiData
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        String(project?.nonjo_joi || project?.jenis_jo_current || "")
          .replace(/\s+/g, "")
          .toUpperCase()
          .includes("NON")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.pu_real_parsial || 0);
    }, 0);

  const puRealJoi = realisasiData
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        String(project?.nonjo_joi || project?.jenis_jo_current || "")
          .replace(/\s+/g, "")
          .toUpperCase()
          .includes("JOI")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.pu_real_parsial || 0);
    }, 0);

  const puRealTotal = puRealNonJo + puRealJoi;

  // =====================================================
  // FINANCIAL TABLE DATA BK REAL
  // =====================================================

  const bkRealNonJo = realisasiData
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        String(project?.nonjo_joi || project?.jenis_jo_current || "")
          .replace(/\s+/g, "")
          .toUpperCase()
          .includes("NON")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.bk_real_parsial || 0);
    }, 0);

  const bkRealJoi = realisasiData
    .filter((row) => {
      const project = masterData.find(
        (m) => String(m.id_project) === String(row.id_project),
      );

      return (
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) <= Number(selectedMonth) &&
        String(project?.nonjo_joi || project?.jenis_jo_current || "")
          .replace(/\s+/g, "")
          .toUpperCase()
          .includes("JOI")
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row.bk_real_parsial || 0);
    }, 0);

  const bkRealTotal = bkRealNonJo + bkRealJoi;

  // =====================================================
  // FINANCIAL TABLE DATA BK/PU REAL
  // =====================================================

  const bkpuRealPercent =
    puRealTotal > 0 ? (bkRealTotal / puRealTotal) * 100 : 0;

  const bkpuRealNonJoPercent =
    puRealNonJo > 0 ? (bkRealNonJo / puRealNonJo) * 100 : 0;

  const bkpuRealJoiPercent = puRealJoi > 0 ? (bkRealJoi / puRealJoi) * 100 : 0;

  // =====================================================
  // FINANCIAL TABLE DATA LK REAL
  // =====================================================

  const lkRealTotal = puRealTotal - bkRealTotal;
  const lkRealNonJo = puRealNonJo - bkRealNonJo;
  const lkRealJoi = puRealJoi - bkRealJoi;

  // =====================================================
  // 2. KPI KEUANGAN
  // =====================================================

  const totalPURealisasi = safeNumber(
    getCumulativeValue(
      realisasiData,
      "pu_realisasi_parsial",
      selectedYear,
      selectedMonth,
    ),
  );

  const totalPURkap = safeNumber(
    db_rkap_awal.reduce(
      (sum, item) => sum + safeNumber(item?.pu_rkap_parsial),
      0,
    ),
  );

  const capaianPercent =
    totalPURkap > 0 ? safePercent((totalPURealisasi / totalPURkap) * 100) : 0;

  const bkReal = safeNumber(
    getCumulativeValue(
      realisasiData,
      "bk_real_parsial",
      selectedYear,
      selectedMonth,
    ),
  );

  const bkRkap = safeNumber(
    getCumulativeValue(
      db_rkap_awal,
      "bk_rkap_parsial",
      selectedYear,
      selectedMonth,
    ),
  );

  const bkpuReal =
    totalPURealisasi > 0 ? safePercent((bkReal / totalPURealisasi) * 100) : 0;

  const bkpuRKAP =
    totalPURkap > 0 ? safePercent((bkRkap / totalPURkap) * 100) : 0;

  const bkpuProgress =
    bkpuRKAP > 0 ? safePercent((bkpuReal / bkpuRKAP) * 100) : 0;

  const labaKotorReal = totalPURealisasi - bkReal;
  const labaBersihReal = labaKotorReal;

  // =====================================================
  // 3. ONGOING PROJECTS
  // =====================================================

  const ongoingProjects = masterData.filter((item) => {
    const status = String(item?.status_proyek || "").trim();

    const progress = latestProgressMap[getProjectId(item)]?.progress || 0;

    if (status === "ON GOING") return true;

    if (status === "SAP Not Updated") {
      return progress < 99.99;
    }

    return false;
  });

  const totalProject = ongoingProjects.length;

  // =====================================================
  // 4. TIME OVERRUN
  // =====================================================

  const today = getSelectedDate(selectedYear, selectedMonth);

  today.setHours(0, 0, 0, 0);

  const timeProjects = ongoingProjects
    .map((item) => {
      const endDate = safeDateConvert(item?.end_date_current);

      if (!endDate) return null;

      endDate.setHours(0, 0, 0, 0);

      const remain = safeNumber(
        Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)),
      );

      const projectId = getProjectId(item);

      const progress = latestProgressMap[projectId]?.progress || 0;

      return {
        name:
          item?.nama_proyek_current ||
          item?.nama_paket_current ||
          item?.project_name ||
          "-",

        prog: safeNumber(progress).toFixed(2),

        endDate: endDate.toLocaleDateString("id-ID"),

        remain,

        progress,
      };
    })
    .filter(Boolean);

  const pureTimeOverrun = timeProjects.filter(
    (item) => item?.remain < 0 && item?.progress < 100 && item?.progress > 0,
  );

  const almostOverrun = timeProjects
    .filter((item) => item?.remain >= 30 && item?.remain <= 90)
    .sort((a, b) => safeNumber(a?.remain) - safeNumber(b?.remain));

  const timeOverrunPercent =
    totalProject > 0
      ? Math.round((pureTimeOverrun.length / totalProject) * 100)
      : 0;

  // =====================================================
  // 5. BEHIND SCHEDULE
  // =====================================================

  const selectedDate = getSelectedDate(selectedYear, selectedMonth);

  const behindScheduleData = ongoingProjects
    .map((project) => {
      const id = getProjectId(project);

      const realisasiProject = getProjectRealisasi(
        realisasiData,
        id,
        selectedDate,
      );

      const ri = safeNumber(calculateRiProgress(realisasiProject));

      const ra = safeNumber(calculateRaProgress(realisasiProject));

      const dev = ri - ra;

      if (dev >= 0) return null;

      const projectId = getProjectId(project);

      const progress = latestProgressMap[projectId]?.progress || 0;

      return {
        name:
          project?.nama_proyek_current ||
          project?.nama_paket_current ||
          project?.project_name ||
          "-",

        prog: safeNumber(progress).toFixed(2),

        ra: safeNumber(ra).toFixed(2),

        ri: safeNumber(ri).toFixed(2),

        dev: safeNumber(dev).toFixed(2),
      };
    })
    .filter(Boolean)
    .sort((a, b) => safeNumber(a?.dev) - safeNumber(b?.dev));

  const behindScheduleProjects = behindScheduleData.filter(
    (item) => safeNumber(item?.dev) < 0,
  );

  const behindSchedulePercent =
    totalProject > 0
      ? Math.round((behindScheduleProjects.length / totalProject) * 100)
      : 0;

  // =====================================================
  // 6. COST OVERRUN
  // =====================================================

  const costOverrunData = ongoingProjects
    .map((project) => {
      const id = getProjectId(project);

      const selectedDate = getSelectedDate(selectedYear, selectedMonth);

      const realisasiProject = getProjectRealisasi(
        realisasiData,
        id,
        selectedDate,
      );

      if (!realisasiProject?.length) return null;

      const latest = [...realisasiProject].sort(
        (a, b) => new Date(b.periode) - new Date(a.periode),
      )[0];

      // PROGRESS REALISASI
      const progress = safeNumber(latest?.prog_real);

      // REAL BKPU
      const real = safeNumber(latest?.bkpu_real_kumulatif);

      // TARGET MAPP
      const nilaiKontrak = safeNumber(project?.nk_current);

      const bkMappKumulatif = safeNumber(project?.bk_mapp_kumulatif_current);

      const mapp =
        nilaiKontrak > 0
          ? safePercent((bkMappKumulatif / nilaiKontrak) * 100)
          : 0;

      // DEVIASI
      const dev = mapp - real;

      // HANYA COST OVERRUN
      if (real <= mapp) return null;

      return {
        id,

        name:
          project?.nama_proyek_current ||
          project?.nama_paket_current ||
          project?.project_name ||
          "-",

        prog: safeNumber(progress).toFixed(2),

        mapp: safeNumber(mapp).toFixed(2),

        real: safeNumber(real).toFixed(2),

        dev: safeNumber(dev).toFixed(2),
      };
    })
    .filter(Boolean)
    .sort((a, b) => safeNumber(a?.dev) - safeNumber(b?.dev));

  const bkpuMappProjects = costOverrunData.filter(
    (item) => safeNumber(item?.dev) < 0,
  );

  const bkpuMappPercent =
    totalProject > 0
      ? Math.round((bkpuMappProjects.length / totalProject) * 100)
      : 0;

  // =====================================================
  // RETURN
  // =====================================================

  return {
    selectedMonth,

    financialTableData: {
      puRkapTotal,
      puRealTotal,
      puRkapNonJo,
      puRealNonJo,
      puRkapJoi,
      puRealJoi,

      bkTotal,
      bkRealTotal,
      bkNonJo,
      bkRealNonJo,
      bkJoi,
      bkRealJoi,

      bkpuPercent,
      bkpuRealPercent,
      bkpuNonJoPercent,
      bkpuRealNonJoPercent,
      bkpuJoiPercent,
      bkpuRealJoiPercent,

      lkTotal,
      lkRealTotal,
      lkNonJo,
      lkRealNonJo,
      lkJoi,
      lkRealJoi,
    },

    totalPURealisasi,

    capaianPercent,

    bkpuReal,

    bkpuProgress,

    labaKotorReal,

    labaBersihReal,

    totalProject,

    pureTimeOverrun,

    almostOverrun,

    timeOverrunPercent,

    behindScheduleProjects,

    behindSchedulePercent,

    costOverrunData,

    bkpuMappProjects,

    bkpuMappPercent,

    financialChartData: [
      {
        month: "Jan",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Feb",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Mar",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Apr",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
    ],
  };
}
