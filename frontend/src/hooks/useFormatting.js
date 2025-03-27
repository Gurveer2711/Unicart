import {
  formatDate,
  formatDateTime,
  formatShortDate,
  formatRelativeTime,
} from "../utils/formatDate";

/**
 * Custom hook for consistent formatting throughout the application
 * @returns {object} - Formatting utility functions
 */
const useFormatting = () => {
  /**
   * Format a currency value
   * @param {number} amount - The amount to format
   * @param {string} currency - The currency code (default: USD)
   * @returns {string} - Formatted currency string
   */
  const formatCurrency = (amount, currency = "USD") => {
    if (amount === undefined || amount === null) return "N/A";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${amount} ${currency}`;
    }
  };

  /**
   * Format a number with thousands separators
   * @param {number} value - The number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted number
   */
  const formatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null) return "N/A";

    try {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    } catch (error) {
      console.error("Error formatting number:", error);
      return value.toString();
    }
  };

  /**
   * Format a percentage value
   * @param {number} value - The value to format (0.1 = 10%)
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted percentage
   */
  const formatPercent = (value, decimals = 0) => {
    if (value === undefined || value === null) return "N/A";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    } catch (error) {
      console.error("Error formatting percentage:", error);
      return `${value * 100}%`;
    }
  };

  // Return all formatting functions
  return {
    formatDate,
    formatDateTime,
    formatShortDate,
    formatRelativeTime,
    formatCurrency,
    formatNumber,
    formatPercent,
  };
};

export default useFormatting;
