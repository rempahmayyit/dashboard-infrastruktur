import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";

const AgendaLayout = ({ children, pageNumber }) => {
  return (
    <div
      style={{
        width: "338.67mm", // Ukuran PPT Widescreen
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
        display: "flex",
        flexDirection: "column",
        padding: "30px 50px", // Padding disesuaikan
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <img src={logoDanantara} alt="" style={{ height: 45 }} />
        <img src={logoWaskita} alt="" style={{ height: 45 }} />
      </div>

      <div style={{ flex: 1 }}>{children}</div>

      <div
        style={{
          textAlign: "right",
          color: "#666",
          fontWeight: "bold",
          fontSize: "14px"
        }}
      >
        {pageNumber}
      </div>
    </div>
  );
};

export default AgendaLayout;