// src/components/PopupContainer.jsx
import React, { useEffect } from "react";
import { Minimize2 } from "lucide-react";

export default function PopupContainer({ isOpen, setIsOpen, title, subtitle, children }) {
  
  // Efek untuk mengunci scroll body utama saat pop-up terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      // Klik di area kosong luar box untuk menutup pop-up
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn font-sans"
    >
      {/* KONTAINER UTAMA (Sangat Lebar, max-w-7xl) */}
      <div 
        onClick={(e) => e.stopPropagation()} // Mencegah pop-up tertutup saat area dalam tabel diklik
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden w-full max-w-[95vw] xl:max-w-7xl h-[90vh]"
      >
        
        {/* HEADER POP-UP */}
        <div className="bg-slate-50 border-b border-slate-100 p-5 px-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                {title}
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md normal-case font-mono">
                  Pop-up Mode
                </span>
              </h4>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            
            {/* Tombol Tutup (Exit) */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm flex items-center gap-1 text-[10px] font-black uppercase tracking-tight"
            >
              <Minimize2 size={12} strokeWidth={2.5} />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* ============================================================
            AREA KONTEN TABEL (TEKNIK KUNCI ADA DI SINI)
           ============================================================ */}
        {/* overflow-auto di sini mengizinkan scroll horizontal dan vertikal */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50">
          
          {/* TEKNIK KUNCI 1 (DI KONTAINER):
             Menggunakan 'block table' dan 'min-w-full'. 
             Ini memaksa kontainer ini minimal selebar kontainer pop-up, tapi BISA MELUAS ke kanan jika tabel di dalamnya sangat lebar.
          */}
          <div className="block table min-w-full align-top h-full">
            
            {/* TEKNIK KUNCI 2 (DI BORDER KONTEN):
               Kita gunakan border dinamis mengikuti lebar tabel di dalam kontainer 'block table' tadi.
            */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 h-full font-sans
                            [table]:min-w-full [table]:w-full [table]:table-auto">
              
              {/* Komponen Tabel Kinerja Anda akan dirender di sini */}
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}