import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AddProjectModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    id_project: "",
    project_name: "",
    short_project_name: "",
    nonjo_joi: "",
    status_proyek: "",
    kadiv: "",
    wakadiv: "",
    kepala_departemen: "",
    kepala_proyek_current: "",
    id_owner: "",
    owner: "",
    lokasi_provinsi: "",
    jenis_proyek: "",
    jenis_kontrak: "",
    jenis_proyek_lainnya: "",
    jenis_kontrak_lainnya: "",
    tipe_proyek_lainnya: "",
    psn: "",
    tipe_proyek: "",
    nk_current: 0,
    bk_mapp_kumulatif_current: 0,
    pu_mapp_kumulatif_current: 0,
    start_date: "",
    end_date: "",
    end_date_current: "",
    longitude: "",
    latitude: "",
    link_drone: "",
    cctv_available: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.id_project) {
      alert("ID Project wajib diisi!");
      return;
    }

    setSaving(true);

    const getValueOrOther = (value, other) =>
      value === "LAINNYA" ? other : value;

    const {
      jenis_proyek_lainnya,
      jenis_kontrak_lainnya,
      tipe_proyek_lainnya,
      ...dbForm
    } = form;

    const cleanedForm = Object.fromEntries(
      Object.entries({
        ...dbForm,

        jenis_proyek:
          form.jenis_proyek === "LAINNYA"
            ? form.jenis_proyek_lainnya
            : form.jenis_proyek,

        jenis_kontrak:
          form.jenis_kontrak === "LAINNYA"
            ? form.jenis_kontrak_lainnya
            : form.jenis_kontrak,

        tipe_proyek:
          form.tipe_proyek === "LAINNYA"
            ? form.tipe_proyek_lainnya
            : form.tipe_proyek,

        longitude: isNaN(Number(form.longitude))
          ? null
          : Number(form.longitude),

        latitude: isNaN(Number(form.latitude)) ? null : Number(form.latitude),

        nk_current: form.nk_current === "" ? null : Number(form.nk_current),

        bk_mapp_kumulatif_current:
          form.bk_mapp_kumulatif_current === ""
            ? null
            : Number(form.bk_mapp_kumulatif_current),

        pu_mapp_kumulatif_current:
          form.pu_mapp_kumulatif_current === ""
            ? null
            : Number(form.pu_mapp_kumulatif_current),
      }).filter(([_, v]) => v !== ""),
    );

    console.log("FORM CLEANED:", cleanedForm);

    const { data, error } = await supabase
      .from("master_project")
      .insert([cleanedForm])
      .select();

    setSaving(false);

    if (error) {
      console.error("SUPABASE ERROR:", error);

      alert(`
Code    : ${error.code}
Message : ${error.message}
Detail  : ${error.details}
Hint    : ${error.hint}
  `);

      return;
    }

    onSaved();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
        <div className="border-b p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            Tambah Project Baru
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 text-xl font-bold"
          >
            &#x2715;
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* BAGIAN 1: DATA UTAMA */}
          <div>
            <h3 className="font-semibold text-lg text-[#000075] border-b pb-2 mb-4">
              Informasi Utama
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  ID Project <span className="text-red-500">*</span>
                </label>
                <input
                  name="id_project"
                  placeholder="Contoh: PRJ-001"
                  className="w-full border rounded-xl p-3 bg-slate-50 focus:bg-white"
                  value={form.id_project}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Nama Project
                </label>
                <input
                  name="project_name"
                  className="w-full border rounded-xl p-3 bg-slate-50 focus:bg-white"
                  value={form.project_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Short Name
                </label>
                <input
                  name="short_project_name"
                  className="w-full border rounded-xl p-3"
                  value={form.short_project_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Nilai Kontrak (Current)
                </label>
                <input
                  name="nk_current"
                  type="number"
                  className="w-full border rounded-xl p-3"
                  value={form.nk_current}
                  onChange={handleChange}
                />
              </div>

              {/* BK MAPP */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  BK MAPP Kumulatif Current
                </label>
                <input
                  type="number"
                  name="bk_mapp_kumulatif_current"
                  value={form.bk_mapp_kumulatif_current || 0}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* PU MAPP */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  PU MAPP Kumulatif Current
                </label>
                <input
                  type="number"
                  name="pu_mapp_kumulatif_current"
                  value={form.pu_mapp_kumulatif_current || 0}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* DROPDOWN STATUS PROYEK */}
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Status Proyek
                </label>
                <select
                  name="status_proyek"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.status_proyek}
                  onChange={handleChange}
                >
                  <option value="">Pilih Status...</option>
                  <option value="ON GOING">ON GOING</option>
                  <option value="MAINTENANCE / PHO">MAINTENANCE / PHO</option>
                  <option value="FHO (BAST II)">FHO (BAST II)</option>
                  <option value="HOLD">HOLD</option>
                  <option value="CANCEL / WALKOUT">CANCEL / WALKOUT</option>
                  <option value="SAP Not Updated">SAP Not Updated</option>
                </select>
              </div>

              {/* DROPDOWN JENIS JO */}
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Jenis JO (Non JO / JOI)
                </label>
                <select
                  name="nonjo_joi"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.nonjo_joi}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis JO...</option>
                  <option value="JOI">JOI</option>
                  <option value="Non JO">Non JO</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Tipe Proyek
                </label>
                <select
                  name="tipe_proyek"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.tipe_proyek}
                  onChange={handleChange}
                >
                  <option value="">Pilih Tipe...</option>

                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>

                  <option value="LAINNYA">Lainnya</option>
                </select>
                {form.tipe_proyek === "LAINNYA" && (
                  <input
                    name="tipe_proyek_lainnya"
                    placeholder="Masukkan Tipe Proyek"
                    className="w-full border rounded-xl p-3 mt-2"
                    value={form.tipe_proyek_lainnya}
                    onChange={handleChange}
                  />
                )}
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Owner
                </label>
                <input
                  name="owner"
                  className="w-full border rounded-xl p-3"
                  value={form.owner}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  ID Owner
                </label>
                <input
                  name="id_owner"
                  className="w-full border rounded-xl p-3"
                  value={form.id_owner}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Jenis Proyek
                </label>
                <select
                  name="jenis_proyek"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.jenis_proyek}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis Proyek...</option>

                  <option value="Jalan Tol At Grade">Jalan Tol At Grade</option>
                  <option value="Jalan Tol Elevated">Jalan Tol Elevated</option>
                  <option value="Jalan Raya / Lintas (Non Tol)">
                    Jalan Raya / Lintas (Non Tol)
                  </option>
                  <option value="Jembatan">Jembatan</option>
                  <option value="Terowongan">Terowongan</option>
                  <option value="Irigasi">Irigasi</option>
                  <option value="Bendungan">Bendungan</option>
                  <option value="Pelabuhan / Dermaga">
                    Pelabuhan / Dermaga
                  </option>
                  <option value="Runway - Apron - Taxiway">
                    Runway - Apron - Taxiway
                  </option>
                  <option value="Gedung Bandar Udara">
                    Gedung Bandar Udara
                  </option>
                  <option value="Apartemen / Hotel">Apartemen / Hotel</option>
                  <option value="Gedung Pabrik">Gedung Pabrik</option>
                  <option value="Perumahan">Perumahan</option>
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Office / Shopping Center">
                    Office / Shopping Center
                  </option>
                  <option value="Bendung">Bendung</option>
                  <option value="Waste Treatment">Waste Treatment</option>
                  <option value="Kampus">Kampus</option>
                  <option value="Pembangkit">Pembangkit</option>
                  <option value="EPC Lainnya">EPC Lainnya</option>

                  <option value="LAINNYA">Lainnya</option>
                </select>
                {form.jenis_proyek === "LAINNYA" && (
                  <input
                    name="jenis_proyek_lainnya"
                    placeholder="Masukkan Jenis Proyek"
                    className="w-full border rounded-xl p-3 mt-2"
                    value={form.jenis_proyek_lainnya}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Jenis Kontrak
                </label>
                <select
                  name="jenis_kontrak"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.jenis_kontrak}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis Kontrak...</option>

                  <option value="Kontrak Konstruksi">Kontrak Konstruksi</option>

                  <option value="Design & Build">Design & Build</option>

                  <option value="LAINNYA">Lainnya</option>
                </select>
                {form.jenis_kontrak === "LAINNYA" && (
                  <input
                    name="jenis_kontrak_lainnya"
                    placeholder="Masukkan Jenis Kontrak"
                    className="w-full border rounded-xl p-3 mt-2"
                    value={form.jenis_kontrak_lainnya}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">
                  PSN
                </label>
                <select
                  name="psn"
                  className="w-full border rounded-xl p-3 bg-white"
                  value={form.psn}
                  onChange={handleChange}
                >
                  <option value="">Pilih</option>
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: ORGANISASI */}
          <div>
            <h3 className="font-semibold text-lg text-[#000075] border-b pb-2 mb-4">
              Struktur Organisasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Kadiv
                </label>
                <input
                  name="kadiv"
                  className="w-full border rounded-xl p-3"
                  value={form.kadiv}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Wakadiv
                </label>
                <input
                  name="wakadiv"
                  className="w-full border rounded-xl p-3"
                  value={form.wakadiv}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Kepala Departemen
                </label>
                <input
                  name="kepala_departemen"
                  className="w-full border rounded-xl p-3"
                  value={form.kepala_departemen}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Kepala Proyek
                </label>
                <input
                  name="kepala_proyek_current"
                  className="w-full border rounded-xl p-3"
                  value={form.kepala_proyek_current}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3: LOKASI & DETAIL LAINNYA */}
          <div>
            <h3 className="font-semibold text-lg text-[#000075] border-b pb-2 mb-4">
              Pemetaan & Tanggal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Provinsi
                </label>
                <input
                  name="lokasi_provinsi"
                  className="w-full border rounded-xl p-3"
                  value={form.lokasi_provinsi}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Link Drone
                </label>
                <input
                  name="link_drone"
                  className="w-full border rounded-xl p-3"
                  value={form.link_drone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Latitude
                </label>
                <input
                  name="latitude"
                  className="w-full border rounded-xl p-3"
                  value={form.latitude}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Longitude
                </label>
                <input
                  name="longitude"
                  className="w-full border rounded-xl p-3"
                  value={form.longitude}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Mulai
                </label>
                <input
                  type="date"
                  name="start_date"
                  className="w-full border rounded-xl p-3"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Selesai
                </label>
                <input
                  type="date"
                  name="end_date"
                  className="w-full border rounded-xl p-3"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Addendum
                </label>
                <input
                  type="date"
                  name="end_date_current"
                  className="w-full border rounded-xl p-3"
                  value={form.end_date_current}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
              <input
                type="checkbox"
                id="add_cctv_available"
                name="cctv_available"
                className="w-5 h-5 cursor-pointer accent-green-600"
                checked={form.cctv_available}
                onChange={handleChange}
              />
              <label
                htmlFor="add_cctv_available"
                className="font-medium text-green-800 cursor-pointer select-none"
              >
                CCTV Tersedia di Proyek Ini
              </label>
            </div>
          </div>
        </div>

        <div className="border-t p-5 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#000075] hover:bg-blue-900 text-white font-medium rounded-xl transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Menyimpan..." : "Simpan Project Baru"}
          </button>
        </div>
      </div>
    </div>
  );
}
