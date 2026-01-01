export const formatCount = (count?: number | null): string => {
  if (count == null || isNaN(count)) return '0';

  const abs = Math.abs(count);

  if (abs >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }

  if (abs >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (abs >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return count.toString();
};
