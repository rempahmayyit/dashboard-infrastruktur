import React from "react";
import { Search } from "lucide-react";

export default function EmptySearch({ searchTerm, handleSearchChange, suggestions, onSelectProject, clearSearch }) {
  return (
    <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 min-h-0">
      <div className="w-14 h-14 bg-[#000075]/5 rounded-2xl flex items-center justify-center text-[#000075] mb-4">
        <Search size={28} />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-1">Executive Summary Proyek</h2>
      <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">
        Silakan cari dan pilih proyek di bawah ini untuk memuat seluruh visualisasi data pengendalian dan pemetaan geografis.
      </p>

      <div className="relative w-full max-w-md">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-inner focus-within:ring-2 focus-within:ring-[#000075]/20 focus-within:border-[#000075] transition-all">
          <Search size={18} className="text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Ketik nama proyek..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[999] max-h-60 overflow-y-auto overflow-hidden">
            {suggestions.map((project) => (
              <button
                key={project.id}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                onClick={() => {
                  clearSearch();
                  onSelectProject(project);
                }}
              >
                <div className="font-bold text-xs text-slate-800">{project.short_project_name || project.name}</div>
                <div className="text-[10px] text-slate-500">ID: {project.id}</div>
                <div className="text-[10px] text-slate-400 truncate">{project.project_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}