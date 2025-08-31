"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface LiveAuctionTimerProps {
  endTime: Date
  onTimeUp?: () => void
  className?: string
}

export function LiveAuctionTimer({ endTime, onTimeUp, className = "" }: LiveAuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds, total: difference })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
        if (onTimeUp) {
          onTimeUp()
        }
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  const formatTime = () => {
    if (timeLeft.total <= 0) {
      return "Auction Ended"
    }

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`
    }
  }

  const getUrgencyLevel = () => {
    const totalMinutes = Math.floor(timeLeft.total / (1000 * 60))

    if (totalMinutes <= 0) return "ended"
    if (totalMinutes <= 30) return "critical" // Less than 30 minutes
    if (totalMinutes <= 120) return "urgent" // Less than 2 hours
    if (totalMinutes <= 1440) return "warning" // Less than 24 hours
    return "normal"
  }

  const urgencyLevel = getUrgencyLevel()

  const getBadgeVariant = () => {
    switch (urgencyLevel) {
      case "ended":
        return "secondary"
      case "critical":
        return "destructive"
      case "urgent":
        return "destructive"
      case "warning":
        return "default"
      default:
        return "outline"
    }
  }

  const getBadgeColor = () => {
    switch (urgencyLevel) {
      case "ended":
        return "bg-gray-100 text-gray-800"
      case "critical":
        return "bg-red-100 text-red-800 animate-pulse"
      case "urgent":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {urgencyLevel === "critical" ? (
          <AlertTriangle className="h-3 w-3 text-red-600" />
        ) : (
          <Clock className="h-3 w-3 text-muted-foreground" />
        )}
        <Badge variant={getBadgeVariant()} className={getBadgeColor()}>
          {formatTime()}
        </Badge>
      </div>

      {urgencyLevel === "critical" && timeLeft.total > 0 && (
        <span className="text-xs text-red-600 font-medium animate-pulse">Ending Soon!</span>
      )}
    </div>
  )
}

// Hook for managing multiple auction timers
export function useAuctionTimer(endTime: Date) {
  const [isEnded, setIsEnded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const difference = end - now

      setTimeLeft(Math.max(0, difference))
      setIsEnded(difference <= 0)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return { isEnded, timeLeft }
}
