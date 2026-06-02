import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Maximize2,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import ModuleOverlay from "./components/ModuleOverlay";

function MonitoringEskalasiComponent() {
  const [dataEskalasi, setDataEskalasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchEskalasiData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("monitoring_eskalasi")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setDataEskalasi(data);
        } else {
          setDataEskalasi(getStaticData());
        }
      } catch (err) {
        setDataEskalasi(getStaticData());
      } finally {
        setLoading(false);
      }
    }
    fetchEskalasiData();
  }, []);

  const getStaticData = () => [
    {
      id: 1,
      id_proyek: "1418018",
      nama: "Bendungan Bener Paket II (83.5%)",
      status_proyek: "On Going",
      periode: "Oktober 2019 - Desember 2023 (Progress 45.527%)",
      tgl_pengajuan: "12-Jun-24",
      awal: 32989980938,
      evaluasi_panitia: 20188621664,
      koreksi: -1666282517,
      nilai_disetujui: 18522339147,
      status: "Cair",
      keterangan:
        "Laporan Hasil Audit (LHA) Penyesuaian Harga sudah diterbitkan oleh BPKP sesuai Surat Nomor: PE.04.03/R/5-861/D6/02/2025 tanggal 16 Oktober 2025 dengan nilai yang sudah terkoreksi menjadi Rp 18.522.339.146,93",
    },
    {
      id: 2,
      id_proyek: "1418021",
      nama: "Bendungan Tiga Dihaji (57%)",
      status_proyek: "On Going",
      periode: "Oktober 2019 - Desember 2024 (Progress 45.55%)",
      tgl_pengajuan: "21-Feb-25",
      awal: 9227468258,
      evaluasi_panitia: 8962232156,
      koreksi: -2559313541,
      nilai_disetujui: 6402918615,
      status: "Cair",
      keterangan:
        "Laporan Hasil Audit (LHA) Penyesuaian Harga sudah diterbitkan oleh BPKP sesuai Surat Nomor: PE.04.03/R/5-276/PW07/5/2025 tanggal 15 Juli 2025 dengan nilai yang sudah terkoreksi menjadi Rp 6.402.918.614,55",
    },
    {
      id: 3,
      id_proyek: "1420033",
      nama: "Bendungan Jragung Paket 1",
      status_proyek: "On Going",
      periode: "Oktober 2021 - Desember 2024 (Progress 80.491%)",
      tgl_pengajuan: "01-Sep-25",
      awal: 118789070652,
      evaluasi_panitia: 74529337512,
      koreksi: -36325152412,
      nilai_disetujui: 38204185110,
      status: "Disetujui",
      keterangan:
        "Laporan Hasil Audit (LHA) Penyesuaian Harga telah diterbitkan oleh BPKP sesuai Surat Nomor: PE.04.03/R/5-51/D6/01/2026 tanggal 21 Januari 2026 dengan nilai Eskalasi sebesar: 38.204.185.109,91",
    },
    {
      id: 4,
      id_proyek: "1423006",
      nama: "Rentang Irrigation LOS-01 JOP 60%",
      status_proyek: "On Going",
      periode:
        "01 Februari 2023 - 29 Juni 2025 (Periode IPC 1 s.d IPC 17) (Progress 95.02%)",
      tgl_pengajuan: "09-Apr-25",
      awal: 14623112357,
      evaluasi_panitia: 9405302916,
      koreksi: -253476750,
      nilai_disetujui: 9151906166,
      status: "Disetujui",
      keterangan:
        "Laporan Hasil Audit (LHA) Penyesuaian Harga telah diterbitkan oleh BPKP sesuai Surat Nomor: PE.04.03/LHP-119/PW10/5.1/2025 tanggal 24 April 2026 dengan nilai Eskalasi sebesar: 9.151.906.166,69",
    },
    {
      id: 5,
      id_proyek: "1421039",
      nama: "Bendungan Mbay",
      status_proyek: "On Going",
      periode: "Agustus 2021 - Desember 2025 (Progress 91%)",
      tgl_pengajuan: "-",
      awal: 18000000000,
      evaluasi_panitia: 0,
      koreksi: 0,
      nilai_disetujui: 0,
      status: "Proses Perhitungan",
      keterangan: "Cost Factor item pekerjaan baru, masih proses perhitungan",
    },
    {
      id: 6,
      id_proyek: "-",
      nama: "Pengarah Rukoh Aceh",
      status_proyek: "On Going",
      periode: "-",
      tgl_pengajuan: "-",
      awal: 5529908584,
      evaluasi_panitia: 0,
      koreksi: 0,
      nilai_disetujui: 0,
      status: "Proses Perhitungan",
      keterangan: "Cost Factor item pekerjaan baru, masih proses perhitungan",
    },
    {
      id: 7,
      id_proyek: "1419009",
      nama: "Bendungan Rukoh Paket 2",
      status_proyek: "Maintenance/PHO",
      periode: "Desember 2018 - Desember 2024",
      tgl_pengajuan: "11-Jul-25",
      awal: 251679143061,
      evaluasi_panitia: 230770019884,
      koreksi: -114462302686,
      nilai_disetujui: 116307717198,
      status: "Disetujui",
      keterangan:
        "Laporan Hasil Audit (LHA) Penyesuaian Harga telah diterbitkan oleh BPKP sesuai Surat Nomor: PE.04.03/LHP-515/PW01/5/2024 tanggal 11 Desember 2025 dengan nilai Eskalasi sebesar: 116.307.717.198",
    },
    {
      id: 8,
      id_proyek: "1420037",
      nama: "Pengaman Pantai KEK Tanjung Lesung",
      status_proyek: "Maintenance/PHO",
      periode: "November 2020 - November 2023",
      tgl_pengajuan: "26-Aug-24",
      awal: 14653309960,
      evaluasi_panitia: 9608962960,
      koreksi: -108053051,
      nilai_disetujui: 9500909909,
      status: "Cair",
      keterangan:
        "Addendum Kontrak XIV Nomor: HK.02.03/09-ADD XIV/APBN/SP.II/2025 tanggal 15 Desember 2025",
    },
    {
      id: 9,
      id_proyek: "1320015",
      nama: "Rentang Irrigation Modernization Project",
      status_proyek: "Maintenance/PHO",
      periode: "Juli 2023 - November 2024 (Progress 100%)",
      tgl_pengajuan: "13-May-25",
      awal: 5502749532,
      evaluasi_panitia: 5310221129,
      koreksi: -379540696,
      nilai_disetujui: 4930679433,
      status: "Disetujui",
      keterangan:
        "Proses Addendum XXVI Nomor: HK.02.03-At/3.3/32/Add.XXVI tanggal 04 Mei 2026",
    },
    {
      id: 10,
      id_proyek: "1418020",
      nama: "Bendungan Jlantah (65%)",
      status_proyek: "Maintenance/PHO",
      periode: "November 2018 - Desember 2022",
      tgl_pengajuan: "04-Mar-25",
      awal: 82840345561,
      evaluasi_panitia: 80853624000,
      koreksi: 0,
      nilai_disetujui: 0,
      status: "Review",
      keterangan: "Menunggu Hasil Audit BPKP Target Mei 2026",
    },
    {
      id: 11,
      id_proyek: "1421048",
      nama: "Pengendalian Banjir dan Rob Sungai Loji Paket 1",
      status_proyek: "Maintenance/PHO",
      periode: "-",
      tgl_pengajuan: "17-Mar-25",
      awal: 29318283611,
      evaluasi_panitia: 8118381330,
      koreksi: 0,
      nilai_disetujui: 0,
      status: "Review",
      keterangan: "Saat ini masih menunggu proses Review oleh BPKP.",
    },
    {
      id: 12,
      id_proyek: "1423041",
      nama: "Lanjutan Pembangunan Bend Temef (JO! 65%)",
      status_proyek: "Maintenance/PHO",
      periode: "Agustus 2023 - Desember 2024",
      tgl_pengajuan: "28-Jul-25",
      awal: 5209062000,
      evaluasi_panitia: 4514678925,
      koreksi: -1509999592,
      nilai_disetujui: 3004675333,
      status: "Disetujui",
      keterangan: "Proses Addendum. Sudah cair di rekening KSO.",
    },
    {
      id: 13,
      id_proyek: "1420022",
      nama: "TPA Sampah Manado",
      status_proyek: "FHO",
      periode: "23 September 2020 - 31 Desember 2022",
      tgl_pengajuan: "Proses Pengajuan Ulang",
      awal: 6596778434,
      evaluasi_panitia: 0,
      koreksi: 0,
      nilai_disetujui: 0,
      status: "Diajukan",
      keterangan:
        "Saat ini sedang dalam proses pengajuan ulang, proses koordinasi dengan PPK Sanitasi.",
    },
  ];

  const totalAwal = dataEskalasi.reduce((sum, item) => sum + item.awal, 0);
  const totalPanitia = dataEskalasi.reduce(
    (sum, item) => sum + item.evaluasi_panitia,
    0,
  );
  const totalKoreksi = dataEskalasi.reduce(
    (sum, item) => sum + item.koreksi,
    0,
  );
  const totalDisetujui = dataEskalasi.reduce(
    (sum, item) => sum + item.nilai_disetujui,
    0,
  );

  const formatMiliar = (val) => {
    if (!val || val === 0) return "-";
    return `${(val / 1e9).toFixed(2)} M`;
  };

  const filteredData = dataEskalasi.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_proyek.includes(searchTerm),
  );

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 bg-slate-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Matriks Monitoring Eskalasi
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Lembar Evaluasi Klaim dan Penyesuaian Harga Divisi Infrastruktur
            </p>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Cari bendungan / nama proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
            <Maximize2 size={14} /> Fullscreen
          </button>
        </div>
      </div>

      {/* METRIC KARTU TOP AGREGAT - Meniru gaya dashboard utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Nilai Pengajuan Awal
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-1">
            {formatMiliar(totalAwal)}
          </h3>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Hasil Evaluasi Panitia
          </span>
          <h3 className="text-xl font-black text-blue-700 mt-1">
            {formatMiliar(totalPanitia)}
          </h3>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Total Koreksi Audit
          </span>
          <h3 className="text-xl font-black text-rose-600 mt-1">
            ({formatMiliar(Math.abs(totalKoreksi))})
          </h3>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Total Nilai Disetujui
          </span>
          <h3 className="text-xl font-black text-emerald-600 mt-1">
            {formatMiliar(totalDisetujui)}
          </h3>
        </div>
      </div>

      {/* STRUKTUR TABEL MODERN MINIMALIS */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[580px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="py-4 px-4 text-center w-12">No</th>
                <th className="py-4 px-3 w-24">ID Proyek</th>
                <th className="py-4 px-4 w-[280px]">Nama Proyek</th>
                <th className="py-4 px-3 text-center w-28">Tgl Pengajuan</th>
                <th className="py-4 px-3 text-right">Awal</th>
                <th className="py-4 px-3 text-right">Hasil Panitia</th>
                <th className="py-4 px-3 text-right">Koreksi Audit</th>
                <th className="py-4 px-3 text-right">Nilai Setuju</th>
                <th className="py-4 px-3 text-center w-36">Status</th>
                <th className="py-4 px-4 w-[350px]">
                  Keterangan Tindak Lanjut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {filteredData.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors align-top group"
                >
                  <td className="py-4 px-4 text-center text-slate-400 font-bold">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-3 font-mono text-slate-400 font-bold">
                    {row.id_proyek}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800 leading-snug group-hover:text-blue-900 transition-colors">
                      {row.nama}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      {row.periode}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-medium text-center">
                    {row.tgl_pengajuan}
                  </td>
                  <td className="py-4 px-3 text-right font-semibold text-slate-700">
                    {formatMiliar(row.awal)}
                  </td>
                  <td className="py-4 px-3 text-right text-blue-600 font-semibold">
                    {formatMiliar(row.evaluasi_panitia)}
                  </td>
                  <td
                    className={`py-4 px-3 text-right font-bold ${row.koreksi < 0 ? "text-rose-500" : "text-slate-400"}`}
                  >
                    {row.koreksi < 0
                      ? `-${formatMiliar(Math.abs(row.koreksi))}`
                      : "-"}
                  </td>
                  <td className="py-4 px-3 text-right font-black text-emerald-600">
                    {formatMiliar(row.nilai_disetujui)}
                  </td>

                  {/* BADGE STATUS BULAT MINI PASTEL */}
                  <td className="py-4 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        row.status === "Cair"
                          ? "bg-emerald-50 text-emerald-600"
                          : row.status === "Disetujui"
                            ? "bg-blue-50 text-blue-600"
                            : row.status === "Review"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Cair"
                            ? "bg-emerald-500"
                            : row.status === "Disetujui"
                              ? "bg-blue-500"
                              : row.status === "Review"
                                ? "bg-purple-500"
                                : "bg-amber-500"
                        }`}
                      ></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 group-hover:text-slate-600 transition-colors leading-relaxed text-[11px] font-medium">
                    {row.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <ModuleOverlay />
      </div>

      
    </div>
  );
}

export default MonitoringEskalasiComponent;
