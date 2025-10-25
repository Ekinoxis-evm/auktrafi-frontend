'use client'

import { useState, useMemo } from 'react'
import { useDailySubVaults } from '@/hooks/useDailySubVaults'
import { DayCell } from './DayCell'

interface DailySubVaultsCalendarProps {
  parentVaultId: string
  onDateSelect?: (dates: Date[]) => void
  selectionMode?: 'single' | 'multiple'
  selectedDates?: Date[]
  disabled?: boolean
}

interface DayInfo {
  date: Date
  state: 0 | 1 | 2 | null
  isToday: boolean
  isPast: boolean
  isCurrentMonth: boolean
  isSelected: boolean
}

export function DailySubVaultsCalendar({
  parentVaultId,
  onDateSelect,
  selectionMode = 'multiple',
  selectedDates = [],
  disabled = false,
}: DailySubVaultsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { getDayState, isLoading, getMonthStats } = useDailySubVaults(parentVaultId)

  const monthStats = getMonthStats(currentMonth)

  // Generate days for the current month view
  const days = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysArray: DayInfo[] = []

    // Add empty days for calendar grid alignment
    const startPadding = firstDay.getDay()
    for (let i = 0; i < startPadding; i++) {
      const paddingDate = new Date(year, month, -startPadding + i + 1)
      daysArray.push({
        date: paddingDate,
        state: getDayState(paddingDate),
        isToday: false,
        isPast: paddingDate < today,
        isCurrentMonth: false,
        isSelected: false,
      })
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)

      daysArray.push({
        date,
        state: getDayState(date),
        isToday: date.getTime() === today.getTime(),
        isPast: date < today,
        isCurrentMonth: true,
        isSelected: selectedDates.some(
          (selectedDate) =>
            selectedDate.toDateString() === date.toDateString()
        ),
      })
    }

    return daysArray
  }, [currentMonth, getDayState, selectedDates])

  const handleDateClick = (dayInfo: DayInfo) => {
    if (disabled || !dayInfo.isCurrentMonth || dayInfo.isPast) return
    if (dayInfo.state === 2) return // Can't select occupied days

    const clickedDate = dayInfo.date

    if (selectionMode === 'single') {
      onDateSelect?.([clickedDate])
    } else {
      // Multiple selection mode
      const isAlreadySelected = selectedDates.some(
        (d) => d.toDateString() === clickedDate.toDateString()
      )

      if (isAlreadySelected) {
        onDateSelect?.(
          selectedDates.filter(
            (d) => d.toDateString() !== clickedDate.toDateString()
          )
        )
      } else {
        onDateSelect?.([...selectedDates, clickedDate].sort((a, b) => a.getTime() - b.getTime()))
      }
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">🌙 Select Your Nights</h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectionMode === 'single' ? 'Select a night' : 'Select your nights'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
            title="Previous month"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium"
            title="Go to today"
          >
            Today
          </button>
          <span className="text-lg font-semibold text-gray-700 min-w-[180px] text-center">
            {monthYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
            title="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Month Stats */}
      {!isLoading && monthStats.total > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {monthStats.free > 0 && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
              <span>🟢</span>
              <span className="font-medium text-green-700">{monthStats.free} available</span>
            </div>
          )}
          {monthStats.auction > 0 && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
              <span>🟡</span>
              <span className="font-medium text-yellow-700">{monthStats.auction} in auction</span>
            </div>
          )}
          {monthStats.settled > 0 && (
            <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
              <span>🔴</span>
              <span className="font-medium text-red-700">{monthStats.settled} occupied</span>
            </div>
          )}
        </div>
      )}

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading availability...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayInfo, index) => (
            <DayCell
              key={`${dayInfo.date.toISOString()}-${index}`}
              dayInfo={dayInfo}
              onClick={() => handleDateClick(dayInfo)}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <span>🟢</span> <span className="text-gray-700">FREE (available)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🟡</span> <span className="text-gray-700">AUCTION (can bid)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔴</span> <span className="text-gray-700">SETTLED (occupied)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⚪</span> <span className="text-gray-700">Available (no bookings yet)</span>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDates.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                🌙 Selected: {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {selectedDates.map((d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}
              </p>
            </div>
            <button
              onClick={() => onDateSelect?.([])}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors shadow-md"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

