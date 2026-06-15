import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";

const ClosingLayout = ({ children, pageNumber }) => {
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
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "50px",
          display: "flex",
          gap: "30px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <img src={logoDanantara} alt="" style={{ height: 50 }} />
        <img src={logoWaskita} alt="" style={{ height: 50 }} />
      </div>

      {children}

      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "20px",
          color: "#666",
        }}
      >
        {pageNumber}
      </div>
    </div>
  );
};

export default ClosingLayout;
