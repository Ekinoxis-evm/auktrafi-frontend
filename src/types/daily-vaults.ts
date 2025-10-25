import { Address } from 'viem'

/**
 * Information about a single daily sub-vault
 */
export interface DailySubVaultInfo {
  subVaultAddress: Address
  subVaultId: string
  date: number // Unix timestamp
  currentState: 0 | 1 | 2 // 0=FREE, 1=AUCTION, 2=SETTLED
  dailyPrice: bigint
  createdAt: number // Unix timestamp
}

/**
 * User's selection for booking multiple days
 */
export interface DailyBookingSelection {
  dates: Date[]
  totalCost: bigint
  dailyPrice: bigint
}

/**
 * Statistics for a month of bookings
 */
export interface MonthStats {
  free: number
  auction: number
  settled: number
  total: number
  noSubVault: number
}

/**
 * Vault state enum for type safety
 */
export enum VaultState {
  FREE = 0,
  AUCTION = 1,
  SETTLED = 2,
}

