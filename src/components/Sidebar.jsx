// src/components/Sidebar.jsx

import React from "react";
import { ChevronRight } from "lucide-react";
import waskitaLogo from "../assets/waskita_logo.png";
import danantaraLogo from "../assets/Logo_danantara.png";

export default function Sidebar({
  isCollapsed,
  activeMenu,
  setActiveMenu,
  openMenu,
  setOpenMenu,
  menuItems,
  userInitials,
  userName,
  userEmail,
}) {
  return (
    <div className={`${isCollapsed ? "w-20 p-3" : "w-72 p-5"} h-screen print:hidden bg-[#00005a] text-slate-200 flex flex-col justify-between font-sans border-r border-slate-800/40 shadow-2xl sticky top-0 z-10 transition-all duration-300 overflow-hidden shrink-0`}>
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* LOGO AREA */}
        <div className="bg-white rounded-[24px] p-2 mb-4 shadow-inner transition-all duration-300 overflow-hidden shrink-0">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center justify-center w-[48%]">
                  <img src={danantaraLogo} alt="Danantara" className="h-[55px] object-contain" />
                </div>
                <div className="w-px h-10 bg-slate-300"></div>
                <div className="flex items-center justify-center w-[48%]">
                  <img src={waskitaLogo} alt="Waskita" className="h-[40px] object-contain scale-[0.92]" />
                </div>
              </div>
              <div className="border-t border-slate-200 mt-2 mb-1"></div>
              <div className="text-center pb-1">
                <p className="text-[12px] font-black tracking-[0.25em] text-[#00005a] uppercase leading-tight">Divisi<br />Infrastruktur</p>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-2">
              <img src={waskitaLogo} alt="Waskita" className="h-7 w-7 object-contain" />
            </div>
          )}
        </div>

        {/* KOTAK PROFIL USER */}
        <div className={`flex items-center ${isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-4 py-3"} mb-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transition-all shrink-0`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black shadow-inner shrink-0 text-sm">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden transition-all duration-300">
              <p className="text-[13px] font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-blue-200/70 truncate">{userEmail}</p>
            </div>
          )}
        </div>

        {/* MENU NAVIGATION */}
        <nav className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;

            return (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => !isCollapsed && setOpenMenu(openMenu === item.name ? null : item.name)}
                      className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3.5" : "justify-between px-4 py-3.5"} rounded-2xl transition-all duration-300 ${activeMenu === item.name || item.children.some((c) => c.name === activeMenu) ? "bg-gradient-to-r from-[#BD002F] to-[#990022] text-white shadow-xl shadow-red-900/30" : "text-blue-200/80 hover:bg-white/5 hover:text-white hover:translate-x-1"}`}
                      title={isCollapsed ? item.name : ""}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} className="shrink-0" />
                        {!isCollapsed && <span className="text-[13px] font-semibold tracking-wide truncate">{item.name}</span>}
                      </div>
                      {!isCollapsed && <ChevronRight size={14} className={`transition-all duration-300 shrink-0 ${openMenu === item.name ? "rotate-90 text-blue-300" : "text-blue-300/50"}`} />}
                    </button>
                    {openMenu === item.name && !isCollapsed && (
                      <div className="ml-8 mt-2 space-y-1 transition-all">
                        {item.children.map((child) => (
                          <button
                            key={child.name}
                            onClick={() => setActiveMenu(child.name)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${activeMenu === child.name ? "bg-white text-[#BD002F] font-semibold" : "text-blue-200/70 hover:bg-white/10"}`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenu(item.name)}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3.5" : "justify-between px-4 py-3.5"} rounded-2xl transition-all duration-300 ${isActive ? "bg-gradient-to-r from-[#BD002F] to-[#990022] text-white shadow-xl shadow-red-900/30" : "text-blue-200/80 hover:bg-white/5 hover:text-white hover:translate-x-1"}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className="shrink-0" />
                      {!isCollapsed && <span className="text-[13px] font-semibold tracking-wide truncate">{item.name}</span>}
                    </div>
                    {!isCollapsed && <ChevronRight size={14} className={`transition-all shrink-0 ${isActive ? "text-white" : "text-blue-300/50"}`} />}
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <div className="text-center pt-4 border-t border-white/5 shrink-0">
        <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase font-bold truncate">
          {isCollapsed ? "#WB" : "#FORBETTERWASKITA"}
        </p>
      </div>
    </div>
  );
}