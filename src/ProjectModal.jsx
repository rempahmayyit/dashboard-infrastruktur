// src/ProjectModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function ProjectModal({ isOpen, onClose, onSave }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pm, setPm] = useState("Internal");
  const [delay, setDelay] = useState("");
  const [risk, setRisk] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !name) return alert("ID dan Nama Proyek wajib diisi!");
    onSave({ id, name, PM: pm, delay, risk });
    setId(""); setName(""); setDelay(""); setRisk("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="bg-[#000075] text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Input Proyek Kritis Baru</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kode / ID Proyek</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#000075]" placeholder="Contoh: 1426012" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Proyek</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#000075]" placeholder="Nama bendungan / jalan tol..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Manajer Proyek (PM)</label>
              <select value={pm} onChange={(e) => setPm(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-[#000075]">
                <option value="Internal">Internal</option>
                <option value="KSO (Member)">KSO (Member)</option>
                <option value="KSO (Leader)">KSO (Leader)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Deviasi / Nilai</label>
              <input type="text" value={delay} onChange={(e) => setDelay(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#000075]" placeholder="Contoh: -15 M atau Nilai 48" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Akar Masalah / Risiko</label>
            <textarea value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#000075] h-20" placeholder="Jelaskan kendala pemenuhan material/lahan/termin..." />
          </div>
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">Batal</button>
            <button type="submit" className="px-4 py-2 bg-[#000075] hover:bg-[#000050] text-white rounded-xl text-sm font-semibold shadow-md">Simpan Data</button>
          </div>
        </form>
      </div>
    </div>
  );
}
