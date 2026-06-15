import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";

const AgendaLayout = ({ children, pageNumber }) => {
  return (
    <div
      style={{
        width: "297mm",
        height: "206mm",
        border: "1px solid #d1d5db",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        margin: "0 auto 24px auto",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
        boxSizing: "border-box",
        position: "relative",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "20px 30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <img src={logoDanantara} alt="" style={{ height: 40 }} />
        <img src={logoWaskita} alt="" style={{ height: 40 }} />
      </div>

      <div style={{ flex: 1 }}>{children}</div>

      <div
        style={{
          textAlign: "right",
          color: "#666",
          fontWeight: "bold",
        }}
      >
        {pageNumber}
      </div>
    </div>
  );
};

export default AgendaLayout;
