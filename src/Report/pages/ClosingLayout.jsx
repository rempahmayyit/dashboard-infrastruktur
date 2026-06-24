import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";
import bgCoverLayout from "../../assets/bg-CoverLayout.webp";

const ClosingLayout = ({ pageNumber }) => {
  return (
    <div
      style={{
        width: "338.67mm",
        height: "190.5mm",
        border: "1px solid #d1d5db",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        margin: "0 auto 24px auto",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        
        // Background Image Bangunan (Sisi Kanan)
        backgroundImage: `url(${bgCoverLayout})`,
        backgroundSize: "auto 100%",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* HEADER LOGO */}
      <div style={{ position: "absolute", top: "40px", left: "50px", display: "flex", gap: "25px", alignItems: "center" }}>
        <img src={logoDanantara} alt="" style={{ height: 45 }} />
        <img src={logoWaskita} alt="" style={{ height: 45 }} />
      </div>

      {/* CONTENT TERIMA KASIH */}
      <div style={{ padding: "140px 0 0 50px", width: "50%" }}>
        <h1 style={{ color: "#002060", fontSize: "64px", fontWeight: "900", margin: "0 0 30px 0" }}>
          TERIMA KASIH
        </h1>
        
        <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#333", marginBottom: "40px" }}>
          <strong style={{ fontSize: "16px" }}>PT Waskita Karya (Persero) Tbk</strong><br /><br />
          <strong>Alamat Kantor:</strong><br />
          Gedung Waskita Karya<br />
          Jl. MT Haryono Kav. No. 10 Cawang<br />
          Jakarta 13340<br />
          Telepon: (021) 8508510/20<br />
          E-mail: waskita@waskita.co.id
        </div>

        {/* DISCLAIMER BOX */}
        <div style={{ 
          fontSize: "10px", 
          fontStyle: "italic", 
          color: "#666", 
          textAlign: "justify", 
          borderTop: "1px solid #ccc", 
          paddingTop: "15px",
          width: "90%" 
        }}>
          <strong>Disclaimer:</strong> Dokumen ini disusun untuk tujuan informasi, sumber yang disiapkan berasal dari pihak-pihak kredibel, namun kami tidak menjamin keakuratan maupun kelengkapannya...
        </div>
      </div>

      {/* FOOTER SOCIAL MEDIA */}
      <div style={{ position: "absolute", bottom: "40px", left: "50px", display: "flex", gap: "40px", alignItems: "center" }}>
        <div style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", background: "#002060", borderRadius: "3px" }}></div>
          www.waskita.co.id
        </div>
        <div style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", background: "#E4405F", borderRadius: "3px" }}></div>
          @waskita_karya
        </div>
      </div>

      {/* PAGE NUMBER */}
      <div style={{ position: "absolute", bottom: "25px", right: "30px", color: "#666", fontWeight: "bold", fontSize: "14px" }}>
        {pageNumber}
      </div>
    </div>
  );
};

export default ClosingLayout;