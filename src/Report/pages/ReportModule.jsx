import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ManagementReport from "./ManagementReport";

const ReportDashboard = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Report",
  });

  // Di dalam file src/Report/Pages/ReportModule.jsx

  const reportData = {
    cover: {
      judul: "EVALUASI KINERJA BULANAN",
      periode: "(PRODUKSI) - MEI 2026",
      divisi: "DIVISI INFRASTRUKTUR",
      tanggal: "Jakarta, 4-5 Mei 2026",
    },
    agenda: [
      "Proyek - Proyek On Going 2026",
      "Kinerja Operasional MEI 2026",
      "Evaluasi Time Overrun",
      "Evaluasi Kinerja Div. Infrastruktur",
    ],
    proyekOnGoing: [
      {
        wilayah: "ACEH",
        proyek: [
          { nama: "Bang. Pengarah Rukoh", progress: 55.09 },
          { nama: "Fasilitas Pengarah Rukoh JO", progress: 67.62 },
        ],
      },
    ],
    kinerjaOperasional: {
      tabel: [
        {
          uraian: "PRODUKSI USAHA (PU)",
          rkap: 1045.8,
          realisasi: 1309.48,
          capaian: 125.21,
        },
        {
          uraian: "BIAYA KONTRAK (BK)",
          rkap: 1492.23,
          realisasi: 1066.27,
          capaian: 71.45,
        },
        {
          uraian: "LABA KOTOR (LK)",
          rkap: -446.43,
          realisasi: 243.21,
          capaian: null,
        },
      ],
      trenPU: [
        { bulan: "JAN", rkap: 149, realisasi: 205 },
        { bulan: "FEB", rkap: 141, realisasi: 223 },
      ],
    },
    evaluasiBulanIni: {
      overrun: [
        {
          no: 1,
          nama: "Oplah III Sumut",
          renc: 91.4,
          real: 91.4,
          dev: -0.0,
          jadwal: "31-May-26",
          sisa: 0,
        },
        {
          no: 2,
          nama: "Japeksel 3 Induk",
          renc: 98.57,
          real: 98.57,
          dev: -0.0,
          jadwal: "23-Jun-26",
          sisa: 23,
        },
      ],
      behindSchedule: [
        { no: 1, nama: "Patimban Port", renc: 97.76, real: 69.94, dev: -27.82 },
        {
          no: 2,
          nama: "Bendungan Rukoh",
          renc: 67.62,
          real: 55.09,
          dev: -12.53,
        },
      ],
    },
    evaluasiDetailV2: [
      {
        no: 1,
        nama: "Perbaikan KAPB",
        nilaiKontrak: 856594,
        rkapPU: 112933,
        rkapBK: 95877,
        realPU: 225956,
        realBK: 175519,
        deviasiBK: -62586,
        progPU: 150000,
        progBK: 130000,
        sisaPU: 37067,
        sisaBK: 34123,
        lk: -67493,
      },
    ],
    financialTableData: {
    puRkapTotal: 1045800000000, puRealTotal: 1309480000000, puPercent: 125.21, puRkapTahunan: 5589640000000, sisaPuTotal: 4280160000000,
    puRkapNonJo: 600000000000, puRealNonJo: 700000000000, puNonJoPercent: 116.66, puRkapTahunanNonJo: 3000000000000, sisaPuNonJo: 2300000000000,
    puRkapJoi: 445800000000, puRealJoi: 609480000000, puJoiPercent: 136.71, puRkapTahunanJoi: 2589640000000, sisaPuJoi: 1980160000000,

    bkTotal: 1492230000000, bkRealTotal: 1066270000000, bkRkapTahunan: 5172310000000, sisaBkTotal: 4106040000000,
    bkNonJo: 800000000000, bkRealNonJo: 600000000000, bkRkapTahunanNonJo: 2800000000000, sisaBkNonJo: 2200000000000,
    bkJoi: 692230000000, bkRealJoi: 466270000000, bkRkapTahunanJoi: 2372310000000, sisaBkJoi: 1906040000000,

    bkpuPercent: 142.68, bkpuRealPercent: 81.42, bkpuRkapTahunan: 92.53, sisaBkpuTotal: 95.93,
    bkpuNonJoPercent: 133.33, bkpuRealNonJoPercent: 85.71, bkpuRkapTahunanNonJo: 93.33, sisaBkpuNonJo: 95.65,
    bkpuJoiPercent: 155.27, bkpuRealJoiPercent: 76.50, bkpuRkapTahunanJoi: 91.60, sisaBkpuJoi: 96.25,

    lkTotal: -446430000000, lkRealTotal: 243210000000, lkPercent: -54.47, lkRkapTahunan: 417330000000, sisaLkTotal: 174120000000,
    lkNonJo: -200000000000, lkRealNonJo: 100000000000, lkRkapTahunanNonJo: 200000000000, sisaLkNonJo: 100000000000,
    lkJoi: -246430000000, lkRealJoi: 143210000000, lkRkapTahunanJoi: 217330000000, sisaLkJoi: 74120000000
  }  
};

  return (
    <div>
      <button onClick={handlePrint}>Export PDF</button>

      <ManagementReport ref={componentRef} data={reportData} />
    </div>
  );
};

export default ReportDashboard;
