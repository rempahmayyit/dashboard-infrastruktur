import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Database,
  RefreshCw,
  Download,
  Search,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  Activity,
  Wallet,
  Briefcase
} from "lucide-react";

import MasterProjectModal from "./MasterProjectModal";
import AddProjectModal from "./AddProjectModal";

export default function MasterProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // State untuk Filter Status
  const [filterStatus, setFilterStatus] = useState("Semua");

  // STATE BARU: Untuk navigasi tab (Sub-heading)
  const [activeTab, setActiveTab] = useState("MASTER");

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("master_project")
      .select("*")
      .order("id_project");
      
    if (error) {
      console.error("LOAD ERROR:", error);
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  };

  const deleteProject = async (id_project) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus project ${id_project}?`,
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("master_project")
      .delete()
      .eq("id_project", id_project);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Project berhasil dihapus");
    loadProjects();
  };

  const statusCounts = useMemo(() => {
    const counts = { Semua: projects.length };
    
    projects.forEach((p) => {
      const status = p.status_proyek?.trim() || "Tanpa Status";
      counts[status] = (counts[status] || 0) + 1;
    });

    const statusArray = Object.entries(counts)
      .filter(([key]) => key !== "Semua")
      .sort((a, b) => b[1] - a[1]);

    return [["Semua", counts["Semua"]], ...statusArray];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        item.project_name?.toLowerCase().includes(keyword) ||
        item.short_project_name?.toLowerCase().includes(keyword) ||
        item.id_project?.toString().includes(keyword) ||
        item.lokasi_provinsi?.toLowerCase().includes(keyword) ||
        item.kepala_proyek_current?.toLowerCase().includes(keyword);

      if (!matchSearch) return false;

      const itemStatus = item.status_proyek?.trim() || "Tanpa Status";
      if (filterStatus !== "Semua" && itemStatus !== filterStatus) return false;

      return true;
    });
  }, [projects, search, filterStatus]);

  const exportExcel = () => {
    const dataExport = filteredProjects.map((item) => ({
      ID_Project: item.id_project,
      Project_Name: item.project_name,
      Short_Name: item.short_project_name,
      Tipe_Proyek: item.tipe_proyek,
      Jenis_Proyek: item.jenis_proyek,
      Status: item.status_proyek,
      Jenis_JO: item.nonjo_joi,
      Nilai_Kontrak: item.nk_current,
      BK_MAPP: item.bk_mapp_kumulatif_current,
      Provinsi: item.lokasi_provinsi,
      Owner: item.owner,
      Kepala_Proyek: item.kepala_proyek_current,
      Kadiv: item.kadiv,
      Wakadiv: item.wakadiv,
      Kepala_Departemen: item.kepala_departemen,
      Start_Date: item.start_date,
      End_Date: item.end_date_current,
      Latitude: item.latitude,
      Longitude: item.longitude,
      Link_Drone: item.link_drone,
      CCTV_Tersedia: item.cctv_available ? "Ya" : "Tidak",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Master Project");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Master_Project.xlsx");
  };

  const formatMiliar = (value) => {
    const num = Number(value || 0);
    return "Rp " + (num / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M";
  };

  // Daftar Menu Sub-heading
  const navigationTabs = [
    { id: "MASTER", label: "MASTER PROJECT", icon: Database },
    { id: "MARKETING", label: "MARKETING", icon: TrendingUp },
    { id: "PENGENDALIAN", label: "PENGENDALIAN", icon: Activity },
    { id: "KEUANGAN", label: "KEUANGAN", icon: Wallet },
    { id: "LAINNYA", label: "DATA LAINNYA", icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER UTAMA (Bisa disesuaikan jika sudah ada di layout global) */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Backend</h1>
        <p className="text-slate-500">Semua Data Pendukung Dashboard</p>
      </div>

      {/* SUB-HEADING / TABS NAVIGATION */}
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "text-[#000075] border-b-[3px] border-[#000075]" // Style saat Aktif
                : "text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent" // Style saat Inaktif
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER KONTEN BERDASARKAN TAB YANG AKTIF */}
      
      {/* ----------------------------------------------------- */}
      {/* TAB: MASTER PROJECT (Konten Utama Anda Saat Ini)        */}
      {/* ----------------------------------------------------- */}
      {activeTab === "MASTER" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">Total Project</p>
              <h2 className="text-3xl font-bold text-[#000075] mt-1">{projects.length}</h2>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">Project JOI</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-1">
                {projects.filter((p) => p.nonjo_joi === "JOI").length}
              </h2>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">Project Non JO</p>
              <h2 className="text-3xl font-bold text-orange-600 mt-1">
                {projects.filter((p) => p.nonjo_joi === "Non JO").length}
              </h2>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">Total Nilai Kontrak</p>
              <h2 className="text-xl font-bold text-red-600 mt-2">
                {(projects.reduce((a, b) => a + Number(b.nk_current || 0), 0) / 1000000000000).toFixed(1)} T
              </h2>
            </div>
          </div>

          {/* MONITORING & FILTER PANEL */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <Database size={24} className="text-[#000075]" />
                  <h2 className="text-xl font-bold text-slate-900">Monitoring Master Project</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Daftar seluruh proyek berdasarkan status operasional (Database: master_project)
                </p>
              </div>

              <div className="flex gap-2">
                 <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#000075] text-white rounded-xl hover:bg-blue-900 transition-colors text-sm font-medium"
                >
                  <Plus size={16} /> Tambah
                </button>
                <button
                  onClick={loadProjects}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  <RefreshCw size={16} /> Refresh
                </button>
                <button
                  onClick={exportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5">
              <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID Project, Nama Project, atau Lokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#000075] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {statusCounts.map(([status, count]) => {
                const isActive = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#000075] border-[#000075] text-white shadow-md"
                        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {status}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-100 z-10 whitespace-nowrap">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left min-w-[200px]">Nama Project</th>
                    <th className="p-4 text-left">Short Name</th>
                    <th className="p-4 text-left">Provinsi</th>
                    <th className="p-4 text-left">Kepala Proyek</th>
                    <th className="p-4 text-right min-w-[120px]">Nilai Kontrak</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">JO</th>
                    <th className="p-4 text-center sticky right-0 bg-slate-100">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-500">Loading data...</td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-500">Tidak ada project ditemukan.</td>
                    </tr>
                  ) : (
                    filteredProjects.map((item) => (
                      <tr key={item.id_project} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-medium bg-white">{item.id_project}</td>
                        <td className="p-4">{item.project_name}</td>
                        <td className="p-4">{item.short_project_name}</td>
                        <td className="p-4">{item.lokasi_provinsi}</td>
                        <td className="p-4">{item.kepala_proyek_current}</td>
                        <td className="p-4 text-right">{formatMiliar(item.nk_current)}</td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {item.status_proyek || "Tanpa Status"}
                          </span>
                        </td>
                        <td className="p-4 text-center">{item.nonjo_joi}</td>
                        <td className="p-4 sticky right-0 bg-white border-l shadow-sm">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedProject(item)}
                              className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => deleteProject(item.id_project)}
                              className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB: MARKETING (Contoh Tempat untuk Tabel Berikutnya)   */}
      {/* ----------------------------------------------------- */}
      {activeTab === "MARKETING" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Data Marketing</h2>
          <p className="text-slate-500 mt-2">Tabel dan analitik marketing akan ditampilkan di sini.</p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB: PENGENDALIAN (Contoh Tempat untuk Tabel Berikutnya)*/}
      {/* ----------------------------------------------------- */}
      {activeTab === "PENGENDALIAN" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <Activity size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Data Pengendalian</h2>
          <p className="text-slate-500 mt-2">Tabel monitoring pengendalian akan ditampilkan di sini.</p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB: KEUANGAN (Contoh Tempat untuk Tabel Berikutnya)    */}
      {/* ----------------------------------------------------- */}
      {activeTab === "KEUANGAN" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <Wallet size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Data Keuangan</h2>
          <p className="text-slate-500 mt-2">Tabel arus kas dan analitik keuangan akan ditampilkan di sini.</p>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* TAB: LAINNYA                                          */}
      {/* ----------------------------------------------------- */}
      {activeTab === "LAINNYA" && (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center animate-in fade-in duration-300">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Data Lainnya</h2>
          <p className="text-slate-500 mt-2">Tabel pendukung lainnya akan ditampilkan di sini.</p>
        </div>
      )}

      {/* MODALS */}
      {selectedProject && (
        <MasterProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onSaved={loadProjects} />
      )}

      {showAddModal && (
        <AddProjectModal onClose={() => setShowAddModal(false)} onSaved={loadProjects} />
      )}
    </div>
  );
}