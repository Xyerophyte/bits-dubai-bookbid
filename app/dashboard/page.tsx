"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrialBanner } from "@/components/trial-banner"
import {
  BookOpen,
  Plus,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  Gavel,
  User,
  Settings,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  student_id: string | null
  phone: string | null
  year_of_study: number | null
  branch: string | null
  avatar_url: string | null
  bio: string | null
  rating: number
  total_reviews: number
  created_at: string
}

const getTrialUser = () => {
  if (typeof window !== "undefined") {
    const trialUser = localStorage.getItem("trialUser")
    if (trialUser) {
      return JSON.parse(trialUser)
    }
  }
  return null
}

// Mock data for dashboard
const mockActiveListings = [
  {
    id: 1,
    title: "Physics for Scientists and Engineers",
    currentBid: 650,
    buyNowPrice: 950,
    timeLeft: "1d 8h",
    views: 24,
    watchers: 6,
    bids: 3,
    status: "active",
  },
  {
    id: 2,
    title: "Organic Chemistry",
    currentBid: 1100,
    buyNowPrice: 1500,
    timeLeft: "3d 2h",
    views: 45,
    watchers: 12,
    bids: 8,
    status: "active",
  },
  {
    id: 3,
    title: "Linear Algebra and Its Applications",
    currentBid: 0,
    buyNowPrice: 800,
    timeLeft: "5d 12h",
    views: 8,
    watchers: 2,
    bids: 0,
    status: "active",
  },
]

const mockActiveBids = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals",
    myBid: 850,
    currentBid: 900,
    timeLeft: "2d 14h",
    status: "outbid",
    isAutoBid: true,
    maxAutoBid: 1000,
  },
  {
    id: 2,
    title: "Introduction to Algorithms",
    myBid: 1200,
    currentBid: 1200,
    timeLeft: "4d 6h",
    status: "winning",
    isAutoBid: false,
  },
  {
    id: 3,
    title: "Discrete Mathematics",
    myBid: 600,
    currentBid: 650,
    timeLeft: "12h 30m",
    status: "outbid",
    isAutoBid: false,
  },
]

const mockRecentActivity = [
  { type: "bid", message: "You placed a bid on Calculus: Early Transcendentals", time: "2 hours ago" },
  { type: "sale", message: "Your Physics textbook was sold to Priya S.", time: "1 day ago" },
  { type: "outbid", message: "You were outbid on Introduction to Algorithms", time: "2 days ago" },
  { type: "listing", message: "You listed Organic Chemistry for sale", time: "3 days ago" },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isTrialUser, setIsTrialUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check for trial user first
        const trialUser = getTrialUser()
        if (trialUser) {
          setIsTrialUser(true)
          setUser({
            id: trialUser.id,
            email: trialUser.email,
            full_name: trialUser.name,
            student_id: null,
            phone: null,
            year_of_study: null,
            branch: null,
            avatar_url: trialUser.avatar,
            bio: null,
            rating: trialUser.rating || 0,
            total_reviews: 0,
            created_at: trialUser.joinDate,
          })
          setLoading(false)
          return
        }

        // Get authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.push("/auth")
          return
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          // Create basic profile if it doesn't exist
          const { error: insertError } = await supabase.from("profiles").insert({
            id: authUser.id,
            email: authUser.email || "",
            full_name: authUser.user_metadata?.full_name || null,
          })

          if (!insertError) {
            // Retry fetching profile
            const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

            if (newProfile) {
              setUser(newProfile)
            }
          }
        } else {
          setUser(profile)
        }
      } catch (error) {
        console.error("Error in fetchUser:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "winning":
        return "bg-green-100 text-green-800"
      case "outbid":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bid":
        return <Gavel className="h-4 w-4 text-blue-600" />
      case "sale":
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case "outbid":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "listing":
        return <BookOpen className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const displayName = user.full_name || user.email.split("@")[0]
  const firstName = user.full_name?.split(" ")[0] || user.email.split("@")[0]
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

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
            <Button asChild>
              <Link href="/sell">
                <Plus className="h-4 w-4 mr-2" />
                Sell Book
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {isTrialUser && <TrialBanner />}

        {/* User Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {user.rating.toFixed(1)} rating
              </div>
              <span>•</span>
              <span>{user.total_reviews} reviews</span>
              <span>•</span>
              <span>Member since {joinDate}</span>
              {user.branch && (
                <>
                  <span>•</span>
                  <span>{user.branch}</span>
                </>
              )}
            </div>
          </div>
          <Button asChild>
            <Link href="/profile">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Books for sale</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Ongoing auctions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹15,420</div>
              <p className="text-xs text-muted-foreground">From book sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Successful transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on BookBid</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to get you started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/sell">
                      <Plus className="h-4 w-4 mr-2" />
                      List a New Book
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                    <Link href="/books">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Books
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages (3)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Listings</h2>
              <Button asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Listing
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockActiveListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">{listing.title}</CardTitle>
                      <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Bid:</span>
                      <span className="font-semibold">
                        {listing.currentBid > 0 ? `₹${listing.currentBid}` : "No bids"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Buy Now:</span>
                      <span className="font-semibold">₹{listing.buyNowPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Left:</span>
                      <span>{listing.timeLeft}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {listing.watchers} watching
                      </div>
                      <div className="flex items-center gap-1">
                        <Gavel className="h-3 w-3" />
                        {listing.bids} bids
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/books/${listing.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="bids" className="space-y-6">
            <h2 className="text-2xl font-bold">My Bids</h2>

            <div className="space-y-4">
              {mockActiveBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{bid.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">My Bid:</span>
                            <p className="font-semibold">₹{bid.myBid}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current Bid:</span>
                            <p className="font-semibold">₹{bid.currentBid}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Time Left:</span>
                            <p>{bid.timeLeft}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
                          </div>
                        </div>
                        {bid.isAutoBid && (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Auto-bid active (Max: ₹{bid.maxAutoBid})
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/books/${bid.id}`}>View</Link>
                        </Button>
                        {bid.status === "outbid" && (
                          <Button size="sm">
                            <Gavel className="h-4 w-4 mr-1" />
                            Bid Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Transaction history will be displayed here</p>
              <p className="text-sm">Complete purchases and sales to see your history</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
