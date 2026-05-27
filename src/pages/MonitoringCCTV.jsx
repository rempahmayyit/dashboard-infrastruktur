import React, { useEffect, useMemo, useState } from "react";

import { Camera, Play, X, MapPin, Search } from "lucide-react";

import { supabase } from "../lib/supabase";

export default function MonitoringCCTV() {
  const [activeMedia, setActiveMedia] = useState(null);

  const [monitoringData, setMonitoringData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("ALL");

  const [searchProject, setSearchProject] = useState("");

  /* ===================================================== */
  /* FETCH DATA */
  /* ===================================================== */
  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.from("master_project").select("*");

      if (error) {
        console.error("SUPABASE ERROR:", error);

        setLoading(false);
        return;
      }

      const filtered = (data || []).filter((item) => {
        return (
          item.project_name &&
          item.project_name !== "-" &&
          item.project_name !== "NULL"
        );
      });

      const formatted = filtered.map((item, index) => ({
        id:
          item.id_project ||
          item.kode_project ||
          item.project_code ||
          `LOT-${index + 1}`,

        name:
          item.project_name ||
          item.nama_project ||
          item.nama_paket ||
          item.paket_pekerjaan ||
          "Unknown Project",

        location:
          item.lokasi_proyek ||
          item.lokasi_provinsi ||
          item.wilayah_current ||
          item.lokasi ||
          item.provinsi ||
          "-",

        status: item.status_proyek || item.status_proyek || "UNKNOWN",

        progress: `${Number(
          item.progress_current || item.progress || item.progres || 0,
        ).toFixed(2)}%`,

        deviasi: `${Number(item.deviasi_current || item.deviasi || 0).toFixed(
          2,
        )}%`,

        /* DRONE */
        droneUrl: item.link_drone || item.drone_url || "",

        /* CCTV */
        cctvUrl: item.link_cctv || item.cctv_url || "",

        /* THUMBNAIL */
        droneThumb:
          item.drone_thumbnail ||
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",

        cctvThumb:
          item.cctv_thumbnail ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
      }));

      setMonitoringData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }

    setLoading(false);
  };

  /* ===================================================== */
  /* FILTER */
  /* ===================================================== */
  const filteredProjects = useMemo(() => {
    return monitoringData
      .filter((item) => {
        if (filterStatus === "ONGOING") {
          return item.status === "ON GOING" || item.status === "SAP Not Update";
        }

        if (filterStatus === "FINISHED") {
          return ["MAINTENANCE", "PHO", "FHO", "CANCEL", "WALK OUT"].includes(
            item.status,
          );
        }

        return true;
      })
      .filter((item) =>
        item.name.toLowerCase().includes(searchProject.toLowerCase()),
      );
  }, [monitoringData, filterStatus, searchProject]);

  /* ===================================================== */
  /* YOUTUBE CONVERTER */
  /* ===================================================== */
  const convertYoutubeUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "https://www.youtube.com/embed/");
    }

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    return url;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div className="sticky top-0 z-30 bg-slate-50 pb-5 mb-6 border-b border-slate-200">
        {/* FILTER */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search proyek..."
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
              className="h-12 pl-12 pr-5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500 min-w-[280px]"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`h-12 px-5 rounded-2xl font-bold transition ${
                filterStatus === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              Semua
            </button>

            <button
              onClick={() => setFilterStatus("ONGOING")}
              className={`h-12 px-5 rounded-2xl font-bold transition ${
                filterStatus === "ONGOING"
                  ? "bg-emerald-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              ON GOING
            </button>

            <button
              onClick={() => setFilterStatus("FINISHED")}
              className={`h-12 px-5 rounded-2xl font-bold transition ${
                filterStatus === "FINISHED"
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              FINISHED
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[78vh]">
          <table className="w-full min-w-[1200px]">
            {/* HEADER */}
            <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
              <tr className="text-slate-700 text-sm uppercase tracking-wide">
                <th className="text-left px-6 py-5 font-black">Nama Proyek</th>

                <th className="text-center px-4 py-5 font-black w-[180px]">
                  Progress / Deviasi
                </th>

                <th className="text-center px-4 py-5 font-black w-[260px]">
                  Drone Monitoring
                </th>

                <th className="text-center px-4 py-5 font-black w-[260px]">
                  CCTV Monitoring
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-24 text-slate-400 font-semibold"
                  >
                    Loading Monitoring Data...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-24 text-slate-400 font-semibold"
                  >
                    Tidak ada proyek
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* PROJECT */}
                    <td className="px-6 py-6">
                      <div className="inline-flex px-3 py-1 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-black mb-3">
                        {project.id}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 leading-tight">
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-3">
                        <MapPin size={14} />

                        {project.location}
                      </div>
                    </td>

                    {/* PROGRESS */}
                    <td className="text-center px-4 py-6">
                      <div className="text-4xl font-black text-slate-800">
                        {project.progress}
                      </div>

                      <div
                        className={`mt-3 text-lg font-black ${
                          project.deviasi.includes("-")
                            ? "text-red-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {project.deviasi}
                      </div>
                    </td>

                    {/* DRONE */}
                    <td className="px-4 py-6">
                      <div
                        onClick={() => {
                          if (!project.droneUrl) {
                            return;
                          }

                          const url = project.droneUrl.toLowerCase();

                          /* SHAREPOINT EMBED */
                          if (
                            url.includes("sharepoint") ||
                            url.includes("embed.aspx")
                          ) {
                            setActiveMedia({
                              type: "Drone Monitoring",
                              title: project.name,
                              url: project.droneUrl,
                              isEmbed: true,
                            });

                            return;
                          }

                          /* INVALID URL */
                          if (!url.startsWith("http")) {
                            alert("Link Drone Tidak Valid");

                            return;
                          }

                          /* NORMAL MODAL */
                          setActiveMedia({
                            type: "Drone Monitoring",
                            title: project.name,
                            url: project.droneUrl,
                          });
                        }}
                        className={`relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition ${
                          project.droneUrl
                            ? "cursor-pointer group"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <img
                          src={project.droneThumb}
                          alt="Drone"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <Camera size={26} className="text-slate-800" />
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-lg font-bold">
                          DRONE
                        </div>
                      </div>
                    </td>

                    {/* CCTV */}
                    <td className="px-4 py-6">
                      <div
                        onClick={() => {
                          if (
                            project.cctvUrl?.includes("sharepoint") ||
                            project.cctvUrl?.includes("stream.aspx")
                          ) {
                            window.open(project.cctvUrl, "_blank");

                            return;
                          }

                          setActiveMedia({
                            type: "Live CCTV",
                            title: project.name,
                            url: project.cctvUrl,
                          });
                        }}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group shadow-sm"
                      >
                        <img
                          src={project.cctvThumb}
                          alt="CCTV"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg animate-pulse">
                            <Play
                              size={24}
                              fill="white"
                              className="text-white ml-1"
                            />
                          </div>
                        </div>

                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-lg font-black animate-pulse">
                          LIVE
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {activeMedia.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {activeMedia.type}
                </p>
              </div>

              <button
                onClick={() => setActiveMedia(null)}
                className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* PLAYER */}
            <div className="bg-black aspect-video flex items-center justify-center">
              {activeMedia.url ? (
                activeMedia.url.includes("youtube") ||
                activeMedia.url.includes("youtu.be") ? (
                  <iframe
                    src={`${convertYoutubeUrl(
                      activeMedia.url,
                    )}?autoplay=1&mute=1`}
                    title="Youtube Player"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : activeMedia.isEmbed ? (
                  <iframe
                    src={`${activeMedia.url}&autoplay=true`}
                    title="Sharepoint Embed"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : activeMedia.url.includes(".mp4") ||
                  activeMedia.url.includes(".mov") ||
                  activeMedia.url.includes(".webm") ? (
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-5 text-white">
                    <div className="text-xl font-bold">
                      Video tidak dapat di-embed
                    </div>

                    <a
                      href={activeMedia.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-bold"
                    >
                      Buka Video
                    </a>
                  </div>
                )
              ) : (
                <div className="text-white text-xl font-semibold">
                  Media belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
