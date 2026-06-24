import { useRef, useEffect } from "react";
import CCTVPlayer from "./CCTVPlayer";
import Hls from "hls.js";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { MapPin, ZoomIn, ZoomOut, PlayCircle, Video } from "lucide-react";

const geoUrl = "/indonesia.json";

export default function MapSection({
  activeProject,
  position,
  setPosition,
  setActiveVideo,
  setActiveCCTV,
}) {
  const handleZoomIn = () =>
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * 1.5, 20),
    }));

  const handleZoomOut = () =>
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / 1.5, 1),
    }));

  const handleMoveEnd = (newPosition) => setPosition(newPosition);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource("http://localhost:8000/live.m3u8");
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="lg:col-span-1 flex flex-col h-full gap-4">
      {/* BOX PETA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[260px]">
        <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#000075]" />
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
              Peta Interaktif
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1 bg-white border border-slate-300 rounded text-slate-600 hover:bg-blue-50"
            >
              <ZoomIn size={12} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 bg-white border border-slate-300 rounded text-slate-600 hover:bg-blue-50"
            >
              <ZoomOut size={12} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#b9d3ee] relative cursor-grab active:cursor-grabbing">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#F3F4F6"
                      stroke="#D1D5DB"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#E5E7EB", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              <Marker
                coordinates={[activeProject.longitude, activeProject.latitude]}
              >
                <g transform="translate(-7, -14) scale(0.5)">
                  <circle cx="10" cy="20" r="6" fill="#DC2626" opacity="0.3">
                    <animate
                      attributeName="r"
                      values="6;18"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    d="M10 0C6.32 0 3.33 3 3.33 6.67c0 4.38 5.83 10.83 6.67 11.81.08.1.25.1.33 0 .83-.98 6.67-7.43 6.67-11.81C17 3 13.68 0 10 0zm0 9.58c-1.61 0-2.92-1.31-2.92-2.92S8.39 3.75 10 3.75s2.92 1.31 2.92 2.92c0 1.61-1.31 2.92-2.92 2.92z"
                    fill="#DC2626"
                  />
                </g>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>

      {/* BOX DRONE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-1 shrink-0">
          <PlayCircle size={14} className="text-[#000075]" />
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
            Drone Monitoring
          </h3>
        </div>

        <div className="aspect-video bg-slate-100">
          {activeProject.link_drone ? (
            <div className="h-[280px] bg-slate-100">
              {" "}
              <iframe
                src={activeProject.link_drone}
                title="Drone Monitoring"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
              Drone belum tersedia
            </div>
          )}
        </div>
      </div>

      {/* BOX CCTV */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5">
          <Video size={14} className="text-[#000075]" />
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
            CCTV Monitoring
          </h3>
        </div>

        <div className="aspect-video bg-black">
          {activeProject?.cctv_channel2 ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              controls={false}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() =>
                setActiveCCTV({
                  title: activeProject.project_name,
                  streamUrl: "http://localhost:8000/live.m3u8",
                })
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <span className="text-xs text-slate-400">
                CCTV belum tersedia
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
