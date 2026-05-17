// src/data.js

// =========================================================================
// 1. DATA RINGKASAN METRIK OPERASIONAL UTAMA (EXECUTIVE DASHBOARD & UMUM)
// =========================================================================
export const stats = {
  totalProyek: 45,
  puRealisasi: "1.227,93 M", 
  bkPuRatio: "112,27%",       
  cashIn: "185,92 M",         
};

// =========================================================================
// 2. DATA DEPARTEMEN PEMASARAN & ANGGARAN (MODUL NKB - HALAMAN 4)
// =========================================================================
export const marketingNkbChartData = [
  { month: "Jan", bulananRKAP: 300,    bulananPrognosa: 738.66, rkapKumulatif: 300,     realisasiKumulatif: 0,       prognosaKumulatif: 738.66 },
  { month: "Feb", bulananRKAP: 825,    bulananPrognosa: 108.1,  rkapKumulatif: 1125,    realisasiKumulatif: 384.4,   prognosaKumulatif: 846.76 },
  { month: "Mar", bulananRKAP: 400,    bulananPrognosa: 384.4,  rkapKumulatif: 1525,    realisasiKumulatif: 768.8,   prognosaKumulatif: 1231.16 },
  { month: "Apr", bulananRKAP: 0,      bulananPrognosa: 4.63,   rkapKumulatif: 1525,    realisasiKumulatif: 1273.63, prognosaKumulatif: 1235.79 },
  { month: "Mei", bulananRKAP: 0,      bulananPrognosa: 55.8,   rkapKumulatif: 1525,    realisasiKumulatif: null,    prognosaKumulatif: 1291.59 },
  { month: "Jun", bulananRKAP: 0,      bulananPrognosa: 505.68, rkapKumulatif: 2030.68, realisasiKumulatif: null,    prognosaKumulatif: 2070.96 },
  { month: "Jul", bulananRKAP: 150,    bulananPrognosa: 0,      rkapKumulatif: 2180.68, realisasiKumulatif: null,    prognosaKumulatif: 2070.96 },
  { month: "Agu", bulananRKAP: 1104,   bulananPrognosa: 840,    rkapKumulatif: 3285.18, realisasiKumulatif: null,    prognosaKumulatif: 2910.96 },
  { month: "Sep", bulananRKAP: 388.75, bulananPrognosa: 1255.7, rkapKumulatif: 3673.93, realisasiKumulatif: null,    prognosaKumulatif: 4166.66 },
  { month: "Okt", bulananRKAP: 455,    bulananPrognosa: 890.9,  rkapKumulatif: 4128.93, realisasiKumulatif: null,    prognosaKumulatif: 5057.56 },
  { month: "Nov", bulananRKAP: 871.44, bulananPrognosa: 400,    rkapKumulatif: 5000.37, realisasiKumulatif: null,    prognosaKumulatif: 5457.56 },
  { month: "Des", bulananRKAP: 1689.68, bulananPrognosa: 3551.9, rkapKumulatif: 6690.04, realisasiKumulatif: null,    prognosaKumulatif: 9009.4 },
];

export const nkbProjectList = [
  { id: "NKB-2601", name: "Jalan Tol Japek II Selatan Paket 3", divisi: "Infrastruktur 1", nilai: "420,5 M", tgl: "Jan 2026" },
  { id: "NKB-2602", name: "Bendungan Jragung Paket Berjalan", divisi: "Infrastruktur 2", nilai: "256,1 M", tgl: "Feb 2026" },
  { id: "NKB-2603", name: "Pengaman Pantai Muara Baru DKI", divisi: "Infrastruktur 1", nilai: "185,4 M", tgl: "Feb 2026" },
  { id: "NKB-2604", name: "Pembangunan Jalan Sumbu Kebangsaan IKN", divisi: "IKN Cluster", nilai: "155,0 M", tgl: "Mar 2026" },
  { id: "NKB-2605", name: "Sistem Transmisi Air Baku Penajam", divisi: "Infrastruktur 2", nilai: "132,6 M", tgl: "Apr 2026" },
  { id: "NKB-2606", name: "Dermaga Logistik Teluk Balikpapan", divisi: "Infrastruktur 1", nilai: "124,0 M", tgl: "Apr 2026" },
];

export const marketClusterData = [
  { name: "Proyek Kementerian", value: 55 },
  { name: "BUMN / BUMD", value: 25 },
  { name: "Proyek Swasta", value: 12 },
  { name: "Investasi Internal", value: 8 },
];

