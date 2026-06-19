import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function useKeuanganData() {
  const [chartData, setChartData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPiutangData();
  }, []);

  async function loadPiutangData() {
    try {
      setLoading(true);
      console.log("⏳ Mulai fetch data piutang dari Supabase...");

      // Grafik
      const { data: chart, error: chartError } = await supabase
        .from("vw_piutang_chart")
        .select("*")
        .order("sort_order");
        
      console.log("📊 HASIL CHART:", chart);
      if (chartError) {
        console.error("❌ ERROR CHART:", chartError);
        throw chartError;
      }

      // Detail
      const { data: detail, error: detailError } = await supabase
        .from("vw_piutang_detail")
        .select("*");

      console.log("📝 HASIL DETAIL:", detail);
      if (detailError) {
        console.error("❌ ERROR DETAIL:", detailError);
        throw detailError;
      }

      setChartData(chart || []);
      setDetailData(detail || []);
      console.log("✅ Fetch selesai dan data berhasil di-set!");

    } catch (err) {
      console.error("🚨 CATCH ERROR Keseluruhan:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    chartData,
    detailData,
    loading,
    reload: loadPiutangData,
  };
}