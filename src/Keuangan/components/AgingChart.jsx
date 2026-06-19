import React, { useMemo } from "react";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Impor formatter global
import { formatFinancialMiliar } from "../../utils/formatters";

export default function AgingChart({ chartData = [], detailData = [] }) {
  // 1. FORMAT DATA UNTUK BAR CHART
  const formattedBarData = useMemo(() => {
    return chartData
      .map((item) => {
        let bucketName = item.aging_bucket;
        if (bucketName === ">360") bucketName = "> 360";
        else if (bucketName) bucketName = bucketName.replace("-", " s/d ");

        return {
          name: bucketName,
          "Piutang Termin": Number((item.termin / 1000000000).toFixed(1)) || 0,
          "Piutang Retensi":
            Number((item.retensi / 1000000000).toFixed(1)) || 0,
          "Tagihan Bruto (WIP)":
            Number((item.bruto / 1000000000).toFixed(1)) || 0,
          sortOrder: item.sort_order,
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [chartData]);

  // 2. FORMAT DATA UNTUK DONUT CHART (Agregasi dari detailData)
  const donutData = useMemo(() => {
    if (!detailData || detailData.length === 0) return [];

    // Grouping berdasarkan kolom tipe_owner (Jika null, asumsikan 'Lainnya')
    const grouped = detailData.reduce((acc, curr) => {
      const ownerType = curr.tipe_owner?.trim() || "Lainnya";

      acc[ownerType] = (acc[ownerType] || 0) + Number(curr.value || 0);

      return acc;
    }, {});

    return Object.keys(grouped)
      .map((key) => ({
        name: key,
        value: Number((grouped[key] / 1000000).toFixed(1)), // Konversi ke Milyar
      }))
      .sort((a, b) => b.value - a.value); // Urutkan dari yang terbesar
  }, [detailData]);

  const DONUT_COLORS = ["#000075", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Formatter agar angka 0 tidak tampil menumpuk di atas grafik
  const renderLabelContent = (props) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#64748b"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
      >
        {formatFinancialMiliar(value * 1000000000, 1)}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* KIRI: BAR CHART */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={16} className="text-[#000075]" />
            Aging Profile (Milyar Rp)
          </h3>
        </div>

        {/* Tambahkan min-h dan min-w 0 untuk mengakali warning Recharts */}
        <div className="w-full h-72 min-w-0">
          {formattedBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedBarData}
                margin={{ top: 25, right: 10, bottom: 5, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  style={{ fontSize: 10, fontWeight: "bold" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(val) =>
                    formatFinancialMiliar(val * 1000000000, 1)
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

                <Bar
                  dataKey="Piutang Termin"
                  fill="#BD002F"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList content={renderLabelContent} />
                </Bar>
                <Bar
                  dataKey="Piutang Retensi"
                  fill="#000075"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList content={renderLabelContent} />
                </Bar>
                <Bar
                  dataKey="Tagihan Bruto (WIP)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList content={renderLabelContent} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Menunggu data grafik...
            </div>
          )}
        </div>
      </div>

      {/* KANAN: DONUT CHART (TIPE OWNER) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PieIcon size={16} className="text-[#000075]" />
            Komposisi Tipe Owner (Milyar Rp)
          </h3>
        </div>

        <div className="w-full h-72 min-w-0">
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val) =>
                    formatFinancialMiliar(val * 1000000000, 1)
                  }
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={true}
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Menunggu data tipe owner...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
