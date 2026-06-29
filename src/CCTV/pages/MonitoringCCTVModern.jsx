import React, { useMemo, useState } from "react";
import { Search, RefreshCcw, Video, X } from "lucide-react";

import useCCTVData from "../hooks/useCCTVData";
import CCTVCard from "../components/CCTVCard";
import CCTVStatCard from "../components/CCTVStatCard";
import CCTVPlayer from "../components/CCTVPlayer";

export default function MonitoringCCTVModern() {
  const { cctvData, totalCamera, onlineCamera, offlineCamera, totalProject } = useCCTVData();

  // ==========================================================
  // STATES
  // ==========================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  
  // State untuk membuka player popup CCTV
  const [activeCCTV, setActiveCCTV] = useState(null);

  // ==========================================================
  // OPTIONS LIST (Untuk Dropdown Filter)
  // ==========================================================
  const projectOptions = useMemo(() => {
    const projects = [...new Set(cctvData.map((x) => x.project_name).filter(Boolean))];
    return projects.sort();
  }, [cctvData]);

  // ==========================================================
  // LOGIKA PENCARIAN & SUGGESTIONS (Meniru ProjectDetails)
  // ==========================================================
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const keyword = value.toLowerCase().trim();
    
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const filtered = cctvData.filter((cam) => {
      return (
        String(cam.id_project || "").toLowerCase().includes(keyword) ||
        String(cam.project_name || "").toLowerCase().includes(keyword) ||
        String(cam.camera_name || "").toLowerCase().includes(keyword)
      );
    }).slice(0, 8); // Batasi maksimal 8 saran
    
    setSuggestions(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  // ==========================================================
  // LOGIKA FILTER DATA
  // ==========================================================
  const isLoading = cctvData.length === 0;

  const filteredData = useMemo(() => {
    return cctvData.filter((item) => {
      const matchProject = selectedProject === "ALL" || item.project_name === selectedProject;
      
      let matchStatus = true;
      if (selectedStatus === "ONLINE") matchStatus = item.is_active;
      if (selectedStatus === "OFFLINE") matchStatus = !item.is_active;

      // Jika search aktif, filter berdasarkan suggestions
      if (searchTerm) {
        return suggestions.some((sugg) => sugg.id === item.id);
      }

      return matchProject && matchStatus;
    });
  }, [cctvData, searchTerm, suggestions, selectedProject, selectedStatus]);

  // ==========================================================
  // GROUPING PER PROJECT (Tampilan Horizontal Scroll)
  // ==========================================================
  const groupedCCTV = useMemo(() => {
    const groups = {};
    filteredData.forEach((cam) => {
      const pName = cam.project_name || "Proyek Tidak Diketahui";
      if (!groups[pName]) groups[pName] = [];
      groups[pName].push(cam);
    });
    return groups;
  }, [filteredData]);

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="bg-slate-50 min-h-screen pb-10 font-sans">
      
      {/* ==================================================== */}
      {/* HEADER ATAS */}
      {/* ==================================================== */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#000075] uppercase tracking-tight">Monitoring CCTV</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">
              Pantauan visual real-time seluruh titik proyek infrastruktur
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition"
          >
            <RefreshCcw size={16} />
            <span className="font-bold text-sm">Refresh</span>
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        
        {/* ==================================================== */}
        {/* KΡΙ SUMMARY STAT CARDS */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <CCTVStatCard title="Total Camera" value={totalCamera} icon={<Video size={32} className="text-white" />} color="blue" />
          <CCTVStatCard title="Total Project" value={totalProject} icon={<Video size={32} className="text-white" />} color="amber" />
          <CCTVStatCard title="Online" value={onlineCamera} icon={<Video size={32} className="text-white" />} color="emerald" />
          <CCTVStatCard title="Offline" value={offlineCamera} icon={<Video size={32} className="text-white" />} color="red" />
        </div>

        {/* ==================================================== */}
        {/* TOOLBAR SEARCH & FILTER */}
        {/* ==================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Dropdown Filter & Status */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#000075]/20 focus:border-[#000075]"
            >
              <option value="ALL">Semua Proyek</option>
              {projectOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <div className="flex bg-slate-100 rounded-lg p-1">
              {["ALL", "ONLINE", "OFFLINE"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedStatus === status
                      ? "bg-white text-[#000075] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box + Suggestions */}
          <div className="relative w-full lg:w-80">
            <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#000075]/20 focus-within:border-[#000075] transition-all">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Cari Proyek / ID / Kamera..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="text-slate-400 hover:text-red-500 ml-1">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Kotak Rekomendasi Pencarian Melayang */}
            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl z-[50] max-h-60 overflow-y-auto">
                {suggestions.map((cam) => (
                  <button
                    key={cam.id}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                    onClick={() => {
                      clearSearch();
                      setActiveCCTV(cam); // Langsung membuka player CCTV
                    }}
                  >
                    <div className="font-bold text-sm text-slate-800">{cam.camera_name}</div>
                    <div className="text-[11px] font-semibold text-blue-600 uppercase mt-0.5">ID: {cam.id_project}</div>
                    <div className="text-[11px] text-slate-500 truncate">{cam.project_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* KONTEN UTAMA CCTV (HORIZONTAL SCROLL PER PROYEK) */}
        {/* ==================================================== */}
        {isLoading && (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center animate-pulse text-slate-500">
            Memuat data CCTV...
          </div>
        )}
        
        {!isLoading && Object.keys(groupedCCTV).length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl py-24 flex flex-col items-center justify-center shadow-sm">
            <Video size={50} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Tidak ada data CCTV</h2>
            <p className="text-slate-500 text-sm mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        )}

        {!isLoading && Object.keys(groupedCCTV).length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedCCTV).map(([projectName, cameras]) => (
              <div key={projectName} className="bg-transparent">
                
                {/* Judul Proyek */}
                <div className="flex items-center gap-2 mb-3 pl-1">
                  <div className="w-1.5 h-5 bg-[#000075] rounded-full"></div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {projectName}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    {cameras.length} Kamera
                  </span>
                </div>

                {/* Container Scroll Kesamping */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  {cameras.map((camera) => (
                    <div key={camera.id} className="min-w-[320px] max-w-[320px] shrink-0">
                      <CCTVCard
                        camera={camera}
                        onOpen={() => setActiveCCTV(camera)}
                      />
                    </div>
                  ))}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL LIVE STREAMING POPUP */}
      {/* ==================================================== */}
      {activeCCTV && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 bg-slate-950">
              <div>
                <h3 className="font-black text-white text-base tracking-wide">
                  {activeCCTV.camera_name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Proyek: {activeCCTV.project_name} &bull; ID: {activeCCTV.id_project} &bull; CH: {activeCCTV.channel}
                </p>
              </div>

              <button
                onClick={() => setActiveCCTV(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Eksekusi Komponen CCTVPlayer yang Andal */}
            <div className="w-full aspect-video bg-black relative">
              <CCTVPlayer streamUrl={activeCCTV.streamUrl} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}