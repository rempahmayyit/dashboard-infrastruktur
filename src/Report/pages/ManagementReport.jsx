import React, { forwardRef } from "react";
import { usePengendalianData } from "../../hooks/usePengendalianData";

import CoverLayout from "./CoverLayout";
import AgendaLayout from "./AgendaLayout";
import ContentLayout from "./ContentLayout"; // Boleh dihapus dari sini jika tidak dipakai langsung di file ini
import ClosingLayout from "./ClosingLayout";

// Import semua komponen slide dari folder components
import SlideAgenda from "../components/SlideAgenda";
import SlideProyekOnGoing from "../components/SlideProyekOnGoing";
import SlideWarningList from "../components/SlideWarningList";
import SlideKinerjaOperasional from "../components/KinerjaOperasional";
import SlideEvaluasiRkap from "../components/EvaluasiRkap";
import SlideEvaluasiBkpu from "../components/EvaluasiBkpu";
import SlideEvaluasiSisaRkap from "../components/EvaluasiSisaRkap";
import SlideMonitoringBudget from "../components/MonitoringBudget";
import SlideTagihanBruto from "../components/SlideTagihanBruto";
import SlideAgingStock from "../components/SlideAgingStock";
import SlideCadPemeliharaan from "../components/SlideCadPemeliharaan";

const ManagementReport = forwardRef(({ data }, ref) => {
  if (!data) return <div ref={ref}>Memuat dokumen...</div>;

  const pengendalian = usePengendalianData();

  return (
    <div ref={ref}>
      {/* Halaman 1 */}
      <CoverLayout data={data.cover} />
      {/* Halaman 2 */}
      <SlideAgenda /> {/* Pasang di sini */}
      {/* Halaman 3 */}
      <SlideProyekOnGoing />
      {/* Halaman 3 */}
      <SlideKinerjaOperasional />
      {/* Halaman 4 */}
      <SlideWarningList
        pageNumber={4}
        pureTimeOverrunProjects={pengendalian.pureTimeOverrun}
        almostOverrun={pengendalian.almostOverrun}
        behindScheduleProjects={pengendalian.behindScheduleProjects}
        bkpuMappProjects={pengendalian.bkpuMappProjects}
        totalProject={pengendalian.totalProject}
        timeOverrunPercent={pengendalian.timeOverrunPercent}
        behindSchedulePercent={pengendalian.behindSchedulePercent}
        bkpuMappPercent={pengendalian.bkpuMappPercent}
      />
      {/* Halaman 6 */}
      <SlideEvaluasiRkap />
      
      {/* Halaman 9 */}
      <SlideEvaluasiBkpu />
      
      {/* Halaman 9 */}
      <SlideEvaluasiSisaRkap />
      
      {/* Halaman 14 */}
      <SlideMonitoringBudget />

      {/* Halaman 14 */}
      <SlideCadPemeliharaan />

      {/* Halaman 14 */}
      <SlideTagihanBruto />

      {/* Halaman 14 */}
      <SlideAgingStock />
      
      {/* Halaman Penutup */}
      <ClosingLayout pageNumber={15} />
    </div>
  );
});

export default ManagementReport;
