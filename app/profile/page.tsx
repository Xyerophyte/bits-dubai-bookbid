"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BookOpen, ArrowLeft, User, Star, Upload, Bell, Shield } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  id: "1",
  firstName: "Arjun",
  lastName: "Kumar",
  email: "arjun.kumar@dubai.bits-pilani.ac.in",
  phone: "+971 50 123 4567",
  avatar: "/student-avatar.png",
  bio: "Second-year Computer Science student at BITS Pilani Dubai. Love reading and sharing textbooks with fellow students!",
  joinedDate: "September 2024",
  rating: 4.8,
  totalSales: 12,
  totalPurchases: 8,
  totalReviews: 15,
  verificationStatus: "verified",
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    bidAlerts: true,
    marketingEmails: false,
  },
}

const mockReviews = [
  {
    id: 1,
    reviewer: "Priya S.",
    rating: 5,
    comment: "Great seller! Book was exactly as described and delivery was quick.",
    date: "2 weeks ago",
    bookTitle: "Physics for Scientists and Engineers",
  },
  {
    id: 2,
    reviewer: "Rahul M.",
    rating: 5,
    comment: "Excellent condition textbook. Highly recommend this seller!",
    date: "1 month ago",
    bookTitle: "Calculus: Early Transcendentals",
  },
  {
    id: 3,
    reviewer: "Sneha P.",
    rating: 4,
    comment: "Good transaction, book was as expected. Fast response to messages.",
    date: "1 month ago",
    bookTitle: "Organic Chemistry",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    phone: mockUser.phone,
    bio: mockUser.bio,
  })
  const [preferences, setPreferences] = useState(mockUser.preferences)

  const handleSave = () => {
    console.log("[v0] Saving profile:", formData)
    setIsEditing(false)
    // TODO: Save to backend
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    console.log("[v0] Updated preference:", key, value)
    // TODO: Save to backend
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
          <nav className="flex items-center space-x-4">
            <Link
              href="/books"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Books
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 bg-transparent"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
                <CardTitle className="text-xl">
                  {mockUser.firstName} {mockUser.lastName}
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {mockUser.rating}
                  </div>
                  <span>•</span>
                  <span>{mockUser.totalReviews} reviews</span>
                </CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Student
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{mockUser.totalSales}</p>
                    <p className="text-xs text-muted-foreground">Books Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">{mockUser.totalPurchases}</p>
                    <p className="text-xs text-muted-foreground">Books Bought</p>
                  </div>
                </div>
                <Separator />
                <div className="text-center text-sm text-muted-foreground">Member since {mockUser.joinedDate}</div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verified</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Student Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and bio</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={mockUser.email} disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell other students about yourself..."
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
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your bids and sales</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("emailNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get text messages for urgent updates</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("smsNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bid-alerts">Bid Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when you're outbid or auction ends</p>
                  </div>
                  <Switch
                    id="bid-alerts"
                    checked={preferences.bidAlerts}
                    onCheckedChange={(value) => handlePreferenceChange("bidAlerts", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive tips and featured books</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(value) => handlePreferenceChange("marketingEmails", value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews ({mockReviews.length})
                </CardTitle>
                <CardDescription>What other students say about you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {review.reviewer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.reviewer}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">Book: {review.bookTitle}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
