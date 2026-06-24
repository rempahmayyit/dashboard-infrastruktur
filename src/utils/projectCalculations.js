export const getSelectedDate = (selectedYear, selectedMonth) => {
  return new Date(selectedYear, selectedMonth - 1, 31);
};

export const getProjectRealisasi = (realisasiData, projectId, selectedDate) => {
  const hasil = realisasiData.filter((row) => {
    const rowId = row.id_project || row.id_proyect || row.id_proyek;

    const rowDate = new Date(row.periode);

    return String(rowId) === String(projectId) && rowDate <= selectedDate;
  });

  return hasil;
};

export const calculateRiProgress = (realisasiProject) => {
  if (!realisasiProject?.length) return 0;

  const latest = [...realisasiProject].sort(
    (a, b) => new Date(b.periode) - new Date(a.periode),
  )[0];

  return Number(latest?.prog_real || 0);
};

export const calculateRaProgress = (realisasiProject) => {
  if (!realisasiProject?.length) return 0;

  const latest = [...realisasiProject].sort(
    (a, b) => new Date(b.periode) - new Date(a.periode),
  )[0];

  return Number(latest?.progres_scurve || 0);
};

export const calculateRemainingDays = (endDate) => {
  const today = new Date();

  const end = new Date(endDate);

  const diff = (end - today) / (1000 * 60 * 60 * 24);

  return Math.round(diff);
};

export const calculateTimeOverrunData = ({
  ongoingProjects,
  realisasiData,
  selectedYear,
  selectedMonth,
}) => {
  const selectedDate = getSelectedDate(selectedYear, selectedMonth);

  const timeProjects = ongoingProjects
    .map((project) => {
      const id = project.id_project;

      const realisasiProject = getProjectRealisasi(
        realisasiData,
        id,
        selectedDate,
      );

      calculateRiProgress(realisasiProject);

      const remain = calculateRemainingDays(project.end_date);

      return {
        name: project.nama_paket || project.project_name,
        progress,
        remain,
        endDate: project.end_date,
      };
    })
    .filter((item) => item.progress < 100);

  const pureTimeOverrun = timeProjects.filter(
    (item) => item.remain < 0 && item.progress < 100,
  );

  const almostOverrun = timeProjects
    .filter((item) => item.remain >= 30 && item.remain <= 90)
    .sort((a, b) => a.remain - b.remain)
    .slice(0, 5);

  return {
    pureTimeOverrun,
    almostOverrun,
    timeProjects,
  };
};

export const getCumulativeValue = (
  data,
  field,
  selectedYear,
  selectedMonth,
) => {
  return data
    .filter((row) => {
      const year = Number(row.tahun || 0);
      const month = Number(row.bulan_index || 0);

      return (
        year < selectedYear || (year === selectedYear && month <= selectedMonth)
      );
    })
    .reduce((sum, row) => {
      return sum + Number(row[field] || 0);
    }, 0);
};

// =====================================================
// SISA HARI
// Ambil tanggal paling akhir antara end_date
// dan end_date_current
// =====================================================

export const getSisaHari = (project) => {
  const end1 = project?.end_date ? new Date(project.end_date) : null;

  const end2 = project?.end_date_current
    ? new Date(project.end_date_current)
    : null;

  let targetEndDate = null;

  if (end1 && end2) {
    targetEndDate = end1 > end2 ? end1 : end2;
  } else {
    targetEndDate = end1 || end2;
  }

  if (!targetEndDate) return 0;

  return Math.ceil((targetEndDate - new Date()) / (1000 * 60 * 60 * 24));
};

// =====================================================
// SISA PROGRESS
// =====================================================

export const getSisaProgress = (ri) => {
  return Math.max(0, Math.min(100, 100 - Number(ri || 0)));
};

// =====================================================
// TARGET HARIAN
// =====================================================

export const getTargetHarian = (sisaProgress, sisaHari) => {
  // proyek selesai
  if (sisaProgress <= 0) {
    return {
      value: 0,
      status: "SELESAI",
    };
  }

  // proyek lewat kontrak
  if (sisaHari <= 0) {
    return {
      value: null,
      status: "OVERDUE",
    };
  }

  return {
    value: sisaProgress / sisaHari,
    status: "NORMAL",
  };
};

export const getUrgencyRatio = (project, progress) => {
  const sisaHari = getSisaHari(project);
  const sisaProgress = getSisaProgress(progress);

  const result = getTargetHarian(
    sisaProgress,
    sisaHari
  );

  if (result.status === "OVERDUE") return 999;

  return result.value || 0;
};