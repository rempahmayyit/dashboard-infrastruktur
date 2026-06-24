import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";

const ContentLayout = ({ children, pageNumber, sectionNumber, slideTitle }) => {
  return (
    <div
      style={{
        width: "338.67mm", // PPT Widescreen
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
        padding: "20px 30px",
        lineHeight: "1.0",
      }}
    >
      {/* HEADER */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}
      >
        <img
          src={logoDanantara}
          alt=""
          style={{ height: "35px", marginRight: "20px" }}
        />

        {/* Section Circle */}
        <div
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            border: "6px solid #002b7f",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#002b7f",
            fontWeight: "bold",
            fontSize: "28px",
            flexShrink: 0,
          }}
        >
          {sectionNumber}
        </div>

        <div style={{ width: "20px", height: "6px", background: "#002b7f" }} />

        <div
          style={{
            width: "250px",
            background: "#002b7f",
            color: "white",
            borderRadius: "25px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          INFRASTRUKTUR
        </div>

        <div style={{ width: "20px", height: "5px", background: "#002b7f" }} />

        {/* Slide Title */}
        <div
          style={{
            flex: 1,
            background: "#002b7f",
            color: "white",
            borderRadius: "25px",
            height: "50px",
            padding: "0 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            textAlign: "center",
            fontSize:
              slideTitle?.length > 70
                ? "16px"
                : slideTitle?.length > 40
                  ? "18px"
                  : "22px",
          }}
        >
          {String(slideTitle)
            .split("\n")
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < String(slideTitle).split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
        </div>

        <img
          src={logoWaskita}
          alt=""
          style={{ height: "50px", marginLeft: "25px" }}
        />
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
          fontSize: "14px",
        }}
      >
        <div style={{ color: "#002b7f", fontWeight: "bold" }}>
          #ForBetterWaskita
        </div>
        <div style={{ fontWeight: "bold", color: "#666" }}>{pageNumber}</div>
      </div>
    </div>
  );
};

export default ContentLayout;
