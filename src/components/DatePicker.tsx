'use client'

import { useState } from 'react'
import { Button } from './ui/Button'

interface DatePickerProps {
  onDateSelect: (checkIn: Date, checkOut: Date) => void
  disabled?: boolean
  minStayDays?: number
  maxStayDays?: number
}

export function DatePicker({ 
  onDateSelect, 
  disabled = false, 
  minStayDays = 1, 
  maxStayDays = 30 
}: DatePickerProps) {
  const [checkInDate, setCheckInDate] = useState<string>('')
  const [checkOutDate, setCheckOutDate] = useState<string>('')
  const [error, setError] = useState<string>('')

  const today = new Date().toISOString().split('T')[0]
  
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setCheckInDate(date)
    setError('')
    
    // Auto-adjust check-out if it's before check-in
    if (checkOutDate && new Date(checkOutDate) <= new Date(date)) {
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOutDate(nextDay.toISOString().split('T')[0])
    }
  }

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setCheckOutDate(date)
    setError('')
  }

  const validateDates = (): boolean => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates')
      return false
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      setError('Check-in date cannot be in the past')
      return false
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date')
      return false
    }

    const stayDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    if (stayDays < minStayDays) {
      setError(`Minimum stay is ${minStayDays} day${minStayDays > 1 ? 's' : ''}`)
      return false
    }

    if (stayDays > maxStayDays) {
      setError(`Maximum stay is ${maxStayDays} days`)
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!validateDates()) return

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    
    // Set time to noon to avoid timezone issues
    checkIn.setHours(12, 0, 0, 0)
    checkOut.setHours(12, 0, 0, 0)
    
    onDateSelect(checkIn, checkOut)
  }

  const getStayDuration = (): string => {
    if (!checkInDate || !checkOutDate) return ''
    
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    return `${days} night${days > 1 ? 's' : ''}`
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <input
            type="date"
            id="checkIn"
            value={checkInDate}
            onChange={handleCheckInChange}
            min={today}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <input
            type="date"
            id="checkOut"
            value={checkOutDate}
            onChange={handleCheckOutChange}
            min={checkInDate || today}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {getStayDuration() && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
          <span className="font-medium">Duration:</span> {getStayDuration()}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={disabled || !checkInDate || !checkOutDate}
        className="w-full"
      >
        {disabled ? 'Loading...' : 'Check Availability'}
      </Button>
    </div>
  )
}

// Utility functions for date handling
export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function formatDateRange(checkIn: Date, checkOut: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }
  
  return `${checkIn.toLocaleDateString('en-US', options)} - ${checkOut.toLocaleDateString('en-US', options)}`
}
