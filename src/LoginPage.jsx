import { useState } from "react";
import { supabase } from "./lib/supabase";
// Import aset logo dari folder assets internal Anda
import waskitaLogo from "./assets/waskita_logo.png";
import danantaraLogo from "./assets/Logo_danantara.png";

export default function LoginPage() {
  // State untuk mengontrol animasi loading dan pesan error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Reset error sebelumnya jika ada

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
      setIsLoading(false); // Matikan loading jika terjadi error sebelum redirect
    }
  };

  // URL Gambar proyek jalan tol sebagai latar belakang sisi kiri
  const projectImageUrl = "https://unsplash.com";

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased">
      {/* SISI KIRI: Visual Proyek Infrastruktur (Hanya muncul di laptop/desktop) */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${projectImageUrl})` }}
      >
        {/* Overlay Biru Gelap Korporat Waskita */}
        <div className="absolute inset-0 bg-[#0A2540] opacity-85 mix-blend-multiply"></div>

        {/* Konten Teks Informatif Proyek */}
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
              Divisi Infrastruktur
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Membangun Negeri dengan <br />
              Konektivitas Berkelanjutan
            </h1>
            <p className="text-blue-200 max-w-md text-sm leading-relaxed">
              Sistem integrasi pemantauan proyek infrastruktur strategis
              nasional—jalan tol, bendungan, dan pengairan secara real-time.
            </p>
          </div>
          <p className="text-xs text-blue-300/60">
            © {new Date().getFullYear()} PT Waskita Karya (Persero) Tbk. All
            rights reserved.
          </p>
        </div>
      </div>

      {/* SISI KANAN: Area Login & Branding Sinergi */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 bg-white">
        {/* Menggunakan space-y-6 agar jarak antar elemen lebih rapat dan seimbang */}
        <div className="w-full max-w-sm space-y-6">
          {/* STRUKTUR LOGO: Fix Danantara Kiri, Waskita Kanan (Sesuai pandangan layar Anda) */}
          <div className="flex items-center justify-center gap-6 mb-6 w-full">
            {/* KIRI: Logo Danantara */}
            <div className="flex-1 flex justify-end items-center max-w-[160px]">
              <img
                className="max-h-9 w-auto object-contain"
                src={danantaraLogo}
                alt="Logo Danantara"
              />
            </div>

            {/* TENGAH: Garis Pembatas Sinergi */}
            <div className="h-8 w-px bg-gray-300 block shrink-0"></div>

            {/* KANAN: Logo Waskita */}
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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard Infrastruktur
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Silakan masuk menggunakan akun korporat internal Anda untuk
              melanjutkan akses.
            </p>
          </div>

          {/* Banner Notifikasi Error (Hanya muncul jika terjadi error) */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5">
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
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tombol Akses SSO Microsoft */}
          <div className="pt-2">
            <button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 bg-[#000075] hover:bg-[#00005c] text-white py-3.5 px-5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : "active:scale-[0.99]"}`}
            >
              {isLoading ? (
                /* Spinner Animasi saat Loading */
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                /* Icon Microsoft SVG */
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://w3.org"
                >
                  <path d="M0 0H11V11H0V0Z" fill="#F25022" />
                  <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
                  <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
                  <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
                </svg>
              )}
              <span>
                {isLoading
                  ? "Menghubungkan Azure..."
                  : "Login dengan Microsoft Waskita"}
              </span>
            </button>
          </div>

          {/* Pusat Bantuan */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <a
              href="#help"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Kendala akses atau akun terkunci? Hubungi IT Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
