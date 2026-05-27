// src/ProjectMap.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Video, X } from "lucide-react";

const geoUrl = "/indonesia.json";

export default function ProjectMap() {
  const [projectData, setProjectData] = useState([]);

  // State untuk menyimpan data proyek mana yang SEDANG DIKLIK
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    fetchLokasi();
  }, []);

  const fetchLokasi = async () => {
    try {
      // Pastikan nama tabel disesuaikan dengan yang ada di Supabase Anda
      const { data, error } = await supabase.from("master_project").select("*");

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const formatted = (data || [])
        .map((item) => {
          // FIX FORMAT KOORDINAT
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

          // VALIDASI ANTI NaN
          const isValid =
            Number.isFinite(longitude) &&
            Number.isFinite(latitude) &&
            longitude !== 0 &&
            latitude !== 0;

          if (!isValid) return null;

          // FILTER STATUS ON GOING
          const rawStatus = String(
            item?.status_proyek || item?.status_project_current || "",
          ).toUpperCase();

          const isOnGoing =
            rawStatus.includes("ON GOING") ||
            rawStatus.includes("SAP NOT UPDATE");

          if (!isOnGoing) return null;

          return {
            id: item?.id_project || "-",

            name:
              item?.project_name ||
              item?.nama_proyek_current ||
              "Unknown Project",

            longitude,
            latitude,

            // MARKER MERAH JIKA BEHIND
            status: String(item?.status_schedule || "")
              .toUpperCase()
              .includes("BEHIND")
              ? "Critical"
              : "On Going",

            gap: String(item?.status_schedule || "")
              .toUpperCase()
              .includes("BEHIND")
              ? "Behind Schedule"
              : "Normal",

            link_drone: item?.link_drone || null,
          };
        })
        .filter(Boolean);

      setProjectData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setProjectData([]);
    }
  };

  return (
    <div className="w-full bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 mt-8 relative">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-slate-800">
            Sebaran Geografis Proyek
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Klik titik koordinat proyek untuk melihat detail dan pantauan drone
          </p>
        </div>

        {/* LEGENDA */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="font-medium text-slate-600 text-xs">On Going</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="font-medium text-slate-600 text-xs">
              Critical / Delay
            </span>
          </div>
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="bg-[#F3F4F6] rounded-[24px] overflow-hidden relative min-h-[450px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [118, -2],
          }}
          width={1000}
          height={450}
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

          {/* MARKERS KOTAK KLIK */}
          {projectData
            .filter((project) => {
              const lat = Number(project.latitude);
              const lng = Number(project.longitude);

              return (
                !isNaN(lat) &&
                !isNaN(lng) &&
                lat >= -90 &&
                lat <= 90 &&
                lng >= -180 &&
                lng <= 180
              );
            })
            .map((project, index) => {
              const lat = Number(project.latitude);
              const lng = Number(project.longitude);

              if (isNaN(lat) || isNaN(lng)) return null;

              return (
                <Marker
                  key={`${project.id}-${index}`}
                  coordinates={[lng, lat]}
                  onClick={() => setActiveTooltip(project)}
                >
                  <circle
                    r={4}
                    fill={project.status === "Critical" ? "#DC2626" : "#2563EB"}
                  />
                </Marker>
              );
            })}
        </ComposableMap>

        {/* OVERLAY POPUP INFORMASI (Akan muncul saat Marker diklik) */}
        {activeTooltip && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200 w-72 z-50 font-sans transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-black text-sm text-slate-800 leading-snug pr-4">
                {activeTooltip.name}
              </h4>
              <button
                onClick={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-full p-1 transition-colors"
                title="Tutup"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  Status Pekerjaan
                </span>
                <span
                  className={`font-black px-2 py-0.5 rounded ${activeTooltip.status === "Critical" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
                >
                  {activeTooltip.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  Kondisi Deviasi
                </span>
                <span className="font-bold text-slate-700">
                  {activeTooltip.gap}
                </span>
              </div>
            </div>

            {/* TOMBOL DRONE */}
            {activeTooltip.link_drone &&
            activeTooltip.link_drone.trim() !== "" &&
            activeTooltip.link_drone !== "-" ? (
              <a
                href={activeTooltip.link_drone}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center gap-1.5 w-full bg-[#000075] hover:bg-blue-900 text-white text-[11px] font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-900/20"
              >
                <Video size={14} /> Lihat Pantauan Drone
              </a>
            ) : (
              <div className="flex justify-center items-center w-full bg-slate-100 text-slate-400 text-[11px] font-bold py-2.5 rounded-xl cursor-not-allowed border border-slate-200 border-dashed">
                Video Drone Tidak Tersedia
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
