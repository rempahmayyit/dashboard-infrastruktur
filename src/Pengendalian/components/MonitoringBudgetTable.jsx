import React, { useState } from "react";
import { formatNumber } from "../../utils/formatters"; 
import { Maximize2, Minimize2, Activity } from "lucide-react";

// DUMMY DATA BERDASARKAN GAMBAR
const dummyData = [
  { id: 1, id_project: "1325039", nama: "BA Sumatera", progres: 0.00, mapp: 15000, actual: 4740, terpakai: 31.60, dev: -31.60, preq: null, pord: 968, available: 9292 },
  { id: 2, id_project: "1421046", nama: "Pengarah Rukoh", progres: 54.37, mapp: 432847, actual: 294634, terpakai: 68.07, dev: -13.70, preq: null, pord: 2344, available: 135869 },
  { id: 3, id_project: "1326003", nama: "BA Langsa", progres: 0.00, mapp: 162000, actual: 14790, terpakai: 9.13, dev: -9.13, preq: null, pord: 587, available: 146623 },
  { id: 4, id_project: "1425010", nama: "Perbaikan KAPB", progres: 44.34, mapp: 767409, actual: 380570, terpakai: 49.59, dev: -5.25, preq: 7864, pord: 76910, available: 302064 },
  { id: 5, id_project: "1326006", nama: "BA Bireun-Takengon", progres: 0.00, mapp: 270000, actual: 9681, terpakai: 3.59, dev: -3.59, preq: null, pord: null, available: 260319 },
  { id: 6, id_project: "1425014", nama: "Irg. Lempuing 3", progres: 69.17, mapp: 192520, actual: 139463, terpakai: 72.44, dev: -3.27, preq: 3, pord: 2354, available: 50700 },
  { id: 7, id_project: "1418018", nama: "Bend. Bener", progres: 80.89, mapp: 546839, actual: 454450, terpakai: 83.10, dev: -2.21, preq: 572, pord: 19897, available: 71920 },
  { id: 8, id_project: "1421039", nama: "Bend. Mbay", progres: 96.61, mapp: 468724, actual: 459652, terpakai: 98.06, dev: -1.46, preq: null, pord: 3117, available: 5955 },
];

