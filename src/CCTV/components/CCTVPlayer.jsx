import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  RefreshCcw,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";

export default function CCTVPlayer({ streamUrl }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [status, setStatus] = useState("connecting");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !streamUrl) return;

    let reconnectTimer;

    const destroyPlayer = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    const initializePlayer = () => {
      destroyPlayer();

      setStatus("connecting");

      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,

          liveSyncDurationCount: 2,
          liveMaxLatencyDurationCount: 4,

          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          backBufferLength: 10,

          enableWorker: true,
        });

        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.LEVEL_LOADED, () => {
          setStatus("live");
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS ERROR :", data);

          if (!data.fatal) return;

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Reconnect Network...");
              setStatus("connecting");
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Recover Media...");
              setStatus("connecting");
              hls.recoverMediaError();
              break;

            default:
              console.log("Recreate Player...");
              setStatus("offline");

              reconnectTimer = setTimeout(() => {
                initializePlayer();
              }, 3000);

              break;
          }
        });
      } else if (
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        video.src = streamUrl;

        video.onloadedmetadata = () => {
          video.play().catch(() => {});
        };
      }
    };

    initializePlayer();

    return () => {
      clearTimeout(reconnectTimer);
      destroyPlayer();
    };
  }, [streamUrl, reloadKey]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">

      {/* STATUS */}

      <div className="absolute top-3 left-3 z-20">

        {status === "live" && (
          <div className="flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            <Wifi size={12} />
            LIVE
          </div>
        )}

        {status === "connecting" && (
          <div className="flex items-center gap-2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            <Loader2
              size={12}
              className="animate-spin"
            />
            CONNECTING...
          </div>
        )}

        {status === "offline" && (
          <div className="flex items-center gap-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            <WifiOff size={12} />
            OFFLINE
          </div>
        )}
      </div>

      {/* REFRESH */}

      <button
        onClick={() => setReloadKey((v) => v + 1)}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition"
      >
        <RefreshCcw size={15} />
      </button>

      {/* VIDEO */}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls
        className="w-full h-full object-cover"
      />
    </div>
  );
}