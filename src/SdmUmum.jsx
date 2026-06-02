// src/SdmUmum.jsx
import React from "react";
import { Users, BarChart3, PieChart as PieIcon, Activity } from "lucide-react";
import ModuleOverlay from "./components/ModuleOverlay";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function SdmUmum() {
  const KANTOR_COLORS = ["#BD002F", "#000075"];
  const GEN_COLORS = ["#BD002F", "#000075", "#f97316"];

  // DATA SINKRONISASI SLIDE (HALAMAN 8)
  const dataPegawai = [
    { name: "Kantor", value: 206 },
    { name: "Proyek", value: 848 },
  ];

  const dataJobLevel = [
    { level: "BOD-1", jumlah: 1 },
    { level: "BOD-2", jumlah: 13 },
    { level: "BOD-3", jumlah: 47 },
    { level: "BOD-4", jumlah: 209 },
    { level: "BOD-5", jumlah: 784 },
  ];

  const dataGenerasi = [
    { name: "Gen X (1965-1980)", value: 14 },
    { name: "Gen Y (1981-1996)", value: 77 },
    { name: "Gen Z (1997-2012)", value: 9 },
  ];

  const dataUsia = [
    { range: "≤ 25 th", jumlah: 23 },
    { range: "26 - 35 th", jumlah: 519 },
    { range: "36 - 45 th", jumlah: 366 },
    { range: "46 - 55 th", jumlah: 139 },
    { range: "> 55 th", jumlah: 7 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* HEADER TOP METRICS ROW (KOMPAK SESUAI SLIDE SHOT) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Total Employee
          </p>
          <h4 className="text-xl font-black text-slate-800 mt-1">1.054</h4>
          <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded block mt-1 text-slate-600">
            Organik & OS
          </span>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">
            Employee Detail
          </p>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center font-bold text-white mt-1">
            <div className="bg-blue-600 rounded p-1" title="PT">
              418
            </div>
            <div className="bg-blue-400 rounded p-1" title="PTT">
              58
            </div>
            <div className="bg-amber-500 rounded p-1" title="OS">
              578
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">
            Outsourcing (OS)
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-center font-bold text-white mt-1">
            <div className="bg-red-700 rounded p-1" title="WAGS">
              215
            </div>
            <div className="bg-blue-900 rounded p-1" title="DMS">
              363
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">
            Gender
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-center font-bold mt-1">
            <div className="bg-blue-100 text-blue-800 rounded p-1" title="Pria">
              956
            </div>
            <div
              className="bg-pink-100 text-pink-800 rounded p-1"
              title="Wanita"
            >
              98
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">
            MT / Non MT
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-center font-bold text-white mt-1">
            <div className="bg-indigo-600 rounded p-1" title="MT">
              265
            </div>
            <div className="bg-orange-500 rounded p-1" title="Non MT">
              211
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE CHARTS GRID ROW (3 KOLOM KINERJA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* KANAN/KIRI 1: JUMLAH PEGAWAI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users size={14} /> Jumlah Pegawai (Lokasi)
          </h3>
          <div className="w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPegawai}
                  dataKey="value"
                  outerRadius={55}
                  innerRadius={25}
                  label={{ fontSize: 10, fontWeight: "bold" }}
                >
                  {dataPegawai.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={KANTOR_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KOLOM 2: PEGAWAI BERDASARKAN JOB LEVEL */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <BarChart3 size={14} /> Pegawai Berdasarkan Job Level
          </h3>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataJobLevel}
                margin={{ top: 10, right: 5, bottom: 5, left: -25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="level"
                  style={{ fontSize: 9, fontWeight: "bold" }}
                  stroke="#94a3b8"
                />
                <YAxis style={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar
                  dataKey="jumlah"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KOLOM 3: PEGAWAI BERDASARKAN GENERASI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <PieIcon size={14} /> Pegawai Berdasarkan Generasi
          </h3>
          <div className="w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataGenerasi}
                  dataKey="value"
                  outerRadius={55}
                  label={{ fontSize: 10, fontWeight: "bold" }}
                >
                  {dataGenerasi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GEN_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER GRID SECTION: RENTANG USIA & PRODUKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* GRAFIK USIA HORISONTAL (LEBAR 2 KOLOM) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1">
            <BarChart3 size={14} /> Pegawai Berdasarkan Rentang Usia
          </h3>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataUsia}
                layout="vertical"
                margin={{ top: 5, right: 25, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" style={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis
                  dataKey="range"
                  type="category"
                  style={{ fontSize: 10, fontWeight: "600" }}
                  stroke="#94a3b8"
                />
                <Tooltip />
                <Bar
                  dataKey="jumlah"
                  fill="#BD002F"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RESUME POSISI PRODUKTIVITAS BOX MONOLIT */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#000075] flex flex-col justify-between items-center text-center shadow-md bg-gradient-to-br from-slate-50 to-white">
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <Activity className="text-[#000075] animate-pulse" size={26} />
            <h3 className="text-sm font-black text-[#000075] uppercase tracking-widest">
              PRODUKTIVITAS
            </h3>
          </div>

          <div className="my-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              2.281.134
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Nilai Output Per Kapita
            </p>
          </div>

          <div className="w-full bg-[#000075] text-white rounded-xl py-1.5 text-xs font-bold tracking-wide">
            Periode April 2026
          </div>
        </div>
      </div>
      <ModuleOverlay/>
    </div>
  );
}