export default function MonitoringBudgetTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper render angka (Format standar dengan opsi persentase)
  const renderValue = (num, isPercent = false, allowZero = false) => {
    if (num === null || num === undefined) return <span className="text-slate-400">-</span>;
    if (num === 0 && !allowZero) return <span className="text-slate-400">-</span>;
    
    // Asumsi formatNumber sudah ada dari formatters.js, jika tidak fallback ke toLocaleString
    const formatted = typeof formatNumber === 'function' ? formatNumber(Math.abs(num), isPercent ? 2 : 0) : Math.abs(num).toLocaleString('id-ID', { minimumFractionDigits: isPercent ? 2 : 0, maximumFractionDigits: isPercent ? 2 : 0 });
    const suffix = isPercent ? "%" : "";
    
    if (num < 0) {
      return <span>-{formatted}{suffix}</span>;
    }
    return <span>{formatted}{suffix}</span>;
  };

  const RenderTableContent = ({ isFullView = false }) => (
    <div className="flex-1 overflow-auto border border-slate-300 rounded-xl bg-white scrollbar-thin">
      <table className={`w-full border-separate border-spacing-0 min-w-[1200px] ${isFullView ? "text-[12px]" : "text-[11px]"}`}>
        <thead className="sticky top-0 z-40 text-white font-bold text-center tracking-wide">
          {/* HEADER BARIS 1 */}
          <tr className="bg-[#002060]">
            <th rowSpan={3} className="sticky top-0 left-0 z-50 bg-[#002060] border-b border-r border-slate-300 p-2 w-[40px] align-middle">
              No.
            </th>
            <th rowSpan={3} className="sticky top-0 left-[40px] z-50 bg-[#002060] border-b border-r border-slate-300 p-2 w-[80px] align-middle">
              ID Project
            </th>
            <th rowSpan={3} className="sticky top-0 left-[120px] z-50 bg-[#002060] border-b border-r border-slate-300 p-2 min-w-[220px] align-middle">
              Nama Proyek
            </th>
            <th rowSpan={3} className="border-b border-r border-slate-300 p-2 w-[70px] align-middle">
              Progres<br/>Fisik
            </th>
            <th colSpan={7} className="border-b border-slate-300 p-2">
              Monitoring Budget
            </th>
          </tr>

          {/* HEADER BARIS 2 */}
          <tr className="bg-[#002060]">
            <th rowSpan={2} className="border-b border-r border-slate-300 p-2 align-middle w-[90px]">Budget MAPP</th>
            <th rowSpan={2} className="border-b border-r border-slate-300 p-2 align-middle w-[90px]">Actual Cost</th>
            <th rowSpan={2} className="border-b border-r border-slate-300 p-2 align-middle w-[80px]">% Terpakai</th>
            
            {/* KOLOM DEV MERAH */}
            <th rowSpan={2} className="bg-red-600 border-b border-r border-red-700 p-2 align-middle w-[80px]">Dev.</th>
            
            <th colSpan={2} className="border-b border-r border-slate-300 p-2">Cost Commitment</th>
            <th rowSpan={2} className="border-b border-slate-300 p-2 align-middle w-[90px]">Available<br/>Budget</th>
          </tr>

          {/* HEADER BARIS 3 */}
          <tr className="bg-[#002060]">
            <th className="border-b border-r border-slate-300 p-1.5 w-[75px]">PReq</th>
            <th className="border-b border-r border-slate-300 p-1.5 w-[75px]">POrd</th>
          </tr>
        </thead>

        <tbody className="text-slate-800 font-medium">
          {/* BARIS GROUP "On Going" */}
          <tr className="bg-white">
            <td className="sticky left-0 z-30 bg-white border-b border-r border-slate-200 p-2"></td>
            <td className="sticky left-[40px] z-30 bg-white border-b border-r border-slate-200 p-2"></td>
            <td className="sticky left-[120px] z-30 bg-white border-b border-r border-slate-200 p-2 font-bold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
              On Going
            </td>
            <td colSpan={8} className="border-b border-slate-200 p-2"></td>
          </tr>

          {/* LOOP DATA */}
          {dummyData.map((item, idx) => {
            const isNegativeDev = item.dev < 0;
            const bgRow = idx % 2 === 0 ? "bg-blue-50/40" : "bg-white"; // Efek selang-seling (zebra stripe) seperti di gambar
            
            return (
              <tr key={idx} className={`${bgRow} hover:bg-slate-100 transition-colors`}>
                {/* 3 KOLOM KIRI DI-FREEZE */}
                <td className={`sticky left-0 z-30 p-2.5 text-center border-b border-r border-slate-200 ${bgRow}`}>
                  {item.id}
                </td>
                <td className={`sticky left-[40px] z-30 p-2.5 text-center font-mono text-slate-700 border-b border-r border-slate-200 ${bgRow}`}>
                  {item.id_project}
                </td>
                <td className={`sticky left-[120px] z-30 p-2.5 text-left font-semibold border-b border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${bgRow}`}>
                  {item.nama}
                </td>
                
                {/* DATA NORMAL */}
                <td className="p-2.5 text-center border-b border-r border-slate-200">{renderValue(item.progres, true, true)}</td>
                <td className="p-2.5 text-right border-b border-r border-slate-200">{renderValue(item.mapp)}</td>
                <td className="p-2.5 text-right border-b border-r border-slate-200">{renderValue(item.actual)}</td>
                <td className="p-2.5 text-center border-b border-r border-slate-200">{renderValue(item.terpakai, true, true)}</td>
                
                {/* KOLOM DEV. KHUSUS */}
                <td className={`p-2.5 text-center border-b border-r border-slate-200 font-bold ${isNegativeDev ? 'bg-red-200/60 text-red-600' : ''}`}>
                  {renderValue(item.dev, true, true)}
                </td>
                
                <td className="p-2.5 text-right border-b border-r border-slate-200">{renderValue(item.preq)}</td>
                <td className="p-2.5 text-right border-b border-r border-slate-200">{renderValue(item.pord)}</td>
                <td className="p-2.5 text-right border-b border-slate-200">{renderValue(item.available)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[400px] mt-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-[#002060]" strokeWidth={2.5} />
              MONITORING PEMAKAIAN BUDGET
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">Evaluasi Actual Cost terhadap Budget MAPP</p>
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

      {/* MODAL VIEW */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900">DETAIL MONITORING PEMAKAIAN BUDGET</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600">
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