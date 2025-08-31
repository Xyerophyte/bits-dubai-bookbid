"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Shield,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { isAdminUser } from "@/lib/admin"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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





export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<UserProfile | null>(null)
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {

        // Get authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.push("/auth")
          return
        }

        setAuthUser(authUser)
        setIsAdmin(isAdminUser(authUser))

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
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">Admin</span>
              </div>
            )}
            <Link
              href="/books"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Books
            </Link>
            {isAdmin && (
              <Button asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  Sell Book
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">

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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Books for sale</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ongoing auctions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
              <p className="text-xs text-muted-foreground">From book sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-xs">Start listing books or placing bids to see your activity here</p>
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
                  {isAdmin && (
                    <Button asChild className="w-full justify-start">
                      <Link href="/sell">
                        <Plus className="h-4 w-4 mr-2" />
                        List a New Book
                      </Link>
                    </Button>
                  )}
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
                    Messages (0)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Listings</h2>
              {isAdmin && (
                <Button asChild>
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Listing
                  </Link>
                </Button>
              )}
            </div>

            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {isAdmin ? (
                <>
                  <p className="text-lg mb-2">No listings yet</p>
                  <p className="text-sm mb-6">Start by listing your first book for sale</p>
                  <Button asChild>
                    <Link href="/sell">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">No access to create listings</p>
                  <p className="text-sm mb-6">Only administrators can create book listings</p>
                  <Button asChild>
                    <Link href="/books">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Available Books
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="bids" className="space-y-6">
            <h2 className="text-2xl font-bold">My Bids</h2>

            <div className="text-center py-12 text-muted-foreground">
              <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No active bids</p>
              <p className="text-sm mb-6">Browse books and start bidding to see your bids here</p>
              <Button asChild>
                <Link href="/books">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Books
                </Link>
              </Button>
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
