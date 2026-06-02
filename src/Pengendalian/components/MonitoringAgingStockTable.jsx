import React, { useState } from "react";
import { formatNumber } from "../../utils/formatters"; 
import { Maximize2, Minimize2, PackageSearch } from "lucide-react";

// ==========================================
// DUMMY DATA: TABEL UTAMA
// ==========================================
const dummyData = [
  { id: 1, id_project: "1324010", nama: "JALAN TOL CIAWI - SUKABUMI SEKSI 3B", prog: 73.04, day30: 5348, day60: 1058, day90: 11425, day180: 1083, day360: 2430, dayMore360: 1972, total: 23316, lep: null, deviasi: 23316 },
  { id: 2, id_project: "1425010", nama: "PERBAIKAN JALAN TOL KAPB JOP 70%", prog: 43.03, day30: 6802, day60: 1696, day90: 7284, day180: 4724, day360: 0, dayMore360: 0, total: 20506, lep: null, deviasi: 20506 },
  { id: 3, id_project: "1421046", nama: "Pengarah Rukoh", prog: 54.12, day30: 0, day60: 0, day90: 821, day180: 6357, day360: 1556, dayMore360: 3550, total: 12283, lep: null, deviasi: 12283 },
  { id: 4, id_project: "1323042", nama: "Jalan Tol Ciawi Sukabumi Seksi 3A", prog: 84.49, day30: 5972, day60: 73, day90: 1133, day180: 1166, day360: 2296, dayMore360: 0, total: 10640, lep: null, deviasi: 10640 },
  { id: 5, id_project: "1424002", nama: "PEMB. BANGUNAN PENGARAH BEND. RUKOH", prog: 67.43, day30: 0, day60: 0, day90: 0, day180: 0, day360: 143, dayMore360: 6908, total: 7051, lep: null, deviasi: 7051 },
  { id: 6, id_project: "1319006", nama: "PROYEK TOL JAPEK 2 SELATAN PAKET 3", prog: 98.57, day30: 1089, day60: 647, day90: 0, day180: 4977, day360: 0, dayMore360: 25, total: 6738, lep: null, deviasi: 6738 },
];

// ==========================================
// DUMMY DATA: PANEL KANAN (>360 HK)
// ==========================================
const dummyRightPanel = [
  {
    project: "Proyek Jalan Kretek - Girijati",
    total: 19680000,
    items: [
      { name: "Geotextile Non Woven 300 Gr PET", value: 19680000 }
    ]
  },
  {
    project: "PROYEK TOL JAPEK 2 SELATAN PAKET 3 INDUK",
    total: 25075400,
    items: [
      { name: "Bearing Pad 350x400x39mm", value: 12464000 },
      { name: "Bearing Pad Karet Alam 250x400x41mm", value: 9761400 },
      { name: "Bearing Pad 280x350x51mm", value: 2850000 }
    ]
  },
  {
    project: "Irigasi Belitang Lempuing Pkt 2 JOP 60%",
    total: 232936237,
    items: [
      { name: "Besi Beton Ulir U40-12m D16", value: 141848108 },
      { name: "Besi Beton Ulir U40-12m D19", value: 47535629 },
      { name: "Geotextile Non Woven 4x100m", value: 28500000 },
      { name: "Waterstop PVC WSF 150", value: 15052500 }
    ]
  }
];

