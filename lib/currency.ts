const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

/**
 * Format pence to GBP currency string
 * @param pence - Amount in pence (1 pound = 100 pence)
 * @returns Formatted currency string (e.g., "£10.50")
 */
export const formatFromPence = (pence: number) => formatter.format(pence / 100);

/**
 * Format pence to GBP currency string with an approximate indicator
 * Use this for estimated prices that may vary
 * @param pence - Amount in pence
 * @returns Formatted currency string with ~ prefix (e.g., "~£10.50")
 */
export const formatFromPenceEstimate = (pence: number) => `~${formatter.format(pence / 100)}`;

/**
 * Format pence to a simple price string without currency symbol
 * Useful for compact displays
 * @param pence - Amount in pence
 * @returns Formatted price without symbol (e.g., "10.50")
 */
export const formatFromPenceNoSymbol = (pence: number) => {
  return (pence / 100).toFixed(2);
};







