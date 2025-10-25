'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { DailySubVaultsCalendar } from '@/components/calendar/DailySubVaultsCalendar'
import { Button } from '@/components/ui/Button'
import { useDailySubVaults } from '@/hooks/useDailySubVaults'
import { useDailyVaultActions } from '@/hooks/useDailyVaultActions'
import { usePYUSDApproval } from '@/hooks/usePYUSDApproval'
import { useMasterAccessCode } from '@/hooks/useMasterAccessCode'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import Link from 'next/link'

type BookingStep = 'select-dates' | 'confirm' | 'approve-pyusd' | 'create-booking' | 'success'

interface DailyBookingFlowProps {
  vaultId: string
  parentVaultAddress: `0x${string}`
}

export function DailyBookingFlow({ vaultId, parentVaultAddress }: DailyBookingFlowProps) {
  const { address } = useAccount()
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-dates')
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [error, setError] = useState<string>('')

  const { getDailyPrice, refetch: refetchSubVaults } = useDailySubVaults(vaultId)
  const { masterCode, isLoading: isLoadingMasterCode } = useMasterAccessCode(parentVaultAddress)
  
  const {
    createMultiDayBooking,
    isPending: isBookingPending,
    isConfirming: isBookingConfirming,
    isConfirmed: isBookingConfirmed,
  } = useDailyVaultActions(vaultId)

  const dailyPrice = getDailyPrice()
  const totalCost = dailyPrice * BigInt(selectedDates.length)

  const {
    approve: approvePYUSD,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
  } = usePYUSDApproval(address, parentVaultAddress)

  // Handle date selection
  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates)
    setError('')
  }

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (selectedDates.length === 0) {
      setError('Please select at least one date')
      return
    }
    setCurrentStep('approve-pyusd')
  }

  // Handle PYUSD approval
  const handleApprovePYUSD = async () => {
    if (!address || !totalCost) {
      setError('Missing required information')
      return
    }

    console.log('🔍 Approving PYUSD:', {
      amount: totalCost.toString(),
      spender: parentVaultAddress,
      owner: address,
    })

    try {
      await approvePYUSD(totalCost)
      console.log('✅ PYUSD approval transaction submitted')
    } catch (err) {
      setError('Failed to approve PYUSD. Please check your wallet and try again.')
      console.error('❌ PYUSD approval error:', err)
    }
  }

  // Handle booking creation
  const handleCreateBooking = async () => {
    if (!masterCode) {
      setError('Master access code not available. Please try again.')
      return
    }

    if (selectedDates.length === 0) {
      setError('No dates selected')
      return
    }

    console.log('📅 Creating booking for', selectedDates.length, 'days')

    try {
      await createMultiDayBooking(selectedDates, masterCode)
      console.log('✅ Booking created successfully')
    } catch (err) {
      setError('Failed to create booking. Please try again.')
      console.error('❌ Booking creation error:', err)
      setCurrentStep('confirm')
    }
  }

  // Auto-progress after approval
  useEffect(() => {
    if (isApproveConfirmed && currentStep === 'approve-pyusd') {
      setCurrentStep('create-booking')
    }
  }, [isApproveConfirmed, currentStep])

  // Auto-create booking after moving to create-booking step
  useEffect(() => {
    if (currentStep === 'create-booking' && !isBookingPending && !isBookingConfirming && !isBookingConfirmed) {
      handleCreateBooking()
    }
  }, [currentStep])

  // Auto-progress to success after booking confirmed
  useEffect(() => {
    if (isBookingConfirmed && currentStep === 'create-booking') {
      refetchSubVaults()
      setCurrentStep('success')
    }
  }, [isBookingConfirmed, currentStep, refetchSubVaults])

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-dates':
        return (
          <div className="space-y-6">
            <DailySubVaultsCalendar
              parentVaultId={vaultId}
              onDateSelect={handleDateSelect}
              selectionMode="multiple"
              selectedDates={selectedDates}
            />

            {selectedDates.length > 0 && dailyPrice > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-4">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Daily Rate:</span>
                    <span className="font-semibold text-blue-900">{formatUnits(dailyPrice, 6)} PYUSD/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Selected Days:</span>
                    <span className="font-semibold text-blue-900">{selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-blue-800 font-semibold">Total Cost:</span>
                    <span className="font-bold text-blue-900 text-lg">{formatUnits(totalCost, 6)} PYUSD</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleConfirmBooking}
                  className="w-full mt-4"
                >
                  Continue to Booking →
                </Button>
              </div>
            )}
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Confirm Your Booking</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-semibold text-gray-900">{vaultId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Selected Dates:</span>
                  <span className="font-semibold text-gray-900">{selectedDates.length} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-semibold text-gray-900">{formatUnits(dailyPrice, 6)} PYUSD</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                  <span className="text-gray-700 font-semibold">Total Cost:</span>
                  <span className="font-bold text-gray-900 text-lg">{formatUnits(totalCost, 6)} PYUSD</span>
                </div>
              </div>

              {isLoadingMasterCode && (
                <p className="text-sm text-gray-500 mb-4">⏳ Loading access code...</p>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('select-dates')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('approve-pyusd')}
                  disabled={isLoadingMasterCode || !masterCode}
                  className="flex-1"
                >
                  Proceed to Approve →
                </Button>
              </div>
            </div>
          </div>
        )

      case 'approve-pyusd':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="font-semibold text-yellow-900 text-lg mb-2">
                💰 Approve PYUSD for Booking
              </h3>
              <p className="text-yellow-700 mb-4">
                Approve {formatUnits(totalCost, 6)} PYUSD to complete your booking for {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''}.
              </p>

              {isApprovePending || isApproveConfirming ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                  <p className="text-yellow-700 text-sm">
                    {isApprovePending ? 'Waiting for approval...' : 'Confirming approval...'}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleApprovePYUSD}
                  className="w-full"
                >
                  Approve PYUSD
                </Button>
              )}
            </div>
          </div>
        )

      case 'create-booking':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-semibold text-blue-900 text-lg mb-2">
                📝 Creating Your Booking
              </h3>
              <p className="text-blue-700 mb-4">
                Creating reservations for {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''}...
              </p>

              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-700 text-sm">
                  {isBookingPending ? 'Submitting transaction...' : 'Confirming booking...'}
                </p>
              </div>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center border-2 border-green-200">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Booking Confirmed!</h3>
              <p className="text-green-700 font-medium mb-4">
                Your booking for {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} has been created successfully.
              </p>

              <div className="bg-white rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Booking Details:</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>📅 Dates: {selectedDates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}</p>
                  <p>💰 Total Cost: {formatUnits(totalCost, 6)} PYUSD</p>
                  <p>🏠 Property: {vaultId}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
                <p className="font-semibold mb-2">🔑 Access Codes</p>
                <p>Your access codes will be available after check-in. View them in the Reservations page.</p>
              </div>

              <div className="flex gap-3">
                <Link href="/reservations" className="flex-1">
                  <Button className="w-full">
                    View My Reservations
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setSelectedDates([])
                    setCurrentStep('select-dates')
                    setError('')
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Book More Dates
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Step Content */}
      {renderStepContent()}
    </div>
  )
}

