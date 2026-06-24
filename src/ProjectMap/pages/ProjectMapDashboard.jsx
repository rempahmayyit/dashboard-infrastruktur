import React, { useState, useEffect } from "react";
import { useFilter } from "../../context/FilterContext";
import { useProjectMapData } from "../hooks/useProjectMapData";

import EmptySearch from "../components/EmptySearch";
import ProjectDetails from "../components/ProjectDetails";
import MapSection from "../components/MapSection";
import ActionModals from "../components/ActionModals";

export default function ProjectMapDashboard() {
  const { excelData, globalFilter } = useFilter();
  
  // Custom Hook menangani pengolahan data map
  const projectData = useProjectMapData(excelData, globalFilter);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCCTV, setActiveCCTV] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [position, setPosition] = useState({ coordinates: [118, -2], zoom: 1 });

  // Update Data aktif jika terjadi perubahan bulan/tahun dari filter global
  useEffect(() => {
    if (activeProject && projectData.length > 0) {
      const updatedProject = projectData.find((p) => String(p.id) === String(activeProject.id));
      if (updatedProject) setActiveProject(updatedProject);
    }
  }, [projectData]);

  // Handle titik kamera map saat proyek dipilih
  useEffect(() => {
    if (activeProject) {
      setPosition({ coordinates: [activeProject.longitude, activeProject.latitude], zoom: 7 });
    } else {
      setPosition({ coordinates: [118, -2], zoom: 1 });
    }
  }, [activeProject]);

  // Fungsi Search
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const keyword = value.toLowerCase().trim();
    if (!keyword) {
      setSuggestions([]);
      return;
    }
    const filtered = projectData.filter((p) => {
      return (
        String(p.id || "").toLowerCase().includes(keyword) ||
        String(p.short_project_name || "").toLowerCase().includes(keyword) ||
        String(p.project_name || "").toLowerCase().includes(keyword) ||
        String(p.name || "").toLowerCase().includes(keyword)
      );
    }).slice(0, 15);
    
    setSuggestions(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col min-h font-sans bg-slate-50 p-1">
      {!activeProject ? (
        <EmptySearch 
          searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange} 
          suggestions={suggestions} 
          onSelectProject={setActiveProject}
          clearSearch={clearSearch}
        />
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <ProjectDetails 
            activeProject={activeProject}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            suggestions={suggestions}
            onSelectProject={setActiveProject}
            clearSearch={clearSearch}
            setDetailModal={setDetailModal}
          />
          <MapSection 
            activeProject={activeProject}
            position={position}
            setPosition={setPosition}
            setActiveVideo={setActiveVideo}
            setActiveCCTV={setActiveCCTV}
          />
        </div>
      )}

      {/* Popups */}
      <ActionModals 
        detailModal={detailModal} setDetailModal={setDetailModal}
        activeVideo={activeVideo} setActiveVideo={setActiveVideo}
        activeCCTV={activeCCTV} setActiveCCTV={setActiveCCTV}
      />
    </div>
  );
}