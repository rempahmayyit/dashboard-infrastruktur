import { useMemo } from "react";
import { getDisplayName } from "../../utils/projectName";
import {
  getSisaHari,
  getSisaProgress,
  getTargetHarian,
} from "../../utils/projectCalculations";
import { safeParseNumber } from "../utils/formatters";

export const useProjectMapData = (excelData, globalFilter) => {
  return useMemo(() => {
    if (!excelData || !excelData.db_master_data) return [];

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
    const selectedMonthNumber = monthMap[globalFilter?.bulan] || 12;
    const selectedYear = Number(globalFilter?.tahun);

    const masterData = excelData.db_master_data || [];
    const kendalaData = excelData.db_kendala || [];
    const piutangDetailData = excelData.vw_piutang_detail || [];
    const piutangAgingData = excelData.vw_piutang_aging || [];

    console.log("AGING FILTERED", excelData?.vw_piutang_aging?.length);

    console.log("AGING RAW", excelData?.vw_piutang_aging_raw?.length);

    const realisasiData = excelData.db_realisasi || [];
    const rkapData = excelData.db_rkap_awal || [];

    return masterData
      .map((item) => {
        const rawStatus = String(
          item?.status_proyek || item?.status_project_current || "",
        )
          .toUpperCase()
          .trim();
        const projectId =
          item?.id_project || item?.id_proyect || item?.id_proyek;

        const currentRealisasi =
          realisasiData
            .filter(
              (r) =>
                String(r.id_project) === String(projectId) &&
                Number(r.tahun) === selectedYear &&
                Number(r.bulan_index || 0) <= selectedMonthNumber,
            )
            .sort((a, b) => Number(b.bulan_index) - Number(a.bulan_index))[0] ||
          {};

        const currentRkap =
          rkapData
            .filter(
              (r) =>
                String(r.id_project) === String(projectId) &&
                Number(r.tahun) === selectedYear &&
                Number(r.bulan_index || 0) <= selectedMonthNumber,
            )
            .sort((a, b) => Number(b.bulan_index) - Number(a.bulan_index))[0] ||
          {};

        const latestKendala = kendalaData
          .filter((k) => String(k.id_project) === String(projectId))
          .sort((a, b) => new Date(b.periode) - new Date(a.periode))[0];

        const ri = safeParseNumber(
          currentRealisasi?.prog_real ||
            currentRealisasi?.progres_realisasi ||
            0,
        );
        const ra = safeParseNumber(
          currentRealisasi?.progres_scurve || currentRkap?.progres_scurve || 0,
        );
        const isBehind = ri - ra < 0;

        const bkMappKum = safeParseNumber(item?.bk_mapp_kumulatif_current);
        const puMappKum = safeParseNumber(item?.pu_mapp_kumulatif_current);
        const bkRealKum = safeParseNumber(
          currentRealisasi?.bk_real_kumulatif ||
            currentRealisasi?.bk_real_kum ||
            currentRealisasi?.bk_real_parsial,
        );
        const puRealKum = safeParseNumber(
          currentRealisasi?.pu_real_kumulatif ||
            currentRealisasi?.pu_real_kum ||
            currentRealisasi?.pu_real_parsial,
        );

        const bkRencana = puMappKum > 0 ? (bkMappKum / puMappKum) * 100 : 0;
        const bkRealisasi = puRealKum > 0 ? (bkRealKum / puRealKum) * 100 : 0;
        const bkDeviasi = bkRencana - bkRealisasi;

        const nk = safeParseNumber(
          item?.nk_current || item?.nilai_kontrak || 0,
        );
        const isOnGoing =
          rawStatus.includes("ON GOING") ||
          (rawStatus.includes("SAP NOT UPDATE") && ri < 99.99);
        if (!isOnGoing) return null;

        const longitude = parseFloat(
          String(item?.longitude || "0")
            .replace(",", ".")
            .trim(),
        );
        const latitude = parseFloat(
          String(item?.latitude || "0")
            .replace(",", ".")
            .trim(),
        );
        if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude))
          return null;

        const projectPiutangRows = piutangDetailData.filter(
          (row) => String(row.id_project).trim() === String(projectId).trim(),
        );
        const projectAgingRows = piutangAgingData.filter(
          (row) => String(row.id_project).trim() === String(projectId).trim(),
        );

        if (projectAgingRows.length > 0) {
          console.log(
            "MATCH",
            projectId,
            item.project_name,
            projectAgingRows.length,
          );
        }

        const sumKategori = (kategori) =>
          projectPiutangRows
            .filter(
              (row) =>
                String(row.kategori_piutang || "")
                  .trim()
                  .toUpperCase() === kategori,
            )
            .reduce((sum, row) => sum + Number(row.value || 0), 0);

        const tagihanBruto = sumKategori("BRUTO");
        const piutangTermin = sumKategori("TERMIN");
        const pdpk = sumKategori("RETENSI");

        const getAgingValue = (kategori, bucket) =>
          projectAgingRows
            .filter(
              (row) =>
                String(row.kategori_piutang || "")
                  .trim()
                  .toUpperCase() === kategori &&
                String(row.aging_bucket || "").trim() === bucket,
            )
            .reduce((sum, row) => sum + Number(row.value || 0), 0);

        const isJO = Math.random() > 0.5 ? "JO" : "Non JO";
        const porsiWaskita =
          isJO === "JO" ? Math.floor(Math.random() * 40) + 30 : 100;
        const nkPorsi = (nk * porsiWaskita) / 100;

        const sisaHari = getSisaHari(item);
        const sisaProgress = getSisaProgress(ri);
        const targetHarian = getTargetHarian(sisaProgress, sisaHari);

        return {
          id: projectId,
          short_project_name: item?.short_project_name || "",
          project_name:
            item?.project_name ||
            item?.nama_proyek_current ||
            item?.nama_paket_current ||
            "",
          name:
            getDisplayName(item) ||
            item?.short_project_name ||
            item?.nama_proyek_current ||
            item?.nama_paket_current ||
            "Unknown Project",
          owner: item?.owner || item?.pemilik_proyek || "Kementerian PUPR",
          start_date: item?.start_date || null,
          end_date: item?.end_date || null,
          end_date_current: item?.end_date_current || null,
          kepala_proyek_current: item?.kepala_proyek_current || null,
          sisa_hari: sisaHari,
          sisa_progress: sisaProgress,
          target_harian: targetHarian.value,
          target_harian_status: targetHarian.status,
          divisi: item?.divisi || "Infrastruktur I",
          is_jo: isJO,
          porsi: porsiWaskita,
          longitude,
          latitude,
          status: isBehind ? "Critical" : "On Track",
          gap: isBehind ? "Behind Schedule" : "Normal",
          link_drone: item?.link_drone || null,
          cctv_channel1: item?.cctv_channel1 || null,
          cctv_channel2: item?.cctv_channel2 || null,
          nk,
          nk_porsi: nkPorsi,
          tagihan_bruto: tagihanBruto,
          piutang_termin: piutangTermin,
          pdpk,
          ra,
          ri,
          deviasi: ri - ra,
          bk_rencana: bkRencana,
          bk_realisasi: bkRealisasi,
          bk_deviasi: bkDeviasi,
          kendalaProgres: latestKendala?.kendala_progres || "",
          aging_bruto: {
            "0-30": getAgingValue("BRUTO", "0-30"),
            "30-60": getAgingValue("BRUTO", "30-60"),
            "60-180": getAgingValue("BRUTO", "60-180"),
            "180-360": getAgingValue("BRUTO", "180-360"),
            ">360": getAgingValue("BRUTO", ">360"),
          },
          aging_termin: {
            "0-30": getAgingValue("TERMIN", "0-30"),
            "30-60": getAgingValue("TERMIN", "30-60"),
            "60-180": getAgingValue("TERMIN", "60-180"),
            "180-360": getAgingValue("TERMIN", "180-360"),
            ">360": getAgingValue("TERMIN", ">360"),
          },
          aging_retensi: {
            "0-30": getAgingValue("RETENSI", "0-30"),
            "30-60": getAgingValue("RETENSI", "30-60"),
            "60-180": getAgingValue("RETENSI", "60-180"),
            "180-360": getAgingValue("RETENSI", "180-360"),
            ">360": getAgingValue("RETENSI", ">360"),
          },
        };
      })
      .filter(Boolean);
  }, [excelData, globalFilter]);
};
