/**
 * Utility Formatting Functions
 */

export function formatAddress(address) {
  if (!address) return 'Not Connected';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatMatic(amount) {
  if (amount === undefined || amount === null) return '0.00 MATIC';
  const num = Number(amount);
  return `${num.toFixed(3)} MATIC`;
}

export function formatUsd(maticAmount, rate = 0.58) {
  const num = Number(maticAmount || 0);
  return `$${(num * rate).toFixed(2)}`;
}

export function formatTons(tons) {
  if (tons === undefined || tons === null) return '0.00 tCO2e';
  return `${Number(tons).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e`;
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
