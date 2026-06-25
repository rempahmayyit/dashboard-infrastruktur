import React, { useState, useEffect } from "react";
import { Building2, LogOut } from "lucide-react";

import { supabase } from "../lib/supabase"; // sesuaikan path

import proyek1 from "../assets/proyek1.jpeg";
import proyek2 from "../assets/proyek2.jpeg";
import proyek3 from "../assets/proyek3.jpeg";
import proyek4 from "../assets/proyek4.jpeg";
import proyek5 from "../assets/proyek5.jpeg";
import proyek6 from "../assets/proyek6.jpeg";
import proyek7 from "../assets/proyek7.jpeg";
import proyek8 from "../assets/proyek8.jpeg";
import proyek9 from "../assets/proyek9.jpeg";
import proyek10 from "../assets/proyek10.jpeg";
import proyek11 from "../assets/proyek11.jpeg";
import proyek12 from "../assets/proyek12.jpeg";
import proyek13 from "../assets/proyek13.jpeg";
import proyek14 from "../assets/proyek14.jpeg";

const backgrounds = [
  proyek1,
  proyek2,
  proyek3,
  proyek4,
  proyek5,
  proyek6,
  proyek7,
  proyek8,
  proyek9,
  proyek10,
  proyek11,
  proyek12,
  proyek13,
  proyek14,
];

export default function LandingPage({ userName = "User" }) {
  const [bgImage] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)],
  );

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;

    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl animate-slowZoom"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 z-10"></div>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000075]/20 via-transparent to-black/40 z-10"></div>
      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleLogout}
          className="
    group
    flex items-center
    gap-2
    rounded-full
    bg-white/10
    backdrop-blur-lg
    border border-white/20
    px-4 py-3
    text-white
    hover:bg-red-600
    hover:border-red-500
    transition-all
    duration-300
    shadow-lg
  "
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-8">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-xl md:text-2xl font-medium text-white/90 mb-3">
            Selamat Datang
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {userName}
          </h2>

          <p className="mt-4 text-lg md:text-xl text-white/80">
            Dashboard Portofolio Divisi Infrastruktur
          </p>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-3xl bg-[#000075] flex items-center justify-center shadow-2xl">
            <Building2 size={40} className="text-white" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs md:text-sm tracking-[0.5em] uppercase text-white/80 mb-4">
            PT Waskita Karya (Persero) Tbk
          </h3>

          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
            Divisi Infrastruktur
          </h1>
        </div>

        {/* Divider */}
        <div className="w-40 h-px bg-white/30 my-10" />

        {/* Tagline */}
        <p className="max-w-3xl text-white/70 text-sm md:text-base tracking-wide">
          Monitoring Kinerja Pemasaran, Operasional, Keuangan, dan Manajemen
          Risiko
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-white/50">
          © {new Date().getFullYear()} Divisi Infrastruktur
        </p>
      </div>
    </div>
  );
}
