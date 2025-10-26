'use client'

import { useState } from 'react'
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement'
import { DailySubVaultsCalendar } from '@/components/calendar/DailySubVaultsCalendar'
import { Button } from '@/components/ui/Button'

interface AvailabilityManagerProps {
  vaultId: string
}

export function AvailabilityManager({ vaultId }: AvailabilityManagerProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [mode, setMode] = useState<'open' | 'block'>('block')

  const {
    openNights,
    blockNights,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAvailabilityManagement(vaultId)

  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates)
  }

  const handleOpenNights = async () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one night')
      return
    }
    
    try {
      console.log('🔓 Opening nights:', selectedDates)
      const result = await openNights(selectedDates)
      console.log('✅ Transaction submitted:', result)
    } catch (err) {
      console.error('❌ Error opening nights:', err)
      alert(`Failed to open nights: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleBlockNights = async () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one night')
      return
    }
    
    try {
      console.log('🚫 Blocking nights:', selectedDates)
      const result = await blockNights(selectedDates)
      console.log('✅ Transaction submitted:', result)
    } catch (err) {
      console.error('❌ Error blocking nights:', err)
      alert(`Failed to block nights: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const isProcessing = isPending || isConfirming

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📅 Availability Management
        </h3>
        <p className="text-gray-600">
          Select nights to open or block for booking
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode('block')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            mode === 'block'
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🚫 Block Nights
        </button>
        <button
          onClick={() => setMode('open')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            mode === 'open'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✅ Open Nights
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <DailySubVaultsCalendar
          parentVaultId={vaultId}
          onDateSelect={handleDateSelect}
          selectionMode="multiple"
          selectedDates={selectedDates}
          disabled={isProcessing}
        />
      </div>

      {/* Action Buttons */}
      {selectedDates.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Selected: {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedDates.map((d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}
              </p>
            </div>
          </div>

          {mode === 'block' ? (
            <Button
              onClick={handleBlockNights}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {isProcessing ? (
                <>⏳ Processing...</>
              ) : (
                <>🚫 Block {selectedDates.length} Night{selectedDates.length !== 1 ? 's' : ''}</>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleOpenNights}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isProcessing ? (
                <>⏳ Processing...</>
              ) : (
                <>✅ Open {selectedDates.length} Night{selectedDates.length !== 1 ? 's' : ''}</>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Transaction Status */}
      {isPending && (
        <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            ⏳ Waiting for wallet signature...
          </p>
        </div>
      )}
      
      {isConfirming && (
        <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            ⏳ Transaction confirming on blockchain...
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✅ Availability updated successfully!
          </p>
          <button
            onClick={() => setSelectedDates([])}
            className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            ⚠️ Error updating availability. Please try again.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">💡 How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Open:</strong> Make nights available for booking</li>
          <li>• <strong>Block:</strong> Prevent bookings on specific nights</li>
          <li>• Select multiple nights for bulk operations</li>
          <li>• Changes take effect immediately on the blockchain</li>
        </ul>
      </div>
    </div>
  )
}

