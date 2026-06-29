import { useEffect, useState } from "react";

export default function useMediaMTXStatus() {
  const [statusMap, setStatusMap] = useState(new Map());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://192.168.205.108:3000/api/status");

        const json = await res.json();

        console.log("STATUS API");
        console.table(json);

        const map = new Map();

        Object.entries(json).forEach(([path, status]) => {
          map.set(path, status);
        });

        setStatusMap(map);
      } catch (err) {
        console.error("STATUS API ERROR");
        console.error(err);
      }
    }

    load();

    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  return statusMap;
}