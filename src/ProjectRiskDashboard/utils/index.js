export const safeParseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const cleanStr = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export const safeDateConvert = (rawDate) => {
  if (!rawDate) return null;
  if (rawDate instanceof Date) return rawDate;

  let result = null;
  if (typeof rawDate === "number" && rawDate > 10000) {
    result = new Date((rawDate - 25569) * 86400 * 1000);
  } else if (typeof rawDate === "string") {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) result = d;
    else {
      const parts = rawDate.split(/[-/]/);
      if (parts.length === 3 && parts[0].length <= 2 && parts[2].length === 4) {
        result = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
  }
  return result && !isNaN(result.getTime()) ? result : null;
};

export const getPiutangRiskLevel = (aging60, aging180) => {
  if (aging180 > 0) return "KRITIS";
  if (aging60 > 0) return "WASPADA";
  return "NORMAL";
};

export const formatCompact = (value) => {
  const num = Number(value || 0);
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(2)} T`;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} M`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} Jt`;
  return num.toLocaleString("id-ID");
};