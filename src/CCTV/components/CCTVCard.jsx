import React from "react";
import { useState, useEffect } from "react";
import { MapPin, Wifi, WifiOff, Play, Maximize2 } from "lucide-react";

export default function CCTVCard({ camera, onOpen }) {
  // Menggunakan is_active dari useCCTVData
  const online = camera.is_active;

  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-xl
        bg-white
        border
        border-slate-200
        hover:border-[#000075]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-[#000075]/10
        flex
        flex-col
        h-full
      "
    >
      {/* ==================================================== */}
      {/* SNAPSHOT VIDEO PLAYER PLACEHOLDER */}
      {/* ==================================================== */}
      <div className="relative aspect-video overflow-hidden bg-slate-900 shrink-0">
        <img
          src={
            camera.snapshotUrl
              ? `${camera.snapshotUrl}?v=${refreshKey}`
              : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
          }
          alt={camera.camera_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

        {/* STATUS LIVE */}
        <div className="absolute left-3 top-3">
          {online ? (
            <div className="flex items-center gap-1.5 rounded bg-red-600/90 backdrop-blur-sm px-2 py-0.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] text-white font-bold tracking-widest">
                LIVE
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded bg-slate-700/90 backdrop-blur-sm px-2 py-0.5 shadow-sm">
              <span className="text-[9px] text-slate-300 font-bold tracking-widest">
                OFFLINE
              </span>
            </div>
          )}
        </div>

        {/* TOMBOL PLAY (HOVER) */}
        <button
          onClick={onOpen}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
        >
          <div className="w-14 h-14 rounded-full bg-[#000075]/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </button>
      </div>

      {/* ==================================================== */}
      {/* CARD BODY INFO */}
      {/* ==================================================== */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            ID: {camera.id_project}
          </span>
          <span className="text-slate-400 text-[10px] font-bold uppercase">
            {camera.channel || "-"}
          </span>
        </div>

        {/* Nama Kamera Utama */}
        <h2 className="text-sm font-black text-slate-800 leading-snug line-clamp-2 mt-1">
          {camera.camera_name || "Kamera Tanpa Nama"}
        </h2>

        {/* Lokasi / Nama Proyek */}
        <div className="mt-2 flex items-start gap-1.5 text-slate-500 flex-grow">
          <MapPin size={14} className="shrink-0 mt-0.5 text-[#000075]" />
          <span className="text-xs font-medium line-clamp-2 leading-tight">
            {camera.project_name}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 my-3"></div>

        {/* Footer (Status & Expand) */}
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-1.5">
            {online ? (
              <>
                <Wifi size={14} className="text-emerald-500" />
                <span className="text-emerald-600 text-[11px] font-bold tracking-wide">
                  ONLINE
                </span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-red-400" />
                <span className="text-red-500 text-[11px] font-bold tracking-wide">
                  OFFLINE
                </span>
              </>
            )}
          </div>

          <button
            onClick={onOpen}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-[#000075] hover:text-white hover:border-[#000075] transition-colors flex items-center justify-center"
            title="Perbesar Kamera"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
