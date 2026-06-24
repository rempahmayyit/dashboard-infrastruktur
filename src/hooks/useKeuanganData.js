import { useMemo } from "react";
import { useFilter } from "../context/FilterContext";

export default function useKeuanganData() {
  const { excelData, isDataLoading } = useFilter();

  const chartData = useMemo(() => {
    return excelData?.vw_piutang_chart || [];
  }, [excelData?.vw_piutang_chart]);

  const detailData = useMemo(() => {
    return excelData?.vw_piutang_detail || [];
  }, [excelData?.vw_piutang_detail]);

  return {
    chartData,
    detailData,
    loading: isDataLoading,
    reload: () => {}, // dummy agar tidak merusak komponen lama
  };
}