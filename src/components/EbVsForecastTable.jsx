import React, { useState } from "react";
import { formatNumber } from "../utils/formatters";
import { Maximize2, Minimize2, Activity } from "lucide-react";

// DUMMY DATA
const dummyData = [
  { id: 1, nama: "CWIS", nk: 145314, rencPu: 0, rencBk: 0, rencBkpu: 0, progBulanIni: 0.14, evalPu: 199, evalBk: 517, evalBkpu: 259.55, mapp: 93.00, progDepan: 89.67, rencDepanPu: 478, rencDepanBk: 444, rencDepanBkpu: 92.92 },
  { id: 2, nama: "Jl. Kretek-Girijati", nk: 179073, rencPu: 1227, rencBk: 1071, rencBkpu: 87.32, progBulanIni: 97.15, evalPu: 415, evalBk: 750, evalBkpu: 180.62, mapp: 87.80, progDepan: 0.14, rencDepanPu: 0, rencDepanBk: 0, rencDepanBkpu: -14.66 },
  { id: 3, nama: "IPAL IKN", nk: 402850, rencPu: 10901, rencBk: 13490, rencBkpu: 123.74, progBulanIni: 88.06, evalPu: 12827, evalBk: 16724, evalBkpu: 130.38, mapp: 124.35, progDepan: 23.80, rencDepanPu: 60275, rencDepanBk: 57002, rencDepanBkpu: 94.57 },
];

