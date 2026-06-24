export const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const num = Number(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? 0 : num;
};

export const formatPercent = (val) => {
  return Number(val || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatMiliar = (val) => {
  const num = safeParseNumber(val);
  return (
    "Rp " +
    (num / 1_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    " M"
  );
};

export const formatAngkaM = (value) => {
  const num = Number(value || 0);
  if (num === 0) return "-";
  return (num / 1000000000).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};