import React from "react";
import { ChevronDown } from "lucide-react";

export default function CCTVFilter({ icon, value, options = [], onChange }) {
  return (
    <div className="relative group">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          bg-slate-950
          border
          border-slate-700
          hover:border-blue-500
          focus:border-blue-500
          outline-none
          rounded-xl
          pl-11
          pr-11
          py-3
          min-w-[220px]
          text-sm
          font-medium
          text-white
          transition-all
          duration-300
          cursor-pointer
          shadow-lg
          group-hover:shadow-blue-500/10
        "
      >
        {options.map((item) => (
          <option key={item} value={item} className="bg-slate-900">
            {item === "ALL" ? "Semua" : item}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-500
          pointer-events-none
        "
      />
    </div>
  );
}
