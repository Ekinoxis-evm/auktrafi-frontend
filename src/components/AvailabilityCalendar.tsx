'use client'

import { useState } from 'react'

interface AvailabilityCalendarProps {
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void
  selectedCheckIn?: Date
  selectedCheckOut?: Date
}

interface DayInfo {
  date: Date
  isSelected: boolean
  isInRange: boolean
  isToday: boolean
  isPast: boolean
  isCurrentMonth: boolean
}

/**
 * Simple date picker calendar - NO CONTRACT CALLS
 * Only validates selected dates when user clicks "Check Availability" button
 */
export function AvailabilityCalendar({ 
  onDateRangeSelect,
  selectedCheckIn,
  selectedCheckOut 
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingCheckIn, setSelectingCheckIn] = useState(true)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Get days in current month
  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Add empty days for calendar grid alignment
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: DayInfo[] = []
    const current = new Date(startDate)

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = current.getMonth() === month
      const isPast = current < today
      const isToday = current.getTime() === today.getTime()
      
      days.push({
        date: new Date(current),
        isSelected: Boolean((selectedCheckIn && current.getTime() === selectedCheckIn.getTime()) ||
                   (selectedCheckOut && current.getTime() === selectedCheckOut.getTime())),
        isInRange: isInSelectedRange(current, selectedCheckIn, selectedCheckOut, hoveredDate, selectingCheckIn),
        isToday,
        isPast,
        isCurrentMonth
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Check if date is in selected range
  const isInSelectedRange = (
    date: Date, 
    checkIn?: Date, 
    checkOut?: Date, 
    hovered?: Date | null,
    selecting?: boolean
  ): boolean => {
    if (!checkIn) return false
    
    let rangeEnd = checkOut
    if (selecting && !checkOut && hovered && hovered > checkIn) {
      rangeEnd = hovered
    }
    
    if (!rangeEnd) return false
    
    const start = checkIn < rangeEnd ? checkIn : rangeEnd
    const end = checkIn < rangeEnd ? rangeEnd : checkIn
    
    return date > start && date < end
  }

  // Handle day click
  const handleDayClick = (day: DayInfo) => {
    if (day.isPast || !day.isCurrentMonth) return

    if (selectingCheckIn || !selectedCheckIn) {
      // Selecting check-in date
      setSelectingCheckIn(false)
      onDateRangeSelect(day.date, selectedCheckOut || new Date(day.date.getTime() + 86400000)) // Next day as default checkout
    } else {
      // Selecting check-out date
      if (day.date <= selectedCheckIn) {
        // If selected date is before check-in, make it the new check-in
        setSelectingCheckIn(false)
        onDateRangeSelect(day.date, selectedCheckIn)
      } else {
        // Normal check-out selection
        setSelectingCheckIn(true)
        onDateRangeSelect(selectedCheckIn, day.date)
      }
    }
  }

  // Get day styling
  const getDayClassName = (day: DayInfo): string => {
    const baseClasses = "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all relative hover:scale-105"
    
    if (!day.isCurrentMonth) {
      return `${baseClasses} text-gray-300 cursor-default hover:scale-100`
    }
    
    if (day.isPast) {
      return `${baseClasses} text-gray-400 cursor-not-allowed hover:scale-100 line-through`
    }
    
    if (day.isSelected) {
      return `${baseClasses} bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-lg ring-2 ring-emerald-300`
    }
    
    if (day.isInRange) {
      return `${baseClasses} bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-300`
    }
    
    if (day.isToday) {
      return `${baseClasses} bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-800 font-bold border-2 border-orange-400 hover:from-yellow-200 hover:to-orange-200 shadow-md`
    }
    
    // Available days
    return `${baseClasses} hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 text-gray-700 border border-gray-200 hover:border-green-300`
  }

  // Get day tooltip
  const getDayTooltip = (day: DayInfo): string => {
    if (!day.isCurrentMonth) return ''
    if (day.isPast) return 'Past date'
    if (day.isToday) return 'Today'
    return 'Click to select'
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const days = getDaysInMonth(currentMonth)
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            📅 Select Your Dates
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectingCheckIn ? 'Choose your check-in date' : 'Choose your check-out date'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Previous month"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            title="Go to today"
          >
            Today
          </button>
          <span className="text-lg font-semibold text-gray-700 min-w-[180px] text-center">
            {monthYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-orange-400 rounded"></div>
          <span className="font-medium">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded shadow"></div>
          <span className="font-medium">Selected</span>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={getDayClassName(day)}
            onClick={() => handleDayClick(day)}
            onMouseEnter={() => setHoveredDate(day.date)}
            onMouseLeave={() => setHoveredDate(null)}
            title={getDayTooltip(day)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      {/* Selection info */}
      {selectedCheckIn && selectedCheckOut && selectedCheckIn.getTime() !== selectedCheckOut.getTime() && (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Selected Dates</p>
              <p className="text-emerald-700 font-medium">
                {selectedCheckIn.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })} → {selectedCheckOut.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24))} nights
              </p>
            </div>
            <button
              onClick={() => {
                setSelectingCheckIn(true)
                onDateRangeSelect(new Date(), new Date())
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center text-sm">
          {selectingCheckIn ? (
            <p className="text-blue-900">
              <span className="font-semibold">Step 1:</span> Click on your <strong>check-in</strong> date 📅
            </p>
          ) : (
            <p className="text-blue-900">
              <span className="font-semibold">Step 2:</span> Click on your <strong>check-out</strong> date 📅
            </p>
          )}
          <p className="text-xs text-blue-600 mt-2">
            💡 After selecting dates, click &quot;Check Availability&quot; to verify with the contract
          </p>
        </div>
      </div>
    </div>
  )
}
