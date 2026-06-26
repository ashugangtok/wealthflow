// Parse date string in YYYY-MM-DD format and create a local Date object
export const parseDateString = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Convert date to YYYY-MM-DD string
export const formatDateString = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// Ensure date is a proper Date object
export const ensureDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    // Check if it's a valid date
    return isNaN(date.getTime()) ? null : date;
  }
  if (typeof date === 'string') {
    // Handle both YYYY-MM-DD and ISO string formats
    if (date.includes('-') && !date.includes('T')) {
      return parseDateString(date);
    }
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }
  // Handle Firestore Timestamp objects
  if (date && typeof date.toDate === 'function') {
    return date.toDate();
  }
  // Try to convert to Date as last resort
  if (date && typeof date.getTime === 'function') {
    return date; // Already a Date-like object
  }
  return null;
};
