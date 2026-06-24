import React, { useState, useEffect } from "react";
import { useFilter } from "./context/FilterContext";
import { getDisplayName } from "./utils/projectName";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Video,
  X,
  MapPin,
  AlertTriangle,
  PlayCircle,
  Maximize2,
  Search,
  Building2,
  Activity,
  Wallet,
  ZoomIn,
  ZoomOut,
  CalendarDays,
  Target,
} from "lucide-react";

import {
  getSisaHari,
  getSisaProgress,
  getTargetHarian,
} from "./utils/projectCalculations";

const geoUrl = "/indonesia.json";

// --- FORMATTER ---
const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const num = Number(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatPercent = (val) => {
  return Number(val || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatMiliar = (val) => {
  const num = safeParseNumber(val);
  return (
    "Rp " +
    (num / 1_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    " M"
  );
};

const formatAngkaM = (value) => {
  const num = Number(value || 0);

  if (num === 0) return "-";

  return (num / 1000000000).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ProjectMap() {
  const [projectData, setProjectData] = useState([]);
  const { excelData, globalFilter } = useFilter();

  const piutangDetailData = excelData?.vw_piutang_detail || [];
  const piutangAgingData = excelData?.vw_piutang_aging || [];

  if (piutangAgingData.length > 0) {
    console.log("AGING SAMPLE =", piutangAgingData[0]);
  }

  if (piutangDetailData.length > 0) {
    console.log("DETAIL SAMPLE =", piutangDetailData[0]);
  }

  const masterData = excelData?.db_master_data || [];
  const kendalaData = excelData?.db_kendala || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // State Konten
  const [activeProject, setActiveProject] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCCTV, setActiveCCTV] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const sisaProgress = Math.max(0, 100 - Number(activeProject?.ri || 0));

  // State Peta Interaktif
  const [position, setPosition] = useState({ coordinates: [118, -2], zoom: 1 });

  const fetchLokasi = async () => {
    try {
      const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        Mei: 5,
        Jun: 6,
        Jul: 7,
        Agu: 8,
        Sep: 9,
        Okt: 10,
        Nov: 11,
        Des: 12,
      };

      const selectedMonthNumber = monthMap[globalFilter.bulan] || 12;
      const selectedYear = Number(globalFilter.tahun);

      const piutangDetailData = excelData?.vw_piutang_detail || [];

      console.log("AGING DATA =", piutangAgingData.length);
      console.log("DETAIL DATA =", piutangDetailData.length);

      const formatted = (masterData || [])
        .map((item) => {
          const rawStatus = String(
            item?.status_proyek || item?.status_project_current || "",
          )
            .toUpperCase()
            .trim();
          const projectId =
            item?.id_project || item?.id_proyect || item?.id_proyek;

          console.log("PROJECT ID =", projectId);

          console.log(
            "AGING MATCH =",
            piutangAgingData.filter(
              (row) => String(row.id_project) === String(projectId),
            ).length,
          );

          console.log(
            "DETAIL MATCH =",
            piutangDetailData.filter(
              (row) => String(row.id_project) === String(projectId),
            ).length,
          );

          // ==========================================
          // 1. CARI DATA REALISASI DI BULAN TERPILIH
          // ==========================================
          const currentRealisasi =
            (excelData?.db_realisasi || [])
              .filter(
                (r) =>
                  String(r.id_project) === String(projectId) &&
                  Number(r.tahun) === selectedYear &&
                  Number(r.bulan_index || 0) <= selectedMonthNumber,
              )
              .sort(
                (a, b) => Number(b.bulan_index) - Number(a.bulan_index),
              )[0] || {};

          const currentRkap =
            (excelData?.db_rkap_awal || [])
              .filter(
                (r) =>
                  String(r.id_project) === String(projectId) &&
                  Number(r.tahun) === selectedYear &&
                  Number(r.bulan_index || 0) <= selectedMonthNumber,
              )
              .sort(
                (a, b) => Number(b.bulan_index) - Number(a.bulan_index),
              )[0] || {};

          const latestKendala = kendalaData
            .filter((k) => String(k.id_project) === String(projectId))
            .sort((a, b) => new Date(b.periode) - new Date(a.periode))[0];

          // ==========================================
          // 2. PROGRESS FISIK
          // ==========================================
          const ri = safeParseNumber(
            currentRealisasi?.prog_real ||
              currentRealisasi?.progres_realisasi ||
              0,
          );
          const ra = safeParseNumber(
            currentRealisasi?.progres_scurve ||
              currentRkap?.progres_scurve ||
              0,
          );
          const isBehind = ri - ra < 0;

          // ==========================================
          // 3. PERBAIKAN: MAPP BK / PU (Ditarik dari Master Data!)
          // ==========================================
          // Karena target MAPP ada di master data, kita panggil dari 'item'
          const bkMappKum = safeParseNumber(item?.bk_mapp_kumulatif_current);
          const puMappKum = safeParseNumber(item?.pu_mapp_kumulatif_current);

          // Realisasi tetap mengikuti bulan yang difilter dari tabel db_realisasi
          const bkRealKum = safeParseNumber(
            currentRealisasi?.bk_real_kumulatif ||
              currentRealisasi?.bk_real_kum ||
              currentRealisasi?.bk_real_parsial,
          );
          const puRealKum = safeParseNumber(
            currentRealisasi?.pu_real_kumulatif ||
              currentRealisasi?.pu_real_kum ||
              currentRealisasi?.pu_real_parsial,
          );

          // RUMUS FINAL
          const bkRencana = puMappKum > 0 ? (bkMappKum / puMappKum) * 100 : 0;
          const bkRealisasi = puRealKum > 0 ? (bkRealKum / puRealKum) * 100 : 0;
          const bkDeviasi = bkRencana - bkRealisasi;

          // ==========================================

          const nk = safeParseNumber(
            item?.nk_current || item?.nilai_kontrak || 0,
          );
          const isOnGoing =
            rawStatus.includes("ON GOING") ||
            (rawStatus.includes("SAP NOT UPDATE") && ri < 99.99);
          if (!isOnGoing) return null;

          const longitude = parseFloat(
            String(item?.longitude || "0")
              .replace(",", ".")
              .trim(),
          );
          const latitude = parseFloat(
            String(item?.latitude || "0")
              .replace(",", ".")
              .trim(),
          );

          if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude))
            return null;

          // ==========================================
          // DATA PIUTANG DETAIL
          // ==========================================

          const projectPiutangRows = piutangDetailData.filter(
            (row) => String(row.id_project).trim() === String(projectId).trim(),
          );

          // ==========================================
          // DATA PIUTANG AGING
          // ==========================================

          const projectAgingRows = piutangAgingData.filter(
            (row) => String(row.id_project).trim() === String(projectId).trim(),
          );

          // DEBUG SEMENTARA
          if (String(projectId) === "1425010") {
            console.log("PROJECT =", projectId);
            console.log("DETAIL ROWS =", projectPiutangRows.length);
            console.log("AGING ROWS =", projectAgingRows.length);
          }

          // ==========================================
          // SUMMARY PIUTANG
          // ==========================================

          const sumKategori = (kategori) =>
            projectPiutangRows
              .filter(
                (row) =>
                  String(row.kategori_piutang || "")
                    .trim()
                    .toUpperCase() === kategori,
              )
              .reduce((sum, row) => sum + Number(row.value || 0), 0);

          const tagihanBruto = sumKategori("BRUTO");
          const piutangTermin = sumKategori("TERMIN");
          const pdpk = sumKategori("RETENSI");

          // ==========================================
          // AGING
          // ==========================================

          const getAgingValue = (kategori, bucket) =>
            projectAgingRows
              .filter(
                (row) =>
                  String(row.kategori_piutang || "")
                    .trim()
                    .toUpperCase() === kategori &&
                  String(row.aging_bucket || "").trim() === bucket,
              )
              .reduce((sum, row) => sum + Number(row.value || 0), 0);

          // sementara tetap gunakan data JO lama
          const isJO = Math.random() > 0.5 ? "JO" : "Non JO";
          const porsiWaskita =
            isJO === "JO" ? Math.floor(Math.random() * 40) + 30 : 100;

          const nkPorsi = (nk * porsiWaskita) / 100;

          const projectName =
            getDisplayName(item) ||
            item?.nama_proyek_current ||
            item?.nama_paket_current ||
            "";

          const sisaHari = getSisaHari(item);

          const sisaProgress = getSisaProgress(ri);

          const targetHarian = getTargetHarian(sisaProgress, sisaHari);

          return {
            id: projectId,

            short_project_name: item?.short_project_name || "",

            project_name:
              item?.project_name ||
              item?.nama_proyek_current ||
              item?.nama_paket_current ||
              "",

            name:
              getDisplayName(item) ||
              item?.short_project_name ||
              item?.nama_proyek_current ||
              item?.nama_paket_current ||
              "Unknown Project",

            owner: item?.owner || item?.pemilik_proyek || "Kementerian PUPR",

            start_date: item?.start_date || null,
            end_date: item?.end_date || null,
            end_date_current: item?.end_date_current || null,
            kepala_proyek_current: item?.kepala_proyek_current || null,

            sisa_hari: sisaHari,
            sisa_progress: sisaProgress,
            target_harian: targetHarian.value,
            target_harian_status: targetHarian.status,

            divisi: item?.divisi || "Infrastruktur I",
            is_jo: isJO,
            porsi: porsiWaskita,

            startDate: item?.start_date_current || null,
            endDate: item?.end_date_current || null,

            longitude,
            latitude,

            status: isBehind ? "Critical" : "On Track",
            gap: isBehind ? "Behind Schedule" : "Normal",

            link_drone: item?.link_drone || null,
            cctv_channel1: item?.cctv_channel1 || null,
            cctv_channel2: item?.cctv_channel2 || null,

            nk,
            nk_porsi: nkPorsi,

            tagihan_bruto: tagihanBruto,
            piutang_termin: piutangTermin,
            pdpk,

            ra,
            ri,
            deviasi: ri - ra,

            bk_rencana: bkRencana,
            bk_realisasi: bkRealisasi,
            bk_deviasi: bkDeviasi,

            kendalaProgres: latestKendala?.kendala_progres || "",

            aging_bruto: {
              "0-30": getAgingValue("BRUTO", "0-30"),
              "30-60": getAgingValue("BRUTO", "30-60"),
              "60-180": getAgingValue("BRUTO", "60-180"),
              "180-360": getAgingValue("BRUTO", "180-360"),
              ">360": getAgingValue("BRUTO", ">360"),
            },

            aging_termin: {
              "0-30": getAgingValue("TERMIN", "0-30"),
              "30-60": getAgingValue("TERMIN", "30-60"),
              "60-180": getAgingValue("TERMIN", "60-180"),
              "180-360": getAgingValue("TERMIN", "180-360"),
              ">360": getAgingValue("TERMIN", ">360"),
            },

            aging_retensi: {
              "0-30": getAgingValue("RETENSI", "0-30"),
              "30-60": getAgingValue("RETENSI", "30-60"),
              "60-180": getAgingValue("RETENSI", "60-180"),
              "180-360": getAgingValue("RETENSI", "180-360"),
              ">360": getAgingValue("RETENSI", ">360"),
            },
          };
        })
        .filter(Boolean);

      setProjectData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setProjectData([]);
    }
  };

  // 1. TRIGGER UPDATE KETIKA FILTER GLOBAL BERUBAH
  useEffect(() => {
    if (masterData.length > 0) fetchLokasi();
  }, [masterData, excelData, globalFilter]);

  console.log(
    "PIUTANG AGING DALAM FETCH =",
    excelData?.vw_piutang_aging?.length,
  );

  console.log(
    "PIUTANG DETAIL DALAM FETCH =",
    excelData?.vw_piutang_detail?.length,
  );

  // 2. TRIGGER UPDATE MODAL AKTIF DI KIRI KETIKA BULAN DIGANTI
  useEffect(() => {
    if (activeProject && projectData.length > 0) {
      const updatedProject = projectData.find(
        (p) => String(p.id) === String(activeProject.id),
      );
      if (updatedProject) setActiveProject(updatedProject);
    }
  }, [projectData]);

  // Tambahkan efek ini agar saat filter berubah, proyek yang sedang
  // tampil di layar sebelah kiri (activeProject) otomatis me-refresh angkanya
  useEffect(() => {
    if (activeProject && projectData.length > 0) {
      const updatedProject = projectData.find(
        (p) => String(p.id) === String(activeProject.id),
      );
      if (updatedProject) {
        setActiveProject(updatedProject);
      }
    }
  }, [projectData]);

  // Efek Peta: Auto center ke koordinat proyek pilihan
  useEffect(() => {
    if (activeProject) {
      setPosition({
        coordinates: [activeProject.longitude, activeProject.latitude],
        zoom: 7,
      });
    } else {
      setPosition({ coordinates: [118, -2], zoom: 1 });
    }
  }, [activeProject]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    const keyword = value.toLowerCase().trim();

    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const filtered = projectData
      .filter((p) => {
        return (
          String(p.id || "")
            .toLowerCase()
            .includes(keyword) ||
          String(p.short_project_name || "")
            .toLowerCase()
            .includes(keyword) ||
          String(p.project_name || "")
            .toLowerCase()
            .includes(keyword) ||
          String(p.name || "")
            .toLowerCase()
            .includes(keyword)
        );
      })
      .slice(0, 15);

    setSuggestions(filtered);
  };

  const handleZoomIn = () => {
    if (position.zoom >= 20) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };
  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };
  const handleMoveEnd = (newPosition) => setPosition(newPosition);

  const noFinancialData =
    !activeProject?.tagihan_bruto &&
    !activeProject?.piutang_termin &&
    !activeProject?.pdpk &&
    Object.values(activeProject?.aging_bruto || {}).every((v) => !v) &&
    Object.values(activeProject?.aging_termin || {}).every((v) => !v) &&
    Object.values(activeProject?.aging_retensi || {}).every((v) => !v);

  return (
    <div className="flex flex-col h-full font-sans overflow-hidden bg-slate-50 p-1">
      {/* ====================================================================== */}
      {/* KONDISI 1: BELUM ADA PROYEK YANG DIPILIH (Pencarian Center Elegan) */}
      {/* ====================================================================== */}
      {!activeProject ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 min-h-0">
          <div className="w-14 h-14 bg-[#000075]/5 rounded-2xl flex items-center justify-center text-[#000075] mb-4">
            <Search size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-1">
            Executive Summary Proyek
          </h2>
          <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">
            Silakan cari dan pilih proyek di bawah ini untuk memuat seluruh
            visualisasi data pengendalian dan pemetaan geografis.
          </p>

          {/* Kotak Pencarian Utama Tengah */}
          <div className="relative w-full max-w-md">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-inner focus-within:ring-2 focus-within:ring-[#000075]/20 focus-within:border-[#000075] transition-all">
              <Search size={18} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Ketik nama proyek..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[999] max-h-60 overflow-y-auto overflow-hidden">
                {suggestions.map((project) => (
                  <button
                    key={project.id}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors flex items-center justify-between group"
                    onClick={() => {
                      setSearchTerm("");
                      setSuggestions([]);
                      setActiveProject(project);
                    }}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800">
                        {project.short_project_name}
                      </div>

                      <div className="text-[10px] text-slate-500">
                        ID: {project.id}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate">
                        {project.project_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // ======================================================================
        // KONDISI 2: PROYEK TERPILIH (Dasbor Terkunci & Pencarian Masuk ke Header)
        // ======================================================================
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
          {/* KOLOM KRI: DATA PROFIL & EXECUTIVE SUMMARY */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            {/* ─── HEADER PROFIL + FITUR KOTAK PENCARIAN KECIL DI SINI ─── */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-[#000075] uppercase tracking-tight mb-0.5">
                  {activeProject.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    ID: {activeProject.id}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border ${activeProject.status === "Critical" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
                  >
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* SEARCH BOX KECIL MINIMALIS (Tidak Makan Tempat) */}
              <div className="relative w-full sm:w-60 shrink-0">
                <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#000075]/20 focus-within:border-[#000075] transition-all">
                  <Search size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari proyek lain..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSuggestions([]);
                      }}
                      className="text-slate-400 hover:text-slate-600 ml-1"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl z-[999] max-h-52 overflow-y-auto overflow-hidden">
                    {suggestions.map((project) => (
                      <button
                        key={project.id}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                        onClick={() => {
                          setSearchTerm("");
                          setSuggestions([]);
                          setActiveProject(project);
                        }}
                      >
                        <div className="font-bold text-xs text-slate-800">
                          {project.short_project_name || project.name}
                        </div>

                        <div className="text-[10px] text-slate-500">
                          ID: {project.id}
                        </div>

                        <div className="text-[10px] text-slate-400 truncate">
                          {project.project_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* BODY SUMMARY (Scrollable Internal) */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
              {/* TABEL PROFIL PROYEK */}
              <div className="flex gap-3">
                {/* PROFIL PROYEK - 2/3 */}
                <div className="w-3/4 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center gap-2 tracking-widest">
                    <Building2 size={12} /> Profil Proyek
                  </div>
                  <div className="grid grid-cols-1 text-[11px]">
                    {/* OWNER */}
                    <div className="flex border-b border-slate-200">
                      <div className="w-[18%] bg-slate-50 p-1 font-bold text-slate-600 border-r border-slate-200">
                        Owner
                      </div>
                      <div
                        className="w-3/4 p-1 font-semibold text-slate-800 bg-white"
                        title={activeProject.owner}
                      >
                        {activeProject.owner || "-"}
                      </div>
                    </div>

                    {/* NK */}
                    <div className="flex border-b border-slate-200">
                      <div className="w-[18%] bg-slate-50 p-1 font-bold text-slate-600 border-r border-slate-200">
                        NK
                      </div>
                      <div className="w-3/4 p-1 font-black text-blue-700 bg-white">
                        Rp{" "}
                        {Number(activeProject.nk || 0).toLocaleString("id-ID")}
                      </div>
                    </div>

                    {/* WAKTU PELAKSANAAN */}
                    <div className="flex border-b border-slate-200">
                      <div className="w-[18%] bg-slate-50 p-1 font-bold text-slate-600 border-r border-slate-200">
                        Waktu Pelaksanaan
                      </div>

                      <div className="w-3/4 bg-white">
                        <div className="flex border-b border-slate-100">
                          <div className="w-1/3 p-1 font-semibold text-slate-600">
                            Mulai
                          </div>
                          <div className="w-2/3 p-1 font-semibold text-slate-800">
                            {formatDate(activeProject.start_date)}
                          </div>
                        </div>

                        <div className="flex border-b border-slate-100">
                          <div className="w-1/3 p-1 font-semibold text-slate-600">
                            Selesai
                          </div>
                          <div className="w-2/3 p-1 font-semibold text-slate-800">
                            {formatDate(activeProject.end_date)}
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-1/3 p-1 font-semibold text-slate-600">
                            Addendum
                          </div>
                          <div className="w-2/3 p-1 font-semibold text-slate-800">
                            {formatDate(activeProject.end_date_current)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KAPRO */}
                    <div className="flex">
                      <div className="w-[18%] bg-slate-50 p-2 font-bold text-slate-600 border-r border-slate-200">
                        Kapro
                      </div>
                      <div className="w-3/4 p-2 font-semibold text-slate-800 bg-white">
                        {activeProject.kepala_proyek_current || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                {/* MONITORING TARGET */}
                <div className="w-1/3 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase tracking-widest">
                    Monitoring Target
                  </div>

                  <div className="flex flex-col h-full">
                    {/* TOP */}
                    <div className="grid grid-cols-2">
                      {/* SISA HARI */}
                      <div className="flex flex-col items-center justify-center border-r border-slate-200 p-1 bg-white">
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Sisa Hari
                        </div>

                        <div className="text-2xl font-black text-amber-600 leading-none mt-2">
                          {getSisaHari(activeProject)}
                        </div>

                        <div className="text-xs text-slate-400 mt-1">Hari</div>
                      </div>

                      {/* PROGRESS */}
                      <div className="flex flex-col items-center justify-center p-1 bg-white">
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          Sisa Progress
                        </div>

                        <div className="text-2xl font-black text-emerald-600 leading-none mt-2">
                          {formatPercent(sisaProgress)}
                        </div>

                        <div className="text-sm text-slate-400 mt-1">%</div>
                      </div>
                    </div>

                    {/* TARGET HARIAN */}
                    <div className="border-t border-slate-200 bg-white p-1 text-center flex flex-col items-center justify-center min-h-[110px]">
                      {" "}
                      <div className="text-xs uppercase font-bold text-slate-500">
                        Target Harian
                      </div>
                      {activeProject.target_harian_status === "SELESAI" ? (
                        <>
                          <div className="text-3xl font-black text-emerald-600 mt-2">
                            FINISH
                          </div>

                          <div className="text-sm text-emerald-600 mt-1">
                            Progress 100%
                          </div>
                        </>
                      ) : activeProject.target_harian_status === "OVERDUE" ? (
                        <>
                          <div className="text-3xl font-black text-red-600 mt-2">
                            OVERDUE
                          </div>

                          <div className="text-sm text-red-500 mt-1">
                            Lewat Target
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-black text-blue-600 mt-2">
                            {formatPercent(activeProject.target_harian)}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            % / Hari
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* WRAPPER BARU: flex untuk membuat jejer */}
              <div className="flex gap-4">
                {/* KIRI: Finansial Proyek (1/3) */}
                <div className="w-1/3 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center gap-2 tracking-widest border-b border-blue-800">
                    <Wallet size={12} /> Finansial Proyek
                  </div>

                  {noFinancialData ? (
                    <div className="h-[112px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-amber-600">
                          Data Belum Tersedia
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Periode belum closing / Cek periode sebelumnya
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white text-center">
                      <div className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                          Bruto
                        </div>
                        <div className="text-xs font-black text-slate-800">
                          {formatMiliar(activeProject.tagihan_bruto)}
                        </div>
                      </div>
                      <div className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                          Termin
                        </div>
                        <div className="text-xs font-black text-amber-600">
                          {formatMiliar(activeProject.piutang_termin)}
                        </div>
                      </div>
                      <div className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                          Retensi
                        </div>
                        <div className="text-xs font-black text-red-600">
                          {formatMiliar(activeProject.pdpk)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* KANAN: Umur Piutang (2/3) - Versi Compact/Hemat Baris */}
                <div className="w-full md:w-2/3 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  {/* Header digabung: Judul "Umur Piutang" dan Header Kolom dalam 1 baris */}
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-[#000075] text-white">
                        <th className="p-2 text-left font-bold tracking-widest uppercase">
                          Umur (Rp.M)
                        </th>
                        <th className="p-2 font-bold">0-30</th>
                        <th className="p-2 font-bold">30-60</th>
                        <th className="p-2 font-bold">60-180</th>
                        <th className="p-2 font-bold">180-360</th>
                        <th className="p-2 font-bold">&gt;360</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noFinancialData ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10">
                            <div className="font-bold text-amber-600">
                              Data Belum Tersedia
                            </div>

                            <div className="text-[10px] text-slate-500 mt-1">
                              Periode belum closing / Cek periode sebelumnya
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2 py-1 font-bold text-slate-700">
                              Bruto
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_bruto?.["0-30"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_bruto?.["30-60"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_bruto?.["60-180"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_bruto?.["180-360"] || 0,
                              )}
                            </td>

                            <td className="text-center font-bold text-red-600">
                              {formatAngkaM(
                                activeProject?.aging_bruto?.[">360"] || 0,
                              )}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2 py-1 font-bold text-slate-700">
                              Termin
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_termin?.["0-30"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_termin?.["30-60"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_termin?.["60-180"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_termin?.["180-360"] || 0,
                              )}
                            </td>

                            <td className="text-center font-bold text-red-600">
                              {formatAngkaM(
                                activeProject?.aging_termin?.[">360"] || 0,
                              )}
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50">
                            <td className="p-2 py-1 font-bold text-slate-700">
                              Retensi
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_retensi?.["0-30"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_retensi?.["30-60"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_retensi?.["60-180"] || 0,
                              )}
                            </td>

                            <td className="text-center">
                              {formatAngkaM(
                                activeProject?.aging_retensi?.["180-360"] || 0,
                              )}
                            </td>

                            <td className="text-center font-bold text-red-600">
                              {formatAngkaM(
                                activeProject?.aging_retensi?.[">360"] || 0,
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROGRESS FISIK, BK/PU & KENDALA */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* KOTAK 1: PROGRESS FISIK (Porsi 1/4) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center justify-between tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Activity size={12} /> Progres
                    </span>
                    <span
                      className={`px-1 py-0.5 rounded bg-white font-black text-[10px] ${activeProject.deviasi < 0 ? "text-red-600" : "text-emerald-600"}`}
                    >
                      Dev: {activeProject.deviasi > 0 ? "+" : ""}
                      {activeProject.deviasi.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-2 bg-white flex-1 space-y-2 flex flex-col justify-center">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                        <span>Rencana</span>
                        <span>{activeProject.ra.toFixed(2)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-slate-400"
                          style={{
                            width: `${Math.min(activeProject.ra, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                        <span>Realisasi</span>
                        <span
                          className={
                            activeProject.deviasi < 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }
                        >
                          {activeProject.ri.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full transition-all duration-1000 ${activeProject.deviasi < 0 ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{
                            width: `${Math.min(activeProject.ri, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* HEADER */}
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center justify-between tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Wallet size={12} />
                      BK/PU
                    </span>

                    <span
                      className={`px-1 py-0.5 rounded bg-white font-black text-[10px]
      ${
        Number(activeProject.bk_deviasi) > 0
          ? "text-red-600"
          : "text-emerald-600"
      }`}
                    >
                      DEV : {Number(activeProject.bk_deviasi) > 0 ? "+" : ""}
                      {formatPercent(activeProject.bk_deviasi)}%
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="p-3 h-[92px]">
                    <div className="grid grid-cols-2 gap-2 h-full">
                      {/* MAPP */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          MAPP
                        </div>

                        <div className="text-[18px] font-black text-slate-700 leading-none mt-1">
                          {formatPercent(activeProject.bk_rencana)}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">%</div>
                      </div>

                      {/* REALISASI */}
                      <div
                        className={`rounded-lg border flex flex-col items-center justify-center
        ${
          Number(activeProject.bk_deviasi) > 0
            ? "bg-red-50 border-red-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
                      >
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          REAL
                        </div>

                        <div
                          className={`text-[18px] font-black leading-none mt-1
          ${
            Number(activeProject.bk_deviasi) > 0
              ? "text-red-600"
              : "text-emerald-600"
          }`}
                        >
                          {formatPercent(activeProject.bk_realisasi)}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KOTAK 3: KENDALA UTAMA (Porsi 2/4 alias setengah layar, tidak berubah posisinya) */}
                <div className="md:col-span-2 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center justify-between tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={12} /> Kendala Utama
                    </span>
                    <button
                      onClick={() =>
                        setDetailModal({
                          title: "KENDALA UTAMA PROYEK",
                          content: activeProject.kendalaProgres,
                        })
                      }
                      className="text-white hover:text-blue-200"
                    >
                      <Maximize2 size={12} />
                    </button>
                  </div>
                  <div className="p-3 bg-white flex-1 flex flex-col justify-center">
                    <p className="text-[12px] leading-relaxed font-medium text-slate-700 line-clamp-3">
                      {activeProject.kendalaProgres ||
                        "Tidak ada catatan kendala utama yang signifikan saat ini."}
                    </p>
                  </div>
                </div>
              </div>
              {/* END PROGRESS FISIK, BK/PU & KENDALA */}
            </div>
          </div>{" "}
          {/* <-- TUTUP lg:col-span-2 */}
          {/* KOLOM KANAN: PETA INTERAKTIF & AKSES LIVE CCTV */}
          <div className="lg:col-span-1 flex flex-col h-full gap-4">
            {/* BOX PETA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-[280px]">
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
                      coordinates={[
                        activeProject.longitude,
                        activeProject.latitude,
                      ]}
                    >
                      <g transform="translate(-7, -14) scale(0.5)">
                        <circle
                          cx="10"
                          cy="20"
                          r="6"
                          fill="#DC2626"
                          opacity="0.3"
                        >
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

            {/* BOX VIDEO DRONE & CCTV */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={
                    !activeProject.link_drone ||
                    activeProject.link_drone === "-"
                  }
                  onClick={() => setActiveVideo(activeProject)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    !activeProject.link_drone ||
                    activeProject.link_drone === "-"
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-[#000075] border-[#000075] text-white hover:bg-blue-900"
                  }`}
                >
                  <PlayCircle size={14} /> DRONE
                </button>
                <button
                  disabled={
                    !activeProject.cctv_channel1 && !activeProject.cctv_channel2
                  }
                  onClick={() => setActiveCCTV(activeProject)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    !activeProject.cctv_channel1 && !activeProject.cctv_channel2
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Video size={14} /> CCTV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL POPUP (KENDALA TEXT) */}
      {/* ========================================= */}
      {detailModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#000075] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-(18px) tracking-widest">
                {detailModal.title}
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-6 max-h-[50vh] overflow-y-auto text-(16px) leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">
              {detailModal.content}
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL DOKUMENTASI (DRONE & CCTV) */}
      {/* ========================================= */}
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
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200">
              <h3 className="font-black text-slate-800 text-xs uppercase">
                CCTV Monitoring
              </h3>
              <button
                onClick={() => setActiveCCTV(null)}
                className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-3 bg-slate-50">
              {activeCCTV.cctv_channel1 && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <div className="font-bold text-xs mb-1 text-[#000075]">
                    Kamera Utama
                  </div>
                  <div className="text-[11px] text-blue-600 break-all p-2 bg-blue-50 rounded-lg">
                    {activeCCTV.cctv_channel1}
                  </div>
                </div>
              )}
              {activeCCTV.cctv_channel2 && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <div className="font-bold text-xs mb-1 text-[#000075]">
                    Kamera PTZ
                  </div>
                  <div className="text-[11px] text-blue-600 break-all p-2 bg-blue-50 rounded-lg">
                    {activeCCTV.cctv_channel2}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
