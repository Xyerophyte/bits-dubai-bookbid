"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BookOpen, User, GraduationCap, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const ONBOARDING_STEPS = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Help other students get to know you",
  },
  {
    id: "preferences",
    title: "Set Your Preferences",
    description: "Customize your BookBid experience",
  },
  {
    id: "tutorial",
    title: "Quick Tutorial",
    description: "Learn how to buy and sell books",
  },
]

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    student_id: "",
    phone: "",
    year_of_study: "",
    branch: "",
    bio: "",
  })
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    bid_notifications: true,
    marketing_emails: false,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error || !user) {
          router.push("/auth")
          return
        }
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, supabase])

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceUpdate = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profileData,
          year_of_study: profileData.year_of_study ? Number.parseInt(profileData.year_of_study) : null,
        })
        .eq("id", user.id)

      if (error) throw error
      console.log("[v0] Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const completeOnboarding = async () => {
    try {
      await saveProfile()
      // Mark onboarding as complete
      localStorage.setItem("onboardingComplete", "true")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    )
  }

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BITS Dubai BookBid</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Welcome to BookBid!</h1>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {currentStep === 0 && <User className="h-12 w-12 text-primary" />}
              {currentStep === 1 && <GraduationCap className="h-12 w-12 text-primary" />}
              {currentStep === 2 && <CheckCircle className="h-12 w-12 text-primary" />}
            </div>
            <CardTitle>{ONBOARDING_STEPS[currentStep].title}</CardTitle>
            <CardDescription>{ONBOARDING_STEPS[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Profile */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                      id="student_id"
                      placeholder="2023A7PS1234H"
                      value={profileData.student_id}
                      onChange={(e) => handleProfileUpdate("student_id", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+971 50 123 4567"
                      value={profileData.phone}
                      onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Select
                      value={profileData.year_of_study}
                      onValueChange={(value) => handleProfileUpdate("year_of_study", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select value={profileData.branch} onValueChange={(value) => handleProfileUpdate("branch", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Input
                    id="bio"
                    placeholder="Tell other students about yourself..."
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Preferences */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified about important updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.email_notifications}
                        onChange={(e) => handlePreferenceUpdate("email_notifications", e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bid Notifications</p>
                        <p className="text-sm text-muted-foreground">Get alerts when you're outbid</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.bid_notifications}
                        onChange={(e) => handlePreferenceUpdate("bid_notifications", e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive tips and platform updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing_emails}
                        onChange={(e) => handlePreferenceUpdate("marketing_emails", e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tutorial */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold">You're All Set!</h3>
                  <p className="text-muted-foreground">
                    Your BookBid account is ready. Here are some quick tips to get started:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Browse Books</p>
                      <p className="text-sm text-muted-foreground">
                        Check out textbooks from other students in your courses
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Place Bids</p>
                      <p className="text-sm text-muted-foreground">
                        Bid on books you need or use "Buy Now" for instant purchase
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Sell Your Books</p>
                      <p className="text-sm text-muted-foreground">List books you no longer need and earn money</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={nextStep}>
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
                {currentStep < ONBOARDING_STEPS.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{" "}
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => router.push("/help")}>
              Help Center
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
