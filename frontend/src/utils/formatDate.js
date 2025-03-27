/**
 * Format a date string or Date object into a readable format
 * @param {string|Date|number} date - The date to format (can be string, Date object, or timestamp)
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  let dateObj;

  try {
    // Handle different input types
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else if (typeof date === "string") {
      // Check if it's an ISO string or other format
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date)) {
        dateObj = new Date(date);
      } else {
        // Try parsing with Date.parse
        const timestamp = Date.parse(date);
        if (isNaN(timestamp)) {
          return "Invalid date";
        }
        dateObj = new Date(timestamp);
      }
    } else {
      return "Invalid date";
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    // Default formatting options
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    };

    // Format using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date error";
  }
};

/**
 * Format a date with time
 * @param {string|Date|number} date - The date to format
 * @param {object} options - Additional formatting options
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, options = {}) => {
  return formatDate(date, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    ...options,
  });
};

/**
 * Format a date in short format (MM/DD/YYYY)
 * @param {string|Date|number} date - The date to format
 * @returns {string} Formatted date in short format
 */
export const formatShortDate = (date) => {
  return formatDate(date, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date|number} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    // Future date
    if (diffMs > 0) {
      if (diffMin < 60)
        return `in ${diffMin} minute${diffMin !== 1 ? "s" : ""}`;
      if (diffHour < 24)
        return `in ${diffHour} hour${diffHour !== 1 ? "s" : ""}`;
      if (diffDay < 30) return `in ${diffDay} day${diffDay !== 1 ? "s" : ""}`;
      return formatDate(date);
    }

    // Past date
    const absDiffMin = Math.abs(diffMin);
    const absDiffHour = Math.abs(diffHour);
    const absDiffDay = Math.abs(diffDay);

    if (absDiffMin < 60)
      return `${absDiffMin} minute${absDiffMin !== 1 ? "s" : ""} ago`;
    if (absDiffHour < 24)
      return `${absDiffHour} hour${absDiffHour !== 1 ? "s" : ""} ago`;
    if (absDiffDay < 30)
      return `${absDiffDay} day${absDiffDay !== 1 ? "s" : ""} ago`;
    return formatDate(date);
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Date error";
  }
};
