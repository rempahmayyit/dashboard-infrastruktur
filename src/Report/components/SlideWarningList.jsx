import React from "react";
import ContentLayout from "../pages/ContentLayout";

const SlideWarningList = ({
  pageNumber = 4,
  pureTimeOverrunProjects = [],
  almostOverrun = [],
  behindScheduleProjects = [],
  bkpuMappProjects = [],
  totalProject = 0,
  timeOverrunPercent = 0,
  behindSchedulePercent = 0,
}) => {
  const bkpuPercent =
    totalProject > 0
      ? Math.round((bkpuMappProjects.length / totalProject) * 100)
      : 0;

  const Donut = ({ percent, color }) => {
    const size = 60;
    const center = size / 2;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percent / 100) * circumference}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 12,
            color,
            lineHeight: 1,
          }}
        >
          {percent}%
        </div>
      </div>
    );
  };

  const tableHeaderStyle = {
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    padding: "6px 8px",
    textAlign: "center",
  };

  const cellStyle = {
    fontSize: 11,
    padding: "5px 6px",
    borderBottom: "1px solid #E5E7EB",
  };

  const projectCellStyle = {
    ...cellStyle,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "14px",
  };

  return (
    <ContentLayout
      pageNumber={pageNumber}
      sectionNumber={4}
      slideTitle="EVALUASI BULAN INI (TIME OVERRUN, BEHIND SCHEDULE & COST OVERRUN)"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          alignItems: "start",
        }}
      >
        {/* ====================================================== */}
        {/* TIME OVERRUN */}
        {/* ====================================================== */}

        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: 16,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              background: "#FEF2F2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                TIME OVERRUN
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 600,
                }}
              >
                Rasio Kasus : {pureTimeOverrunProjects.length}/{totalProject}
              </div>
            </div>

            <Donut percent={timeOverrunPercent} color="#BD002F" />
          </div>

          <div style={{ padding: 10 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead
                style={{
                  background: "#008B8B",
                }}
              >
                <tr>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      textAlign: "left",
                      width: "50%",
                    }}
                  >
                    Proyek
                  </th>

                  <th style={tableHeaderStyle}>Prog</th>
                  <th style={tableHeaderStyle}>End Date</th>
                  <th style={tableHeaderStyle}>Remain</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...cellStyle,
                      fontWeight: 800,
                      background: "#F8FAFC",
                    }}
                  >
                    TIME OVERRUN
                  </td>
                </tr>

                {pureTimeOverrunProjects.map((p, i) => (
                  <tr key={i}>
                    <td style={projectCellStyle} title={p.name}>
                      {p.name}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.prog}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.endDate}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        color: "#DC2626",
                        fontWeight: 700,
                      }}
                    >
                      {p.remain}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...cellStyle,
                      fontWeight: 800,
                      background: "#F8FAFC",
                    }}
                  >
                    ALMOST OVERRUN
                  </td>
                </tr>

                {almostOverrun.map((p, i) => (
                  <tr key={i}>
                    <td style={projectCellStyle} title={p.name}>
                      {p.name}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.prog}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.endDate}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        color: "#DC2626",
                        fontWeight: 700,
                      }}
                    >
                      {p.remain}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====================================================== */}
        {/* BEHIND SCHEDULE */}
        {/* ====================================================== */}

        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              background: "#FFF7ED",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                BEHIND SCHEDULE
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 600,
                }}
              >
                Rasio Kasus : {behindScheduleProjects.length}/{totalProject}
              </div>
            </div>

            <Donut percent={behindSchedulePercent} color="#EA580C" />
          </div>

          <div style={{ padding: 10 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead style={{ background: "#995100" }}>
                <tr>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      textAlign: "left",
                      width: "58%",
                    }}
                  >
                    Proyek
                  </th>

                  <th style={tableHeaderStyle}>Ra</th>
                  <th style={tableHeaderStyle}>Ri</th>
                  <th style={tableHeaderStyle}>Dev</th>
                </tr>
              </thead>

              <tbody>
                {behindScheduleProjects.map((p, i) => (
                  <tr key={i}>
                    <td style={projectCellStyle} title={p.name}>
                      {p.name}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.ra}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {p.ri}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        color: "#DC2626",
                        fontWeight: 700,
                      }}
                    >
                      {p.dev}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====================================================== */}
        {/* BKPU > MAPP */}
        {/* ====================================================== */}

        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              background: "#EFF6FF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                BK/PU &gt; MAPP
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 600,
                }}
              >
                Rasio Kasus : {bkpuMappProjects.length}/{totalProject}
              </div>
            </div>

            <Donut percent={bkpuPercent} color="#000075" />
          </div>

          <div style={{ padding: 10 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead style={{ background: "#000050" }}>
                <tr>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      textAlign: "left",
                      width: "50%",
                    }}
                  >
                    Proyek
                  </th>

                  <th style={tableHeaderStyle}>Prog</th>
                  <th style={tableHeaderStyle}>MAPP</th>
                  <th style={tableHeaderStyle}>Real</th>
                  <th style={tableHeaderStyle}>Dev</th>
                </tr>
              </thead>

              <tbody>
                {bkpuMappProjects.map((p, i) => (
                  <tr key={i}>
                    <td style={projectCellStyle} title={p.name}>
                      {p.name}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {Number(p.prog || 0).toFixed(2)}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {Number(p.mapp || 0).toFixed(2)}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        color: "#000075",
                        fontWeight: 700,
                      }}
                    >
                      {Number(p.real || 0).toFixed(2)}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        color: "#DC2626",
                        fontWeight: 700,
                      }}
                    >
                      {Number(p.dev || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SlideWarningList;
