// src/ProjectMap.jsx
import React, { useState, useEffect } from "react";
import { useFilter } from "./context/FilterContext";
import { getDisplayName } from "./utils/projectName";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Video,
  X,
  Plus,
  Minus,
  MapPin,
  AlertTriangle,
  PlayCircle,
  Info,
} from "lucide-react";

const geoUrl = "/indonesia.json";

// Helper formatter agar aman
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const num = Number(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatMiliar = (val) => {
  const num = safeParseNumber(val);
  return (
    (num / 1_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " M"
  );
};

const formatDate = (value) => {
  if (!value) return "-";

  const d = new Date(value);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ProjectMap() {
  const [projectData, setProjectData] = useState([]);
  const { excelData, dataMode } = useFilter();

  const masterData = excelData?.db_master_data || [];
  const realisasiData = excelData?.db_realisasi || [];
  const kendalaData = excelData?.db_kendala || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // State untuk menyimpan data proyek yang sedang diklik (Panel Kanan)
  const [activeProject, setActiveProject] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const [position, setPosition] = useState({ coordinates: [118, -2], zoom: 1 });

  // Sedikit memperbesar radius agar tumpukan marker lebih terlihat
  const spreadMarker = (lat, lng, clusterIndex, totalCluster) => {
    if (totalCluster <= 1) return { latitude: lat, longitude: lng };
    const angle = (clusterIndex / totalCluster) * Math.PI * 2;
    const radius = totalCluster <= 3 ? 0.05 : totalCluster <= 6 ? 0.08 : 0.12;
    return {
      latitude: lat + Math.sin(angle) * radius,
      longitude: lng + Math.cos(angle) * radius,
    };
  };

  const fetchLokasi = async () => {
    try {
      const data = masterData;
      const formatted = (data || [])
        .map((item, index) => {
          const rawStatus = String(
            item?.status_proyek || item?.status_project_current || "",
          )
            .toUpperCase()
            .trim();
          const projectId =
            item?.id_project || item?.id_proyect || item?.id_proyek;

          const latestRealisasi = (excelData?.db_realisasi || [])
            .filter((r) => {
              const rid = r?.id_project || r?.id_proyect || r?.id_proyek;

              const statusMatch =
                String(r?.status_data || "").toUpperCase() ===
                String(dataMode || "QUICK").toUpperCase();

              return String(rid) === String(projectId) && statusMatch;
            })
            .sort((a, b) => new Date(b.periode) - new Date(a.periode))[0];

          const latestKendala = kendalaData
            .filter((k) => String(k.id_project) === String(projectId))
            .sort((a, b) => new Date(b.periode) - new Date(a.periode))[0];

          const ri = safeParseNumber(latestRealisasi?.prog_real || 0);
          const ra = safeParseNumber(latestRealisasi?.progres_scurve || 0);

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

          const sameLocationProjects = (data || []).filter((p) => {
            const lat2 = parseFloat(p.latitude);
            const lng2 = parseFloat(p.longitude);
            return (
              !isNaN(lat2) &&
              !isNaN(lng2) &&
              Math.abs(lat2 - latitude) < 0.0005 &&
              Math.abs(lng2 - longitude) < 0.0005
            );
          });

          const clusterIndex = sameLocationProjects.findIndex((p) => {
            const pid = p.id_project || p.id_proyek || p.id_proyect;
            return String(pid) === String(projectId);
          });

          const shifted = spreadMarker(
            latitude,
            longitude,
            clusterIndex,
            sameLocationProjects.length,
          );
          const isBehind = ri - ra < 0;

          // Ambil data untuk Summary
          const nk = safeParseNumber(
            item?.nk_current || item?.nilai_kontrak || 0,
          );

          // Nanti bisa diganti dengan field 'kendala' dari database jika sudah ada
          const kendalaProgres = latestKendala?.kendala_progres || "";

          const kendalaBkpu = latestKendala?.kendala_bkpu || "";

          return {
            id: projectId,
            name:
              getDisplayName(item) ||
              item?.nama_proyek_current ||
              item?.nama_paket_current ||
              "Unknown Project",
            endDate: item?.end_date_current || null,
            longitude: shifted.longitude,
            latitude: shifted.latitude,
            originalLongitude: longitude,
            originalLatitude: latitude,
            status: isBehind ? "Critical" : "On Going",
            gap: isBehind ? "Behind Schedule" : "Normal",
            link_drone: item?.link_drone || null,
            // Data Keuangan & Progres (Real Data)
            nk: nk,
            ra: ra,
            ri: ri,
            deviasi: ri - ra,
            kendalaProgres,
            kendalaBkpu,
          };
        })
        .filter(Boolean);

      setProjectData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setProjectData([]);
    }
  };

  useEffect(() => {
    if (masterData.length > 0) {
      fetchLokasi();
    }
  }, [masterData, realisasiData]);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = projectData
      .filter((project) =>
        project.name?.toLowerCase().includes(value.toLowerCase()),
      )
      .slice(0, 8);
    setSuggestions(filtered);
  };

  const filteredProjects = projectData.filter((project) =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch font-sans">
      {/* ====================================================================== */}
      {/* 1. KOLOM PETA (Kiri - Lebar 2/3) */}
      {/* ====================================================================== */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col relative min-h-[500px]">
        {/* HEADER MAP */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-[18px] font-black text-slate-900 tracking-tight uppercase">
              Sebaran Geografis
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Klik titik koordinat proyek untuk melihat rincian di panel kanan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-4 text-[10px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                On Going
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>{" "}
                Critical
              </span>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="🔍 Cari proyek..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[999] max-h-64 overflow-y-auto">
                  {suggestions.map((project) => (
                    <button
                      key={project.id}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b last:border-b-0"
                      onClick={() => {
                        setSearchTerm(project.name);
                        setSuggestions([]);
                        setActiveProject(project); // Set ke panel kanan
                        setPosition({
                          coordinates: [
                            project.originalLongitude,
                            project.originalLatitude,
                          ],
                          zoom: 5,
                        });
                      }}
                    >
                      <div className="font-medium text-sm text-slate-800">
                        {project.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID : {project.id}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AREA PETA */}
        <div className="bg-[#F3F4F6] rounded-2xl overflow-hidden relative flex-1 cursor-grab active:cursor-grabbing border border-slate-200">
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600"
            >
              <Minus size={18} />
            </button>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000 }}
            width={1000}
            height={450}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
              maxZoom={8}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#DCDCE1"
                      stroke="#FFFFFF"
                      strokeWidth={0.75}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#C8C8CE", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {filteredProjects.map((project, index) => (
                <Marker
                  key={`${project.id}-${index}`}
                  coordinates={[project.longitude, project.latitude]}
                  onClick={() => setActiveProject(project)}
                >
                  <g className="cursor-pointer transition-transform hover:scale-125">
                    <title>{project.name}</title>
                    {/* Ring Animasi jika marker aktif */}
                    {activeProject?.id === project.id && (
                      <circle
                        r={18 / position.zoom}
                        fill="none"
                        stroke={
                          project.status === "Critical" ? "#DC2626" : "#2563EB"
                        }
                        strokeWidth={3 / position.zoom}
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          values={`${8 / position.zoom};${25 / position.zoom}`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <circle
                      r={6 / position.zoom}
                      fill={
                        project.status === "Critical" ? "#DC2626" : "#2563EB"
                      }
                      stroke="#FFFFFF"
                      strokeWidth={2 / position.zoom}
                    />
                    <circle r={2 / position.zoom} fill="#FFFFFF" />
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 2. KOLOM EXECUTIVE SUMMARY (Kanan - Lebar 1/3) */}
      {/* ====================================================================== */}
      <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {/* Header Summary */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              Executive Summary
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Detail & Status Proyek Terpilih
            </p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 shadow-sm">
            <MapPin size={16} />
          </div>
        </div>

        {/* Content Summary */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
          {!activeProject ? (
            // STATE KOSONG (Placeholder)
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MapPin size={40} className="mb-3 opacity-20" />
              <p className="text-xs font-medium">
                Klik titik koordinat di peta untuk memuat data executive summary
                proyek.
              </p>
            </div>
          ) : (
            // STATE TERISI (Ada Proyek Terpilih)
            <div className="p-5 space-y-5">
              {/* A. Info Proyek Utama */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {activeProject.name}
                  </h4>
                  <span
                    className={`px-2 py-1 border text-[9px] font-black uppercase rounded-md shrink-0 ${activeProject.status === "Critical" ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                  >
                    {activeProject.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-1.5">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                    ID: {activeProject.id}
                  </span>
                  <span>•</span>
                  <span>{activeProject.gap}</span>
                </div>
              </div>

              {/* B. Grid Matriks Angka */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* NK */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">
                    NK
                  </div>

                  <div className="text-lg font-black text-slate-800">
                    {formatMiliar(activeProject.nk)}
                  </div>
                </div>

                {/* DEVIASI */}
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <div className="text-[9px] text-red-400 font-bold uppercase">
                    Deviasi Progres
                  </div>

                  <div className="text-lg font-black text-red-700">
                    {activeProject.deviasi.toFixed(2)}%
                  </div>
                </div>

                {/* TARGET */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">
                    Target Selesai
                  </div>

                  <div className="text-base font-black text-slate-800">
                    {formatDate(activeProject.endDate)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                    <span>Rencana (RA)</span>
                    <span>{activeProject.ra.toFixed(2)}%</span>
                  </div>

                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(activeProject.ra, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                    <span>Realisasi (RI)</span>
                    <span>{activeProject.ri.toFixed(2)}%</span>
                  </div>

                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        activeProject.deviasi < 0
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(activeProject.ri, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* C. Area Kendala (Dirender jika ada masalah deviasi) */}
              {activeProject.deviasi < 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200/60 h-32 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle size={14} className="text-red-600" />
                    <h5 className="text-[11px] font-black text-red-800 uppercase tracking-wide">
                      Penyebab Keterlambatan
                    </h5>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2">
                    <p className="text-[10.5px] text-red-700 font-medium leading-relaxed">
                      {activeProject.kendalaProgres || "-"}
                    </p>
                  </div>
                </div>
              )}

              {activeProject.kendalaBkpu && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 h-32 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <h5 className="text-[11px] font-black text-amber-800 uppercase">
                      Penyebab BK/PU di Atas MAPP
                    </h5>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2">
                    <p className="text-[10.5px] text-amber-700 leading-relaxed">
                      {activeProject.kendalaBkpu || "-"}
                    </p>
                  </div>
                </div>
              )}

              {/* Pesan Aman (Jika On Track) */}
              {activeProject.deviasi >= 0 && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200/60 flex items-start gap-2">
                  <Info
                    size={14}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                  <p className="text-[10.5px] text-emerald-700 font-medium leading-relaxed">
                    Proyek berjalan sesuai dengan kurva S (On Track). Tidak
                    terdeteksi deviasi negatif yang signifikan.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Action Button untuk Drone */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            disabled={
              !activeProject ||
              !activeProject.link_drone ||
              activeProject.link_drone === "-"
            }
            onClick={() => setActiveVideo(activeProject)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all shadow-sm
              ${
                !activeProject ||
                !activeProject.link_drone ||
                activeProject.link_drone === "-"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 active:scale-[0.98]"
              }
            `}
          >
            {!activeProject ||
            !activeProject.link_drone ||
            activeProject.link_drone === "-" ? (
              <>Video Drone Tidak Tersedia</>
            ) : (
              <>
                <PlayCircle size={16} /> Putar Video Drone Proyek
              </>
            )}
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MODAL POPUP VIDEO DRONE */}
      {/* ====================================================================== */}
      {activeVideo && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">
                  Pemantauan Visual Udara (Drone)
                </h3>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {activeVideo.name}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                title="Tutup Video"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Aspect Ratio 16:9 untuk Video */}
            <div className="aspect-video bg-black w-full relative">
              <iframe
                src={`${activeVideo.link_drone}${activeVideo.link_drone.includes("?") ? "&" : "?"}autoplay=1`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
