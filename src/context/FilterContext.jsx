// src/context/FilterContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const today = new Date();
  const currentWeek = Math.ceil(today.getDate() / 7);

  const [globalFilter, setGlobalFilter] = useState({
    tahun: today.getFullYear(),
    bulan: monthNames[today.getMonth()],
    minggu: currentWeek,
  });

  const [dataMode, setDataMode] = useState("QUICK");

  const [excelData, setExcelData] = useState({
    db_master_data: [],
    db_rkap_awal: [],
    db_pengendalian_rkap: [],
    db_realisasi: [],
    db_pemasaran_rkap: [],
    db_beban_bawah: [],
    db_cashflow: [],
    db_kendala: [],
    db_sap: [],
    db_bruto_sap: [],
    db_renc_eb: [],
    db_cctv: [],
    vw_piutang_detail: [],
    vw_piutang_detail_raw: [],
    vw_piutang_chart: [],
    vw_piutang_aging: [],
    vw_piutang_aging_raw: [],
  });

  const [isDataLoading, setIsDataLoading] = useState(true);

  // =========================================================
  // FETCH ALL DATA (ANTI LIMIT 1000)
  // =========================================================
  const fetchAllDataFromTable = async (tableName) => {
    let allRows = [];
    let page = 0;
    const pageSize = 1000;
    let hasMoreData = true;

    while (hasMoreData) {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .range(from, to);

      if (error) {
        console.error(`Error fetching table ${tableName}:`, error);
        return [];
      }

      if (data && data.length > 0) {
        allRows = [...allRows, ...data];
        if (data.length < pageSize) {
          hasMoreData = false;
        } else {
          page++;
        }
      } else {
        hasMoreData = false;
      }
    }

    return allRows;
  };

  // =========================================================
  // LOAD DATA + REALTIME
  // =========================================================
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsDataLoading(true);

      try {
        const masterDataRaw = await fetchAllDataFromTable("master_project");
        const masterData = masterDataRaw.map((row) => ({
          ...row,
          display_name:
            row.short_project_name ||
            row.project_name ||
            row.nama_proyek_current ||
            row.nama_paket_current,
        }));

        const rkapAwalData = await fetchAllDataFromTable("db_rkap_awal");
        const realisasiData = await fetchAllDataFromTable("db_realisasi");
        const pemasaranRkapData =
          await fetchAllDataFromTable("db_pemasaran_rkap");
        const bebanBawahData = await fetchAllDataFromTable("db_beban_bawah");
        const cashflowData = await fetchAllDataFromTable("db_cashflow");
        const kendalaData = await fetchAllDataFromTable("db_kendala");
        const sapData = await fetchAllDataFromTable("db_sap");
        const brutoSapData = await fetchAllDataFromTable("db_bruto_sap");
        const rencEbData = await fetchAllDataFromTable("db_renc_eb");
        const cctvData = await fetchAllDataFromTable("db_cctv");
        const piutangDetailData =
          await fetchAllDataFromTable("vw_piutang_detail");
        const piutangChartData =
          await fetchAllDataFromTable("vw_piutang_chart");
        const piutangAgingData =
          await fetchAllDataFromTable("vw_piutang_aging");

        setExcelData((prevData) => ({
          ...prevData,
          db_master_data: masterData,
          db_rkap_awal: rkapAwalData,
          db_realisasi: realisasiData,
          db_pemasaran_rkap: pemasaranRkapData,
          db_beban_bawah: bebanBawahData,
          db_cashflow: cashflowData,
          db_kendala: kendalaData,
          db_sap: sapData,
          db_bruto_sap: brutoSapData,
          db_renc_eb: rencEbData,
          db_cctv: cctvData,
          vw_piutang_detail: piutangDetailData,
          vw_piutang_chart: piutangChartData,
          vw_piutang_aging: piutangAgingData,
        }));
      } catch (err) {
        console.error("Error server:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchInitialData();

    // =========================================================
    // REALTIME SUPABASE
    // =========================================================
    const realtimeChannel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_realisasi" },
        async () => {
          const realisasiData = await fetchAllDataFromTable("db_realisasi");
          setExcelData((prevData) => ({
            ...prevData,
            db_realisasi: realisasiData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_bruto_sap" },
        async () => {
          const brutoSapData = await fetchAllDataFromTable("db_bruto_sap");
          setExcelData((prev) => ({ ...prev, db_bruto_sap: brutoSapData }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_rkap_awal" },
        async () => {
          const rkapAwalData = await fetchAllDataFromTable("db_rkap_awal");
          setExcelData((prevData) => ({
            ...prevData,
            db_rkap_awal: rkapAwalData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "master_project" },
        async () => {
          const masterDataRaw = await fetchAllDataFromTable("master_project");
          const masterData = masterDataRaw.map((row) => ({
            ...row,
            display_name:
              row.short_project_name ||
              row.project_name ||
              row.nama_proyek_current ||
              row.nama_paket_current,
          }));
          setExcelData((prevData) => ({
            ...prevData,
            db_master_data: masterData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_cctv" },
        async () => {
          const cctvData = await fetchAllDataFromTable("db_cctv");
          setExcelData((prev) => ({ ...prev, db_cctv: cctvData }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_pemasaran_rkap" },
        async () => {
          const pemasaranRkapData =
            await fetchAllDataFromTable("db_pemasaran_rkap");
          setExcelData((prevData) => ({
            ...prevData,
            db_pemasaran_rkap: pemasaranRkapData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_beban_bawah" },
        async () => {
          const bebanBawahData = await fetchAllDataFromTable("db_beban_bawah");
          setExcelData((prevData) => ({
            ...prevData,
            db_beban_bawah: bebanBawahData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_cashflow" },
        async () => {
          const cashflowData = await fetchAllDataFromTable("db_cashflow");
          setExcelData((prevData) => ({
            ...prevData,
            db_cashflow: cashflowData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_renc_eb" },
        async () => {
          const rencEbData = await fetchAllDataFromTable("db_renc_eb");
          setExcelData((prevData) => ({ ...prevData, db_renc_eb: rencEbData }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_sap" },
        async () => {
          const sapData = await fetchAllDataFromTable("db_sap");
          setExcelData((prevData) => ({ ...prevData, db_sap: sapData }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vw_piutang_detail" },
        async () => {
          const piutangDetailData =
            await fetchAllDataFromTable("vw_piutang_detail");
          setExcelData((prev) => ({
            ...prev,
            vw_piutang_detail: piutangDetailData,
          }));
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_kendala" },
        async () => {
          const kendalaData = await fetchAllDataFromTable("db_kendala");
          setExcelData((prev) => ({ ...prev, db_kendala: kendalaData }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // =========================================================
  // CEK STATUS QUICK / FINAL
  // =========================================================
  const dataStatus = React.useMemo(() => {
    const periodeAktif = excelData.db_realisasi?.filter(
      (row) =>
        row.bulan === globalFilter.bulan &&
        Number(row.tahun) === Number(globalFilter.tahun),
    );

    const quickRow = periodeAktif?.find(
      (row) => String(row.status_data || "").toUpperCase() === "QUICK",
    );

    if (quickRow) {
      return {
        type: "QUICK",
        bulan: quickRow.bulan,
        tahun: quickRow.tahun,
        minggu: quickRow.minggu,
      };
    }

    const finalRow = periodeAktif?.find(
      (row) => String(row.status_data || "").toUpperCase() === "FINAL",
    );

    if (finalRow) {
      return {
        type: "FINAL",
        bulan: finalRow.bulan,
        tahun: finalRow.tahun,
      };
    }

    return null;
  }, [excelData.db_realisasi, globalFilter.bulan, globalFilter.tahun]);

  // =========================================================
  // EFFECTIVE DATA CALCULATIONS
  // =========================================================
  const effectiveRealisasiData = React.useMemo(() => {
    const sourceData = excelData.db_realisasi || [];

    if (dataMode === "FINAL") {
      return sourceData.filter(
        (row) =>
          String(row.status_data || "")
            .trim()
            .toUpperCase() === "FINAL",
      );
    }

    const grouped = {};
    sourceData.forEach((row) => {
      const key = [row.id_project, row.periode, row.minggu].join("_");
      const status = String(row.status_data || "")
        .trim()
        .toUpperCase();
      if (!grouped[key]) grouped[key] = { final: null, quick: null };
      if (status === "FINAL") grouped[key].final = row;
      if (status === "QUICK") grouped[key].quick = row;
    });

    return Object.values(grouped)
      .map((item) => item.quick || item.final)
      .filter(Boolean);
  }, [excelData.db_realisasi, dataMode]);

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
  const selectedMonth = monthMap[globalFilter.bulan];

  const monthNameMap = {
    Jan: "JANUARI",
    Feb: "FEBRUARI",
    Mar: "MARET",
    Apr: "APRIL",
    Mei: "MEI",
    Jun: "JUNI",
    Jul: "JULI",
    Agu: "AGUSTUS",
    Sep: "SEPTEMBER",
    Okt: "OKTOBER",
    Nov: "NOVEMBER",
    Des: "DESEMBER",
  };
  const bulanText = monthNameMap[globalFilter.bulan] || globalFilter.bulan;

  const effectivePiutangAging = React.useMemo(() => {
    return (excelData.vw_piutang_aging || []).filter(
      (row) =>
        Number(row.tahun) === Number(globalFilter.tahun) &&
        Number(row.bulan_index) === selectedMonth,
    );
  }, [excelData.vw_piutang_aging, globalFilter, selectedMonth]);

  const effectivePiutangDetail = React.useMemo(() => {
    return (excelData.vw_piutang_detail || []).filter(
      (row) =>
        Number(row.tahun) === Number(globalFilter.tahun) &&
        Number(row.bulan_index) === selectedMonth,
    );
  }, [excelData.vw_piutang_detail, globalFilter, selectedMonth]);

  const effectiveBrutoSap = React.useMemo(() => {
    return (excelData.db_bruto_sap || []).filter(
      (row) =>
        Number(row.tahun) === Number(globalFilter.tahun) &&
        Number(row.bulan_index) === selectedMonth,
    );
  }, [excelData.db_bruto_sap, globalFilter, selectedMonth]);

  // =========================================================
  // MEMOIZE CONTEXT VALUE
  // =========================================================
  const contextValue = React.useMemo(() => {
    return {
      globalFilter,
      setGlobalFilter,
      dataMode,
      setDataMode,
      excelData: {
        ...excelData,
        db_bruto_sap: effectiveBrutoSap,
        db_bruto_sap_raw: excelData.db_bruto_sap,
        db_realisasi: effectiveRealisasiData,
        db_realisasi_raw: excelData.db_realisasi,
        vw_piutang_aging: effectivePiutangAging,
        vw_piutang_aging_raw: excelData.vw_piutang_aging,
        vw_piutang_detail: effectivePiutangDetail,
        vw_piutang_detail_raw: excelData.vw_piutang_detail,
      },
      setExcelData,
      isDataLoading,
      dataStatus,
      bulanText,
    };
  }, [
    globalFilter,
    dataMode,
    excelData,
    effectiveBrutoSap,
    effectiveRealisasiData,
    effectivePiutangAging,
    effectivePiutangDetail,
    isDataLoading,
    dataStatus,
    bulanText,
  ]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

// =========================================================
// CUSTOM HOOK
// =========================================================
export function useFilter() {
  return React.useContext(FilterContext);
}
