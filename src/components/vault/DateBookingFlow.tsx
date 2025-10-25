'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { DatePicker, dateToTimestamp, formatDateRange } from '../DatePicker'
import { Button } from '../ui/Button'
import { useDigitalHouseFactory } from '../../hooks/useDigitalHouseFactory'
import { usePYUSDApproval } from '../../hooks/usePYUSDApproval'
import { useVaultActions } from '../../hooks/useVaultActions'
import { useAccessCodes } from '../../hooks/useAccessCodes'
import Link from 'next/link'

interface DateBookingFlowProps {
  vaultId: string
  basePrice: bigint
}

type BookingStep = 'select-dates' | 'check-availability' | 'approve-pyusd' | 'create-reservation' | 'success'

export function DateBookingFlow({ vaultId, basePrice }: DateBookingFlowProps) {
  const { address } = useAccount()
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-dates')
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date; checkOut: Date } | null>(null)
  const [subVaultAddress, setSubVaultAddress] = useState<string>('')
  const [error, setError] = useState<string>('')

  const {
    getOrCreateDateVault,
    useDateAvailability,
    useGetDateVault,
    isPending: isFactoryPending,
    isConfirmed: isFactoryConfirmed,
  } = useDigitalHouseFactory()

  // Check availability for selected dates
  const { data: isAvailable, isLoading: isCheckingAvailability } = useDateAvailability(
    vaultId,
    selectedDates ? dateToTimestamp(selectedDates.checkIn) : 0,
    selectedDates ? dateToTimestamp(selectedDates.checkOut) : 0
  )

  // Get existing sub-vault address
  const { data: existingSubVault } = useGetDateVault(
    vaultId,
    selectedDates ? dateToTimestamp(selectedDates.checkIn) : 0,
    selectedDates ? dateToTimestamp(selectedDates.checkOut) : 0
  )

  // PYUSD approval hook
  const {
    approve: approvePYUSD,
    isPending: isApprovePending,
    isConfirmed: isApproveConfirmed,
  } = usePYUSDApproval(address, subVaultAddress as `0x${string}`)

  // Vault actions for creating reservation
  const {
    createReservation,
    isPending: isReservationPending,
    isConfirmed: isReservationConfirmed,
  } = useVaultActions(subVaultAddress as `0x${string}`)

  // Access codes for the sub-vault (after booking)
  const {
    currentCode,
    copyCurrentCode,
    currentCodeCopied,
    refetchCurrentCode,
  } = useAccessCodes(subVaultAddress as `0x${string}`)

  // Refetch access code when reservation is confirmed
  useEffect(() => {
    if (isReservationConfirmed && subVaultAddress) {
      setTimeout(() => {
        refetchCurrentCode()
      }, 2000)
    }
  }, [isReservationConfirmed, subVaultAddress, refetchCurrentCode])

  const handleDateSelect = async (checkIn: Date, checkOut: Date) => {
    setSelectedDates({ checkIn, checkOut })
    setCurrentStep('check-availability')
    setError('')
  }

  const handleCheckAvailability = async () => {
    if (!selectedDates) return

    try {
      if (isAvailable) {
        // Dates are available, proceed to create/get sub-vault
        if (existingSubVault && existingSubVault !== '0x0000000000000000000000000000000000000000') {
          // Sub-vault already exists
          setSubVaultAddress(existingSubVault as string)
          setCurrentStep('approve-pyusd')
        } else {
          // Need to create sub-vault
          await getOrCreateDateVault(
            vaultId,
            dateToTimestamp(selectedDates.checkIn),
            dateToTimestamp(selectedDates.checkOut)
          )
        }
      } else {
        setError('Selected dates are not available. Please choose different dates.')
        setCurrentStep('select-dates')
      }
    } catch (err) {
      setError('Failed to check availability. Please try again.')
      console.error('Availability check error:', err)
    }
  }

  const handleApprovePYUSD = async () => {
    if (!subVaultAddress) return

    try {
      await approvePYUSD(basePrice)
    } catch (err) {
      setError('Failed to approve PYUSD. Please try again.')
      console.error('PYUSD approval error:', err)
    }
  }

  const handleCreateReservation = async () => {
    if (!selectedDates || !subVaultAddress) return

    try {
      await createReservation(
        basePrice,
        BigInt(dateToTimestamp(selectedDates.checkIn)),
        BigInt(dateToTimestamp(selectedDates.checkOut))
      )
    } catch (err) {
      setError('Failed to create reservation. Please try again.')
      console.error('Reservation creation error:', err)
    }
  }

  // Handle transaction confirmations
  if (isFactoryConfirmed && currentStep === 'check-availability') {
    // Sub-vault created, now get its address
    // This would typically be handled by watching for events or refetching
    setCurrentStep('approve-pyusd')
  }

  if (isApproveConfirmed && currentStep === 'approve-pyusd') {
    setCurrentStep('create-reservation')
  }

  if (isReservationConfirmed && currentStep === 'create-reservation') {
    setCurrentStep('success')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-dates':
        return (
          <div className="space-y-4">
            <DatePicker
              onDateSelect={handleDateSelect}
              disabled={false}
              minStayDays={1}
              maxStayDays={30}
            />
          </div>
        )

      case 'check-availability':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Selected Dates</h3>
              <p className="text-blue-700">
                {selectedDates && formatDateRange(selectedDates.checkIn, selectedDates.checkOut)}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Base Price: {(Number(basePrice) / 1e6).toLocaleString()} PYUSD
              </p>
            </div>

            {isCheckingAvailability ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Checking availability...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isAvailable ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-medium">✅ Dates are available!</p>
                    <p className="text-green-600 text-sm">Ready to proceed with booking</p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-800 font-medium">❌ Dates not available</p>
                    <p className="text-red-600 text-sm">Please select different dates</p>
                  </div>
                )}

                <Button
                  onClick={isAvailable ? handleCheckAvailability : () => setCurrentStep('select-dates')}
                  disabled={isFactoryPending}
                  className="w-full"
                >
                  {isFactoryPending ? 'Processing...' : isAvailable ? 'Proceed to Book' : 'Select Different Dates'}
                </Button>
              </div>
            )}
          </div>
        )

      case 'approve-pyusd':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Approve PYUSD</h3>
              <p className="text-yellow-700">
                Approve {(Number(basePrice) / 1e6).toLocaleString()} PYUSD for the booking
              </p>
            </div>

            <Button
              onClick={handleApprovePYUSD}
              disabled={isApprovePending}
              className="w-full"
            >
              {isApprovePending ? 'Approving...' : 'Approve PYUSD'}
            </Button>
          </div>
        )

      case 'create-reservation':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Create Reservation</h3>
              <p className="text-blue-700">
                Final step: Create your reservation for {selectedDates && formatDateRange(selectedDates.checkIn, selectedDates.checkOut)}
              </p>
            </div>

            <Button
              onClick={handleCreateReservation}
              disabled={isReservationPending}
              className="w-full"
            >
              {isReservationPending ? 'Creating Reservation...' : 'Create Reservation'}
            </Button>
          </div>
        )

      case 'success':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 rounded-lg text-center border-2 border-green-200">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Reservation Confirmed!</h3>
              <p className="text-green-700 font-medium">
                Your booking for {selectedDates && formatDateRange(selectedDates.checkIn, selectedDates.checkOut)} is confirmed.
              </p>
            </div>

            {/* Current Access Code (Reception) */}
            {currentCode && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-300">
                <div className="text-center mb-3">
                  <p className="text-sm font-bold text-emerald-900 mb-1">🏨 Your Reception Code</p>
                  <p className="text-xs text-emerald-600">Use this at check-in desk</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-lg p-4 border-2 border-emerald-400">
                    <p className="font-mono text-3xl font-bold text-emerald-900 text-center tracking-wider">
                      {currentCode}
                    </p>
                  </div>
                  <button
                    onClick={copyCurrentCode}
                    className={`px-4 py-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      currentCodeCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {currentCodeCopied ? '✅ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Important Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">📝 Important Information</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• The auction period has started - others can place higher bids</li>
                <li>• You&apos;ll receive the master door code from the property owner</li>
                <li>• Your reception code is shown above for check-in desk</li>
                <li>• Manage your booking in the Reservations page</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/reservations" className="flex-1">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all">
                  📋 View Reservations
                </button>
              </Link>
              <button
                onClick={() => {
                  setCurrentStep('select-dates')
                  setSelectedDates(null)
                  setSubVaultAddress('')
                }}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
              >
                📅 Book Another
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!address) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to book this property.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className={currentStep === 'select-dates' ? 'text-blue-600 font-medium' : ''}>
            Select Dates
          </span>
          <span className={['check-availability', 'approve-pyusd', 'create-reservation'].includes(currentStep) ? 'text-blue-600 font-medium' : ''}>
            Book
          </span>
          <span className={currentStep === 'success' ? 'text-green-600 font-medium' : ''}>
            Complete
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: currentStep === 'select-dates' ? '25%' :
                     ['check-availability', 'approve-pyusd', 'create-reservation'].includes(currentStep) ? '75%' :
                     currentStep === 'success' ? '100%' : '0%'
            }}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Step content */}
      {renderStepContent()}
    </div>
  )
}
