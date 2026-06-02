import React from "react";
import { Wrench, ShieldAlert } from "lucide-react";

export default function ModuleOverlay({
  // Ini adalah nilai teks "Auto" (Default)
  title = "Data Validation in Progress",
  description = "This module is currently undergoing validation and integration. Data and functionality may change prior to official release.",
}) {
  return (
    // UBAH DI SINI: 'items-end pb-8' diubah menjadi 'items-center p-4' agar posisinya di tengah
    // Menggunakan 'fixed' agar posisinya selalu di tengah layar monitor (terpusat)
    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <div className="pointer-events-auto relative left-[132px]">
        <div className="pointer-events-auto relative w-full max-w-2xl bg-white/85 backdrop-blur-md border border-amber-200 shadow-2xl shadow-amber-900/10 rounded-2xl p-5 flex items-start sm:items-center gap-4 transition-all hover:bg-white/95">
          {/* Icon Box */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                {title}
              </h2>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold uppercase border border-amber-200">
                <Wrench size={10} /> Under Refinement
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pr-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
