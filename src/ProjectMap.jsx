// src/ProjectMap.jsx
import React from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";

// Data koordinat kartesian proyek disesuaikan dengan posisi peta Indonesia asli
const projectData = [
  { id: "1323020", name: "Tol Probolinggo-Banyuwangi Pkt 3", x: 42, y: 21, gap: "Potensi Delay", status: "Critical" },
  { id: "1323042", name: "Jalan Tol Ciawi Sukabumi Seksi 3A", x: 26, y: 22, gap: "-15 M", status: "Critical" },
  { id: "1324010", name: "Jalan Tol Ciawi Sukabumi Seksi 3B", x: 28, y: 20, gap: "-34 M", status: "Critical" },
  { id: "1425013", name: "Irigasi Belitang Lempuing Pkt 2", x: 19, y: 44, gap: "Dispute", status: "On Going" },
  { id: "MERAUKE", name: "Irigasi Rawa KSPP Merauke", x: 92, y: 15, gap: "Nilai 48.6", status: "Critical" },
  { id: "IKN-IPAL", name: "IPAL 1,2,3 IKN", x: 52, y: 55, gap: "Nilai 79.77", status: "Critical" }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs max-w-xs font-sans">
        <p className="font-bold text-blue-400 mb-0.5">{data.id}</p>
        <p className="font-black text-sm mb-1">{data.name}</p>
        <p className="text-slate-300">Status: <span className={data.status === "Critical" ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{data.status}</span></p>
        <p className="text-slate-300 mt-0.5">Keterangan: <span className="text-amber-400 font-semibold">{data.gap}</span></p>
      </div>
    );
  }
  return null;
};

export default function ProjectMap() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-full break-inside-avoid">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Sebaran Geografis Proyek Klaster Nusantara</h3>
          <p className="text-slate-500 text-xs mt-0.5">Peta interaktif koordinat lokasi log proyek kritis dan berjalan s.d April 2026</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#000075]"></span><span className="text-slate-600">On Going</span></div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#BD002F]"></span><span className="text-slate-600">Critical / Delay</span></div>
        </div>
      </div>

      {/* RENDER BOX REALISTIS MAP BACKGROUND */}
      <div className="w-full bg-[#f8fafc] rounded-xl border border-slate-100 relative p-2 overflow-hidden min-h-[340px]">
        {/* GAMBAR SILUET PETA ASLI INDONESIA DARI REPOSITORI WIKIMEDIA */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center p-4">
          <img 
            src="wikimedia.org" 
            alt="Peta Indonesia Realistis" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* CONTAINER PLACEMENT SCATTER PLOT */}
        <div className="w-full h-[320px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
              <YAxis type="number" dataKey="y" domain={[0, 100]} hide />
              <ZAxis type="number" range={[150, 160]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />
              <Scatter data={projectData}>
                {projectData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === "Critical" ? "#BD002F" : "#000075"}
                    className="cursor-pointer hover:scale-125 transition-transform duration-200"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
