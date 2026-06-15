import React from "react";
import { BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function AgingChart() {
  const agingChartData = [
    { name: "0 s/d 30", "Piutang Termin": 68.8, "Piutang Retensi": 3.9, "Tagihan Bruto (WIP)": 664.9 },
    { name: "> 30 s/d 90", "Piutang Termin": 66.5, "Piutang Retensi": 33.5, "Tagihan Bruto (WIP)": 236.2 },
    { name: "> 90 s/d 180", "Piutang Termin": 52.1, "Piutang Retensi": 42.7, "Tagihan Bruto (WIP)": 180.3 },
    { name: "> 180 s/d 360", "Piutang Termin": 68.0, "Piutang Retensi": 105.5, "Tagihan Bruto (WIP)": 105.5 },
    { name: "> 360", "Piutang Termin": 2666.2, "Piutang Retensi": 1584.6, "Tagihan Bruto (WIP)": 1371.2 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 w-full mt-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={16} className="text-[#000075]" />
            Struktur Umur Aging Profile: Piutang Bruto, Termin, dan Retensi
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Penarikan manual klaster jatuh tempo per 04 Mei 2026 (Milyar)
          </p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={agingChartData} margin={{ top: 15, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 11, fontWeight: "bold" }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
            <Bar dataKey="Piutang Termin" fill="#BD002F" radius={[4, 4, 0, 0]} barSize={25} />
            <Bar dataKey="Piutang Retensi" fill="#000075" radius={[4, 4, 0, 0]} barSize={25} />
            <Bar dataKey="Tagihan Bruto (WIP)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}