export const marketingPipeline = [
  { id: "TND-01", paket: "Pembangunan Bendungan Karangnongko Paket II", owner: "Kementerian PUPR", nilai: "650 M", status: "Tahap Evaluasi" },
  { id: "TND-02", paket: "Jalan Tol IKN Seksi 1B Simpang Tempadung", owner: "Otorita IKN", nilai: "1.250 M", status: "Klarifikasi Teknis" },
  { id: "TND-03", paket: "Revitalisasi Terminal Pemuda Jakarta", owner: "Dinas Perhubungan DKI", nilai: "340 M", status: "Pemasukan Dokumen" },
  { id: "TND-04", paket: "Sistem Penyediaan Air Minum (SPAM) Semarang", owner: "PDAM Semarang", nilai: "210 M", status: "Tahap Sanggah" },
  { id: "TND-05", paket: "Pekerjaan Dermaga Pelabuhan Benoa Bali", owner: "PT Pelindo (Persero)", nilai: "480 M", status: "Persiapan Dokumen" },
];

// =========================================================================
// 3. DATA EXECUTIVE DASHBOARD TREN FINANSIAL (HALAMAN 4)
// =========================================================================
export const chartDataPU = [
  { month: "Jan", rencana: 149, realisasi: 205 },
  { month: "Feb", rencana: 289, realisasi: 461 },
  { month: "Mar", rencana: 453, realisasi: 545 },
  { month: "Apr", rencana: 722, realisasi: 749 },
  { month: "Mei", rencana: 1093, realisasi: null },
  { month: "Jun", rencana: 1415, realisasi: null },
  { month: "Jul", rencana: 1735, realisasi: null },
  { month: "Agu", rencana: 2086, realisasi: null },
  { month: "Sep", rencana: 2433, realisasi: null },
  { month: "Okt", rencana: 2779, realisasi: null },
  { month: "Nov", rencana: 3092, realisasi: null },
  { month: "Des", rencana: 4010, realisasi: null },
];

export const chartDataLabaKotor = [
  { month: "Jan", rencana: -28.36, realisasi: -107.33 },
  { month: "Feb", rencana: -52.27, realisasi: -109.65 },
  { month: "Mar", rencana: -57.56, realisasi: -147.24 },
  { month: "Apr", rencana: -20.47, realisasi: -150.69 },
  { month: "Mei", rencana: 22.79, realisasi: null },
  { month: "Jun", rencana: 60.99, realisasi: null },
  { month: "Jul", rencana: 100.91, realisasi: null },
  { month: "Agu", rencana: 164.00, realisasi: null },
  { month: "Sep", rencana: 231.61, realisasi: null },
  { month: "Okt", rencana: 278.75, realisasi: null },
  { month: "Nov", rencana: 323.88, realisasi: null },
  { month: "Des", rencana: 417.33, realisasi: null },
];

export const chartDataBKPU = [
  { month: "Jan", rencana: 105.2, realisasi: 110.4 },
  { month: "Feb", rencana: 104.8, realisasi: 111.6 },
  { month: "Mar", rencana: 103.5, realisasi: 113.1 },
  { month: "Apr", rencana: 102.1, realisasi: 112.27 },
  { month: "Mei", rencana: 101.5, realisasi: null },
  { month: "Jun", rencana: 100.8, realisasi: null },
  { month: "Jul", rencana: 99.4, realisasi: null },
  { month: "Agu", rencana: 98.7, realisasi: null },
  { month: "Sep", stroke: "#cbd5e1", rencana: 98.1, realisasi: null },
  { month: "Okt", rencana: 97.5, realisasi: null },
  { month: "Nov", rencana: 97.0, realisasi: null },
  { month: "Des", rencana: 92.53, realisasi: null },
];

export const chartDataLabaBersih = [
  { month: "Jan", rencana: -45.2, realisasi: -125.4 },
  { month: "Feb", rencana: -75.0, realisasi: -132.1 },
  { month: "Mar", rencana: -82.6, realisasi: -168.9 },
  { month: "Apr", rencana: -35.1, realisasi: -174.5 },
  { month: "Mei", rencana: 10.5, realisasi: null },
  { month: "Jun", rencana: 38.2, realisasi: null },
  { month: "Jul", rencana: 75.0, realisasi: null },
  { month: "Agu", rencana: 112.4, realisasi: null },
  { month: "Sep", rencana: 185.0, realisasi: null },
  { month: "Okt", rencana: 220.6, realisasi: null },
  { month: "Nov", rencana: 265.1, realisasi: null },
  { month: "Des", rencana: 345.8, realisasi: null },
];

export const topUnachievedPU = [
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", deviasi: "-37,6 M", kategori: "Keterlambatan MC Lapangan" },
  { id: "1421039", name: "Proyek Bendungan Mbay NTT", deviasi: "-34,7 M", kategori: "Kendala Teknis Metode Kerja" },
  { id: "1420033", name: "Pembangunan Bendungan Jragung I", deviasi: "-20,3 M", kategori: "Lahan & Cuaca Ekstrim Site" },
];

