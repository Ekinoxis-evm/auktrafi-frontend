'use client'

interface DayInfo {
  date: Date
  state: 0 | 1 | 2 | null // 0=FREE, 1=AUCTION, 2=SETTLED, null=no sub-vault
  isToday: boolean
  isPast: boolean
  isCurrentMonth: boolean
  isSelected: boolean
}

interface DayCellProps {
  dayInfo: DayInfo
  onClick: () => void
  disabled?: boolean
}

export function DayCell({ dayInfo, onClick, disabled = false }: DayCellProps) {
  const { date, state, isToday, isPast, isCurrentMonth, isSelected } = dayInfo

  const getDayClassName = () => {
    const baseClass =
      'w-full aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all relative'

    if (!isCurrentMonth) {
      return `${baseClass} text-gray-300 cursor-default hover:scale-100 bg-gray-50/50`
    }

    if (isPast) {
      return `${baseClass} text-gray-400 cursor-not-allowed hover:scale-100 line-through bg-gray-50`
    }

    if (isSelected) {
      return `${baseClass} bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-lg ring-2 ring-emerald-300 hover:scale-105`
    }

    if (disabled) {
      return `${baseClass} text-gray-400 cursor-not-allowed bg-gray-100`
    }

    // State-based styling
    switch (state) {
      case 0: // FREE
        return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200 border-2 border-green-300 hover:scale-105`
      case 1: // AUCTION
        return `${baseClass} bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-2 border-yellow-300 hover:scale-105`
      case 2: // SETTLED (occupied - can't select)
        return `${baseClass} bg-red-100 text-red-800 cursor-not-allowed border-2 border-red-300`
      default: // null - no sub-vault yet
        if (isToday) {
          return `${baseClass} bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-800 font-bold border-2 border-indigo-400 hover:bg-indigo-200 shadow-md hover:scale-105`
        }
        return `${baseClass} hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-105`
    }
  }

  const getDayIcon = () => {
    switch (state) {
      case 0:
        return '🟢'
      case 1:
        return '🟡'
      case 2:
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getTooltip = () => {
    if (!isCurrentMonth) return ''
    if (isPast) return 'Past date'
    if (isToday && state === null) return 'Today - Available for booking'

    switch (state) {
      case 0:
        return 'FREE - Available for booking'
      case 1:
        return 'AUCTION - Has active bids, you can bid'
      case 2:
        return 'SETTLED - Occupied, not available'
      default:
        return 'Available for booking'
    }
  }

  const handleClick = () => {
    if (disabled || !isCurrentMonth || isPast || state === 2) return
    onClick()
  }

  return (
    <div className={getDayClassName()} onClick={handleClick} title={getTooltip()}>
      {isCurrentMonth && !isPast && state !== null && (
        <span className="text-xs mb-0.5">{getDayIcon()}</span>
      )}
      <span className={isToday && !isSelected ? 'font-bold' : ''}>
        {date.getDate()}
      </span>
      {isToday && !isSelected && (
        <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>
      )}
    </div>
  )
}

