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

// =====================================================
// CUSTOM HOOK
// =====================================================
export function usePengendalianData() {
  const { excelData, globalFilter } = useFilter();

  const masterData = excelData?.db_master_data || [];
  const realisasiData = excelData?.db_pengendalian_realisasi || [];
  const rkapData = excelData?.db_pengendalian_rkap || [];

  const monthMap = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6,
    Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12,
  };

  const selectedYear = safeNumber(globalFilter?.tahun || 2026);
  const selectedMonth = monthMap[globalFilter?.bulan] || new Date().getMonth() + 1;

  // 1. LATEST PROGRESS MAP
  const latestProgressMap = {};
  const filteredRealisasiData = realisasiData.filter((row) => {
    const rowYear = safeNumber(row?.tahun);
    const rowMonth = safeNumber(row?.bulan_index);
    return rowYear === selectedYear && rowMonth <= selectedMonth;
  });

  filteredRealisasiData.forEach((row) => {
    const id = row?.id_project || row?.id_proyect || row?.id_proyek;
    if (!id) return;

    const masterProject = masterData.find(
      (m) => String(m?.id_project || m?.id_proyect || m?.id_proyek) === String(id)
    );

    const nilaiKontrak = safeNumber(masterProject?.nk_current);

    if (!latestProgressMap[id]) {
      latestProgressMap[id] = { totalPU: 0, latestYear: 0, latestMonth: 0, progress: 0 };
    }

    const rowYear = safeNumber(row?.tahun);
    const rowMonth = safeNumber(row?.bulan_index);

    const currentLatest =
      rowYear > latestProgressMap[id].latestYear ||
      (rowYear === latestProgressMap[id].latestYear && rowMonth > latestProgressMap[id].latestMonth);

    if (currentLatest) {
      latestProgressMap[id].latestYear = rowYear;
      latestProgressMap[id].latestMonth = rowMonth;
      latestProgressMap[id].totalPU += safeNumber(row?.pu_real_parsial || row?.pu_realisasi_parsial);
    }

    latestProgressMap[id].progress =
      nilaiKontrak > 0 ? safePercent((safeNumber(latestProgressMap[id].totalPU) / nilaiKontrak) * 100) : 0;
  });

  // 2. KPI KEUANGAN
  const totalPURealisasi = safeNumber(getCumulativeValue(realisasiData, "pu_realisasi_parsial", selectedYear, selectedMonth));
  const totalPURkap = safeNumber(rkapData.reduce((sum, item) => sum + safeNumber(item?.pu_rkap_parsial), 0));
  const capaianPercent = totalPURkap > 0 ? safePercent((totalPURealisasi / totalPURkap) * 100) : 0;
  
  const bkReal = safeNumber(getCumulativeValue(realisasiData, "bk_real_parsial", selectedYear, selectedMonth));
  const bkRkap = safeNumber(getCumulativeValue(rkapData, "bk_rkap_parsial", selectedYear, selectedMonth));
  
  const bkpuReal = totalPURealisasi > 0 ? safePercent((bkReal / totalPURealisasi) * 100) : 0;
  const bkpuRKAP = totalPURkap > 0 ? safePercent((bkRkap / totalPURkap) * 100) : 0;
  const bkpuProgress = bkpuRKAP > 0 ? safePercent((bkpuReal / bkpuRKAP) * 100) : 0;

  const labaKotorReal = totalPURealisasi - bkReal;
  const labaBersihReal = labaKotorReal; // Sesuai kode original

  // 3. ONGOING PROJECTS
  const ongoingProjects = masterData.filter((item) => {
    const status = String(item?.status_proyek || "").trim();
    const progress = latestProgressMap[item?.id_project || item?.id_proyect || item?.id_proyek]?.progress || 0;
    
    if (status === "ON GOING") return true;
    if (status === "SAP Not Updated") return progress < 99.99;
    return false;
  });

  const totalProject = ongoingProjects.length;

  // 4. TIME OVERRUN
  const today = new Date();
  const timeProjects = ongoingProjects.map((item) => {
    const endDate = safeDateConvert(item?.end_date_current);
    if (!endDate) return null;

    const remain = safeNumber(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    const progress = latestProgressMap[item?.id_project || item?.id_proyect || item?.id_proyek]?.progress || 0;

    return {
      name: item?.nama_proyek_current || item?.nama_paket_current || item?.project_name || "-",
      prog: `${safeNumber(progress).toFixed(2)}%`,
      endDate: endDate.toLocaleDateString("id-ID"),
      remain,
      progress,
    };
  }).filter(Boolean);

  const pureTimeOverrun = timeProjects.filter((item) => item?.remain < 0 && item?.progress < 100);
  const almostOverrun = timeProjects.filter((item) => item?.remain >= 30 && item?.remain <= 90).sort((a, b) => safeNumber(a?.remain) - safeNumber(b?.remain)).slice(0, 5);
  const timeOverrunPercent = totalProject > 0 ? safePercent((pureTimeOverrun.length / totalProject) * 100) : 0;

  // 5. BEHIND SCHEDULE
  const selectedDate = getSelectedDate(selectedYear, selectedMonth);
  const behindScheduleData = ongoingProjects.map((project) => {
    const id = project?.id_project;
    const nilaiKontrak = safeNumber(project?.nk_current);
    const realisasiProject = getProjectRealisasi(realisasiData, id, selectedDate);
    
    const ri = safeNumber(calculateRiProgress(realisasiProject, nilaiKontrak));
    const ra = safeNumber(calculateRaProgress(realisasiProject));
    const dev = ri - ra;

    if (dev >= 0) return null;

    const progress = latestProgressMap[project?.id_project || project?.id_proyect || project?.id_proyek]?.progress || 0;

    return {
      name: project?.nama_proyek_current || project?.nama_paket_current || project?.project_name || "-",
      prog: safeNumber(progress).toFixed(2),
      ra: safeNumber(ra).toFixed(2),
      ri: safeNumber(ri).toFixed(2),
      dev: safeNumber(dev).toFixed(2),
    };
  }).filter(Boolean).sort((a, b) => safeNumber(a?.dev) - safeNumber(b?.dev));

  const behindSchedulePercent = totalProject > 0 ? safePercent((behindScheduleData.length / totalProject) * 100) : 0;
  const behindScheduleProjects = behindScheduleData.filter((item) => safeNumber(item?.dev) < 0).slice(0, 6);

  // 6. COST OVERRUN
  const costOverrunData = ongoingProjects.map((project) => {
    const id = project?.id_project;
    const projectRows = realisasiData.filter((row) => String(row?.id_project || row?.id_proyek) === String(id));
    
    const totalBK = projectRows.reduce((sum, row) => sum + safeNumber(row?.bk_real_parsial), 0);
    const totalPU = projectRows.reduce((sum, row) => sum + safeNumber(row?.pu_real_parsial), 0);
    
    const projectBkpuReal = totalPU > 0 ? safePercent((totalBK / totalPU) * 100) : 0;
    const mapp = safeNumber(project?.nk_current) > 0 ? safePercent((safeNumber(project?.bk_mapp_kumulatif_current) / safeNumber(project?.nk_current)) * 100) : 0;
    const dev = mapp - projectBkpuReal;

    if (projectBkpuReal <= mapp) return null;

    return {
      id,
      name: project?.nama_proyek_current || project?.nama_paket_current || project?.project_name || "-",
      prog: latestProgressMap[project?.id_project || project?.id_proyect || project?.id_proyek]?.progress || 0,
      mapp,
      real: projectBkpuReal,
      dev,
    };
  }).filter(Boolean).sort((a, b) => safeNumber(a?.dev) - safeNumber(b?.dev));

  const bkpuMappProjects = costOverrunData.filter((item) => safeNumber(item?.dev) < 0).slice(0, 6);

  return {
    selectedMonth,
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
  };
}