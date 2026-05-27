// src/context/FilterContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { usePengendalianData } from "../hooks/usePengendalianData";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [globalFilter, setGlobalFilter] = useState({
    tahun: 2026,
    bulan: "Apr",
    minggu: 5,
  });

  const [excelData, setExcelData] = useState({
    db_master_data: [],
    db_rkap_awal: [],
    db_pengendalian_rkap: [],
    db_realisasi: [],
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

        const masterData = await fetchAllDataFromTable("master_project");

        const rkapAwalData =
          await fetchAllDataFromTable("db_rkap_awal");

        const realisasiData =
          await fetchAllDataFromTable("db_realisasi");

        setExcelData((prevData) => ({
          ...prevData,

          // MASTER
          db_master_data: masterData,

          // RKAP
          db_rkap_awal: rkapAwalData,

          // REALISASI
          db_realisasi: realisasiData,
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
        {
          event: "*",
          schema: "public",
          table: "db_realisasi",
        },
        async (payload) => {
          console.log(
            "Realtime update db_realisasi:",
            payload.eventType
          );

          const realisasiData =
            await fetchAllDataFromTable("db_realisasi");

          setExcelData((prevData) => ({
            ...prevData,
            db_realisasi: realisasiData,
          }));
        }
      )

      // =====================================================
      // RKAP
      // =====================================================
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "db_rkap_awal",
        },
        async (payload) => {
          console.log(
            "Realtime update db_rkap_awal:",
            payload.eventType
          );

          const rkapAwalData =
            await fetchAllDataFromTable("db_rkap_awal");

          setExcelData((prevData) => ({
            ...prevData,
            db_rkap_awal: rkapAwalData,
          }));
        }
      )

      // =====================================================
      // MASTER PROJECT
      // =====================================================
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "master_project",
        },
        async (payload) => {
          console.log(
            "Realtime update master_project:",
            payload.eventType
          );

          const masterData =
            await fetchAllDataFromTable("master_project");

          setExcelData((prevData) => ({
            ...prevData,
            db_master_data: masterData,
          }));
        }
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

  return (
    <FilterContext.Provider
      value={{
        globalFilter,
        setGlobalFilter,

        excelData,
        setExcelData,

        isDataLoading,
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