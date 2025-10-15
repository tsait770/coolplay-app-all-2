/**
 * Utility functions for safe number display across all platforms and locales
 * Prevents character encoding issues when displaying numbers
 */

/**
 * Safely converts a number to a string for display
 * Ensures the output is always a valid Arabic numeral (0-9)
 * @param value - The number to display
 * @returns A string representation of the number using Arabic numerals
 */
export function safeNumberDisplay(value: unknown): string {
  // Handle null, undefined, or non-numeric values
  if (value === null || value === undefined) {
    console.warn('[safeNumberDisplay] Received null/undefined, returning "0"');
    return '0';
  }

  // Convert to number if it's a string
  let numValue: number;
  if (typeof value === 'string') {
    numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      console.warn('[safeNumberDisplay] Invalid string value:', value);
      return '0';
    }
  } else if (typeof value === 'number') {
    numValue = value;
  } else {
    console.warn('[safeNumberDisplay] Invalid type:', typeof value);
    return '0';
  }

  // Validate the number
  if (isNaN(numValue) || !isFinite(numValue)) {
    console.warn('[safeNumberDisplay] Invalid number:', numValue);
    return '0';
  }

  // Ensure it's a non-negative integer
  const safeValue = Math.max(0, Math.floor(numValue));

  // Convert to string using basic toString() to avoid locale issues
  const result = safeValue.toString();

  // Validate the result contains only digits
  if (!/^\d+$/.test(result)) {
    console.error('[safeNumberDisplay] Invalid result:', result, 'from value:', value);
    return '0';
  }

  return result;
}

/**
 * Validates that a value is a valid number for counting
 * @param value - The value to validate
 * @returns true if the value is a valid number
 */
export function isValidCount(value: unknown): boolean {
  if (typeof value !== 'number') {
    return false;
  }
  return !isNaN(value) && isFinite(value) && value >= 0;
}

/**
 * Gets a safe count from an array
 * @param arr - The array to count
 * @returns The length of the array, or 0 if invalid
 */
export function safeArrayLength(arr: unknown): number {
  if (!Array.isArray(arr)) {
    console.warn('[safeArrayLength] Not an array:', typeof arr);
    return 0;
  }
  const length = arr.length;
  if (typeof length !== 'number' || isNaN(length) || !isFinite(length)) {
    console.error('[safeArrayLength] Invalid array length:', length);
    return 0;
  }
  return Math.max(0, Math.floor(length));
}

/**
 * Formats a number for display with proper validation
 * @param value - The number to format
 * @param defaultValue - The default value if invalid (default: 0)
 * @returns A formatted string
 */
export function formatCount(value: unknown, defaultValue: number = 0): string {
  if (!isValidCount(value)) {
    return safeNumberDisplay(defaultValue);
  }
  return safeNumberDisplay(value);
}
