import React from "react";
import { Clock, Activity, TrendingDown, AlertTriangle } from "lucide-react";

export default function MonitoringTables({
  pureTimeOverrunProjects,
  totalProject,
  behindScheduleProjects,
  bkpuMappProjects,
  timeOverrunPercent,
  behindSchedulePercent,
  almostOverrun,
  costOverrunData,
}) {
  return (
    <div className="dashboard-card grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
      {/* KOLOM 1: TIME OVERRUN (TEMA TEGAS - MERAH WASKITA) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header & Indikator Donut Persentase */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-[#BD002F]" size={18} />
            <div>
              <h3 className="text-[16px] font-black text-slate-900">
                TIME OVERRUN
              </h3>
              <p className="text-[12px] font-bold text-slate-400">
                Rasio Kasus: {pureTimeOverrunProjects.length}/{totalProject}{" "}
                Proyek
              </p>
            </div>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                className="text-slate-200"
                stroke="currentColor"
                fill="transparent"
              />

              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-[#BD002F]"
                stroke="currentColor"
                fill="transparent"
                strokeDasharray="138.2"
                strokeDashoffset={138.2 - (138.2 * timeOverrunPercent) / 100}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-xs text-slate-700">
                {timeOverrunPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Wadah Tabel Scrollable */}
        <div className="p-3 flex-1 flex flex-col justify-between max-h-[380px] overflow-y-auto scrollbar-thin">
          {/* PERBAIKAN 1: Tambahkan table-fixed agar pembagian lebar kolom konsisten */}
          <table className="w-full text-left text-[11px] border-collapse table-fixed">
            <thead className="bg-[#008080] text-white font-bold sticky top-0 shadow-sm z-10">
              <tr>
                <th className="p-2 pl-3 w-[50%] align-middle">Proyek</th>

                {/* Struktur disamakan agar tinggi header seragam lintas tabel */}
                <th className="p-2 text-center w-[16%] align-middle leading-tight">
                  Prog.
                  <br />
                  <span className="text-[11px] font-normal text-teal-100">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[16%] align-middle leading-tight">
                  End Date
                </th>

                <th className="p-2 text-center w-[18%] align-middle pr-2 leading-tight">
                  Remain.
                  <br />
                  <span className="text-[11px] font-normal text-teal-100">
                    (day)
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-black">
                <td colSpan="4" className="p-2 pl-3 uppercase">
                  Time Overrun
                </td>
              </tr>

              {pureTimeOverrunProjects.map((p, i) => (
                <tr
                  key={`overrun-${i}`}
                  className="hover:bg-red-50 transition-colors"
                >
                  <td className="p-2 pl-3 font-bold text-slate-800 break-words whitespace-normal align-middle">
                    {p.name}
                  </td>

                  {/* DIKEMBALIKAN KE CENTER: Posisi angka kembali di tengah */}
                  <td className="p-2 text-center align-middle font-mono">
                    {p.prog}
                  </td>

                  <td className="p-2 text-center align-middle text-slate-500 font-mono">
                    {p.endDate}
                  </td>

                  {/* DIKEMBALIKAN KE CENTER: Posisi angka kembali di tengah */}
                  <td className="p-2 text-center align-middle font-black text-red-600 pr-2 font-mono">
                    {p.remain}
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-50 text-slate-500 text-[11px] font-black">
                <td colSpan="4" className="p-2 pl-3 uppercase">
                  Almost Overrun
                </td>
              </tr>

              {almostOverrun.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {/* PERBAIKAN 5: Samakan penyesuaian untuk data row berikutnya */}
                  <td className="p-2 pl-3 font-bold text-slate-800 break-words whitespace-normal">
                    {p.name}
                  </td>
                  <td className="p-2 text-right font-mono">{p.prog}</td>
                  <td className="p-2 text-center text-slate-500 font-mono">
                    {p.endDate}
                  </td>
                  <td className="p-2 text-right font-black text-red-600 pr-3 font-mono">
                    {p.remain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KOLOM 2: BEHIND SCHEDULE (TEMA PERINGATAN - COKLAT/ORANYE OPERASIONAL) */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header & Indikator Donut Persentase */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-orange-600" size={18} />
            <div>
              <h3 className="text-[16px] font-black text-slate-900">
                BEHIND SCHEDULE
              </h3>
              <p className="text-[12px] font-bold text-slate-400">
                Rasio Kasus: {behindScheduleProjects.length}/{totalProject}{" "}
                Proyek
              </p>
            </div>
          </div>
          {/* Visual Indikator Lingkaran 28% */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                className="text-slate-200"
                stroke="currentColor"
                fill="transparent"
              />

              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-orange-500"
                stroke="currentColor"
                fill="transparent"
                strokeDasharray="138.2"
                strokeDashoffset={138.2 - (138.2 * behindSchedulePercent) / 100}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-xs text-orange-600">
                {behindSchedulePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Wadah Tabel Scrollable */}
        <div className="p-3 h-[380px] overflow-y-auto scrollbar-thin">
          {/* PERBAIKAN 1: Tambahkan table-fixed agar ukuran kolom terkunci rapi */}
          <table className="w-full text-left text-[11px] border-collapse table-fixed">
            <thead className="bg-[#995100] text-white font-bold sticky top-0 shadow-sm z-10">
              <tr>
                <th className="p-2 pl-3 w-[46%] align-middle">Proyek</th>

                {/* Menggunakan <br /> agar teks persen konsisten berada di bawah */}
                <th className="p-2 text-center w-[18%] align-middle leading-tight">
                  Ra.
                  <br />
                  <span className="text-[10px] font-normal text-orange-200">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[18%] align-middle leading-tight">
                  Ri.
                  <br />
                  <span className="text-[10px] font-normal text-orange-200">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[18%] align-middle pr-2 leading-tight">
                  Dev.
                  <br />
                  <span className="text-[10px] font-normal text-orange-200">
                    (%)
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {behindScheduleProjects.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {/* PERBAIKAN 3: Hapus truncate & max-w agar nama proyek turun otomatis (wrap text) */}
                  <td className="p-2.5 pl-3 font-bold text-slate-800 break-words whitespace-normal align-middle">
                    {p.name}
                  </td>

                  {/* Tetap Center & ditambahkan font-mono agar karakter angka tegak lurus seimbang */}
                  <td className="p-2.5 text-center text-slate-500 font-mono align-middle">
                    {p.ra}
                  </td>

                  <td className="p-2.5 text-center text-[#000075] font-mono align-middle">
                    {p.ri}
                  </td>

                  {/* Jarak padding kanan disesuaikan (pr-2) agar pas di tengah-tengah kolom */}
                  <td className="p-2.5 text-center font-black text-red-600 pr-2 font-mono align-middle">
                    {p.dev}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KOLOM 3: COST OVERRUN (TEMA MONITORING ANGGARAN - BIRU HOLDING) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header & Indikator Donut Persentase */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="text-[#000075]" size={18} />
            <div>
              <h3 className="text-[16px] font-black text-slate-900">
                BK/PU &gt; MAPP
              </h3>
              <p className="text-[12px] font-bold text-slate-400">
                Rasio Kasus: {bkpuMappProjects.length}/{totalProject} Proyek
              </p>
            </div>
          </div>
          {/* Visual Indikator Lingkaran */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                className="text-slate-200"
                stroke="currentColor"
                fill="transparent"
              />

              <circle
                cx="28"
                cy="28"
                r="22"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-[#000075]"
                stroke="currentColor"
                fill="transparent"
                strokeDasharray="138.2"
                strokeDashoffset={
                  138.2 -
                  (138.2 *
                    (totalProject > 0
                      ? ((bkpuMappProjects.length / totalProject) * 100)
                      : 0)) /
                    100
                }
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-xs text-[#000075]">
                {(totalProject > 0
                  ? ((bkpuMappProjects.length / totalProject) * 100)
                  : 0
                ).toFixed(0)}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Wadah Tabel Scrollable */}
        <div className="p-3 flex-1 flex flex-col justify-between max-h-[380px] overflow-y-auto scrollbar-thin">
          {/* PERBAIKAN 1: Gunakan table-fixed agar ukuran kolom konsisten lintas tabel */}
          <table className="w-full text-left text-[11px] border-collapse table-fixed">
            <thead className="bg-[#000050] text-white font-bold sticky top-0 shadow-sm z-10">
              <tr>
                {/* PERBAIKAN 2: Alokasikan lebar kolom (Proyek w-[40%], sisanya masing-masing w-[15%]) */}
                <th className="p-2 pl-3 w-[40%] align-middle">Proyek</th>

                {/* PERBAIKAN 3: Gunakan <br /> dan leading-tight agar tanda kurung (%) konsisten berada di bawah */}
                <th className="p-2 text-center w-[15%] align-middle leading-tight">
                  Prog.
                  <br />
                  <span className="text-[10px] font-normal text-blue-200">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[20%] align-middle leading-tight">
                  MAPP
                  <br />
                  <span className="text-[10px] font-normal text-blue-200">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[15%] align-middle leading-tight">
                  Real.
                  <br />
                  <span className="text-[10px] font-normal text-blue-200">
                    (%)
                  </span>
                </th>

                <th className="p-2 text-center w-[15%] align-middle pr-2 leading-tight">
                  Dev.
                  <br />
                  <span className="text-[10px] font-normal text-blue-200">
                    (%)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {bkpuMappProjects &&
                bkpuMappProjects.map((p, i) => {
                  // Ambil nilai angka dengan aman, berikan fallback 0 jika data kosong
                  const progVal = Number(p.prog || p.progress || 0);
                  const mappVal = Number(p.mapp || 0);
                  const realVal = Number(p.real || p.realisasiBiaya || 0);
                  const devVal = Number(p.dev || p.devValue || 0);

                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      {/* Nama proyek dengan handling pembungkusan teks otomatis */}
                      <td
                        className="p-2 pl-3 font-bold text-slate-800 break-words whitespace-normal align-middle"
                        title={p.name}
                      >
                        {p.name || "-"}
                        {p.id === "BIM" && (
                          <span className="ml-1 inline-block text-[8px] bg-red-100 text-red-700 px-1 rounded font-black uppercase tracking-wider animate-pulse vertical-middle">
                            BIM
                          </span>
                        )}
                      </td>

                      {/* Tampilan angka rapi dengan batas 2 desimal agar tidak meluber ke kanan */}
                      <td className="p-2 text-center text-slate-500 font-mono align-middle">
                        {progVal.toFixed(2)}
                      </td>
                      <td className="p-2 text-center text-slate-500 font-mono align-middle">
                        {mappVal.toFixed(2)}%
                      </td>
                      <td className="p-2 text-center text-[#000075] font-bold font-mono align-middle">
                        {realVal.toFixed(2)}%
                      </td>
                      <td className="p-2 text-center font-black text-red-600 pr-2 font-mono align-middle bg-red-50/20">
                        {devVal.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
