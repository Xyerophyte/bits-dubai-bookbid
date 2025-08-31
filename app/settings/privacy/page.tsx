"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, ArrowLeft, Shield, Download, Trash2, Eye, Bell, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function PrivacySettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [settings, setSettings] = useState({
    profileVisible: true,
    emailNotifications: true,
    bidNotifications: true,
    marketingEmails: false,
    dataProcessing: true,
  })
  const supabase = createClient()
  const router = useRouter()

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
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, supabase])

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setUpdating(true)
    try {
      // In a real app, save these settings to the database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Privacy settings updated:", settings)
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setUpdating(false)
    }
  }

  const exportData = async () => {
    try {
      // In a real app, generate and download user data export
      const userData = {
        profile: user,
        settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bookbid-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      // In a real app, implement account deletion
      console.log("[v0] Account deletion requested")
      alert("Account deletion request submitted. You will receive a confirmation email.")
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading privacy settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BITS Dubai BookBid</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>

        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Privacy & Data Settings</h1>
            <p className="text-muted-foreground">Manage your privacy preferences and data controls</p>
          </div>

          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
              <CardDescription>Control how your information is displayed and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visible">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow other users to view your profile and ratings</p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={settings.profileVisible}
                  onCheckedChange={(value) => handleSettingChange("profileVisible", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-processing">Data Processing</Label>
                  <p className="text-sm text-muted-foreground">Allow us to process your data to improve our services</p>
                </div>
                <Switch
                  id="data-processing"
                  checked={settings.dataProcessing}
                  onCheckedChange={(value) => handleSettingChange("dataProcessing", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bid-notifications">Bid Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you're outbid or auctions end</p>
                </div>
                <Switch
                  id="bid-notifications"
                  checked={settings.bidNotifications}
                  onCheckedChange={(value) => handleSettingChange("bidNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and platform updates</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(value) => handleSettingChange("marketingEmails", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Export or delete your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Export Your Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of all your personal data and activity
                  </p>
                </div>
                <Button variant="outline" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Data exports include your profile information, transaction history, messages, and settings. The export
                  will be available for download immediately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Account Deletion */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your listings, bids,
                  messages, and transaction history will be deleted.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete My Account</Label>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" onClick={deleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={updating}>
              {updating ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              For questions about privacy and data handling, please review our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              or contact us at privacy@bookbid.ae
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
