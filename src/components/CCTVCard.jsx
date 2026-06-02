import React, { useState } from "react";
import ModuleOverlay from "../components/ModuleOverlay";

import { Video, Camera, X, Play, MapPin, Radio } from "lucide-react";

export default function MonitoringCCTV() {
  const [activeMedia, setActiveMedia] = useState(null);

  // =====================================================
  // MASTER DATA
  // =====================================================

  const monitoringData = [
    {
      id: "LOT-05",
      name: "Quarry Development",
      location: "Sulawesi Selatan",
      progress: "83.91%",
      deviasi: "+1.11%",

      cctvUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

      cctvThumb:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",

      droneUrl: "https://www.w3schools.com/html/movie.mp4",

      droneThumb:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200",
    },

    {
      id: "LOT-17",
      name: "Bendungan Jlantah",
      location: "Karanganyar, Jawa Tengah",
      progress: "72.18%",
      deviasi: "-3.12%",

      cctvUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

      cctvThumb:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",

      droneUrl: "https://www.w3schools.com/html/movie.mp4",

      droneThumb:
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1200",
    },

    {
      id: "LOT-03",
      name: "Jalan Tol XYZ",
      location: "Jawa Barat",
      progress: "61.42%",
      deviasi: "-1.04%",

      cctvUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

      cctvThumb:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200",

      droneUrl: "https://www.w3schools.com/html/movie.mp4",

      droneThumb:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
    },
  ];

  // =====================================================
  // OPEN MEDIA
  // =====================================================

  const openMedia = (type, url, projectName) => {
    setActiveMedia({
      type,
      url,
      projectName,
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm font-sans">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="mb-5 flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            <Video size={18} />
            Drone & Live CCTV Monitoring Center
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Realtime visual monitoring proyek strategis nasional
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Command Center Active
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE WRAPPER */}
      {/* ===================================================== */}

      <div className="w-full overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-inner">
        <table className="w-full text-left border-separate border-spacing-0 text-xs">
          {/* ===================================================== */}
          {/* HEADER TABLE */}
          {/* ===================================================== */}

          <thead className="text-slate-700 font-bold bg-white sticky top-0 z-20 select-none shadow-sm">
            <tr>
              <th className="px-5 py-3 border-b border-slate-200 w-[300px] text-[11px] uppercase tracking-wider">
                Nama Proyek
              </th>

              <th className="px-4 py-3 text-center border-b border-slate-200 w-[140px] text-[11px] uppercase tracking-wider">
                Progress / Deviasi
              </th>

              <th className="px-4 py-3 text-center border-b border-slate-200 w-[230px] text-[11px] uppercase tracking-wider">
                Drone Monitoring
              </th>

              <th className="px-4 py-3 text-center border-b border-slate-200 w-[230px] text-[11px] uppercase tracking-wider">
                CCTV Monitoring
              </th>
            </tr>
          </thead>

          {/* ===================================================== */}
          {/* BODY TABLE */}
          {/* ===================================================== */}

          <tbody className="bg-white">
            {monitoringData.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-blue-50/40 transition-colors duration-200"
              >
                {/* ===================================================== */}
                {/* PROJECT */}
                {/* ===================================================== */}

                <td className="px-5 py-3 align-middle border-b border-slate-100">
                  <span className="inline-block text-[9px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded mb-2">
                    {project.id}
                  </span>

                  <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                    {project.name}
                  </h4>

                  <p className="text-slate-400 text-[10px] mt-2 flex items-center gap-1 font-medium">
                    <MapPin size={10} className="text-slate-400" />

                    {project.location}
                  </p>
                </td>

                {/* ===================================================== */}
                {/* PROGRESS */}
                {/* ===================================================== */}

                <td className="px-4 py-3 text-center align-middle border-b border-slate-100">
                  <div className="font-mono font-black text-slate-800 text-[15px]">
                    {project.progress}
                  </div>

                  <div
                    className={`text-[11px] font-bold font-mono mt-1 ${
                      project.deviasi.includes("-")
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {project.deviasi}
                  </div>
                </td>

                {/* ===================================================== */}
                {/* DRONE */}
                {/* ===================================================== */}

                <td className="px-4 py-3 text-center align-middle border-b border-slate-100">
                  <div className="flex justify-center">
                    <div
                      onClick={() =>
                        openMedia("Drone Video", project.droneUrl, project.name)
                      }
                      className="relative w-[180px] aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm group"
                    >
                      <img
                        src={project.droneThumb}
                        alt="Drone Capture"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                        <div className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md transform group-hover:scale-110 transition-transform">
                          <Camera size={14} strokeWidth={2.5} />
                        </div>
                      </div>

                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[8px] font-black text-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                        DRONE
                      </span>
                    </div>
                  </div>
                </td>

                {/* ===================================================== */}
                {/* CCTV */}
                {/* ===================================================== */}

                <td className="px-4 py-3 text-center align-middle border-b border-slate-100">
                  <div className="flex justify-center">
                    <div
                      onClick={() =>
                        openMedia(
                          "Live CCTV Stream",
                          project.cctvUrl,
                          project.name,
                        )
                      }
                      className="relative w-[180px] aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm group"
                    >
                      <img
                        src={project.cctvThumb}
                        alt="Live CCTV"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                        <div className="p-2 rounded-full bg-red-600 text-white shadow-md transform group-hover:scale-110 transition-transform animate-pulse">
                          <Play size={12} fill="white" className="ml-0.5" />
                        </div>
                      </div>

                      <span className="absolute top-2 right-2 bg-red-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse">
                        LIVE
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================================== */}
      {/* POPUP VIDEO */}
      {/* ===================================================== */}

      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl flex flex-col overflow-hidden w-full max-w-4xl aspect-video"
          >
            {/* ===================================================== */}
            {/* POPUP HEADER */}
            {/* ===================================================== */}

            <div className="mb-3 flex justify-between items-center flex-shrink-0">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  {activeMedia.projectName}

                  <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono uppercase">
                    {activeMedia.type}
                  </span>
                </h4>
              </div>

              <button
                onClick={() => setActiveMedia(null)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all shadow-sm"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* ===================================================== */}
            {/* VIDEO PLAYER */}
            {/* ===================================================== */}

            <div className="flex-1 bg-black rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center">
              <video
                src={activeMedia.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            </div>
          </div>
      <ModuleOverlay />
        </div>
      
      )}
      
    </div>
  );
}
