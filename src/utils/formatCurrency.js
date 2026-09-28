/**
 * Formats a numeric amount to Indian Rupee standard format (e.g. ₹1,500)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export default formatCurrency;
