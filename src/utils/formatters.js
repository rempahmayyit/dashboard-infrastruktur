export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  return new Intl.NumberFormat("id-ID").format(Number(num));
};

export const formatPercent = (num, digits = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0%";

  return `${Number(num).toFixed(digits)}%`;
};

export const formatCompact = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const abs = Math.abs(Number(num));

  if (abs >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(digits)} T`;
  }

  if (abs >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(digits)} M`;
  }

  if (abs >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(digits)} Jt`;
  }

  return formatNumber(num);
};

export const formatCurrency = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) return "Rp 0";

  return `Rp ${formatCompact(num, digits)}`;
};

export const formatSignedPercent = (num, digits = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0%";

  const value = Number(num);

  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
};

export const formatMiliar = (num) => {
  if (!num) return "0 M";

  return `${Number(num).toLocaleString("id-ID")} M`;
};
