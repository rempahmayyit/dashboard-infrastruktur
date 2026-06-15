import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// Import aset logo dari folder assets internal Anda
import waskitaLogo from "./assets/waskita_logo.png";
import danantaraLogo from "./assets/Logo_danantara.png";

// Import ke-10 foto proyek sesuai nama di folder assets Anda
import proyek1 from "./assets/proyek1.jpeg";
import proyek2 from "./assets/proyek2.jpeg";
import proyek3 from "./assets/proyek3.jpeg";
import proyek4 from "./assets/proyek4.jpeg";
import proyek5 from "./assets/proyek5.jpeg";
import proyek6 from "./assets/proyek6.jpeg";
import proyek7 from "./assets/proyek7.jpeg";
import proyek8 from "./assets/proyek8.jpeg";
import proyek9 from "./assets/proyek9.jpeg";
import proyek10 from "./assets/proyek10.jpeg";
import proyek11 from "./assets/proyek11.jpeg";
import proyek12 from "./assets/proyek12.jpeg";
import proyek13 from "./assets/proyek13.jpeg";
import proyek14 from "./assets/proyek14.jpeg";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Masukkan semua gambar ke dalam array. 
  // Kita duplikat array agar animasi scrolling ke bawah terlihat mulus tanpa putus (infinite scroll).
  const projectImages = [
    proyek1, proyek2, proyek3, proyek4, proyek5,
    proyek6, proyek7, proyek8, proyek9, proyek10,
    proyek1, proyek2, proyek3, proyek4, proyek5,proyek11,proyek12,
    proyek13, proyek14 // Duplikasi untuk infinite scroll
  ];

  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal terhubung dengan Microsoft Waskita.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased overflow-hidden">
      
      {/* ========================================= */}
      {/* SISI KIRI: MASONRY PUZZLE GRID ANIMATION    */}
      {/* ========================================= */}
      <div className="hidden lg:flex lg:w-2/3 xl:w-[70%] bg-slate-200 relative overflow-hidden">
        
        {/* Kontainer Grid yang dimiringkan (transform) */}
        <div className="absolute inset-[-50%] w-[200%] h-[200%] transform -rotate-12 scale-[1.1] pointer-events-none">
          
          {/* Membuat 3 Kolom Grid (Masonry) 
            Setiap kolom akan melakukan animasi slide/pan ke arah yang berlawanan
          */}
          <div className="grid grid-cols-3 gap-6 w-full h-full p-4">
            
            {/* Kolom 1: Animasi ke atas */}
            <div className="flex flex-col gap-6 animate-[slideUp_90s_linear_infinite]">
              {projectImages.map((img, idx) => (
                <div key={`col1-${idx}`} className="w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                  <img src={img} alt={`Proyek ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Kolom 2: Animasi ke bawah (Arah sebaliknya biar dinamis) */}
            <div className="flex flex-col gap-6 animate-[slideDown_110s_linear_infinite] mt-[-300px]">
              {/* Kita balik urutan gambarnya biar random */}
              {[...projectImages].reverse().map((img, idx) => (
                <div key={`col2-${idx}`} className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                  <img src={img} alt={`Proyek ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Kolom 3: Animasi ke atas */}
            <div className="flex flex-col gap-6 animate-[slideUp_100s_linear_infinite] mt-[150px]">
              {projectImages.map((img, idx) => (
                <div key={`col3-${idx}`} className="w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                  <img src={img} alt={`Proyek ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Gradient Overlay Transparan (Bukan warna gelap, tapi sekadar agar teks terbaca) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>

        {/* Konten Teks Informatif Proyek */}
        <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white w-full pointer-events-none">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-lg">
              Divisi Infrastruktur
            </span>
          </div>
          
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-6 drop-shadow-2xl text-white">
              Karya <span className="text-blue-400">Nyata</span><br />
              Untuk Negeri
            </h1>
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-xl inline-block">
              Sistem integrasi pemantauan proyek infrastruktur strategis nasional—jalan tol, bendungan, dan pengairan secara real-time.
            </p>
          </div>
          
          {/* Footer Gambar */}
          <div className="flex items-end justify-between">
            <p className="text-xs text-white/70 font-medium bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              © {new Date().getFullYear()} PT Waskita Karya (Persero) Tbk.
            </p>
          </div>
        </div>

        {/* Custom CSS untuk Animasi Infinite Scrolling */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes slideDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
        `}} />
      </div>

      {/* ========================================= */}
      {/* SISI KANAN: AREA LOGIN & FORM               */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/3 xl:w-[30%] flex flex-col justify-center items-center p-8 sm:p-12 bg-white relative z-30 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.15)] z-30">
        
        <div className="w-full max-w-sm space-y-6">
          
          {/* STRUKTUR LOGO */}
          <div className="flex items-center justify-center gap-6 mb-6 w-full">
            <div className="flex-1 flex justify-end items-center max-w-[160px]">
              <img
                className="max-h-9 w-auto object-contain"
                src={danantaraLogo}
                alt="Logo Danantara"
              />
            </div>
            <div className="h-8 w-px bg-gray-300 block shrink-0"></div>
            <div className="flex-1 flex justify-start items-center max-w-[140px]">
              <img
                className="max-h-12 w-auto object-contain"
                src={waskitaLogo}
                alt="Logo Waskita Karya"
              />
            </div>
          </div>

          {/* Judul Halaman */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Dashboard Infrastruktur
            </h2>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed">
              Silakan masuk menggunakan akun korporat internal Anda untuk melanjutkan akses.
            </p>
          </div>

          {/* Banner Notifikasi Error */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 shadow-sm">
              <svg
                className="h-4 w-4 shrink-0 text-red-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Tombol Akses SSO Microsoft */}
          <div className="pt-2">
            <button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 bg-[#000075] hover:bg-[#00005c] text-white py-3.5 px-5 rounded-xl font-bold text-[13px] shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : "active:scale-[0.98]"}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://w3.org">
                  <path d="M0 0H11V11H0V0Z" fill="#F25022" />
                  <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
                  <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
                  <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
                </svg>
              )}
              <span>{isLoading ? "Menghubungkan Azure..." : "Login dengan Microsoft Waskita"}</span>
            </button>
          </div>

          {/* Pusat Bantuan */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <a
              href="#help"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline underline-offset-2"
            >
              Kendala akses atau akun terkunci? Hubungi IT Support
            </a>
          </div>

          {/* DISCLAIMER (Sesuai Permintaan, Dipertahankan Penuh) */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start shadow-inner">
            <svg
              className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div className="text-[11px] text-slate-500 leading-relaxed text-justify">
              <span className="font-bold text-slate-700">
                Peringatan Keamanan:{" "}
              </span>
              Seluruh data, angka, dan informasi di dalam sistem ini bersifat{" "}
              <span className="font-semibold text-slate-700">
                RAHASIA (Confidential)
              </span>{" "}
              dan khusus untuk kepentingan internal Divisi Infrastruktur. Segala
              bentuk penyalahgunaan, pencetakan tanpa izin, atau distribusi
              kepada pihak luar akan ditindak tegas sesuai kebijakan perusahaan
              dan hukum yang berlaku.
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}