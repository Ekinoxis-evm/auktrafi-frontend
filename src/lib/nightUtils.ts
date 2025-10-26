/**
 * Utility functions for night number calculations
 * Night numbers are simple integers (1, 2, 3, etc.) representing nights
 * since the project epoch.
 */

// Define project epoch - January 1, 2025
export const NIGHT_EPOCH = new Date('2025-01-01T00:00:00Z')

/**
 * Convert a Date to a night number
 * @param date The date to convert
 * @returns Night number (1, 2, 3, etc.)
 */
export function dateToNightNumber(date: Date): number {
  const epochTime = NIGHT_EPOCH.getTime()
  const dateTime = new Date(date).setHours(0, 0, 0, 0)
  const daysSinceEpoch = Math.floor((dateTime - epochTime) / (24 * 60 * 60 * 1000))
  return daysSinceEpoch + 1 // Night numbers start at 1
}

/**
 * Convert a night number back to a Date
 * @param nightNumber The night number (1, 2, 3, etc.)
 * @returns Date object
 */
export function nightNumberToDate(nightNumber: number): Date {
  const epochTime = NIGHT_EPOCH.getTime()
  const daysToAdd = nightNumber - 1 // Night 1 = epoch day
  const targetTime = epochTime + (daysToAdd * 24 * 60 * 60 * 1000)
  return new Date(targetTime)
}

/**
 * Get current night number
 * @returns Current night number
 */
export function getCurrentNightNumber(): number {
  return dateToNightNumber(new Date())
}

/**
 * Validate night number is in valid range
 * @param nightNumber Night number to validate
 * @returns true if valid
 */
export function isValidNightNumber(nightNumber: number): boolean {
  return nightNumber > 0 && nightNumber < 1000000 // Reasonable upper limit
}

