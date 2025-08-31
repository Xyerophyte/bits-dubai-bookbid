"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TrialBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTrialAccount, setIsTrialAccount] = useState(false)

  useEffect(() => {
    const trialStatus = localStorage.getItem("isTrialAccount")
    const bannerDismissed = localStorage.getItem("trialBannerDismissed")

    if (trialStatus === "true" && !bannerDismissed) {
      setIsTrialAccount(true)
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("trialBannerDismissed", "true")
  }

  const handleUpgrade = () => {
    localStorage.removeItem("isTrialAccount")
    localStorage.removeItem("trialUser")
    localStorage.removeItem("trialBannerDismissed")
  }

  if (!isVisible || !isTrialAccount) return null

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-5 w-5 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-900">You're using a trial account</h3>
            <p className="text-sm text-amber-700">Upgrade to access full features and start buying/selling books</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/auth">
            <Button onClick={handleUpgrade} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              Upgrade Now
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
