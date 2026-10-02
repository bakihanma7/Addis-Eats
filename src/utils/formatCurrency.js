
export function formatCurrency(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 'ETB 0';
  return `ETB ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export default formatCurrency;
