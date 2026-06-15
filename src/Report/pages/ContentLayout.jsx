import React from "react";
import logoDanantara from "../../assets/Logo_danantara.png";
import logoWaskita from "../../assets/waskita_logo.png";

const ContentLayout = ({
  children,
  pageNumber,
  sectionNumber,
  sectionTitle,
  slideTitle,
}) => {
  const titleFontSize =
    slideTitle?.length > 70
      ? "14px"
      : slideTitle?.length > 50
        ? "16px"
        : "20px";

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
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "18px 24px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Logo Danantara */}
        <img
          src={logoDanantara}
          alt=""
          style={{
            height: "30px",
            marginRight: "15px",
          }}
        />

        {/* Circle Number */}
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
            background: "#fff",
            flexShrink: 0,
          }}
        >
          {sectionNumber}
        </div>

        {/* Connector kiri */}
        <div
          style={{
            width: "18px",
            height: "6px",
            background: "#002b7f",
          }}
        />

        {/* INFRASTRUKTUR */}
        <div
          style={{
            width: "230px", // FIXED
            background: "#002b7f",
            color: "white",
            borderRadius: "20px",
            height: "48px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontWeight: "bold",
            fontSize: "18px",

            flexShrink: 0,
          }}
        >
          INFRASTRUKTUR
        </div>

        {/* Connector tengah */}
        <div
          style={{
            width: "18px",
            height: "6px",
            background: "#002b7f",
          }}
        />

        {/* Judul Slide */}
        <div
          style={{
            flex: 1,
            background: "#002b7f",
            color: "white",
            borderRadius: "20px",
            height: "56px",

            padding: "6px 24px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontWeight: "bold",

            textAlign: "center",

            marginRight: "10px",

            overflow: "hidden",

            lineHeight: "1.1",

            fontSize:
              slideTitle?.length > 60
                ? "16px"
                : slideTitle?.length > 40
                  ? "18px"
                  : "22px",
          }}
        >
          {slideTitle}
        </div>

        {/* Logo Waskita */}
        <img
          src={logoWaskita}
          alt=""
          style={{
            height: "50px",
            marginLeft: "20px",
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <div
          style={{
            color: "#002b7f",
            fontWeight: "600",
          }}
        >
          #ForBetterWaskita
        </div>

        <div
          style={{
            fontWeight: "bold",
          }}
        >
          {pageNumber}
        </div>
      </div>
    </div>
  );
};

export default ContentLayout;
