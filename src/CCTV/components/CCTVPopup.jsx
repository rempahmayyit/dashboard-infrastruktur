import React from "react";
import {
  X,
  MapPin,
  Wifi,
  WifiOff,
  Activity,
  Building2,
  Maximize,
  RefreshCcw,
} from "lucide-react";

import CCTVPlayer from "./CCTVPlayer";

export default function CCTVPopup({ camera, onClose }) {
  if (!camera) return null;

  const online = camera.status === "ONLINE";

  const refreshPlayer = () => {
    window.location.reload();
  };

  const fullscreen = () => {
    const el = document.documentElement;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  return (
    <div
      onClick={onClose}
      className="
      fixed
      inset-0
      z-[999]
      bg-black/80
      backdrop-blur
      flex
      items-center
      justify-center
      p-8
    "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
        w-full
        max-w-7xl
        rounded-3xl
        overflow-hidden
        bg-slate-950
        border
        border-slate-800
        shadow-2xl
      "
      >
        {/* ======================================== */}
        {/* HEADER */}
        {/* ======================================== */}

        <div className="border-b border-slate-800 px-8 py-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-400 font-bold">
                {camera.project_id}
              </span>

              {online ? (
                <div className="flex items-center gap-2 bg-emerald-600 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />

                  <span className="text-xs font-bold">LIVE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-600 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-white rounded-full" />

                  <span className="text-xs font-bold">OFFLINE</span>
                </div>
              )}
            </div>

            <h2 className="mt-3 text-3xl font-black">{camera.project_name}</h2>

            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <MapPin size={15} />

              {camera.location}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshPlayer}
              className="
              w-11
              h-11
              rounded-xl
              bg-slate-900
              hover:bg-blue-600
              transition
              flex
              items-center
              justify-center
            "
            >
              <RefreshCcw size={18} />
            </button>

            <button
              onClick={fullscreen}
              className="
              w-11
              h-11
              rounded-xl
              bg-slate-900
              hover:bg-blue-600
              transition
              flex
              items-center
              justify-center
            "
            >
              <Maximize size={18} />
            </button>

            <button
              onClick={onClose}
              className="
              w-11
              h-11
              rounded-xl
              bg-red-600
              hover:bg-red-500
              transition
              flex
              items-center
              justify-center
            "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ======================================== */}
        {/* BODY */}
        {/* ======================================== */}

        <div className="grid grid-cols-12">
          {/* PLAYER */}

          <div className="col-span-9 bg-black aspect-video">
            <CCTVPlayer streamUrl={camera.streamUrl} />
          </div>

          {/* INFO */}

          <div className="col-span-3 border-l border-slate-800 bg-slate-900 p-6">
            <h3 className="font-bold text-lg">Camera Information</h3>

            <div className="mt-6 space-y-5">
              <InfoItem
                icon={<Building2 size={17} />}
                label="Project"
                value={camera.project_name}
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="Location"
                value={camera.location}
              />

              <InfoItem
                icon={<Activity size={17} />}
                label="Progress"
                value={`${camera.progress}%`}
              />

              <InfoItem
                icon={online ? <Wifi size={17} /> : <WifiOff size={17} />}
                label="Status"
                value={camera.status}
              />
            </div>

            {/* Progress */}

            <div className="mt-10">
              <div className="flex justify-between mb-2 text-sm">
                <span>Project Progress</span>

                <span>{camera.progress}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  style={{
                    width: `${camera.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        {icon}

        {label}
      </div>

      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
