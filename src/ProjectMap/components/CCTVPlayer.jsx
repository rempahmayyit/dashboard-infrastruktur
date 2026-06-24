import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function CCTVPlayer({ streamUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        backBufferLength: 30,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS ERROR:", data);
        }
      });
    } else if (
      video.canPlayType("application/vnd.apple.mpegurl")
    ) {
      video.src = streamUrl;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      controls
      playsInline
      className="w-full h-full object-cover"
    />
  );
}