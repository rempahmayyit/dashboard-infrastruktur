// src/KeuanganAkuntansi.jsx
import React from "react";
import { CircleDollarSign, Table, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { agingInvoiceData, cashFlowTrend } from "./data";
import ModuleOverlay from "./components/ModuleOverlay";

export default function KeuanganAkuntansi() {
  // DATA SINKRONISASI GRAFIK BATANG: AGING BRUTO, PIUTANG, DAN RETENSI
  const agingChartData = [
    {
      name: "0 s/d 30",
      "Piutang Termin": 68.8,
      "Piutang Retensi": 3.9,
      "Tagihan Bruto (WIP)": 664.9,
    },
    {
      name: "> 30 s/d 90",
      "Piutang Termin": 66.5,
      "Piutang Retensi": 33.5,
      "Tagihan Bruto (WIP)": 236.2,
    },
    {
      name: "> 90 s/d 180",
      "Piutang Termin": 52.1,
      "Piutang Retensi": 42.7,
      "Tagihan Bruto (WIP)": 180.3,
    },
    {
      name: "> 180 s/d 360",
      "Piutang Termin": 68.0,
      "Piutang Retensi": 105.5,
      "Tagihan Bruto (WIP)": 105.5,
    },
    {
      name: "> 360",
      "Piutang Termin": 2666.2,
      "Piutang Retensi": 1584.6,
      "Tagihan Bruto (WIP)": 1371.2,
    },
  ];

  // DATA SINKRONISASI TABEL: KOMITMEN PENERIMAAN TERMIN MEI 2026
  const meiCommitmentProjects = [
    {
      id: "1323020",
      name: "Probolinggo-Banyuwangi Pkt 3",
      komitmen: "35.884",
      cair: "-",
      delay: "21.184",
      rencana: "14.698",
      kendala:
        "Nilai Turun Kendala Administrasi KSO terkait perhitungan MC100(Pekerjaan Tanah)",
    },
    {
      id: "1323042",
      name: "Tol Ciawi Sukabumi Seksi 3A",
      komitmen: "20.580",
      cair: "-",
      delay: "5.580",
      rencana: "15.000",
      kendala: "Progres yang sedang Proses Back Up Termin di Konsultan + 15M",
    },
    {
      id: "1324010",
      name: "Tol Ciawi Sukabumi Seksi 3B",
      komitmen: "38.625",
      cair: "-",
      delay: "4.625",
      rencana: "34.000",
      kendala: "Progres yang sedang Proses Back Up Termin di Konsultan + 34M",
    },
    {
      id: "1420033",
      name: "Bendungan Jragung Paket 1",
      komitmen: "4.859",
      cair: "4.859",
      delay: "-",
      rencana: "-",
      kendala: "Sudah cair menjadi upside di 22 April 2026",
    },
    {
      id: "1425010",
      name: "Perbaikan Jalan Tol KAPB JOP 70%",
      komitmen: "11.077",
      cair: "-",
      delay: "-",
      rencana: "26.964",
      kendala: "Masuk on schedule",
    },
    {
      id: "1424022",
      name: "Bendungan Jragung Paket 4",
      komitmen: "442",
      cair: "442",
      delay: "-",
      rencana: "-",
      kendala: "Sudah cair menjadi upside di 20 April 2026",
    },
    {
      id: "1424020",
      name: "Struktur Jembatan Musi",
      komitmen: "11.037",
      cair: "-",
      delay: "8.361",
      rencana: "2.676",
      kendala: "Nilai Turun Terkait proses Add kontrak",
    },
    {
      id: "1425013",
      name: "Irigasi Belitang Lempuing Pkt 2",
      komitmen: "17.512",
      cair: "-",
      delay: "17.512",
      rencana: "-",
      kendala:
        "Terkendala dispute dengan Member Masalah Sharing Termin 7 dan 8",
    },
    {
      id: "1425027",
      name: "Construction Of KSCS Package 1",
      komitmen: "33.600",
      cair: "-",
      delay: "33.600",
      rencana: "-",
      kendala:
        "Potensi Delay ke Bulan Juni, masih proses pemenuhan progres lapangan.",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* SEKSI UTAMA ATAS (2 KOLOM: TABEL CASH IN VS TABEL KOMITMEN MEI) */}
      <div className="dashboard-card flex flex-col xl:flex-row gap-6 items-stretch">
        {/* SISI KIRI: CASH IN APRIL & RESUME CF (LEBAR 40%) */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6 justify-between">
          {/* TABEL KOMITMEN & REALISASI CASH IN APRIL */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <CircleDollarSign size={16} className="text-[#000075]" />
              Komitmen & Realisasi Cash In April 2026
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Divisi Kerja</th>
                    <th className="p-3 text-right">Komitmen</th>
                    <th className="p-3 text-right">Real s.d Apr</th>
                    <th className="p-3 text-center">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white font-bold text-slate-800">
                    <td className="p-3 text-[#000075]">Divisi Infrastruktur</td>
                    <td className="p-3 text-right text-slate-600">174.403 M</td>
                    <td className="p-3 text-right text-emerald-600">
                      185.928 M
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black">
                        106,61%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RESUME POSISI CASH FLOW BOX */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 bg-gradient-to-br from-slate-50 to-white flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Resume Posisi Cash Flow (April)
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                <span>Saldo Awal</span>
                <span className="font-bold text-slate-900">1.979.318 M</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 text-emerald-600">
                <span>Cash In April</span>
                <span className="font-bold">(+) 185.928 M</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 text-red-600">
                <span>Cash Out April</span>
                <span className="font-bold">(-) 264.175 M</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-[#000075] border-t-2 border-slate-300">
                <span className="font-sans uppercase">Saldo Akhir</span>
                <span>1.904.966 M</span>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: TABEL KOMITMEN PENERIMAAN TERMIN MEI (LEBAR 60%) */}
        <div className="w-full xl:w-[60%] bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
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
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-2.5 pl-3">
                        <div
                          className="font-bold text-slate-800 truncate max-w-[210px]"
                          title={p.name}
                        >
                          {p.name}
                        </div>
                        <div
                          className="text-[9px] text-slate-400 font-mono italic truncate max-w-[210px] group-hover:text-blue-600"
                          title={p.kendala}
                        >
                          {p.kendala}
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-700">
                        {p.komitmen} M
                      </td>
                      <td className="p-2.5 text-right font-black text-emerald-600">
                        {p.cair !== "-" ? `${p.cair} M` : "-"}
                      </td>
                      <td className="p-2.5 text-right font-black text-red-600">
                        {p.delay !== "-" ? `${p.delay} M` : "-"}
                      </td>
                      <td className="p-2.5 text-right font-black text-blue-700">
                        {p.rencana !== "-" ? `${p.rencana} M` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SEKSI BAWAH: INTERACTIVE AGING BRUTO CHART PROFILE */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={16} className="text-[#000075]" />
              Struktur Umur Aging Profile: Piutang Bruto, Termin, dan Retensi
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Penarikan manual klaster jatuh tempo per 04 Mei 2026 (Milyar)
            </p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agingChartData}
              margin={{ top: 15, right: 10, bottom: 5, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                style={{ fontSize: 11, fontWeight: "bold" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              {/* REVISE: Mengisi parameter radius agar valid dan tidak crash */}
              <Bar
                dataKey="Piutang Termin"
                fill="#BD002F"
                radius={[4, 4, 0, 0]}
                barSize={25}
              />
              <Bar
                dataKey="Piutang Retensi"
                fill="#000075"
                radius={[4, 4, 0, 0]}
                barSize={25}
              />
              <Bar
                dataKey="Tagihan Bruto (WIP)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ModuleOverlay />
    </div>
  );
}
