// src/utils/formatters.js

export const formatNumber = (num, digits = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  return Number(num).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const formatPercent = (num, digits = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0%";
  }

  return `${formatNumber(num, digits)}%`;
};

export const formatSignedPercent = (num, digits = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0%";
  }

  const value = Number(num);

  return `${value > 0 ? "+" : ""}${formatNumber(value, digits)}%`;
};

export const formatCompact = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  const value = Number(num);
  const abs = Math.abs(value);

  // Triliun
  if (abs >= 1_000_000_000_000) {
    return `${formatNumber(value / 1_000_000_000_000, digits)} T`;
  }

  // Miliar
  if (abs >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, digits)} M`;
  }

  // Juta
  if (abs >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, digits)} Jt`;
  }

  return formatNumber(value, 0);
};

export const formatCurrency = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "Rp 0";
  }

  return `Rp ${formatCompact(num, digits)}`;
};

export const formatMiliar = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0 M";
  }

  return `${formatNumber(num, digits)} M`;
};

export const getNumberColor = (num) => {
  if (num > 0) return "text-emerald-600";
  if (num < 0) return "text-red-600";

  return "text-slate-500";
};

// =====================================================
// FORMAT MILIAR 2 DIGIT UNTUK TABEL FINANCIAL
// Database: Rupiah Full
// Output : Miliar Rupiah (2 digit)
// Contoh :
// 656765407117 -> 656,77
// =====================================================

export const formatFinancialMiliar = (num, digits = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0,00";
  }

  return formatNumber(Number(num) / 1_000_000_000, digits);
};