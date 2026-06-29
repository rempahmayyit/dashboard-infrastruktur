import { useMemo } from "react";
import { useFilter } from "../../context/FilterContext";
import { getCCTVServer } from "../config/cctvServer";
import useMediaMTXStatus from "./useMediaMTXStatus";

export default function useCCTVData() {
  const { excelData } = useFilter();

  const masterProject = excelData.db_master_data || [];
  const cctvMaster = excelData.db_cctv || [];

  // Status realtime dari MediaMTX
  const statusMap = useMediaMTXStatus();

  // ==========================================================
  // MERGE MASTER PROJECT + CCTV
  // ==========================================================
  const cctvData = useMemo(() => {
    // Lookup project
    const projectMap = new Map();

    masterProject.forEach((p) => {
      projectMap.set(String(p.id_project), p);
    });

    return cctvMaster
      .filter((cam) => cam.is_active)
      .map((cam) => {
        const project = projectMap.get(String(cam.id_project));

        if (!project) {
          console.warn("PROJECT TIDAK KETEMU :", cam.id_project);
          return null;
        }

        // ======================================================
        // STATUS DARI MEDIAMTX
        // ======================================================
        const status = statusMap.get(cam.stream_path);

        console.log("DB Path      :", cam.stream_path);
        console.log("Status Keys  :", [...statusMap.keys()]);
        console.log("Result       :", statusMap.get(cam.stream_path));

        console.log("====================================");
        console.log(cam.camera_name);
        console.log("Path      :", cam.stream_path);
        console.log("MediaMTX  :", status);
        console.log("====================================");

        return {
          // ====================================================
          // CCTV
          // ====================================================
          id: cam.id,
          id_project: cam.id_project,
          camera_name: cam.camera_name,
          channel: cam.channel,
          stream_server: cam.stream_server,
          stream_protocol: cam.stream_protocol,
          stream_path: cam.stream_path,
          snapshot_path: cam.snapshot_path,
          sort_order: cam.sort_order,
          is_active: status?.ready ?? false,

          // ====================================================
          // STATUS REALTIME MEDIAMTX
          // ====================================================
          ready: status?.ready ?? false,
          online: status?.online ?? false,
          available: status?.available ?? false,
          readers: status?.readers ?? 0,

          // Status Dashboard
          status: status?.ready ? "ONLINE" : "OFFLINE",

          // ====================================================
          // PROJECT
          // ====================================================
          project_name: project.display_name,
          project_status: project.status_project_current,
          nilai_kontrak: project.nilai_kontrak_current,
          latitude: project.latitude,
          longitude: project.longitude,
          link_drone: project.link_drone,

          // ====================================================
          // URL
          // ====================================================
          streamUrl: buildStreamUrl(cam),
          snapshotUrl: buildSnapshotUrl(cam),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [masterProject, cctvMaster, statusMap]);

  // ==========================================================
  // KPI
  // ==========================================================
  const totalCamera = cctvData.length;

  // Kamera dianggap online jika MediaMTX berhasil connect
  const onlineCamera = cctvData.filter((x) => x.ready).length;

  const offlineCamera = cctvData.filter((x) => !x.ready).length;

  const totalProject = new Set(cctvData.map((x) => x.id_project)).size;

  return {
    cctvData,
    totalCamera,
    onlineCamera,
    offlineCamera,
    totalProject,
  };
}

// ==========================================================
// URL BUILDERS
// ==========================================================

function buildStreamUrl(cam) {
  const server = getCCTVServer(cam.stream_server);

  console.log("====================================");
  console.log("BUILD STREAM URL");
  console.log("Camera        :", cam.camera_name);
  console.log("Project ID    :", cam.id_project);
  console.log("====================================");

  return `${server.hls}/${cam.stream_path}/index.m3u8`;
}

function buildSnapshotUrl(cam) {
  const server = getCCTVServer(cam.stream_server);

  const url = `${server.snapshot}/${cam.stream_path}.jpg`;

  return url;
}
