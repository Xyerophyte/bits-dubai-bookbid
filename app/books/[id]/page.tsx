"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Heart, Share2, ArrowLeft, User, Star, Shield } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isAdminUser } from "@/lib/admin"
import BiddingInterface from "@/components/bidding-interface"
import BidHistory from "@/components/bid-history"
import { RealTimeChat } from "@/components/real-time-chat"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Mock data for book detail
const mockBook = {
  id: 1,
  title: "Calculus: Early Transcendentals",
  author: "James Stewart",
  edition: "8th Edition",
  isbn: "978-1285741550",
  condition: "Like New",
  subject: "Mathematics",
  description:
    "Excellent condition textbook with minimal highlighting. No missing pages or damage. Perfect for first-year calculus students.",
  currentBid: 850,
  buyNowPrice: 1200,
  minBidIncrement: 50,
  timeLeft: "2d 14h 32m",
  images: ["/images/book-calculo.png", "/calculus-textbook-spine.png", "/calculus-textbook-pages.png"],
  seller: {
    name: "Arjun Kumar",
    avatar: "/student-avatar.png",
    rating: 4.8,
    totalSales: 12,
    joinedDate: "Sep 2024",
  },
  bidHistory: [
    { id: "1", bidder: "Priya S.", amount: 850, time: "2 hours ago", isWinning: true },
    { id: "2", bidder: "Rahul M.", amount: 800, time: "5 hours ago", isAutoBid: true },
    { id: "3", bidder: "Sneha P.", amount: 750, time: "1 day ago" },
    { id: "4", bidder: "Amit K.", amount: 700, time: "1 day ago" },
    { id: "5", bidder: "Neha R.", amount: 650, time: "2 days ago" },
  ],
  bidCount: 5,
  isAuctionActive: true,
}

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [book, setBook] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setIsAdmin(isAdminUser(user))
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      setIsAdmin(isAdminUser(currentUser))
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Load book data from database
  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return
      
      try {
        setLoading(true)
        const { data: bookData, error } = await supabase
          .from('books')
          .select(`
            id,
            title,
            author,
            edition,
            isbn,
            condition,
            description,
            starting_price,
            current_bid,
            buy_now_price,
            bid_count,
            auction_end_time,
            course_code,
            images,
            created_at,
            profiles:seller_id (
              id,
              full_name,
              avatar_url
            ),
            categories (
              name
            )
          `)
          .eq('id', bookId)
          .eq('status', 'active')
          .single()

        if (error) {
          console.error('Error loading book:', error)
          return
        }

        if (bookData) {
          // Transform data to match our interface
          const transformedBook = {
            id: bookData.id,
            title: bookData.title,
            author: bookData.author || 'Unknown Author',
            edition: bookData.edition || '',
            isbn: bookData.isbn || '',
            condition: bookData.condition,
            subject: (bookData.categories as any)?.name || 'General',
            description: bookData.description || '',
            currentBid: bookData.current_bid || bookData.starting_price,
            buyNowPrice: bookData.buy_now_price,
            minBidIncrement: 50, // Default increment
            timeLeft: calculateTimeLeft(bookData.auction_end_time),
            images: bookData.images && bookData.images.length > 0 ? bookData.images : ['/placeholder.svg'],
            seller: {
              id: (bookData.profiles as any)?.id,
              name: (bookData.profiles as any)?.full_name || 'Anonymous',
              avatar: (bookData.profiles as any)?.avatar_url || '/placeholder.svg',
              rating: 4.8, // Mock rating for now
              totalSales: 12, // Mock data
              joinedDate: 'Sep 2024', // Mock data
            },
            bidHistory: [], // Will be loaded by BidHistory component
            bidCount: bookData.bid_count || 0,
            isAuctionActive: new Date(bookData.auction_end_time) > new Date(),
            course: bookData.course_code || '',
          }
          setBook(transformedBook)
        }
      } catch (error) {
        console.error('Error loading book:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [bookId, supabase])

  // Helper function to calculate time left
  const calculateTimeLeft = (endTime: string) => {
    if (!endTime) return 'No time limit'
    
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d ${hours}h ${minutes}m`
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800"
      case "like new":
      case "like_new":
        return "bg-blue-100 text-blue-800"
      case "used":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist or may have been removed.</p>
          <Link href="/books">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Browse Books
            </button>
          </Link>
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
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Link
          href="/books"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg border">
              <img
                src={book.images[selectedImage] || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {book.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? "border-primary" : "border-muted"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Book Details & Bidding */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-balance mb-2">{book.title}</h1>
                  <p className="text-muted-foreground mb-2">
                    by {book.author} • {book.edition}
                  </p>
                  {book.isbn && <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>}
                  {book.course && <p className="text-sm text-muted-foreground">Course: {book.course}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={isWishlisted ? "text-red-600" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={getConditionColor(book.condition)}>{book.condition}</Badge>
                <Badge variant="outline">{book.subject}</Badge>
              </div>

              <p className="text-muted-foreground">{book.description}</p>
            </div>

            {/* Enhanced Bidding Interface */}
            <BiddingInterface
              bookId={book.id.toString()}
              initialCurrentBid={book.currentBid}
              buyNowPrice={book.buyNowPrice}
              minBidIncrement={book.minBidIncrement}
              timeLeft={book.timeLeft}
              initialBidCount={book.bidCount}
              isAuctionActive={book.isAuctionActive}
            />

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={book.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.seller.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {book.seller.rating}
                      </div>
                      <span>•</span>
                      <span>{book.seller.totalSales} sales</span>
                      <span>•</span>
                      <span>Joined {book.seller.joinedDate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Message Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Bid History */}
        <div className="mt-8">
          <BidHistory bookId={book.id.toString()} bids={book.bidHistory} isLive={book.isAuctionActive} />
        </div>
      </div>

      {/* Real-time Chat Component (Fixed Position) */}
      {user && (
        <RealTimeChat
          bookId={book.id.toString()}
          sellerId={book.seller.id || 'unknown'}
          sellerName={book.seller.name}
          sellerAvatar={book.seller.avatar}
          currentUserId={user.id}
          currentUserName={user.user_metadata?.full_name || user.email || "User"}
        />
      )}
    </div>
  )
}
