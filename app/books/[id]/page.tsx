"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Heart, Share2, ArrowLeft, User, Star } from "lucide-react"
import Link from "next/link"
import BiddingInterface from "@/components/bidding-interface"
import BidHistory from "@/components/bid-history"

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
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800"
      case "like new":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "fair":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                src={mockBook.images[selectedImage] || "/placeholder.svg"}
                alt={mockBook.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {mockBook.images.map((image, index) => (
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
                  <h1 className="text-2xl font-bold text-balance mb-2">{mockBook.title}</h1>
                  <p className="text-muted-foreground mb-2">
                    by {mockBook.author} • {mockBook.edition}
                  </p>
                  {mockBook.isbn && <p className="text-sm text-muted-foreground">ISBN: {mockBook.isbn}</p>}
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
                <Badge className={getConditionColor(mockBook.condition)}>{mockBook.condition}</Badge>
                <Badge variant="outline">{mockBook.subject}</Badge>
              </div>

              <p className="text-muted-foreground">{mockBook.description}</p>
            </div>

            {/* Enhanced Bidding Interface */}
            <BiddingInterface
              bookId={mockBook.id.toString()}
              currentBid={mockBook.currentBid}
              buyNowPrice={mockBook.buyNowPrice}
              minBidIncrement={mockBook.minBidIncrement}
              timeLeft={mockBook.timeLeft}
              bidCount={mockBook.bidCount}
              isAuctionActive={mockBook.isAuctionActive}
            />

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockBook.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mockBook.seller.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {mockBook.seller.rating}
                      </div>
                      <span>•</span>
                      <span>{mockBook.seller.totalSales} sales</span>
                      <span>•</span>
                      <span>Joined {mockBook.seller.joinedDate}</span>
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
          <BidHistory bookId={mockBook.id.toString()} bids={mockBook.bidHistory} isLive={mockBook.isAuctionActive} />
        </div>
      </div>
    </div>
  )
}
