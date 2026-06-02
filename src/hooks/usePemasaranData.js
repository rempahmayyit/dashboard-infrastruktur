// src/hooks/usePemasaranData.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { formatMiliar } from "../utils/formatters";
import { useFilter } from "../context/FilterContext";

export const usePemasaranData = () => {
  const [marketingPipeline, setMarketingPipeline] = useState([]);
  const [totalRealisasiA0, setTotalRealisasiA0] = useState(0);
  const [totalPrognosa, setTotalPrognosa] = useState(0);
  const [loading, setLoading] = useState(true);
  const { globalFilter } = useFilter();

  // Array untuk konversi angka bulan ke teks (Index 0 = Jan, Index 11 = Des)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const selectedMonthNum =
    monthNames.findIndex(
      (m) => m.toLowerCase() === globalFilter?.bulan?.toLowerCase(),
    ) + 1;

  useEffect(() => {
    const fetchPemasaranData = async () => {
      try {
        setLoading(true);

        // UPDATE: Tambahkan bulan_perolehan di select query
        const { data, error } = await supabase
          .from("db_pemasaran_realisasi")
          .select(
            "id_project, project_name, owner, nilai_perolehan, status_perolehan, bulan_perolehan",
          );

        if (error) {
          console.error(
            "Gagal menarik data db_pemasaran_realisasi:",
            error.message,
          );
          return;
        }

        if (data) {
          // 1. Hitung Total Realisasi Khusus A0
          const dataA0 = data.filter((item) => {
            const bulan = Number(item.bulan_perolehan || 0);

            return (
              item.status_perolehan === "A0" &&
              bulan > 0 &&
              bulan <= selectedMonthNum
            );
          });

          const totalA0 =
            dataA0.reduce(
              (sum, item) => sum + (Number(item.nilai_perolehan) || 0),
              0,
            ) / 1_000_000_000;
          setTotalRealisasiA0(totalA0);

          // 2. Hitung Total Prognosa (A0 + A1 + A2 + B1 + B2)
          const validStatuses = ["A0", "A1", "A2", "B1", "B2"];
          const dataPrognosa = data.filter((item) =>
            validStatuses.includes(item.status_perolehan),
          );
          const tPrognosa =
            dataPrognosa.reduce(
              (sum, item) => sum + (Number(item.nilai_perolehan) || 0),
              0,
            ) / 1_000_000_000;
          setTotalPrognosa(tPrognosa);

          // 3. Mapping Data untuk Tabel
          const filteredByMonth = dataPrognosa
            .filter((item) => {
              const bulan = Number(item.bulan_perolehan || 0);

              return bulan > 0 && bulan <= selectedMonthNum;
            })
            .sort((a, b) => {
              const bulanA = Number(a.bulan_perolehan || 0);
              const bulanB = Number(b.bulan_perolehan || 0);

              return bulanB - bulanA;
            });

          const formattedPipeline = filteredByMonth.map((item) => {
            // Konversi bulan angka (1-12) ke teks (Jan-Des)
            const bulanAngka = parseInt(item.bulan_perolehan, 10);
            const bulanTeks =
              bulanAngka >= 1 && bulanAngka <= 12
                ? monthNames[bulanAngka - 1]
                : "-";

            return {
              id: item.id_project || Math.random().toString(),
              paket: item.project_name || "-",
              owner: item.owner || "-",
              nilai: formatMiliar(
                (Number(item.nilai_perolehan) || 0) / 1_000_000_000,
                1,
              ),
              status: item.status_perolehan,
              bulan: bulanTeks, // Simpan teks bulan ke dalam objek
            };
          });

          setMarketingPipeline(formattedPipeline);
        }
      } catch (err) {
        console.error("Error sistem saat fetch Pemasaran Data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPemasaranData();

    const realtimeChannel = supabase
      .channel("pemasaran-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "db_pemasaran_realisasi" },
        (payload) => {
          fetchPemasaranData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [selectedMonthNum]);

  return { marketingPipeline, totalRealisasiA0, totalPrognosa, loading };
};
