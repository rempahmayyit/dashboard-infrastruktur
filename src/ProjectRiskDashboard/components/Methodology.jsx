import React from "react";
import { BookOpen, TrendingDown, ShieldAlert, Clock, Activity, AlertOctagon, AlertTriangle, CheckCircle } from "lucide-react";

export default function Methodology() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
          <BookOpen size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
            Metodologi Penilaian
          </h2>
          <p className="text-[10px] text-slate-500">
            Sistem Peringkat Relatif (Relative Ranking)
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-600 space-y-5 overflow-y-auto max-h-[380px] pr-2 scrollbar-thin">
        <p className="leading-relaxed text-[11px]">
          Sistem ini tidak menggunakan bobot persentase statis, melainkan
          membandingkan kinerja setiap proyek <b>secara dinamis</b> dengan
          proyek lainnya yang sedang aktif (On Going).
        </p>

        <div>
          <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">1</span>
            Penilaian 4 Indikator Utama
          </div>
          <div className="space-y-2.5 pl-5">
            <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl">
              <span className="font-bold text-blue-800 flex items-center gap-1.5 mb-1"><TrendingDown size={12} /> Behind Schedule</span>
              <span className="text-[10px] text-slate-600 leading-snug block">Dihitung dari selisih progres realisasi terhadap progres rencana (Ri - Ra). Nilai negatif menunjukkan proyek tertinggal dari target.</span>
            </div>
            <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-xl">
              <span className="font-bold text-red-800 flex items-center gap-1.5 mb-1"><ShieldAlert size={12} /> Cost Overrun</span>
              <span className="text-[10px] text-slate-600 leading-snug block">Dihitung dari selisih BK/PU aktual terhadap batas BK/PU rencana (MAPP). Nilai negatif menunjukkan biaya melampaui batas.</span>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 p-2.5 rounded-xl">
              <span className="font-bold text-orange-800 flex items-center gap-1.5 mb-1"><Clock size={12} /> Urgensi Waktu</span>
              <span className="text-[10px] text-slate-600 leading-snug block">Target progres harian. Rumus: <b>Sisa Progress ÷ Sisa Hari</b></span>
            </div>
            <div className="bg-purple-50/50 border border-purple-100 p-2.5 rounded-xl">
              <span className="font-bold text-purple-800 flex items-center gap-1.5 mb-1"><Activity size={12} /> Piutang Risk</span>
              <div className="text-[10px] text-slate-600 leading-relaxed">
                Penilaian berdasarkan aging Tagihan Bruto: &gt; 60 hari = WASPADA | &gt; 180 hari = KRITIS.
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 mt-2">
            <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">2</span>
            Kalkulasi Total Risk Score
          </div>
          <div className="pl-5">
            <div className="bg-slate-50 font-mono text-slate-700 font-semibold px-3 py-2 rounded-lg border border-slate-200 text-[9px] text-center">
              Total Risk = Rank Behind + Rank Cost + Rank Urgency
            </div>
          </div>
        </div>

        <div>
          <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 mt-2">
            <span className="bg-slate-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0">3</span>
            Klasifikasi Status Eksekutif
          </div>
          <ul className="pl-5 space-y-2 text-[10px] text-slate-600">
            <li className="flex items-start gap-2"><div className="bg-red-100 p-1 rounded"><AlertOctagon size={12} className="text-red-600" /></div><div><div className="font-bold text-red-700 mb-1">KRITIS</div> Target harian ≥ 1,00% / Total Risk terburuk.</div></li>
            <li className="flex items-start gap-2"><div className="bg-orange-100 p-1 rounded"><AlertTriangle size={12} className="text-orange-500" /></div><div><div className="font-bold text-orange-600 mb-1">WASPADA</div> Target harian ≥ 0,30% / Risiko menengah.</div></li>
            <li className="flex items-start gap-2"><div className="bg-emerald-100 p-1 rounded"><CheckCircle size={12} className="text-emerald-600" /></div><div><div className="font-bold text-emerald-600 mb-1">NORMAL</div> Tekanan waktu rendah / Kinerja baik.</div></li>
          </ul>
        </div>
      </div>
    </div>
  );
}