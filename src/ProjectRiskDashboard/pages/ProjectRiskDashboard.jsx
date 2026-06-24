import React, { useState, useRef } from "react";
import { useFilter } from "../../context/FilterContext";
import { getDisplayName } from "../../utils/projectName.js";

// Hooks & Components Lokal
import { useRiskData } from "../hooks/useRiskData";
import ExecutiveSummary from "../components/ExecutiveSummary";
import Methodology from "../components/Methodology";
import PerformanceTable from "../components/PerformanceTable";

export default function ProjectRiskDashboard() {
  const { excelData, globalFilter } = useFilter();

  // States untuk UI & Interaksi
  const [sortBy, setSortBy] = useState("total_risk");
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  // Refs untuk navigasi otomatis (scroll)
  const tableRef = useRef(null);
  const rowRefs = useRef({});

  // Mengambil data terpusat dari Custom Hook
  const { list: allProjects, stats } = useRiskData(excelData, globalFilter);

  // Proses Sorting & Filtering untuk Tabel Utama
  const sortedTableProjects = (() => {
    switch (sortBy) {
      case "behind_schedule":
        return [...allProjects].sort(
          (a, b) => a.behindSchedule - b.behindSchedule,
        );
      case "cost_overrun":
        return [...allProjects].sort((a, b) => a.costOverrun - b.costOverrun);
      case "time_overrun":
        return [...allProjects].sort(
          (a, b) => b.targetHarianValue - a.targetHarianValue,
        );
      case "piutang":
        return [...allProjects].sort(
          (a, b) => b.piutangRiskScore - a.piutangRiskScore,
        );
      default:
        return [...allProjects].sort(
          (a, b) => a.totalRiskScore - b.totalRiskScore,
        );
    }
  })();

  const filteredProjects = sortedTableProjects.filter((proj) => {
    const keyword = searchTerm.toLowerCase();
    const matchSearch =
      String(getDisplayName(proj) || "")
        .toLowerCase()
        .includes(keyword) ||
      String(proj.id_project || "")
        .toLowerCase()
        .includes(keyword);
    const matchRisk =
      riskFilter === "ALL" ? true : proj.riskLevel === riskFilter;

    return matchSearch && matchRisk;
  });

  // Fungsi interaksi klik dari Summary ke Table
  const handleSummaryClick = (id_project) => {
    setHighlightedId(id_project);
    setSortBy("total_risk");
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      if (rowRefs.current[id_project]) {
        rowRefs.current[id_project].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);

    setTimeout(() => setHighlightedId(null), 4000);
  };

  return (
    <div className="w-full space-y-6 font-sans mt-8">
      {/* GRID ATAS: SUMMARY & METODOLOGI */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 h-full">
          <ExecutiveSummary
            stats={stats}
            filteredProjects={filteredProjects}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            onProjectClick={handleSummaryClick}
          />
        </div>
        <div className="xl:col-span-5 h-full">
          <Methodology />
        </div>
      </div>

      {/* TABEL BAWAH: PERFORMANCE MATRIX */}
      <PerformanceTable
        projects={filteredProjects}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        highlightedId={highlightedId}
        tableRef={tableRef}
        rowRefs={rowRefs}
      />
    </div>
  );
}
