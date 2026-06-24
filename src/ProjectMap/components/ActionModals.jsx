import React from "react";
import { X } from "lucide-react";
import CCTVPlayer from "./CCTVPlayer";

export default function ActionModals({
  detailModal,
  setDetailModal,
  activeVideo,
  setActiveVideo,
  activeCCTV,
  setActiveCCTV,
}) {
  return (
    <>
      {detailModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#000075] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-[18px] tracking-widest">
                {detailModal.title}
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-6 max-h-[50vh] overflow-y-auto text-[16px] leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">
              {detailModal.content}
            </div>
          </div>
        </div>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200">
              <h3 className="font-black text-slate-800 text-xs uppercase">
                Pemantauan Visual Udara (Drone)
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
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

      {activeCCTV && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-bold">CCTV Live Monitoring</h3>

              <button
                onClick={() => setActiveCCTV(null)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-black">
              <CCTVPlayer streamUrl={activeCCTV.streamUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
