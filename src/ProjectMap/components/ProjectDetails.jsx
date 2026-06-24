import React from "react";
import {
  Search,
  X,
  Building2,
  Activity,
  Wallet,
  AlertTriangle,
  Maximize2,
} from "lucide-react";
import {
  formatPercent,
  formatMiliar,
  formatAngkaM,
  formatDate,
} from "../utils/formatters";
import { getSisaHari } from "../../utils/projectCalculations";

export default function ProjectDetails({
  activeProject,
  searchTerm,
  handleSearchChange,
  suggestions,
  onSelectProject,
  clearSearch,
  setDetailModal,
}) {
  const sisaProgress = Math.max(0, 100 - Number(activeProject.ri || 0));

  const noFinancialData =
    !activeProject.tagihan_bruto &&
    !activeProject.piutang_termin &&
    !activeProject.pdpk &&
    Object.values(activeProject.aging_bruto || {}).every((v) => !v) &&
    Object.values(activeProject.aging_termin || {}).every((v) => !v) &&
    Object.values(activeProject.aging_retensi || {}).every((v) => !v);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* HEADER PROFIL & PENCARIAN KECIL */}
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
                onClick={clearSearch}
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
                    clearSearch();
                    onSelectProject(project);
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

      {/* BODY SUMMARY */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
        {/* ROW 1: PROFIL & TARGET */}
        <div className="flex gap-3">
          <div className="w-3/4 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center gap-2 tracking-widest">
              <Building2 size={12} /> Profil Proyek
            </div>
            <div className="grid grid-cols-1 text-[11px]">
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
              <div className="flex border-b border-slate-200">
                <div className="w-[18%] bg-slate-50 p-1 font-bold text-slate-600 border-r border-slate-200">
                  NK
                </div>
                <div className="w-3/4 p-1 font-black text-blue-700 bg-white">
                  Rp {Number(activeProject.nk || 0).toLocaleString("id-ID")}
                </div>
              </div>
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

          <div className="w-1/3 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase tracking-widest">
              Monitoring Target
            </div>
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-2">
                <div className="flex flex-col items-center justify-center border-r border-slate-200 p-1 bg-white">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Sisa Hari
                  </div>
                  <div className="text-2xl font-black text-amber-600 leading-none mt-2">
                    {getSisaHari(activeProject)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Hari</div>
                </div>
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
              <div className="border-t border-slate-200 bg-white p-1 text-center flex flex-col items-center justify-center min-h-[110px]">
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
                    <div className="text-xs text-slate-500 mt-1">% / Hari</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: FINANSIAL & AGING */}
        <div className="flex gap-4">
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
                    Periode belum closing / Cek periode sebelumnya / JOI
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white text-center">
                <div className="p-3">
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                    Bruto
                  </div>
                  <div className="text-xs font-black text-slate-800">
                    {formatMiliar(activeProject.tagihan_bruto)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                    Termin
                  </div>
                  <div className="text-xs font-black text-amber-600">
                    {formatMiliar(activeProject.piutang_termin)}
                  </div>
                </div>
                <div className="p-3">
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

          <div className="w-full md:w-2/3 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
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
                        Periode belum closing / Cek periode sebelumnya / JOI
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 py-1 font-bold text-slate-700">
                        Bruto
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_bruto?.["0-30"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_bruto?.["30-60"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_bruto?.["60-180"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_bruto?.["180-360"])}
                      </td>
                      <td className="text-center font-bold text-red-600">
                        {formatAngkaM(activeProject.aging_bruto?.[">360"])}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 py-1 font-bold text-slate-700">
                        Termin
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_termin?.["0-30"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_termin?.["30-60"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_termin?.["60-180"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_termin?.["180-360"])}
                      </td>
                      <td className="text-center font-bold text-red-600">
                        {formatAngkaM(activeProject.aging_termin?.[">360"])}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 py-1 font-bold text-slate-700">
                        Retensi
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_retensi?.["0-30"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_retensi?.["30-60"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_retensi?.["60-180"])}
                      </td>
                      <td className="text-center">
                        {formatAngkaM(activeProject.aging_retensi?.["180-360"])}
                      </td>
                      <td className="text-center font-bold text-red-600">
                        {formatAngkaM(activeProject.aging_retensi?.[">360"])}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 3: PROGRESS, BK/PU, KENDALA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    style={{ width: `${Math.min(activeProject.ra, 100)}%` }}
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
                    className={`h-full ${activeProject.deviasi < 0 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(activeProject.ri, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#000075] text-white text-[11px] font-bold p-2 uppercase flex items-center justify-between tracking-widest">
              <span className="flex items-center gap-1.5">
                <Wallet size={12} /> BK/PU
              </span>
              <span
                className={`px-1 py-0.5 rounded bg-white font-black text-[10px] ${Number(activeProject.bk_deviasi) > 0 ? "text-red-600" : "text-emerald-600"}`}
              >
                DEV : {Number(activeProject.bk_deviasi) > 0 ? "+" : ""}
                {formatPercent(activeProject.bk_deviasi)}%
              </span>
            </div>
            <div className="p-3 h-[92px]">
              <div className="grid grid-cols-2 gap-2 h-full">
                <div className="bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-[11px] font-bold uppercase text-slate-500">
                    MAPP
                  </div>
                  <div className="text-[18px] font-black text-slate-700 leading-none mt-1">
                    {formatPercent(activeProject.bk_rencana)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">%</div>
                </div>
                <div
                  className={`rounded-lg border flex flex-col items-center justify-center ${Number(activeProject.bk_deviasi) > 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}
                >
                  <div className="text-[11px] font-bold uppercase text-slate-500">
                    REAL
                  </div>
                  <div
                    className={`text-[18px] font-black leading-none mt-1 ${Number(activeProject.bk_deviasi) > 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {formatPercent(activeProject.bk_realisasi)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">%</div>
                </div>
              </div>
            </div>
          </div>

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
      </div>
    </div>
  );
}
