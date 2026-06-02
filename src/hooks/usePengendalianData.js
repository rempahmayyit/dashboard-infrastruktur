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
  const raw = String(item?.nonjo_joi || item?.jenis_jo_current || "")
    .replace(/\s+/g, "")
    .trim()
    .toUpperCase();

  if (raw === "JOI") {
    return "JOI";
  }

  return "NONJO";
};

// =====================================================
// CUSTOM HOOK
// =====================================================
export function usePengendalianData() {
  const { excelData, globalFilter } = useFilter();

  const masterData = excelData?.db_master_data || [];
  const realisasiData = excelData?.db_realisasi || [];
  const db_rkap_awal = excelData?.db_rkap_awal || [];
  const db_realisasi = excelData?.db_realisasi || [];
  // TAMBAHAN: Tarik data beban bawah dari Supabase
  const db_beban_bawah = excelData?.db_beban_bawah || [];

  // 1. PROJECT MAP
  const projectMap = {};
  masterData.forEach((item) => {
    const id = getProjectId(item);
    if (!id) return;
    projectMap[id] = item;
  });

  // 2. DETEKSI UNMAPPED PROJECT (VERSIONS: ALL TABLES)
  const missingProjectsMap = {};

  const checkMissingProject = (row, source) => {
    const id = getProjectId(row);
    if (!id) return;

    if (!projectMap[id]) {
      if (!missingProjectsMap[id]) {
        missingProjectsMap[id] = {
          id: id,
          name:
            row.project_name ||
            row.nama_proyek ||
            row.nama_paket ||
            row.nama_proyek_current ||
            "Nama Tidak Diketahui",
          sources: new Set([source]),
        };
      } else {
        missingProjectsMap[id].sources.add(source);
      }
    }
  };

  (db_rkap_awal || []).forEach((row) =>
    checkMissingProject(row, "db_rkap_awal"),
  );
  (db_realisasi || []).forEach((row) =>
    checkMissingProject(row, "db_realisasi"),
  );

  const unmappedProjects = Object.values(missingProjectsMap).map((item) => ({
    ...item,
    sources: Array.from(item.sources).join(" & "),
  }));

  // 3. FILTER TANGGAL
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

  // 4. HELPER MENGHITUNG TOTAL KEUANGAN (Ditaruh setelah selectedYear & selectedMonth)
  const calculateSum = ({
    data,
    sumField,
    category = null,
    isAnnual = false,
  }) => {
    if (!Array.isArray(data)) return 0;

    return data.reduce((sum, row) => {
      if (Number(row.tahun) !== Number(selectedYear)) return sum;
      if (!isAnnual && Number(row.bulan_index) > Number(selectedMonth))
        return sum;

      const master = projectMap[getProjectId(row)];
      if (!master) return sum;

      if (category && getProjectCategory(master) !== category) return sum;

      return sum + Number(row[sumField] || 0);
    }, 0);
  };

  // =====================================================
  // 5. LATEST PROGRESS MAP
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
      latestProgressMap[id] = { latestYear: 0, latestMonth: 0, progress: 0 };
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
  // FINANCIAL TABLE DATA - MENGGUNAKAN HELPER
  // =====================================================

  // --- RKAP KUMULATIF ---
  const puRkapNonJo = calculateSum({
    data: db_rkap_awal,
    sumField: "pu_rkap_parsial",
    category: "NONJO",
  });
  const puRkapJoi = calculateSum({
    data: db_rkap_awal,
    sumField: "pu_rkap_parsial",
    category: "JOI",
  });
  const puRkapTotal = puRkapNonJo + puRkapJoi;

  const bkNonJo = calculateSum({
    data: db_rkap_awal,
    sumField: "bk_rkap_parsial",
    category: "NONJO",
  });
  const bkJoi = calculateSum({
    data: db_rkap_awal,
    sumField: "bk_rkap_parsial",
    category: "JOI",
  });
  const bkTotal = bkNonJo + bkJoi;

  const lkNonJo = puRkapNonJo - bkNonJo;
  const lkJoi = puRkapJoi - bkJoi;
  const lkTotal = puRkapTotal - bkTotal;

  const bkpuPercent = puRkapTotal > 0 ? (bkTotal / puRkapTotal) * 100 : 0;
  const bkpuNonJoPercent = puRkapNonJo > 0 ? (bkNonJo / puRkapNonJo) * 100 : 0;
  const bkpuJoiPercent = puRkapJoi > 0 ? (bkJoi / puRkapJoi) * 100 : 0;

  // --- REALISASI KUMULATIF ---
  const puRealNonJo = calculateSum({
    data: db_realisasi,
    sumField: "pu_real_parsial",
    category: "NONJO",
  });
  const puRealJoi = calculateSum({
    data: db_realisasi,
    sumField: "pu_real_parsial",
    category: "JOI",
  });
  const puRealTotal = puRealNonJo + puRealJoi;

  const bkRealNonJo = calculateSum({
    data: db_realisasi,
    sumField: "bk_real_parsial",
    category: "NONJO",
  });
  const bkRealJoi = calculateSum({
    data: db_realisasi,
    sumField: "bk_real_parsial",
    category: "JOI",
  });
  const bkRealTotal = bkRealNonJo + bkRealJoi;

  const lkRealNonJo = puRealNonJo - bkRealNonJo;
  const lkRealJoi = puRealJoi - bkRealJoi;
  const lkRealTotal = puRealTotal - bkRealTotal;

  const bkpuRealPercent =
    puRealTotal > 0 ? (bkRealTotal / puRealTotal) * 100 : 0;
  const bkpuRealNonJoPercent =
    puRealNonJo > 0 ? (bkRealNonJo / puRealNonJo) * 100 : 0;
  const bkpuRealJoiPercent = puRealJoi > 0 ? (bkRealJoi / puRealJoi) * 100 : 0;

  // --- PERSENTASE REAL VS RKAP ---
  const calculateLKPercent = (rkap, real) => {
    const safeRkap = Number(rkap) || 0;
    const safeReal = Number(real) || 0;
    if (safeRkap === 0) return 0;
    if (safeRkap > 0 && safeReal < 0) return (safeRkap / safeReal) * 100;
    return (safeReal / safeRkap) * 100;
  };

  const puPercent = puRkapTotal > 0 ? (puRealTotal / puRkapTotal) * 100 : 0;
  const puNonJoPercent =
    puRkapNonJo > 0 ? (puRealNonJo / puRkapNonJo) * 100 : 0;
  const puJoiPercent = puRkapJoi > 0 ? (puRealJoi / puRkapJoi) * 100 : 0;

  const bkPercent = bkTotal > 0 ? (bkRealTotal / bkTotal) * 100 : 0;
  const bkNonJoPercent = bkNonJo > 0 ? (bkRealNonJo / bkNonJo) * 100 : 0;
  const bkJoiPercent = bkJoi > 0 ? (bkRealJoi / bkJoi) * 100 : 0;

  const lkPercent = calculateLKPercent(lkTotal, lkRealTotal);
  const lkNonJoPercent = calculateLKPercent(lkNonJo, lkRealNonJo);
  const lkJoiPercent = calculateLKPercent(lkJoi, lkRealJoi);

  // --- RKAP TAHUNAN (isAnnual = true) ---
  const puRkapTahunanNonJo = calculateSum({
    data: db_rkap_awal,
    sumField: "pu_rkap_parsial",
    category: "NONJO",
    isAnnual: true,
  });
  const puRkapTahunanJoi = calculateSum({
    data: db_rkap_awal,
    sumField: "pu_rkap_parsial",
    category: "JOI",
    isAnnual: true,
  });
  const puRkapTahunan = puRkapTahunanNonJo + puRkapTahunanJoi;

  const bkRkapTahunanNonJo = calculateSum({
    data: db_rkap_awal,
    sumField: "bk_rkap_parsial",
    category: "NONJO",
    isAnnual: true,
  });
  const bkRkapTahunanJoi = calculateSum({
    data: db_rkap_awal,
    sumField: "bk_rkap_parsial",
    category: "JOI",
    isAnnual: true,
  });
  const bkRkapTahunan = bkRkapTahunanNonJo + bkRkapTahunanJoi;

  const lkRkapTahunanNonJo = puRkapTahunanNonJo - bkRkapTahunanNonJo;
  const lkRkapTahunanJoi = puRkapTahunanJoi - bkRkapTahunanJoi;
  const lkRkapTahunan = puRkapTahunan - bkRkapTahunan;

  const bkpuRkapTahunan =
    puRkapTahunan > 0 ? (bkRkapTahunan / puRkapTahunan) * 100 : 0;
  const bkpuRkapTahunanNonJo =
    puRkapTahunanNonJo > 0
      ? (bkRkapTahunanNonJo / puRkapTahunanNonJo) * 100
      : 0;
  const bkpuRkapTahunanJoi =
    puRkapTahunanJoi > 0 ? (bkRkapTahunanJoi / puRkapTahunanJoi) * 100 : 0;

  // --- SISA TERHADAP RKAP TAHUNAN ---
  const sisaPuTotal = puRkapTahunan - puRealTotal;
  const sisaPuNonJo = puRkapTahunanNonJo - puRealNonJo;
  const sisaPuJoi = puRkapTahunanJoi - puRealJoi;

  const sisaBkTotal = bkRkapTahunan - bkRealTotal;
  const sisaBkNonJo = bkRkapTahunanNonJo - bkRealNonJo;
  const sisaBkJoi = bkRkapTahunanJoi - bkRealJoi;

  const sisaLkTotal = sisaPuTotal - sisaBkTotal;
  const sisaLkNonJo = sisaPuNonJo - sisaBkNonJo;
  const sisaLkJoi = sisaPuJoi - sisaBkJoi;

  const sisaBkpuTotal = sisaPuTotal > 0 ? (sisaBkTotal / sisaPuTotal) * 100 : 0;
  const sisaBkpuNonJo = sisaPuNonJo > 0 ? (sisaBkNonJo / sisaPuNonJo) * 100 : 0;
  const sisaBkpuJoi = sisaPuJoi > 0 ? (sisaBkJoi / sisaPuJoi) * 100 : 0;

  // =====================================================
  // 6. KPI KEUANGAN (Tidak Diubah)
  // =====================================================
  const totalPURealisasi = puRealTotal;
  const totalPURkap = puRkapTahunan;
  const capaianPercent =
    totalPURkap > 0 ? safePercent((totalPURealisasi / totalPURkap) * 100) : 0;

  const bkReal = bkRealTotal;
  const bkRkap = bkRkapTahunan;

  const bkpuReal =
    totalPURealisasi > 0 ? safePercent((bkReal / totalPURealisasi) * 100) : 0;
  const bkpuRKAP =
    totalPURkap > 0 ? safePercent((bkRkap / totalPURkap) * 100) : 0;
  const bkpuProgress =
    bkpuRKAP > 0 ? safePercent((bkpuReal / bkpuRKAP) * 100) : 0;

  // =====================================================
  // 7. ONGOING PROJECTS
  // =====================================================
  const ongoingProjects = masterData.filter((item) => {
    const status = String(item?.status_proyek || "")
      .toUpperCase()
      .replace(/\s+/g, "");

    return status.includes("ONGOING");
  });

  const totalProject = ongoingProjects.length;

  // =====================================================
  // 8. TIME OVERRUN
  // =====================================================
  const today = new Date(selectedYear, selectedMonth, 0);
  today.setHours(23, 59, 59, 999);

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
  // 9. BEHIND SCHEDULE
  // =====================================================
  const behindScheduleData = ongoingProjects
    .map((project) => {
      const id = getProjectId(project);
      const realisasiProject = getProjectRealisasi(realisasiData, id, today);
      const ri = safeNumber(calculateRiProgress(realisasiProject));
      const ra = safeNumber(calculateRaProgress(realisasiProject));
      const dev = ri - ra;

      if (dev >= 0) return null;

      const progress = latestProgressMap[id]?.progress || 0;
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
  // 10. COST OVERRUN
  // =====================================================
  const costOverrunData = ongoingProjects
    .map((project) => {
      const id = getProjectId(project);
      const realisasiProject = getProjectRealisasi(realisasiData, id, today);

      if (!realisasiProject?.length) return null;

      const latest = [...realisasiProject].sort(
        (a, b) => new Date(b.periode) - new Date(a.periode),
      )[0];
      const progress = safeNumber(latest?.prog_real);
      const real = safeNumber(latest?.bkpu_real_kumulatif);
      const nilaiKontrak = safeNumber(project?.nk_current);
      const bkMappKumulatif = safeNumber(project?.bk_mapp_kumulatif_current);
      const mapp =
        nilaiKontrak > 0 ? (bkMappKumulatif / nilaiKontrak) * 100 : 0;

      const dev = mapp - real;

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
  // 11. PERHITUNGAN LABA BERSIH (DATA BEBAN BAWAH SUPABASE)
  // =====================================================

  // Helper khusus untuk menjumlahkan beban bawah karena strukturnya tidak memakai id_project
  const calculateBebanBawah = (sumField, isAnnual = false) => {
    if (!Array.isArray(db_beban_bawah)) return 0;

    return db_beban_bawah.reduce((sum, row) => {
      // Ekstrak tahun dari 'periode' jika 'tahun' null
      let rowYear = Number(row.tahun);
      if (!rowYear && row.periode) {
        rowYear = new Date(row.periode).getFullYear();
      }

      // Filter Tahun
      if (rowYear !== Number(selectedYear)) return sum;

      // Filter Bulan
      let rowMonth = Number(row.bulan_index);
      if (!isAnnual && rowMonth > Number(selectedMonth)) return sum;

      return sum + Number(row[sumField] || 0);
    }, 0);
  };

  // Kalkulasi Total Beban Bawah
  const bebanBawahReal = calculateBebanBawah("beban_bawah_real_parsial");
  const bebanBawahRkap = calculateBebanBawah("beban_bawah_rkap_parsial");
  const bebanBawahRkapTahunan = calculateBebanBawah(
    "beban_bawah_rkap_parsial",
    true,
  );

  // Kalkulasi Akhir Laba Bersih
  // Karena angka beban di Supabase sudah minus (-), kita gunakan operasi DITAMBAH (+)
  const labaBersihRealFinal = lkRealTotal + bebanBawahReal;
  const labaBersihRkapFinal = lkTotal + bebanBawahRkap;
  const labaBersihRkapTahunanFinal = lkRkapTahunan + bebanBawahRkapTahunan;

  const labaKotorReal = lkRealTotal;
  const labaBersihReal = labaBersihRealFinal || labaKotorReal;

  // =====================================================
  // 12. DATA REKONSILIASI (QUICK COUNT VS SAP)
  // =====================================================
  const db_sap = excelData?.db_sap || [];

  const rekonsiliasiTableData = masterData
    .map((project) => {
      const id = getProjectId(project);
      const projectName =
        project?.nama_proyek_current ||
        project?.nama_paket_current ||
        project?.project_name ||
        "Nama Tidak Diketahui";
      const nk = safeNumber(project?.nk_current);

      // 1. QUICK COUNT (YTD): Akumulasi bulan Jan s.d bulan terpilih
      const qc_pu = db_realisasi.reduce((sum, row) => {
        if (
          String(getProjectId(row)) === String(id) &&
          Number(row.tahun) === selectedYear &&
          Number(row.bulan_index) <= selectedMonth
        ) {
          return sum + safeNumber(row.pu_real_parsial); // Asumsi kolom parsial bernama pu_real_parsial
        }
        return sum;
      }, 0);

      const qc_bk = db_realisasi.reduce((sum, row) => {
        if (
          String(getProjectId(row)) === String(id) &&
          Number(row.tahun) === selectedYear &&
          Number(row.bulan_index) <= selectedMonth
        ) {
          return sum + safeNumber(row.bk_real_parsial); // Asumsi kolom parsial bernama bk_real_parsial
        }
        return sum;
      }, 0);

      // 2. SAP (YTD): Ambil baris data langsung pada bulan terpilih (karena sudah nilai annual/ytd)
      // Filter sampai bulan terpilih lalu sort descending untuk mengambil data entry terakhir jika bulan terpilih belum ada
      const validSapRows = db_sap
        .filter(
          (row) =>
            String(getProjectId(row)) === String(id) &&
            Number(row.tahun) === selectedYear &&
            Number(row.bulan_index) <= selectedMonth,
        )
        .sort((a, b) => Number(b.bulan_index) - Number(a.bulan_index));

      const latestSapRow = validSapRows[0] || {};
      const sap_pu = safeNumber(latestSapRow.pu_sap_annual);
      const sap_bk = safeNumber(latestSapRow.bk_sap_annual);

      // 3. DEVIASI (Quick Count - SAP)
      const dev_pu = qc_pu - sap_pu;
      const dev_bk = qc_bk - sap_bk;

      // 4. KATEGORI STATUS VALIDASI
      let ket = "Sinkron";
      if (dev_pu !== 0 || dev_bk !== 0) ket = "Deviasi";
      if ((sap_pu === 0 && qc_pu > 0) || (sap_bk === 0 && qc_bk > 0))
        ket = "Perlu Review"; // Jika QC sudah isi tapi SAP masih 0

      return {
        id,
        project: projectName,
        nk,
        qc_pu,
        qc_bk,
        sap_pu,
        sap_bk,
        dev_pu,
        dev_bk,
        ket,
        nonjo_joi: project?.nonjo_joi,
      };
    })

    .filter((item) => item.qc_pu !== 0 || item.sap_pu !== 0 || item.nk > 0)
    .sort((a, b) => {
      const devA = Math.abs(a.dev_pu || 0) + Math.abs(a.dev_bk || 0);

      const devB = Math.abs(b.dev_pu || 0) + Math.abs(b.dev_bk || 0);

      return devB - devA;
    });

  // =====================================================
  // KPI PENGENDALIAN (FINAL)
  // =====================================================
  const kpiData = {
    // 1. PU HANYA MENGGUNAKAN NON-JO
    pendapatanUsaha: {
      mainValue: puRealNonJo,
      targetPeriode: puRkapNonJo,
      realPeriode: puRealNonJo,
      persenPeriode: puRkapNonJo > 0 ? (puRealNonJo / puRkapNonJo) * 100 : 0,
      targetTahun: puRkapTahunanNonJo,
      persenTahun:
        puRkapTahunanNonJo > 0 ? (puRealNonJo / puRkapTahunanNonJo) * 100 : 0,
    },

    // 2. BK/PU HANYA MENGGUNAKAN NON-JO
    bkpu: {
      mainValue: bkpuRealNonJoPercent,
      targetPeriode: bkpuNonJoPercent,
      realPeriode: bkpuRealNonJoPercent,
      persenPeriode:
        bkpuNonJoPercent > 0
          ? (bkpuRealNonJoPercent / bkpuNonJoPercent) * 100
          : 0,
      targetTahun: bkpuRkapTahunanNonJo,
      persenTahun:
        bkpuRkapTahunanNonJo > 0
          ? (bkpuRealNonJoPercent / bkpuRkapTahunanNonJo) * 100
          : 0,
    },

    // 3. LABA KOTOR MENGGUNAKAN TOTAL KESELURUHAN (NON-JO + JOI)
    labaKotor: {
      mainValue: lkRealTotal,
      targetPeriode: lkTotal,
      realPeriode: lkRealTotal,
      persenPeriode: calculateLKPercent(lkTotal, lkRealTotal),
      targetTahun: lkRkapTahunan,
      persenTahun: calculateLKPercent(lkRkapTahunan, lkRealTotal),
      isDeficit: true,
    },

    // 4. LABA BERSIH = LK TOTAL + BEBAN BAWAH
    labaBersih: {
      mainValue: labaBersihRealFinal,
      targetPeriode: labaBersihRkapFinal,
      realPeriode: labaBersihRealFinal,
      persenPeriode: calculateLKPercent(
        labaBersihRkapFinal,
        labaBersihRealFinal,
      ),
      targetTahun: labaBersihRkapTahunanFinal,
      persenTahun: calculateLKPercent(
        labaBersihRkapTahunanFinal,
        labaBersihRealFinal,
      ),
      isDeficit: true,
    },
  };

  // =====================================================
  // RETURN
  // =====================================================
  return {
    masterData,
    realisasiData,
    unmappedProjects,
    selectedMonth,
    rekonsiliasiTableData,
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
      puPercent,
      puNonJoPercent,
      puJoiPercent,
      bkPercent,
      bkNonJoPercent,
      bkJoiPercent,
      lkPercent,
      lkNonJoPercent,
      lkJoiPercent,
      puRkapTahunan,
      puRkapTahunanNonJo,
      puRkapTahunanJoi,
      bkRkapTahunan,
      bkRkapTahunanNonJo,
      bkRkapTahunanJoi,
      bkpuRkapTahunan,
      bkpuRkapTahunanNonJo,
      bkpuRkapTahunanJoi,
      lkRkapTahunan,
      lkRkapTahunanNonJo,
      lkRkapTahunanJoi,
      sisaPuTotal,
      sisaPuNonJo,
      sisaPuJoi,
      sisaBkTotal,
      sisaBkNonJo,
      sisaBkJoi,
      sisaBkpuTotal,
      sisaBkpuNonJo,
      sisaBkpuJoi,
      sisaLkTotal,
      sisaLkNonJo,
      sisaLkJoi,
    },
    kpiData,
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
      {
        month: "Mei",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Jun",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Jul",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Agu",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Sep",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Okt",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Nov",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
      {
        month: "Des",
        pu: puRealTotal,
        puRkap: puRkapTotal,
        bk: bkRealTotal,
        bkRkap: bkTotal,
      },
    ],
  };
}
