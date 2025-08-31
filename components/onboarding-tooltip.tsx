"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, Lightbulb } from "lucide-react"

interface OnboardingTooltipProps {
  id: string
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
}

export default function OnboardingTooltip({
  id,
  title,
  description,
  position = "bottom",
  children,
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)

  useEffect(() => {
    // Check if this tooltip has been seen before
    const seenTooltips = JSON.parse(localStorage.getItem("seenTooltips") || "[]")
    const onboardingComplete = localStorage.getItem("onboardingComplete")

    if (!seenTooltips.includes(id) && onboardingComplete) {
      setIsVisible(true)
    } else {
      setHasBeenSeen(true)
    }
  }, [id])

  const handleDismiss = () => {
    setIsVisible(false)
    setHasBeenSeen(true)

    // Mark this tooltip as seen
    const seenTooltips = JSON.parse(localStorage.getItem("seenTooltips") || "[]")
    if (!seenTooltips.includes(id)) {
      seenTooltips.push(id)
      localStorage.setItem("seenTooltips", JSON.stringify(seenTooltips))
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2"
      default:
        return "top-full left-1/2 transform -translate-x-1/2 mt-2"
    }
  }

  return (
    <div className="relative inline-block">
      {children}
      {isVisible && (
        <div className={`absolute z-50 w-80 ${getPositionClasses()}`}>
          <Card className="shadow-lg border-primary/20 animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">{title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm mb-3">{description}</CardDescription>
              <Button size="sm" onClick={handleDismiss} className="w-full">
                Got it
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
