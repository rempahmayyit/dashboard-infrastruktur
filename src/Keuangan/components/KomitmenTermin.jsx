import React from "react";
import { Table } from "lucide-react";

export default function KomitmenTermin() {
  const meiCommitmentProjects = [
    { id: "1323020", name: "Probolinggo-Banyuwangi Pkt 3", komitmen: "35.884", cair: "-", delay: "21.184", rencana: "14.698", kendala: "Nilai Turun Kendala Administrasi KSO terkait perhitungan MC100(Pekerjaan Tanah)" },
    { id: "1323042", name: "Tol Ciawi Sukabumi Seksi 3A", komitmen: "20.580", cair: "-", delay: "5.580", rencana: "15.000", kendala: "Progres yang sedang Proses Back Up Termin di Konsultan + 15M" },
    { id: "1324010", name: "Tol Ciawi Sukabumi Seksi 3B", komitmen: "38.625", cair: "-", delay: "4.625", rencana: "34.000", kendala: "Progres yang sedang Proses Back Up Termin di Konsultan + 34M" },
    { id: "1420033", name: "Bendungan Jragung Paket 1", komitmen: "4.859", cair: "4.859", delay: "-", rencana: "-", kendala: "Sudah cair menjadi upside di 22 April 2026" },
    { id: "1425010", name: "Perbaikan Jalan Tol KAPB JOP 70%", komitmen: "11.077", cair: "-", delay: "-", rencana: "26.964", kendala: "Masuk on schedule" },
    { id: "1424022", name: "Bendungan Jragung Paket 4", komitmen: "442", cair: "442", delay: "-", rencana: "-", kendala: "Sudah cair menjadi upside di 20 April 2026" },
    { id: "1424020", name: "Struktur Jembatan Musi", komitmen: "11.037", cair: "-", delay: "8.361", rencana: "2.676", kendala: "Nilai Turun Terkait proses Add kontrak" },
    { id: "1425013", name: "Irigasi Belitang Lempuing Pkt 2", komitmen: "17.512", cair: "-", delay: "17.512", rencana: "-", kendala: "Terkendala dispute dengan Member Masalah Sharing Termin 7 dan 8" },
    { id: "1425027", name: "Construction Of KSCS Package 1", komitmen: "33.600", cair: "-", delay: "33.600", rencana: "-", kendala: "Potensi Delay ke Bulan Juni, masih proses pemenuhan progres lapangan." },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-full flex flex-col">
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table size={14} className="text-[#000075]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Komitmen Penerimaan Termin Mei '26 (Total: 176.627 M)
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[225px] flex-1 scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 shadow-sm z-10">
              <tr>
                <th className="p-2.5 pl-3">Nama Proyek</th>
                <th className="p-2.5 text-right">Komitmen</th>
                <th className="p-2.5 text-right text-emerald-600">Cair</th>
                <th className="p-2.5 text-right text-red-600">Delay</th>
                <th className="p-2.5 text-right text-blue-700">Rencana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {meiCommitmentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-2.5 pl-3">
                    <div className="font-bold text-slate-800 truncate max-w-[210px]" title={p.name}>
                      {p.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono italic truncate max-w-[210px] group-hover:text-blue-600" title={p.kendala}>
                      {p.kendala}
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{p.komitmen} M</td>
                  <td className="p-2.5 text-right font-black text-emerald-600">{p.cair !== "-" ? `${p.cair} M` : "-"}</td>
                  <td className="p-2.5 text-right font-black text-red-600">{p.delay !== "-" ? `${p.delay} M` : "-"}</td>
                  <td className="p-2.5 text-right font-black text-blue-700">{p.rencana !== "-" ? `${p.rencana} M` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}