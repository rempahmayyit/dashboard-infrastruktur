import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { usePengendalianData } from "../../hooks/usePengendalianData";
import { useFilter } from "../../context/FilterContext";

// Import Komponen
import ManagementReport from "./ManagementReport";
import CoverLayout from "./CoverLayout";
import SlideAgenda from "../components/SlideAgenda";
import SlideProyekOnGoing from "../components/SlideProyekOnGoing";
import SlideKinerjaOperasional from "../components/KinerjaOperasional"; // Pastikan path benar
import SlideWarningList from "../components/SlideWarningList";
import SlideEvaluasiRkap from "../components/EvaluasiRkap"; // Pastikan path benar
import SlideEvaluasiBkpu from "../components/EvaluasiBkpu"; // Pastikan path benar
import SlideMonitoringBudget from "../components/MonitoringBudget"; // Pastikan path benar
import ClosingLayout from "./ClosingLayout";

const ReportDashboard = () => {
  const slideContainerRef = useRef(null);
  const componentRef = useRef(null);
  const pengendalian = usePengendalianData();

   const { excelData } = useFilter();

  console.log("db_renc_eb :", excelData.db_renc_eb);
  console.log("Jumlah :", excelData.db_renc_eb.length);
  console.log("Data pertama :", excelData.db_renc_eb[0]);

  // State untuk Slideshow
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scale, setScale] = useState(1);

  // Data
  const reportData = {
    cover: {},
    agenda: [],
  };

  // Kumpulan Slide untuk Mode Presentasi
  const slides = [
    <CoverLayout key="cover" data={reportData.cover} />,
    <SlideAgenda key="agenda" />,
    <SlideProyekOnGoing key="proyek" />,
    <SlideKinerjaOperasional key="operasional" />,
    <SlideWarningList
      key="warning"
      pageNumber={4}
      pureTimeOverrunProjects={pengendalian.pureTimeOverrun}
      almostOverrun={pengendalian.almostOverrun}
      behindScheduleProjects={pengendalian.behindScheduleProjects}
      bkpuMappProjects={pengendalian.bkpuMappProjects}
      totalProject={pengendalian.totalProject}
      timeOverrunPercent={pengendalian.timeOverrunPercent}
      behindSchedulePercent={pengendalian.behindSchedulePercent}
      bkpuMappPercent={pengendalian.bkpuMappPercent}
    />,
    <SlideEvaluasiRkap key="rkap" />,
    <SlideEvaluasiBkpu key="bkpu" />,
    <SlideMonitoringBudget key="budget" />,
    <ClosingLayout key="closing" pageNumber={15} />, // Dinamis
  ];

  // --- LOGIKA SLIDESHOW ---

  // 1. Mengatur Ukuran Skala (Fit to Screen) saat Fullscreen
  useEffect(() => {
    const calculateScale = () => {
      // 338.67mm x 190.5mm setara dengan resolusi ~1280x720px
      const widthRatio = window.innerWidth / 1280;
      const heightRatio = window.innerHeight / 720;
      // Ambil rasio terkecil agar slide selalu masuk ke dalam layar sepenuhnya
      setScale(Math.min(widthRatio, heightRatio) * 0.98); // 98% agar ada sedikit margin
    };

    if (presentationMode) {
      calculateScale();
      window.addEventListener("resize", calculateScale);
    }

    return () => window.removeEventListener("resize", calculateScale);
  }, [presentationMode]);

  // 2. Navigasi Keyboard & Keluar dari Fullscreen (Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!presentationMode) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    // Deteksi jika pengguna menekan "Esc" bawaan browser untuk keluar fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPresentationMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [presentationMode, slides.length]);

  // --- HANDLER TOMBOL ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Report_Manajemen_Infrastruktur",
  });

  const handleStartPresentation = async () => {
    setCurrentSlide(0);
    setPresentationMode(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Gagal masuk mode fullscreen:", err);
    }
  };

  const handleExitPresentation = () => {
    setPresentationMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (slideContainerRef.current) {
      slideContainerRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  // --- RENDER MODE PRESENTASI ---
  if (presentationMode) {
    return (
      <div
        ref={slideContainerRef}
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: "30px 0",
        }}
      >
        {/* Wrapper Slide dengan CSS Transform untuk Scaling */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease-out",
            margin: "0 auto",
          }}
        >
          {slides[currentSlide]}
        </div>

        {/* Kontrol Navigasi Mengambang (Hover) */}
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(30, 41, 59, 0.85)",
            backdropFilter: "blur(10px)",
            padding: "10px 20px",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 10000,
            transition: "opacity 0.3s",
            opacity: 0.2, // Transparan saat tidak disentuh
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.2)}
        >
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            style={navBtnStyle}
            disabled={currentSlide === 0}
          >
            ◀ Prev
          </button>

          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              minWidth: "50px",
              textAlign: "center",
            }}
          >
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={() =>
              setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
            }
            style={navBtnStyle}
            disabled={currentSlide === slides.length - 1}
          >
            Next ▶
          </button>

          <div
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          ></div>

          <button
            onClick={handleExitPresentation}
            style={{ ...navBtnStyle, color: "#FCA5A5" }}
          >
            ✖ Exit
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER MODE NORMAL (DASHBOARD) ---
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F1F5F9",
        minHeight: "100vh",
      }}
    >
      {/* Toolbar Atas */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "15px 25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#002060",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Report Dashboard
          </h2>
          <p
            style={{ margin: "5px 0 0 0", color: "#64748B", fontSize: "14px" }}
          >
            Pratinjau, Presentasikan, atau Ekspor dokumen laporan
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={handleStartPresentation} style={primaryBtnStyle}>
            <span style={{ fontSize: "16px" }}>▶</span> Slideshow
          </button>
          <button onClick={handlePrint} style={secondaryBtnStyle}>
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* Area Pratinjau (Preview) untuk diekspor */}
      <div style={{ opacity: 1 }}>
        <ManagementReport ref={componentRef} data={reportData} />
      </div>
    </div>
  );
};

// --- GAYA CSS TOMBOL (INLINE) ---

const primaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#002060", // Waskita Blue
  color: "white",
  border: "none",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0, 32, 96, 0.2)",
  transition: "all 0.2s",
};

const secondaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#C00000", // Waskita Red
  color: "white",
  border: "none",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "bold",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(192, 0, 0, 0.2)",
  transition: "all 0.2s",
};

const navBtnStyle = {
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "5px",
};

export default ReportDashboard;
