import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Database, Loader2, AlertTriangle, MapPinOff } from "lucide-react";

export default function MasterProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan daftar proyek yang bermasalah (anomali)
  const [warnings, setWarnings] = useState([]);

  // Default filter dibuka ke "On Going"
  const [activeFilter, setActiveFilter] = useState("On Going");
  const [statusCounts, setStatusCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // TAMBAHAN: Tarik juga latitude dan longitude untuk dicek
      const { data, error } = await supabase
        .from("master_project")
        .select(
          "id_project, project_name, nonjo_joi, status_proyek, latitude, longitude",
        )
        .order("id_project", { ascending: true });

      if (error) throw error;

      if (data) {
        setProjects(data);

        // Hitung akumulasi jumlah proyek per status
        const counts = data.reduce((acc, curr) => {
          const status = curr.status_proyek || "Tanpa Status";
          acc[status] = (acc[status] || 0) + 1;
          acc["Semua"] = (acc["Semua"] || 0) + 1; // Total keseluruhan
          return acc;
        }, {});

        setStatusCounts(counts);

        // Cek anomali koordinat KHUSUS untuk proyek On Going
        const anomalyWarnings = [];
        data.forEach((item) => {
          const status = String(item.status_proyek || "")
            .toUpperCase()
            .trim();

          if (status.includes("ON GOING")) {
            const lat = parseFloat(
              String(item.latitude || "0")
                .replace(",", ".")
                .trim(),
            );
            const lng = parseFloat(
              String(item.longitude || "0")
                .replace(",", ".")
                .trim(),
            );

            // Kondisi Koordinat Error / Kosong / Terbalik
            if (
              !lat ||
              !lng ||
              isNaN(lat) ||
              isNaN(lng) ||
              (lat === 0 && lng === 0) ||
              lat < -90 ||
              lat > 90 ||
              lng < -180 ||
              lng > 180
            ) {
              anomalyWarnings.push(item);
            }
          }
        });

        // Simpan data peringatan ke dalam state
        setWarnings(anomalyWarnings);

        // Jika ternyata tidak ada status "On Going" di database, fallback ke "Semua"
        if (!counts["On Going"] && data.length > 0) {
          setActiveFilter("Semua");
        }
      }
    } catch (error) {
      console.error("Gagal menarik data master_project:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tentukan proyek yang tampil berdasarkan filter yang aktif
  const filteredProjects = projects.filter((p) => {
    const statusMatch =
      activeFilter === "Semua"
        ? true
        : (p.status_proyek || "Tanpa Status") === activeFilter;

    const searchMatch =
      !searchTerm ||
      String(p.project_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(p.id_project || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Daftar urutan tombol filter (Bisa disesuaikan urutannya)
  const availableStatuses = [
    "Semua",
    "On Going",
    ...Object.keys(statusCounts).filter(
      (status) => status !== "Semua" && status !== "On Going",
    ),
  ];

  // Helper untuk warna badge status
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("on going"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s.includes("maintenance"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s.includes("selesai") || s.includes("closed"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col mt-6">
      {/* HEADER KOMPONEN */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Database size={20} className="text-[#000075]" />
          Monitoring Master Project
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Daftar seluruh proyek berdasarkan status operasional (Database:
          master_project)
        </p>
      </div>

      {/* ============================================================== */}
      {/* PANEL PERINGATAN (WARNING) - HANYA MUNCUL JIKA ADA ANOMALI */}
      {/* ============================================================== */}
      {warnings.length > 0 && (
        <div className="mb-6 border border-amber-200 rounded-xl overflow-hidden bg-amber-50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-amber-100/70 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertTriangle
                size={18}
                className="text-amber-600 animate-pulse"
              />
              Peringatan Anomali Data ({warnings.length} Proyek On Going)
            </div>
            <span className="text-xs text-amber-700 bg-amber-200/50 px-2 py-1 rounded font-medium">
              Aksi Diperlukan
            </span>
          </div>

          <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
            <p className="text-xs text-amber-700 mb-3 font-medium">
              Proyek-proyek di bawah ini tidak akan tampil di "Sebaran Geografis
              (Peta)" karena titik koordinatnya kosong atau formatnya salah.
              Silakan perbaiki di Supabase.
            </p>
            <ul className="space-y-2">
              {warnings.map((w, idx) => (
                <li
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm flex justify-between items-center gap-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      {w.project_name || "Nama Proyek Kosong"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                      ID: {w.id_project || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] bg-red-50 text-red-600 px-2.5 py-1.5 rounded border border-red-100 font-mono shrink-0">
                    <MapPinOff size={12} />
                    Lat: {w.latitude || "NULL"} | Lng: {w.longitude || "NULL"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari ID Project atau Nama Project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000075]"
        />
      </div>

      {/* AREA TOMBOL FILTER (DRILLDOWN) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {loading ? (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> Menghitung status...
          </div>
        ) : (
          availableStatuses.map((status) => {
            if (!statusCounts[status]) return null; // Sembunyikan tombol jika count 0
            const isActive = activeFilter === status;

            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#000075] border-[#000075] text-white shadow-md"
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* TABEL DATA */}
      <div className="flex-1 overflow-x-auto border border-slate-200 rounded-xl max-h-[400px] scrollbar-thin">
        <table className="w-full text-left text-[12px] border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
            <tr>
              <th className="p-3 font-bold text-slate-700 border-r border-slate-200 w-16 text-center">
                No
              </th>
              <th className="p-3 font-bold text-slate-700 border-r border-slate-200 w-[120px]">
                ID Proyek
              </th>
              <th className="p-3 font-bold text-slate-700 border-r border-slate-200 min-w-[250px]">
                Nama Proyek
              </th>
              <th className="p-3 font-bold text-slate-700 border-r border-slate-200 w-[150px] text-center">
                Non JO / JOI
              </th>
              <th className="p-3 font-bold text-slate-700 w-[150px] text-center">
                Status Proyek
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2
                      size={24}
                      className="animate-spin text-indigo-500"
                    />
                    <span>Memuat data master project...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500 italic"
                >
                  Tidak ada proyek dengan status "{activeFilter}"
                </td>
              </tr>
            ) : (
              filteredProjects.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 text-center text-slate-500 border-r border-slate-100">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-mono text-slate-600 border-r border-slate-100">
                    {item.id_project || "-"}
                  </td>
                  <td className="p-3 font-bold text-slate-800 whitespace-normal break-words border-r border-slate-100">
                    {item.project_name || "-"}
                  </td>
                  <td className="p-3 text-center font-medium text-slate-600 border-r border-slate-100">
                    <span className="bg-slate-100 px-2 py-1 rounded text-[11px] border border-slate-200">
                      {item.nonjo_joi || "-"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        item.status_proyek,
                      )}`}
                    >
                      {item.status_proyek || "Tanpa Status"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
