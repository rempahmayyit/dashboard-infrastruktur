import React from "react";
import AgendaLayout from "../pages/AgendaLayout"; // Sesuaikan path-nya

const SlideAgenda = () => {
  const agendaItems = [
    "PROYEK - PROYEK ON GOING 2026",
    "KINERJA OPERASIONAL MEI 2026",
    "EVALUASI BULAN INI (TIME OVERRUN, BEHIND SCHEDULE & COST OVERRUN)",
    "EVALUASI KINERJA DIVISI INFRASTRUKTUR",
    "MONITORING PEMAKAIAN BUDGET",
  ];

  return (
    <AgendaLayout pageNumber={2}>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        marginTop: "-20px" // Sedikit naik agar visual balance dengan logo di atas
      }}>
        
        {/* Judul Slide (Centered) */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "#002060",
              letterSpacing: "4px",
              margin: 0,
              paddingBottom: "10px",
            }}
          >
            AGENDA
          </h1>
          {/* Garis Aksen Merah di Tengah */}
          <div style={{ 
            width: "80px", 
            height: "6px", 
            backgroundColor: "#C00000", 
            margin: "0 auto" 
          }}></div>
        </div>

        {/* Daftar Agenda (Card Style) */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "18px", 
          width: "85%", // Menjaga kartu tidak terlalu lebar
          maxWidth: "900px" 
        }}>
          {agendaItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)", // Shadow halus agar tidak polos
                border: "1px solid #f0f0f0",
                transition: "transform 0.2s"
              }}
            >
              {/* Nomor Agenda (Box Style) */}
              <div
                style={{
                  width: "70px",
                  height: "65px",
                  backgroundColor: "#002060",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "28px",
                  fontWeight: "900",
                  flexShrink: 0,
                  borderRight: "4px solid #C00000" // Aksen pemisah merah
                }}
              >
                {index + 1}
              </div>

              {/* Teks Agenda */}
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#333",
                  padding: "0 30px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}
              >
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AgendaLayout>
  );
};

export default SlideAgenda;