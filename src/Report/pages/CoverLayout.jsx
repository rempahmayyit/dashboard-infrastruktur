import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";
import bgCoverLayout from "../../assets/bg-CoverLayout.webp";
import { useFilter } from "../../context/FilterContext";

const CoverLayout = ({ children }) => {
  const { globalFilter, bulanText } = useFilter();

  console.log("FILTER:", globalFilter);
  console.log("BULAN TEXT:", bulanText);

  return (
    <div
      style={{
        // --- PERUBAHAN UKURAN STANDAR PPT WIDESCREEN (16:9) ---
        width: "338.67mm",
        height: "190.5mm",
        // -----------------------------------------------------

        border: "1px solid #d1d5db",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        margin: "0 auto 24px auto",
        overflow: "hidden",

        // Pengaturan Background agar pas di rasio 16:9
        backgroundImage: `url(${bgCoverLayout})`,
        backgroundSize: "auto 100%",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#ffffff",

        pageBreakAfter: "always",
        pageBreakInside: "avoid",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* 1. Header: Logo */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <img src={logoDanantara} alt="Logo Danantara" style={{ height: 45 }} />
        <img src={logoWaskita} alt="Logo Waskita" style={{ height: 45 }} />
      </div>

      {/* 2. Body: Teks Judul & Tanggal */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50px",
          zIndex: 10,
          width: "55%", // Menyesuaikan lebar teks di area widescreen
        }}
      >
        <h1
          style={{
            color: "#002060",
            fontSize: "36px",
            fontWeight: "900",
            lineHeight: "1.2",
            margin: "0 0 20px 0",
            textTransform: "uppercase",
          }}
        >
          Evaluasi Kinerja Bulanan
          <br />
          (PRODUKSI) - {bulanText} {globalFilter.tahun}
          <br />
          Divisi Infrastruktur
        </h1>
        <p
          style={{
            color: "#C00000",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0",
          }}
        >
          Jakarta,  2026
        </p>
      </div>

      {/* 3. Footer: Hashtag */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000000",
            }}
          >
            #ForBetterWaskita
          </span>
          <div
            style={{
              width: "100%",
              height: "3px",
              backgroundColor: "#C00000",
              marginTop: "2px",
            }}
          ></div>
        </div>
      </div>

      {/* Konten tambahan */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CoverLayout;