export default function MonitoringAgingStockTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper Format Angka
  const renderValue = (num, isPercent = false, allowZero = false) => {
    if (num === null || num === undefined) return <span className="text-slate-400">-</span>;
    if (num === 0 && !allowZero) return <span className="text-slate-400">-</span>;
    
    const formatted = typeof formatNumber === 'function' ? formatNumber(Math.abs(num), isPercent ? 2 : 0) : Math.abs(num).toLocaleString('id-ID', { minimumFractionDigits: isPercent ? 2 : 0, maximumFractionDigits: isPercent ? 2 : 0 });
    const suffix = isPercent ? "%" : "";
    
    return num < 0 ? <span>-{formatted}{suffix}</span> : <span>{formatted}{suffix}</span>;
  };

  // Kalkulasi Total untuk Footer Tabel
  const sumField = (field) => dummyData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
  const total30 = sumField("day30");
  const total60 = sumField("day60");
  const total90 = sumField("day90");
  const total180 = sumField("day180");
  const total360 = sumField("day360");
  const totalMore360 = sumField("dayMore360");
  const totalGrand = sumField("total");
  const deviasiGrand = sumField("deviasi");

  // Kalkulasi Grand Total Panel Kanan
  const rightPanelGrandTotal = dummyRightPanel.reduce((acc, curr) => acc + curr.total, 0);

  const RenderContent = ({ isFullView = false }) => (
    <div className={`flex flex-col xl:flex-row gap-4 h-full ${isFullView ? "overflow-hidden" : ""}`}>
      
      {/* ========================================== */}
      {/* BAGIAN KIRI: TABEL UTAMA */}
      {/* ========================================== */}
      <div className="flex-1 overflow-auto border border-slate-300 rounded-xl bg-white scrollbar-thin shadow-sm">
        <table className={`w-full border-separate border-spacing-0 min-w-[1100px] ${isFullView ? "text-[12px]" : "text-[11px]"}`}>
          <thead className="sticky top-0 z-40 text-white font-bold text-center tracking-wide">
            {/* HEADER BARIS 1 */}
            <tr className="bg-[#002060]">
              <th rowSpan={3} className="sticky top-0 left-0 z-50 bg-[#002060] border-b border-r border-slate-400 p-2 w-[40px] align-middle">No.</th>
              <th rowSpan={3} className="sticky top-0 left-[40px] z-50 bg-[#002060] border-b border-r border-slate-400 p-2 w-[80px] align-middle">ID Project</th>
              <th rowSpan={3} className="sticky top-0 left-[120px] z-50 bg-[#002060] border-b border-r border-slate-400 p-2 min-w-[220px] align-middle">Nama Proyek</th>
              <th rowSpan={3} className="border-b border-r border-slate-400 p-2 w-[60px] align-middle leading-tight">Prog.<br/>(%)</th>
              <th colSpan={9} className="border-b border-slate-400 p-2">Monitoring Persediaan</th>
            </tr>

            {/* HEADER BARIS 2 */}
            <tr className="bg-[#002060]">
              <th colSpan={6} className="border-b border-r border-slate-400 p-1.5">Umur Persediaan (Hari)</th>
              <th rowSpan={2} className="border-b border-r border-slate-400 p-2 align-middle w-[70px]">Total</th>
              <th rowSpan={2} className="border-b border-r border-slate-400 p-2 align-middle w-[70px]">LEP</th>
              <th rowSpan={2} className="border-b border-slate-400 p-2 align-middle w-[80px]">Deviasi</th>
            </tr>

            {/* HEADER BARIS 3 */}
            <tr className="bg-[#002060] text-[10px]">
              <th className="border-b border-r border-slate-400 p-1.5 w-[65px]">0-30</th>
              <th className="border-b border-r border-slate-400 p-1.5 w-[65px]">30-60</th>
              <th className="border-b border-r border-slate-400 p-1.5 w-[65px]">60-90</th>
              <th className="border-b border-r border-slate-400 p-1.5 w-[65px]">90-180</th>
              <th className="border-b border-r border-slate-400 p-1.5 w-[70px]">180-360</th>
              <th className="border-b border-r border-slate-400 p-1.5 w-[65px]">&gt; 360</th>
            </tr>
          </thead>

          <tbody className="text-slate-800 font-medium">
            {/* GRUP: ON GOING */}
            <tr className="bg-slate-50">
              <td className="sticky left-0 z-30 bg-slate-50 border-b border-r border-slate-200 p-2"></td>
              <td className="sticky left-[40px] z-30 bg-slate-50 border-b border-r border-slate-200 p-2"></td>
              <td className="sticky left-[120px] z-30 bg-slate-50 border-b border-r border-slate-200 p-2 font-bold text-[#002060] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">ON GOING</td>
              <td colSpan={10} className="border-b border-slate-200 p-2"></td>
            </tr>

            {/* LOOP DATA PROYEK */}
            {dummyData.map((item, idx) => {
              const bgRow = idx % 2 === 0 ? "bg-blue-50/30" : "bg-white";
              
              return (
                <tr key={idx} className={`${bgRow} hover:bg-blue-100/50 transition-colors`}>
                  {/* FREEZE COLUMNS */}
                  <td className={`sticky left-0 z-30 p-2 text-center border-b border-r border-slate-200 ${bgRow}`}>{item.id}</td>
                  <td className={`sticky left-[40px] z-30 p-2 text-center font-mono text-slate-700 border-b border-r border-slate-200 ${bgRow}`}>{item.id_project}</td>
                  <td className={`sticky left-[120px] z-30 p-2 text-left font-semibold border-b border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${bgRow}`}>{item.nama}</td>
                  
                  <td className="p-2 text-center border-b border-r border-slate-200">{renderValue(item.prog, true, true)}</td>
                  
                  {/* UMUR PERSEDIAAN */}
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.day30)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.day60)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.day90)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.day180)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.day360)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200 font-bold text-red-600 bg-red-50/50">{renderValue(item.dayMore360)}</td>
                  
                  {/* TOTAL & DEVIASI */}
                  <td className="p-2 text-right border-b border-r border-slate-200 font-bold bg-slate-50">{renderValue(item.total)}</td>
                  <td className="p-2 text-right border-b border-r border-slate-200">{renderValue(item.lep)}</td>
                  <td className="p-2 text-right border-b border-slate-200 font-bold bg-slate-50">{renderValue(item.deviasi)}</td>
                </tr>
              );
            })}
          </tbody>

          {/* FOOTER TOTAL */}
          <tfoot className="sticky bottom-0 z-40 bg-slate-100 font-black text-slate-800 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
            <tr>
              <td colSpan={4} className="sticky left-0 z-50 p-2.5 text-center border-t-2 border-r border-slate-300 bg-slate-100">Total</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">{renderValue(total30)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">{renderValue(total60)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">{renderValue(total90)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">{renderValue(total180)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">{renderValue(total360)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300 text-red-700 bg-red-100/50">{renderValue(totalMore360)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300 text-[#002060]">{renderValue(totalGrand)}</td>
              <td className="p-2.5 text-right border-t-2 border-r border-slate-300">-</td>
              <td className="p-2.5 text-right border-t-2 border-slate-300 text-[#002060]">{renderValue(deviasiGrand)}</td>
            </tr>
            <tr className="bg-slate-50">
              <td colSpan={4} className="sticky left-0 z-50 p-2 text-center border-t border-r border-slate-300 bg-slate-50">Prosentase</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue((total30/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue((total60/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue((total90/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue((total180/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue((total360/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300 text-red-700">{renderValue((totalMore360/totalGrand)*100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">{renderValue(100, true)}</td>
              <td className="p-2 text-right border-t border-r border-slate-300">-</td>
              <td className="p-2 text-right border-t border-slate-300">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ========================================== */}
      {/* BAGIAN KANAN: PANEL TOP PERSEDIAAN >360 HK */}
      {/* ========================================== */}
      <div className={`w-full xl:w-[350px] flex flex-col border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden flex-shrink-0 ${isFullView ? "h-full" : "h-auto max-h-[400px]"}`}>
        <div className="bg-[#002060] text-white p-3 text-center font-bold text-sm tracking-wide">
          Top Persediaan &gt; 360 HK
        </div>
        
        <div className="flex-1 overflow-auto bg-slate-50/50 p-3 scrollbar-thin">
          <div className="flex justify-between items-center pb-2 mb-2 border-b-2 border-[#002060] text-xs font-black text-[#002060]">
            <span>Nama Proyek / Material</span>
            <span>&gt; 360</span>
          </div>

          {dummyRightPanel.map((proj, idx) => (
            <div key={idx} className="mb-3">
              {/* Grup Proyek */}
              <div className="flex justify-between items-start text-xs font-bold text-slate-800 bg-blue-100/50 p-1.5 rounded-md mb-1">
                <span className="flex items-center gap-1.5 flex-1 pr-2 leading-tight">
                  <span className="w-3 h-3 rounded-full border-2 border-[#002060] flex items-center justify-center text-[8px] flex-shrink-0">-</span>
                  {proj.project}
                </span>
                <span className="text-[#002060]">{renderValue(proj.total)}</span>
              </div>
              
              {/* Item Material */}
              <div className="space-y-1">
                {proj.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-[11px] text-slate-600 pl-5 pr-1.5 hover:bg-white rounded p-1 transition-colors">
                    <span className="flex-1 pr-2 leading-tight">{item.name}</span>
                    <span className="font-medium text-slate-800">{renderValue(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total Kanan */}
        <div className="bg-[#002060]/10 border-t border-[#002060]/20 p-3 flex justify-between items-center">
          <span className="text-sm font-black text-[#002060]">Grand Total</span>
          <span className="text-sm font-black text-[#002060]">{renderValue(rightPanelGrandTotal)}</span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* NORMAL VIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-auto xl:h-[450px] mt-6">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <PackageSearch size={16} className="text-[#002060]" strokeWidth={2.5} />
              MONITORING UMUR PERSEDIAAN (FIORI)
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">
              Periode : April 2026 &rarr; update : 30 April 2026
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all shadow-sm flex items-center justify-center w-8 h-8 flex-shrink-0"
            title="Maximize"
          >
            <Maximize2 size={14} strokeWidth={2.5} />
          </button>
        </div>
        <RenderContent />
      </div>

      {/* MODAL VIEW */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-[95vw] h-[95vh] shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">MONITORING UMUR PERSEDIAAN (FIORI)</h3>
                <p className="text-sm text-slate-500 font-medium">Periode : April 2026 &rarr; update : 30 April 2026</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 bg-white shadow-sm">
                <Minimize2 size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <RenderContent isFullView />
            </div>
          </div>
        </div>
      )}
    </>
  );
}