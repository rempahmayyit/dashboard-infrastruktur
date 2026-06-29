import React from "react";

export default function CCTVStatCard({ title, value, icon, color = "blue" }) {
  const colorMap = {
    blue: {
      bg: "from-blue-600 to-cyan-500",
      glow: "shadow-blue-500/30",
      text: "text-blue-300",
      border: "border-blue-500/20",
    },

    emerald: {
      bg: "from-emerald-600 to-green-500",
      glow: "shadow-emerald-500/30",
      text: "text-emerald-300",
      border: "border-emerald-500/20",
    },

    red: {
      bg: "from-red-600 to-rose-500",
      glow: "shadow-red-500/30",
      text: "text-red-300",
      border: "border-red-500/20",
    },

    amber: {
      bg: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/30",
      text: "text-amber-300",
      border: "border-amber-500/20",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`
      relative
      overflow-hidden
      rounded-3xl
      border
      ${c.border}
      bg-slate-900
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-2xl
      ${c.glow}
      group
    `}
    >
      {/* Glow */}

      <div
        className={`
        absolute
        -right-8
        -top-8
        w-28
        h-28
        rounded-full
        blur-3xl
        opacity-20
        bg-gradient-to-br
        ${c.bg}
      `}
      />

      {/* Header */}

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            {value}
          </h2>
        </div>

        <div
          className={`
          w-16
          h-16
          rounded-2xl
          bg-gradient-to-br
          ${c.bg}
          flex
          items-center
          justify-center
          shadow-xl
          ${c.glow}
          group-hover:scale-110
          transition-transform
        `}
        >
          {icon}
        </div>
      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between relative z-10">
        <span
          className={`
          text-xs
          font-semibold
          uppercase
          tracking-wider
          ${c.text}
        `}
        >
          LIVE DATA
        </span>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

          <span className="text-xs text-slate-500">Updated</span>
        </div>
      </div>

      {/* Bottom Line */}

      <div
        className={`
        absolute
        bottom-0
        left-0
        h-1
        w-full
        bg-gradient-to-r
        ${c.bg}
      `}
      />
    </div>
  );
}
