'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { useAccount } from 'wagmi'

interface TransferBidModalProps {
  vaultId: string
  bidderAddress: string
  bidAmount: string
  onClose: () => void
}

export function TransferBidModal({ 
  vaultId, 
  bidderAddress, 
  bidAmount,
  onClose 
}: TransferBidModalProps) {
  const [newBidder, setNewBidder] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferReason, setTransferReason] = useState('')
  const { address } = useAccount()

  const handleTransfer = async () => {
    if (!newBidder || !address) return

    setIsTransferring(true)
    try {
      // TODO: Implement actual transfer logic with contract interaction
      console.log('Transferring bid:', {
        vaultId,
        fromBidder: bidderAddress,
        toBidder: newBidder,
        amount: bidAmount,
        reason: transferReason
      })
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully transferred bid from ${bidderAddress.slice(0, 6)}...${bidderAddress.slice(-4)} to ${newBidder.slice(0, 6)}...${newBidder.slice(-4)}!`)
      onClose()
    } catch (error) {
      console.error('Transfer error:', error)
      alert('Error transferring bid. Please try again.')
    } finally {
      setIsTransferring(false)
    }
  }

  const isValidAddress = newBidder.length === 42 && newBidder.startsWith('0x')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              🔄 Transfer Bid
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Transfer this bid to another participant
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Bid Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Current Bid Information</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Vault ID</div>
                <div className="font-bold text-gray-900">{vaultId}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Bid Amount</div>
                <div className="font-bold text-purple-600">
                  ${Number(bidAmount).toLocaleString()} PYUSD
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-600 mb-1">Current Bidder</div>
                <div className="font-mono text-gray-900">
                  {bidderAddress}
                </div>
              </div>
            </div>
          </div>

          {/* New Bidder Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Bidder Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newBidder}
              onChange={(e) => setNewBidder(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            {newBidder && !isValidAddress && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ Invalid Ethereum address. Must start with 0x and be 42 characters long.
              </p>
            )}
            {newBidder && isValidAddress && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Valid Ethereum address
              </p>
            )}
          </div>

          {/* Transfer Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Reason (Optional)
            </label>
            <textarea
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="Enter reason for transfer..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="space-y-1 text-xs">
                  <li>• This action will transfer the bid rights to the new address</li>
                  <li>• The original bidder will lose access to this bid</li>
                  <li>• Make sure the new address is correct before confirming</li>
                  <li>• This action may be irreversible depending on contract rules</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transfer Summary */}
          {newBidder && isValidAddress && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Transfer Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-mono text-gray-900">
                    {bidderAddress.slice(0, 10)}...{bidderAddress.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="text-2xl">⬇️</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono text-gray-900">
                    {newBidder.slice(0, 10)}...{newBidder.slice(-8)}
                  </span>
                </div>
                <div className="pt-2 border-t flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-purple-600">
                    ${Number(bidAmount).toLocaleString()} PYUSD
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!isValidAddress || isTransferring}
          >
            {isTransferring ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Transferring...
              </>
            ) : (
              <>🔄 Confirm Transfer</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

