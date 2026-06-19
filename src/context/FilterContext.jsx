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

  // Hitung minggu keberapa dalam bulan
  const currentWeek = Math.ceil(today.getDate() / 7);

  const [globalFilter, setGlobalFilter] = useState({
    tahun: today.getFullYear(),
    bulan: monthNames[today.getMonth()],
    minggu: currentWeek,
  });

  // =========================================================
  // MODE DATA
  // FINAL = hanya data final
  // QUICK = final + quick count
  // =========================================================
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
        console.error(`Gagal menarik tabel ${tableName}:`, error);
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
        console.log("Loading dashboard data...");

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
        }));

        console.log("Dashboard data loaded");
      } catch (err) {
        console.error("Error server:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================
    fetchInitialData();

    // =========================================================
    // REALTIME SUPABASE
    // =========================================================
    const realtimeChannel = supabase
      .channel("dashboard-realtime")

      // =====================================================
      // REALISASI
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_realisasi" },
        async (payload) => {
          console.log("Realtime update db_realisasi:", payload.eventType);
          const realisasiData = await fetchAllDataFromTable("db_realisasi");
          setExcelData((prevData) => ({
            ...prevData,
            db_realisasi: realisasiData,
          }));
        },
      )

      // =====================================================
      // RKAP
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_rkap_awal" },
        async (payload) => {
          console.log("Realtime update db_rkap_awal:", payload.eventType);
          const rkapAwalData = await fetchAllDataFromTable("db_rkap_awal");
          setExcelData((prevData) => ({
            ...prevData,
            db_rkap_awal: rkapAwalData,
          }));
        },
      )

      // =====================================================
      // MASTER PROJECT
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "master_project" },
        async (payload) => {
          console.log("Realtime update master_project:", payload.eventType);
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

      // =====================================================
      // REALTIME RKAP PEMASARAN
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_pemasaran_rkap" },
        async (payload) => {
          console.log("Realtime update db_pemasaran_rkap:", payload.eventType);
          const pemasaranRkapData =
            await fetchAllDataFromTable("db_pemasaran_rkap");
          setExcelData((prevData) => ({
            ...prevData,
            db_pemasaran_rkap: pemasaranRkapData,
          }));
        },
      )

      // =====================================================
      // REALTIME BEBAN BAWAH
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_beban_bawah" },
        async (payload) => {
          console.log("Realtime update db_beban_bawah:", payload.eventType);
          const bebanBawahData = await fetchAllDataFromTable("db_beban_bawah");
          setExcelData((prevData) => ({
            ...prevData,
            db_beban_bawah: bebanBawahData,
          }));
        },
      )

      // =====================================================
      // TAMBAHAN: REALTIME CASHFLOW
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_cashflow" },
        async (payload) => {
          console.log("Realtime update db_cashflow:", payload.eventType);
          const cashflowData = await fetchAllDataFromTable("db_cashflow");
          setExcelData((prevData) => ({
            ...prevData,
            db_cashflow: cashflowData,
          }));
        },
      )

      // =====================================================
      // DATA SAP
      // =====================================================
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_sap" },
        async (payload) => {
          console.log("Realtime update db_sap:", payload.eventType);
          const sapData = await fetchAllDataFromTable("db_sap");
          setExcelData((prevData) => ({
            ...prevData,
            db_sap: sapData,
          }));
        },
      )

      // =====================================================
      // REALISASI
      // =====================================================

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "db_kendala",
        },
        async () => {
          const kendalaData = await fetchAllDataFromTable("db_kendala");

          setExcelData((prev) => ({
            ...prev,
            db_kendala: kendalaData,
          }));
        },
      )

      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    // =========================================================
    // CLEANUP
    // =========================================================
    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // =========================================================
  // CEK STATUS QUICK / FINAL
  // =========================================================
  const periodeAktif = excelData.db_realisasi?.filter(
    (row) =>
      row.bulan === globalFilter.bulan &&
      Number(row.tahun) === Number(globalFilter.tahun),
  );

  let dataStatus = null;

  // =========================================================
  // EFFECTIVE REALISASI DATA
  // FINAL = hanya FINAL
  // QUICK = FINAL historis + QUICK bulan aktif
  // =========================================================

  const effectiveRealisasiData = React.useMemo(() => {
    const sourceData = excelData.db_realisasi || [];

    // MODE FINAL
    if (dataMode === "FINAL") {
      return sourceData.filter(
        (row) =>
          String(row.status_data || "")
            .trim()
            .toUpperCase() === "FINAL",
      );
    }

    // MODE QUICK
    const grouped = {};

    sourceData.forEach((row) => {
      const key = [row.id_project, row.periode, row.minggu].join("_");

      const status = String(row.status_data || "")
        .trim()
        .toUpperCase();

      if (!grouped[key]) {
        grouped[key] = {
          final: null,
          quick: null,
        };
      }

      if (status === "FINAL") {
        grouped[key].final = row;
      }

      if (status === "QUICK") {
        grouped[key].quick = row;
      }
    });

    console.log("DATA MODE :", dataMode);
    console.log("SOURCE DATA :", sourceData.length);

    const finalCount = sourceData.filter(
      (r) => String(r.status_data).toUpperCase() === "FINAL",
    ).length;

    const quickCount = sourceData.filter(
      (r) => String(r.status_data).toUpperCase() === "QUICK",
    ).length;

    console.log("FINAL :", finalCount);
    console.log("QUICK :", quickCount);

    return Object.values(grouped)
      .map((item) => item.quick || item.final)
      .filter(Boolean);
  }, [excelData.db_realisasi, dataMode]);

  React.useEffect(() => {
    console.log("REALISASI RAW :", excelData.db_realisasi?.length || 0);
    console.log("REALISASI EFFECTIVE :", effectiveRealisasiData?.length || 0);
  }, [excelData.db_realisasi, effectiveRealisasiData]);

  // PRIORITAS 1 = QUICK
  const quickRow = periodeAktif?.find(
    (row) => String(row.status_data || "").toUpperCase() === "QUICK",
  );

  if (quickRow) {
    dataStatus = {
      type: "QUICK",
      bulan: quickRow.bulan,
      tahun: quickRow.tahun,
      minggu: quickRow.minggu,
    };
  } else {
    // PRIORITAS 2 = FINAL
    const finalRow = periodeAktif?.find(
      (row) => String(row.status_data || "").toUpperCase() === "FINAL",
    );

    if (finalRow) {
      dataStatus = {
        type: "FINAL",
        bulan: finalRow.bulan,
        tahun: finalRow.tahun,
      };
    }
  }

  return (
    <FilterContext.Provider
      value={{
        globalFilter,
        setGlobalFilter,
        dataMode,
        setDataMode,

        excelData: {
          ...excelData,
          db_realisasi: effectiveRealisasiData,
          db_realisasi_raw: excelData.db_realisasi,
        },

        setExcelData,
        isDataLoading,
        dataStatus,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// =========================================================
// CUSTOM HOOK
// =========================================================
export function useFilter() {
  return useContext(FilterContext);
}