export const topUnachievedLK = [
  { id: "1425010", name: "Perbaikan Jalan Tol KAPB JOP 70%", deviasi: "-48,2 M", kategori: "Pembengkakan Biaya Subkon Luar" },
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", deviasi: "-25,3 M", kategori: "Keterlambatan Klaim MC Opname" },
];

export const topUnachievedDefault = [
  { id: "WASKITA", name: "Evaluasi Risiko Komposit Divisi", deviasi: "Perhatian", kategori: "Butuh Eskalasi Percepatan Termin Kerja" }
];

export const initialCriticalProjects = [
  { id: "1323020", name: "Probolinggo-Banyuwangi Pkt 3", PM: "KSO (Member)", delay: "Potensi Delay", risk: "Kendala Administrasi KSO" },
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", PM: "Internal", delay: "-15 M", risk: "Proses Back Up Termin" },
  { id: "1324010", name: "Jalan Tol Ciawi Sukabumi Seksi 3B", PM: "Internal", delay: "-34 M", risk: "Proses Back Up Termin" },
];

export const projectProgressData = [
  { id: "1324010", name: "Jalan Tol Ciawi Sukabumi Seksi 3B", rencana: 74.72, realisasi: 73.69, deviasi: -1.03, lkDeviasi: "-34,7 M", bim: "Comply" },
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", rencana: 86.87, realisasi: 84.86, deviasi: -2.00, lkDeviasi: "-20,3 M", bim: "Comply" },
  { id: "1423005", name: "IPAL 1,2,3 Kawasan Inti IKN (JOI 70%)", rencana: 124.35, realisasi: 88.06, deviasi: -6.03, lkDeviasi: "-18,6 M", bim: "Not Comply" },
  { id: "1425034", name: "Irigasi Rawa KSPP Merauke Pkt 1", rencana: 92.29, realisasi: 21.20, deviasi: -3.05, lkDeviasi: "+2,1 M", bim: "Not Comply" },
  { id: "1323020", name: "Tol Probolinggo-Banyuwangi Paket 3", rencana: 95.60, realisasi: 94.92, deviasi: -0.68, lkDeviasi: "-15,2 M", bim: "Comply" },
];

export const divisionSCurveData = [
  { minggu: "Jan", rencana: 12.5, realisasi: 11.2 },
  { minggu: "Feb", rencana: 25.0, realisasi: 23.8 },
  { minggu: "Mar", rencana: 38.2, realisasi: 35.4 },
  { minggu: "Apr", rencana: 52.0, realisasi: 48.6 },
  { minggu: "Mei", rencana: 68.4, realisasi: null },
  { minggu: "Des", rencana: 100.0, realisasi: null },
];

// =========================================================================
// 5. DATA BARU KHUSUS DEPARTEMEN KEUANGAN & AKUNTANSI (HALAMAN 17 & 18)
// =========================================================================
// Tren Tagihan Bruto vs Pendapatan Usaha (Sumbu Parsial - Grafik Halaman 17)
export const cashFlowTrend = [
  { month: "Jan", tagihanBruto: 205.11, pendapatanUsaha: 149.00 },
  { month: "Feb", tagihanBruto: 460.72, pendapatanUsaha: 289.00 },
  { month: "Mar", tagihanBruto: 545.17, pendapatanUsaha: 453.00 },
  { month: "Apr", tagihanBruto: 648.70, pendapatanUsaha: 722.00 },
];

// Data Rincian Umur Piutang (Aging Invoice) dan Status Kelancaran Pembayaran (Halaman 17)
export const agingInvoiceData = [
  { id: "1323020", name: "Probolinggo-Banyuwangi Paket 3", day0_60: "10,7 M", day60_180: "75,7 M", day180: "93,2 M", total: "179,7 M", kolektibilitas: "Lancar" },
  { id: "1324010", name: "Jalan Tol Ciawi Sukabumi Seksi 3B", day0_60: "58,9 M", day60_180: "45,2 M", day180: "0 M", total: "104,2 M", kolektibilitas: "Lancar" },
  { id: "1425010", name: "Perbaikan Jalan Tol KAPB JOP", day0_60: "53,2 M", day60_180: "17,2 M", day180: "0 M", total: "70,4 M", kolektibilitas: "Lancar" },
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", day0_60: "28,2 M", day60_180: "25,1 M", day180: "0 M", total: "53,4 M", kolektibilitas: "Lancar" },
  { id: "1423006", name: "Rentang Irrigation LOS-01", day0_60: "16,3 M", day60_180: "22,9 M", day180: "3,8 M", total: "43,0 M", kolektibilitas: "Lancar" },
  { id: "1421046", name: "Pembangunan Pengarah Rukoh", day0_60: "3,1 M", day60_180: "8,2 M", day180: "8,3 M", total: "19,7 M", kolektibilitas: "Macet (DIPA)" },
];