export default function EbVsForecastTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderFinancial = (num, isPercent = false) => {
    if (!num && num !== 0) return "-";
    const formatted = formatNumber(Math.abs(num), isPercent ? 2 : 0);
    const suffix = isPercent ? "%" : "";
    
    if (num < 0) {
      return <span className="text-red-600 font-semibold">({formatted}{suffix})</span>;
    }
    if (num === 0) {
       return <span className="text-slate-400">-</span>;
    }
    return <span className="text-slate-700">{formatted}{suffix}</span>;
  };

  const RenderTableContent = ({ isFullView = false }) => (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white scrollbar-thin">
      <table className={`w-full text-left border-collapse min-w-[1200px] ${isFullView ? "text-[12px]" : "text-[11px]"}`}>
        <thead className="sticky top-0 z-10">
          {/* HEADER BARIS 1: GROUPING */}
          <tr>
            <th rowSpan={2} className="bg-[#000075] text-white p-2.5 font-bold text-center border-b border-white/20 border-r border-white/20 align-middle w-10">
              No.
            </th>
            <th rowSpan={2} className="bg-[#000075] text-white p-2.5 font-bold text-left border-b border-white/20 border-r border-white/20 align-middle">
              Nama Proyek
            </th>
            <th rowSpan={2} className="bg-[#000075] text-white p-2.5 font-bold text-right border-b border-white/20 border-r border-slate-300 align-middle">
              NK
            </th>
            <th colSpan={3} className="bg-blue-800 text-white p-2.5 font-bold text-center border-b border-blue-900 border-r border-white/20">
              Renc. Bulan Ini EB-01 (Parsial)
            </th>
            {/* Merged baris untuk kolom tunggal agar tidak ada celah kosong */}
            <th rowSpan={2} className="bg-slate-700 text-white p-2.5 font-bold text-center border-b border-slate-800 border-r border-white/20 align-middle leading-tight">
              Real. Prog.<br/>Sd Bulan Ini<br/>
              <span className="text-[9px] font-normal text-slate-300">4</span>
            </th>
            <th colSpan={3} className="bg-red-700 text-white p-2.5 font-bold text-center border-b border-red-800 border-r border-white/20">
              Evaluasi Bulan Ini (Parsial)
            </th>
            <th rowSpan={2} className="bg-amber-600 text-white p-2.5 font-bold text-center border-b border-amber-700 border-r border-white/20 align-middle">
              MAPP<br/>
              <span className="text-[9px] font-normal text-amber-200">8</span>
            </th>
            <th rowSpan={2} className="bg-emerald-600 text-white p-2.5 font-bold text-center border-b border-emerald-700 border-r border-white/20 align-middle leading-tight">
              Renc. Prog.<br/>Sd Bulan Depan<br/>
              <span className="text-[9px] font-normal text-emerald-200">9</span>
            </th>
            <th colSpan={3} className="bg-emerald-500 text-white p-2.5 font-bold text-center border-b border-emerald-600">
              Rencana Bulan Depan (Parsial)
            </th>
          </tr>

          {/* HEADER BARIS 2: SUB-KOLOM */}
          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 shadow-sm text-center">
            {/* Bagian kiri dihapus dari sini karena sudah ditarik dari row atas (rowSpan=2) */}
            <th className="p-2 bg-blue-50/50 text-right border-r border-slate-200">PU <br/><span className="text-[9px] font-normal text-slate-400">1</span></th>
            <th className="p-2 bg-blue-50/50 text-right border-r border-slate-200">BK <br/><span className="text-[9px] font-normal text-slate-400">2</span></th>
            <th className="p-2 bg-blue-50/50 text-right border-r border-slate-200">BK/PU <br/><span className="text-[9px] font-normal text-slate-400">3=2/1</span></th>
            
            <th className="p-2 bg-red-50/50 text-right border-r border-slate-200">PU <br/><span className="text-[9px] font-normal text-slate-400">5</span></th>
            <th className="p-2 bg-red-50/50 text-right border-r border-slate-200">BK <br/><span className="text-[9px] font-normal text-slate-400">6</span></th>
            <th className="p-2 bg-red-50/50 text-right border-r border-slate-200">BK/PU <br/><span className="text-[9px] font-normal text-slate-400">7=6/5</span></th>
            
            <th className="p-2 bg-emerald-50/50 text-right border-r border-slate-200">PU <br/><span className="text-[9px] font-normal text-slate-400">10</span></th>
            <th className="p-2 bg-emerald-50/50 text-right border-r border-slate-200">BK <br/><span className="text-[9px] font-normal text-slate-400">11</span></th>
            <th className="p-2 bg-emerald-50/50 text-right">BK/PU <br/><span className="text-[9px] font-normal text-slate-400">12=11/10</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dummyData.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="p-2.5 text-center text-slate-500 border-r border-slate-100">{idx + 1}</td>
              <td className="p-2.5 font-bold text-slate-800 whitespace-nowrap border-r border-slate-100">{item.nama}</td>
              <td className="p-2.5 text-right font-semibold text-slate-700 border-r border-slate-100">{formatNumber(item.nk)}</td>
              
              <td className="p-2.5 text-right bg-blue-50/10">{renderFinancial(item.rencPu)}</td>
              <td className="p-2.5 text-right bg-blue-50/10">{renderFinancial(item.rencBk)}</td>
              <td className="p-2.5 text-right font-medium text-slate-500 border-r border-slate-100 bg-blue-50/30">{renderFinancial(item.rencBkpu, true)}</td>
              
              <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-100 bg-slate-50">{renderFinancial(item.progBulanIni, true)}</td>
              
              <td className="p-2.5 text-right bg-red-50/10">{renderFinancial(item.evalPu)}</td>
              <td className="p-2.5 text-right bg-red-50/10">{renderFinancial(item.evalBk)}</td>
              <td className="p-2.5 text-right font-medium text-slate-500 border-r border-slate-100 bg-red-50/30">{renderFinancial(item.evalBkpu, true)}</td>
              
              <td className="p-2.5 text-center font-bold text-amber-700 border-r border-slate-100 bg-amber-50/30">{renderFinancial(item.mapp, true)}</td>
              <td className="p-2.5 text-center font-bold text-emerald-700 border-r border-slate-100 bg-emerald-50/20">{renderFinancial(item.progDepan, true)}</td>
              
              <td className="p-2.5 text-right bg-emerald-50/10">{renderFinancial(item.rencDepanPu)}</td>
              <td className="p-2.5 text-right bg-emerald-50/10">{renderFinancial(item.rencDepanBk)}</td>
              <td className="p-2.5 text-right font-medium text-slate-500 bg-emerald-50/30">{renderFinancial(item.rencDepanBkpu, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[360px]">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-blue-700" strokeWidth={2.5} />
              EVALUASI VS FORECAST (EB-01)
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">Matriks parsial rencana, evaluasi, dan proyeksi</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all shadow-sm flex items-center justify-center w-7 h-7"
            title="Maximize"
          >
            <Maximize2 size={13} strokeWidth={2.5} />
          </button>
        </div>
        <RenderTableContent />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900">MATRIKS EVALUASI VS FORECAST (EB-01)</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <Minimize2 size={16} />
              </button>
            </div>
            <RenderTableContent isFullView />
          </div>
        </div>
      )}
    </>
  );
}