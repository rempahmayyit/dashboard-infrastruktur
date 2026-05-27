// src/components/PopupContainer.jsx
import React, { useEffect } from "react";
import { Minimize2 } from "lucide-react";

export default function PopupContainer({
  isOpen,
  setIsOpen,
  title,
  subtitle,
  children,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden w-fit max-w-[95vw] max-h-[95vh]"
      >
        {/* HEADER POP-UP */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 px-6 flex-shrink-0">
          <div className="flex justify-between items-center gap-8">
            <div>
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                {title}
                <span className="text-xs font-bold text-blue-800 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md normal-case font-mono">
                  Pop-up Mode
                </span>
              </h4>
              {subtitle && (
                <p className="text-xs text-slate-600 font-medium mt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Tombol Tutup (Exit) */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 hover:text-black transition-all shadow-sm flex items-center gap-1 text-[10px] font-black uppercase tracking-tight"
            >
              <Minimize2 size={12} strokeWidth={2.5} />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* AREA KONTEN TABEL */}
        <div className="p-4 md:p-6 bg-slate-50/50 flex justify-center items-start overflow-hidden">
             {children}
        </div>
      </div>
    </div>
  );
}