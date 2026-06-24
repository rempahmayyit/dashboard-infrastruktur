import React from "react";
import ContentLayout from "../pages/ContentLayout"; // Sesuaikan path import

// Komponen kecil untuk merender Progress Bar tiap proyek
const ProjectProgressBar = ({ name, progress, isJo }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5px",
          fontSize: "12px",
          fontWeight: "700",
          color: "#333",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "170px", // Batasi panjang teks agar persentase tidak terdorong
            }}
            title={name} // Tooltip bawaan saat di-hover
          >
            {name}
          </span>
          {isJo && (
            <span
              style={{
                color: "#C00000",
                border: "1px solid #C00000",
                borderRadius: "4px",
                padding: "1px 4px",
                fontSize: "9px",
                fontWeight: "900",
                backgroundColor: "#FFF0F0",
              }}
            >
              JO
            </span>
          )}
        </div>
        <span style={{ color: "#002060" }}>{progress.toFixed(2)}%</span>
      </div>
      
      {/* Latar Belakang Bar (Abu-abu) */}
      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#E2E8F0",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        {/* Fill Bar (Biru Waskita) */}
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#002060",
            borderRadius: "5px",
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};

// Komponen Card Wilayah
const RegionCard = ({ regionName, projects }) => {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header Wilayah */}
      <div
        style={{
          backgroundColor: "#002060",
          color: "#fff",
          padding: "8px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        {regionName}
      </div>
      {/* Daftar Proyek */}
      <div style={{ padding: "15px 15px 5px 15px" }}>
        {projects.map((proj, index) => (
          <ProjectProgressBar
            key={index}
            name={proj.name}
            progress={proj.progress}
            isJo={proj.isJo}
          />
        ))}
      </div>
    </div>
  );
};

const SlideProyekOnGoing = () => {
  // Dummy Data sesuai gambar referensi
  const dataKolomKiri = [
    {
      region: "SULAWESI",
      projects: [
        { name: "Sewerage Makassar", progress: 34.02, isJo: false },
        { name: "Unhas RSUP Makasar", progress: 87.05, isJo: false },
        { name: "Bendung Bolaangmo...", progress: 5.76, isJo: false },
      ],
    },
    {
      region: "DKI",
      projects: [
        { name: "Japek Selatan Paket 3", progress: 98.57, isJo: false },
        { name: "Proyek LRT Jkt Fase 1B", progress: 13.98, isJo: true },
        { name: "Pembangunan NCICD...", progress: 85.03, isJo: true },
      ],
    },
  ];

  const dataKolomTengah = [
    {
      region: "KALIMANTAN",
      projects: [
        { name: "Rusun ASN 3 IKN", progress: 34.80, isJo: false },
        { name: "Kementerian Koordi...", progress: 61.32, isJo: false },
        { name: "Kementerian Koordi... 4", progress: 41.25, isJo: true },
        { name: "Jalan Feeder IKN (K...", progress: 74.00, isJo: false },
        { name: "Jalan Nasional IKN S...", progress: 17.51, isJo: false },
        { name: "IPAL 123 IKN", progress: 26.68, isJo: true },
      ],
    },
  ];

  const dataKolomKanan = [
    {
      region: "JABAR & BANTEN",
      projects: [
        { name: "Bendungan Cibeet", progress: 4.88, isJo: false },
        { name: "Jalan Tol Ciawi Suka...", progress: 5.15, isJo: false },
        { name: "Jaringan Irigasi Renta...", progress: 83.21, isJo: false },
      ],
    },
    {
      region: "BALI, NTB, NTT",
      projects: [
        { name: "Bendungan Mbay...", progress: 31.96, isJo: false },
      ],
    },
    {
      region: "PAPUA & MALUKU",
      projects: [
        { name: "Jalan Mamberamo - E...", progress: 13.15, isJo: false },
      ],
    },
  ];

  return (
    <ContentLayout
      pageNumber={3} // Sesuaikan urutan halamannya
      sectionNumber={1}
      slideTitle="PROYEK - PROYEK ON GOING 2026 (2/2)"
    >
      {/* Grid Utama 3 Kolom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          height: "100%",
          paddingTop: "5px",
        }}
      >
        {/* Kolom Kiri */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {dataKolomKiri.map((wilayah, idx) => (
            <RegionCard key={idx} regionName={wilayah.region} projects={wilayah.projects} />
          ))}
        </div>

        {/* Kolom Tengah */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {dataKolomTengah.map((wilayah, idx) => (
            <RegionCard key={idx} regionName={wilayah.region} projects={wilayah.projects} />
          ))}
        </div>

        {/* Kolom Kanan */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {dataKolomKanan.map((wilayah, idx) => (
            <RegionCard key={idx} regionName={wilayah.region} projects={wilayah.projects} />
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideProyekOnGoing;