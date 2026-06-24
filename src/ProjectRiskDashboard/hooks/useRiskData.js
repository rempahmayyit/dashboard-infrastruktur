import { useMemo } from "react";
import { getDisplayName } from "../../utils/projectName";
import {
  calculateRiProgress,
  calculateRaProgress,
  getProjectRealisasi,
  getSisaHari,
  getSisaProgress,
  getTargetHarian,
} from "../../utils/projectCalculations";
import { MONTH_MAP } from "../constans";
import { safeParseNumber, getPiutangRiskLevel } from "../utils";

export const useRiskData = (excelData, globalFilter) => {
  return useMemo(() => {
    if (!excelData) return { list: [], stats: { kritis: 0, waspada: 0, normal: 0 } };

    const selectedYear = safeParseNumber(globalFilter?.tahun || 2026);
    const selectedMonth = MONTH_MAP[globalFilter?.bulan] || new Date().getMonth() + 1;

    const rawProjects = excelData?.db_master_data || [];
    const rawRealisasi = excelData?.db_realisasi || [];
    const rawPiutang = excelData?.vw_piutang_detail_raw || [];

    console.log(
  "RISK PIUTANG",
  rawPiutang.filter(
    (r) =>
      Number(r.tahun) === selectedYear &&
      Number(r.bulan_index) === selectedMonth
  ).length
);

    const today = new Date(selectedYear, selectedMonth, 0);
    today.setHours(23, 59, 59, 999);

    const ongoingProjects = rawProjects.filter((proj) => {
      const status = String(proj.status_proyek || proj.status_projek || proj.status_project || proj.status || "")
        .toLowerCase()
        .replace(/\s+/g, "");
      return status.includes("ongoing");
    });

    const calculated = ongoingProjects.map((proj) => {
      const mId = proj.id_project || proj.id_proyek || proj.project_id || proj.id;

      // Kalkulasi Piutang
      const projectPiutang = rawPiutang.filter((row) => 
        Number(row.tahun) === selectedYear &&
        Number(row.bulan_index) === selectedMonth &&
        String(row.id_project) === String(mId)
      );

      const brutoRows = projectPiutang.filter((row) => String(row.kategori_piutang).trim().toUpperCase() === "BRUTO");
      const terminRows = projectPiutang.filter((row) => String(row.kategori_piutang).trim().toUpperCase() === "TERMIN");
      const retensiRows = projectPiutang.filter((row) => String(row.kategori_piutang).trim().toUpperCase() === "RETENSI");

      const tagihanBruto = brutoRows.reduce((sum, row) => sum + safeParseNumber(row.value), 0);
      const piutangTermin = terminRows.reduce((sum, row) => sum + safeParseNumber(row.value), 0);
      const retensi = retensiRows.reduce((sum, row) => sum + safeParseNumber(row.value), 0);

      const aging360 = brutoRows
        .filter((row) => row.aging_bucket === ">360")
        .reduce((sum, row) => sum + safeParseNumber(row.value), 0);
      
      const aging60 = brutoRows
        .filter((row) => ["60-180", "180-360", ">360"].includes(row.aging_bucket))
        .reduce((sum, row) => sum + safeParseNumber(row.value), 0);
        
      const aging180 = brutoRows
        .filter((row) => ["180-360", ">360"].includes(row.aging_bucket))
        .reduce((sum, row) => sum + safeParseNumber(row.value), 0);

      const agingRatio = tagihanBruto > 0 ? aging360 / tagihanBruto : 0;
      const piutangRiskScore = agingRatio;
      const piutangRiskLevel = getPiutangRiskLevel(aging60, aging180);

      // Kalkulasi Progress & Realisasi
      let realisasiProject = [];
      try {
        if (typeof getProjectRealisasi === "function") {
          realisasiProject = getProjectRealisasi(rawRealisasi, mId, today);
        }
      } catch (e) {
        console.warn("Helper getProjectRealisasi gagal", e);
      }

      let progRencana = 0;
      let progRealisasi = 0;
      try {
        if (typeof calculateRaProgress === "function" && typeof calculateRiProgress === "function") {
          progRencana = safeParseNumber(calculateRaProgress(realisasiProject));
          progRealisasi = safeParseNumber(calculateRiProgress(realisasiProject));
        }
      } catch (e) {}

      const behindSchedule = progRealisasi - progRencana;

      // Kalkulasi Cost Overrun
      const bkMappKumulatif = safeParseNumber(proj?.bk_mapp_kumulatif_current);
      const puMappKumulatif = safeParseNumber(proj?.pu_mapp_kumulatif_current);
      const mappPercent = puMappKumulatif > 0 ? (bkMappKumulatif / puMappKumulatif) * 100 : 0;

      let realBkpuPercent = 0;
      if (realisasiProject && realisasiProject.length > 0) {
        const latestReal = [...realisasiProject].sort((a, b) => new Date(b.periode) - new Date(a.periode))[0];
        realBkpuPercent = safeParseNumber(latestReal?.bkpu_real_kumulatif ?? latestReal?.bkpu_real);
      }
      const costOverrun = mappPercent - realBkpuPercent;

      // Kalkulasi Urgensi (Time Overrun)
      const sisaHari = getSisaHari(proj);
      const sisaProgres = getSisaProgress(progRealisasi);
      const targetHarian = getTargetHarian(sisaProgres, sisaHari);

      return {
        ...proj,
        id_project: mId,
        project_name: proj.nama_proyek_current || proj.nama_proyek || getDisplayName(proj) || "Proyek Tanpa Nama",
        divisi: proj.divisi_current || proj.divisi || "-",
        status_proyek: proj.status_proyek || proj.status_project_current || "On Going",
        progRencana, progRealisasi, behindSchedule, costOverrun, mappPercent, realBkpuPercent,
        targetHarianValue: targetHarian.value,
        targetHarianStatus: targetHarian.status,
        sisaHari, sisaProgres, tagihanBruto, piutangTermin, retensi,
        aging60, aging180, aging360, piutangRiskScore, agingRatio, piutangRiskLevel,
      };
    });

    // Proses Pemeringkatan (Ranking)
    calculated.sort((a, b) => a.behindSchedule - b.behindSchedule);
    calculated.forEach((p, i) => (p.rankBehind = i + 1));

    calculated.sort((a, b) => a.costOverrun - b.costOverrun);
    calculated.forEach((p, i) => (p.rankCost = i + 1));

    calculated.sort((a, b) => b.targetHarianValue - a.targetHarianValue);
    calculated.forEach((p, i) => (p.rankUrgency = i + 1));

    calculated.forEach((p) => {
      p.totalRiskScore = p.rankBehind + p.rankCost + p.rankUrgency;
    });
    calculated.sort((a, b) => a.totalRiskScore - b.totalRiskScore);
    calculated.forEach((p, i) => (p.finalRank = i + 1));

    // Klasifikasi Risiko
    let kritisCount = 0; let waspadaCount = 0; let normalCount = 0;
    const third = Math.ceil(calculated.length / 3);

    calculated.forEach((p, index) => {
      if (p.targetHarianValue >= 1) {
        p.riskLevel = "KRITIS";
        kritisCount++;
      } else if (p.targetHarianValue >= 0.3) {
        p.riskLevel = "WASPADA";
        waspadaCount++;
      } else if (index < third) {
        p.riskLevel = "KRITIS";
        kritisCount++;
      } else if (index < third * 2) {
        p.riskLevel = "WASPADA";
        waspadaCount++;
      } else {
        p.riskLevel = "NORMAL";
        normalCount++;
      }
    });

    return {
      list: calculated,
      stats: { kritis: kritisCount, waspada: waspadaCount, normal: normalCount },
    };
  }, [excelData, globalFilter]);
};