'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { formatUnits } from 'viem'
import { DailySubVaultsCalendar } from '@/components/calendar/DailySubVaultsCalendar'
import { Button } from '@/components/ui/Button'
import { useDailySubVaults } from '@/hooks/useDailySubVaults'
import { useDailyVaultActions } from '@/hooks/useDailyVaultActions'
import { usePYUSDApproval } from '@/hooks/usePYUSDApproval'
import { useMasterAccessCode } from '@/hooks/useMasterAccessCode'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useVaultInfo } from '@/hooks/useVaultInfo'
import { FundWallet } from '@/components/FundWallet'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import { sepolia, arbitrumSepolia } from 'wagmi/chains'
import Link from 'next/link'

type BookingStep = 'select-dates' | 'confirm' | 'create-vault' | 'approve-pyusd' | 'create-reservation' | 'success'

interface DailyBookingFlowProps {
  vaultId: string
  parentVaultAddress: `0x${string}`
}

export function DailyBookingFlow({ vaultId, parentVaultAddress }: DailyBookingFlowProps) {
  const { address } = useAccount()
  const chainId = useChainId()
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-dates')
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [error, setError] = useState<string>('')

  // Validate chain support
  const isSupportedChain = chainId === sepolia.id || chainId === arbitrumSepolia.id
  const currentChainAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { contractAddress: factoryAddress } = useDigitalHouseFactory()
  const { getDailyPrice, refetch: refetchSubVaults } = useDailySubVaults(vaultId)
  const { masterCode, isLoading: isLoadingMasterCode, hasValidMasterCode, refetch: refetchMasterCode } = useMasterAccessCode(parentVaultAddress)
  const { dailyBasePrice: parentVaultDailyPrice } = useVaultInfo(parentVaultAddress)
  
  const {
    createNightVault,
    createReservationOnSubVault,
    setBookingParams,
    subVaultAddress,
    bookingPhase,
    currentNightNumber,
    createMultiDayBooking,
    continueMultiDayBooking,
    resetMultiBooking,
    setBookingError,
    isPending: isBookingPending,
    isConfirming: isBookingConfirming,
    isConfirmed: isBookingConfirmed,
    isMultiBookingInProgress,
    isMultiBookingComplete,
    hasMoreBookings,
    currentBookingIndex,
    totalBookings,
    bookingProgress,
    currentBookingDate,
  } = useDailyVaultActions(vaultId)

  // Get daily price - use parent vault price if no sub-vaults exist yet
  const subVaultDailyPrice = getDailyPrice()
  const dailyPrice = subVaultDailyPrice > BigInt(0) 
    ? subVaultDailyPrice 
    : (parentVaultDailyPrice && typeof parentVaultDailyPrice === 'bigint' ? parentVaultDailyPrice : BigInt(0))
  
  const totalCost = dailyPrice * BigInt(selectedDates.length)


  // IMPORTANT: Approve PYUSD to factory contract, not parent vault
  const {
    approve: approvePYUSD,
    needsApproval,
    hasSufficientBalance,
    balance: pyusdBalance,
    currentAllowance,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    error: approvalError,
  } = usePYUSDApproval(address, factoryAddress)

  // Handle date selection
  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates)
    setError('')
  }

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (selectedDates.length === 0) {
      setError('Please select at least one night')
      return
    }

    // Check wallet connection
    if (!address) {
      setError('Please connect your wallet to continue')
      return
    }

    // Check chain support
    if (!isSupportedChain || !currentChainAddress) {
      setError(`Please switch to Sepolia or Arbitrum Sepolia network. Current chain ID: ${chainId}`)
      return
    }

    // Check factory address
    if (!factoryAddress) {
      setError('Factory contract not available. Please switch to a supported network.')
      return
    }

    // Check PYUSD balance
    if (!hasSufficientBalance(totalCost)) {
      const formattedCost = formatUnits(totalCost, 6)
      const formattedBalance = pyusdBalance ? formatUnits(pyusdBalance, 6) : '0'
      setError(`Insufficient PYUSD balance. Need ${formattedCost} PYUSD, but you have ${formattedBalance} PYUSD`)
      return
    }

    const needsApprove = needsApproval(totalCost)

    // Skip approval if already approved
    if (!needsApprove) {
      setCurrentStep('create-booking')
    } else {
      setCurrentStep('approve-pyusd')
    }
  }

  // Handle PYUSD approval
  const handleApprovePYUSD = async () => {
    if (!address || !totalCost) {
      setError('Missing required information')
      return
    }

    if (!factoryAddress) {
      setError('Factory contract not available')
      return
    }

    try {
      await approvePYUSD(totalCost)
    } catch (err) {
      setError(`Failed to approve PYUSD: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your wallet and try again.`)
    }
  }

  // Handle booking creation
  const handleCreateBooking = async () => {
    if (!hasValidMasterCode || !masterCode) {
      const errorMsg = isLoadingMasterCode 
        ? 'Loading master access code...' 
        : 'Master access code not available. Please try refreshing the page.'
      setError(errorMsg)
      setBookingError(errorMsg)
      
      // Try to refetch master code
      if (!isLoadingMasterCode) {
        refetchMasterCode()
      }
      return
    }

    if (selectedDates.length === 0) {
      setError('No dates selected')
      setBookingError('No dates selected')
      return
    }

    try {
      await createMultiDayBooking(selectedDates, masterCode)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to create booking: ${errorMessage}`)
      setBookingError(`Failed to create booking: ${errorMessage}`)
      setCurrentStep('confirm')
    }
  }

  // Handle continuing multi-day booking
  const handleContinueBooking = async () => {
    try {
      await continueMultiDayBooking()
    } catch (err) {
      setError('Failed to continue booking. Please try again.')
      setBookingError('Failed to continue booking')
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
    if (currentStep === 'create-booking' && 
        !isBookingPending && 
        !isBookingConfirming &&
        hasValidMasterCode &&
        selectedDates.length > 0 &&
        totalBookings === 0) {  // Only start if not already started
      handleCreateBooking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isBookingPending, isBookingConfirming, hasValidMasterCode, selectedDates.length, totalBookings])

  // Handle multi-booking progression - continue to next booking when current one is confirmed
  useEffect(() => {
    if (isBookingConfirmed && currentStep === 'create-booking' && hasMoreBookings && !isBookingPending && !isBookingConfirming) {
      setTimeout(() => {
        handleContinueBooking()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookingConfirmed, currentStep, hasMoreBookings, currentBookingIndex, isBookingPending, isBookingConfirming])

  // Auto-progress to success after all bookings are completed
  useEffect(() => {
    if (isMultiBookingComplete && currentStep === 'create-booking' && !isBookingPending && !isBookingConfirming) {
      refetchSubVaults()
      setTimeout(() => {
        setCurrentStep('success')
      }, 500)
    }
  }, [isMultiBookingComplete, currentStep, refetchSubVaults, isBookingPending, isBookingConfirming])

  // Handle single booking completion (when not multi-booking)
  useEffect(() => {
    if (isBookingConfirmed && 
        currentStep === 'create-booking' && 
        !isMultiBookingInProgress && 
        !hasMoreBookings &&
        !isBookingPending && 
        !isBookingConfirming) {
      refetchSubVaults()
      setTimeout(() => {
        setCurrentStep('success')
      }, 500)
    }
  }, [isBookingConfirmed, currentStep, isMultiBookingInProgress, hasMoreBookings, refetchSubVaults, isBookingPending, isBookingConfirming])

  // Cleanup multi-booking state when component unmounts or when starting fresh
  useEffect(() => {
    return () => {
      if (isMultiBookingInProgress) {
        resetMultiBooking()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

            {selectedDates.length > 0 && (
              dailyPrice > BigInt(0) ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-xl">
                <h4 className="text-xl font-bold text-blue-900 mb-4">💰 Booking Summary</h4>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Rate per Night:</span>
                    <span className="font-semibold text-blue-900 text-lg">{formatUnits(dailyPrice, 6)} PYUSD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Selected Nights:</span>
                    <span className="font-semibold text-blue-900 text-lg">🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
                    <span className="text-blue-800 font-bold text-lg">Total Cost:</span>
                    <span className="font-bold text-blue-900 text-2xl">{formatUnits(totalCost, 6)} PYUSD</span>
                  </div>
                  
                  {/* Wallet Status */}
                  {address ? (
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-600">Your PYUSD Balance:</span>
                        <span className="font-medium text-blue-800">
                          {pyusdBalance ? formatUnits(pyusdBalance, 6) : '0'} PYUSD
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-blue-600">Balance Status:</span>
                        <span className={`font-medium ${hasSufficientBalance(totalCost) ? 'text-green-600' : 'text-red-600'}`}>
                          {hasSufficientBalance(totalCost) ? '✅ Sufficient' : '❌ Insufficient'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-blue-200 text-center">
                      <span className="text-yellow-700 text-sm font-medium">⚠️ Connect wallet to check balance</span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!address || !hasSufficientBalance(totalCost)}
                  className={`w-full py-4 text-lg font-bold shadow-lg ${
                    !address || !hasSufficientBalance(totalCost)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  }`}
                >
                  {!address
                    ? '🔗 Connect Wallet to Book'
                    : !hasSufficientBalance(totalCost)
                    ? '💳 Insufficient PYUSD Balance'
                    : `🏨 Book ${selectedDates.length} Night${selectedDates.length !== 1 ? 's' : ''} Now →`
                  }
                </Button>
              </div>
              ) : (
                // Show loading/error state when pricing is not available
                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <h4 className="text-xl font-bold text-yellow-900 mb-4">⚠️ Pricing Information</h4>
                  <div className="space-y-3">
                    <p className="text-yellow-700 mb-4">
                      🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sub-vault price:</span>
                          <span className="font-mono">{subVaultDailyPrice.toString()} wei</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parent vault price:</span>
                          <span className="font-mono">{parentVaultDailyPrice ? parentVaultDailyPrice.toString() : 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Final price:</span>
                          <span className="font-mono">{dailyPrice.toString()} wei</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      {parentVaultDailyPrice === undefined 
                        ? '⏳ Loading vault pricing information...'
                        : '❌ No pricing information available. Please contact the property owner.'
                      }
                    </p>
                  </div>
                </div>
              )
            )}
            
            {/* Show FundWallet if insufficient balance */}
            {address && selectedDates.length > 0 && dailyPrice > BigInt(0) && !hasSufficientBalance(totalCost) && (
              <div className="mt-6">
                <FundWallet />
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
                  <span className="text-gray-600">Selected Nights:</span>
                  <span className="font-semibold text-gray-900">🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rate per Night:</span>
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

              {/* Master Code Status */}
              {!hasValidMasterCode && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">🔑 Master Access Code Status</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        {isLoadingMasterCode ? 'Loading access code...' : 'Access code not available'}
                      </p>
                    </div>
                    {!isLoadingMasterCode && (
                      <Button
                        onClick={() => refetchMasterCode()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1"
                      >
                        🔄 Retry
                      </Button>
                    )}
                  </div>
                </div>
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
                  disabled={isLoadingMasterCode || !hasValidMasterCode}
                  className="flex-1"
                >
                  {isLoadingMasterCode 
                    ? '⏳ Loading Code...'
                    : !hasValidMasterCode 
                    ? '🔑 Access Code Required'
                    : 'Proceed to Approve →'
                  }
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
                Approve {formatUnits(totalCost, 6)} PYUSD to complete your booking for 🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}.
              </p>

              {/* Approval Status */}
              <div className="mb-4 p-3 bg-white rounded-md border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Current Allowance:</span>
                  <span className="font-medium">{currentAllowance ? formatUnits(currentAllowance, 6) : '0'} PYUSD</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Required Amount:</span>
                  <span className="font-medium">{formatUnits(totalCost, 6)} PYUSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approval Status:</span>
                  <span className={`font-medium ${needsApproval(totalCost) ? 'text-red-600' : 'text-green-600'}`}>
                    {needsApproval(totalCost) ? 'Approval Required' : 'Already Approved'}
                  </span>
                </div>
              </div>

              {isApprovePending || isApproveConfirming ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                  <p className="text-yellow-700 text-sm">
                    {isApprovePending ? 'Waiting for approval...' : 'Confirming approval...'}
                  </p>
                </div>
              ) : needsApproval(totalCost) ? (
                <Button
                  onClick={handleApprovePYUSD}
                  className="w-full"
                >
                  Approve PYUSD
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-700 font-medium mb-2">✅ PYUSD already approved</p>
                  <Button
                    onClick={() => setCurrentStep('create-booking')}
                    className="w-full"
                  >
                    Continue to Booking
                  </Button>
                </div>
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
              
              {isMultiBookingInProgress && totalBookings > 1 ? (
                <div className="space-y-4">
                  <p className="text-blue-700">
                    Creating reservations for 🌙 {totalBookings} nights (booking each night separately)...
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="bg-blue-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-500 ease-out"
                      style={{ width: `${bookingProgress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>Progress: {Math.round(bookingProgress)}%</span>
                    <span>Night {currentBookingIndex + 1} of {totalBookings}</span>
                  </div>

                  {currentBookingDate && (
                    <p className="text-blue-800 font-medium">
                      Currently booking: {currentBookingDate}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-blue-700 mb-4">
                  Creating reservations for 🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}...
                </p>
              )}

              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-700 text-sm">
                  {isBookingPending ? 'Submitting transaction...' : isBookingConfirming ? 'Confirming booking...' : 'Processing...'}
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
                Your booking for 🌙 {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''} has been created successfully.
              </p>

              <div className="bg-white rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Booking Details:</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>🌙 Nights: {selectedDates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}</p>
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
                    resetMultiBooking()
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Book More Nights
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

