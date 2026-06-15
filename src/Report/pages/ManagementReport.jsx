import React, { forwardRef } from "react";
import { usePengendalianData } from "../../hooks/usePengendalianData";

import CoverLayout from "./CoverLayout";
import AgendaLayout from "./AgendaLayout";
import ContentLayout from "./ContentLayout";
import ClosingLayout from "./ClosingLayout";
import SlideWarningList from "../components/SlideWarningList";

const ManagementReport = forwardRef(({ data }, ref) => {
  if (!data) return <div ref={ref}>Memuat dokumen...</div>;

  const pengendalian = usePengendalianData();

  return (
    <div ref={ref}>
      <CoverLayout data={data.cover} />

      <AgendaLayout data={data.agenda} />

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

      <ClosingLayout />
    </div>
  );
});

export default ManagementReport;
