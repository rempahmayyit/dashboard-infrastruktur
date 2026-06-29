// ==========================================================
// CCTV SERVER CONFIGURATION
// ==========================================================

export const CCTV_SERVERS = {
  LOCAL: {
    hls: "http://192.168.205.108:8888",
    api: "http://192.168.205.108:3000",
    snapshot: "http://192.168.205.108:3000/snapshot",
  },

  SERVER_KANTOR: {
    hls: "http://10.10.10.20:8888",
    api: "http://10.10.10.20:3000",
    snapshot: "http://10.10.10.20:3000/snapshot",
  },

  CLOUDFLARE: {
    hls: "https://cctv.domain.com",
    api: "https://api.waskitadivisiinfrastruktur.com",
    snapshot: "https://api.waskitadivisiinfrastruktur.com/snapshot",
  },
};

// ==========================================================
// GET SERVER URL
// ==========================================================

export function getCCTVServer(serverName = "LOCAL") {
  const key = String(serverName).toUpperCase();

  return CCTV_SERVERS[key] || CCTV_SERVERS.LOCAL;


  console.log("====================================");
  console.log("CCTV SERVER");
  console.log("Key       :", key);

  console.log("====================================");

  return server;
}
