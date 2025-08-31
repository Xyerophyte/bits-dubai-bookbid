"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Search, Clock, Heart, Plus, X, SlidersHorizontal, Shield } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { isAdminUser } from "@/lib/admin"
import type { User } from "@supabase/supabase-js"

// No mock data - using only real database data

export default function BooksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [books, setBooks] = useState<any[]>([]) // Only real database data
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [onlyBuyNow, setOnlyBuyNow] = useState(false)
  const [onlyAuction, setOnlyAuction] = useState(false)
  const supabase = createClient()

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsAdmin(isAdminUser(user))
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      setIsAdmin(isAdminUser(currentUser))
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Load books from database
  const loadBooks = async () => {
    try {
      setLoading(true)
      const { data: booksData, error } = await supabase
        .from('books')
        .select(`
          id,
          title,
          author,
          edition,
          condition,
          starting_price,
          current_bid,
          buy_now_price,
          bid_count,
          auction_end_time,
          course_code,
          isbn,
          created_at,
          images,
          profiles:seller_id (
            full_name
          ),
          categories (
            name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading books:', error)
        setBooks([])
        return
      }

      // Always transform and set books data, even if empty
      const transformedBooks = (booksData || []).map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author || 'Unknown Author',
        edition: book.edition || '',
        condition: book.condition,
        subject: (book.categories as any)?.name || 'General',
        currentBid: book.current_bid || book.starting_price,
        buyNowPrice: book.buy_now_price,
        timeLeft: calculateTimeLeft(book.auction_end_time),
        imageUrl: book.images?.[0] || '/placeholder.svg',
        seller: (book.profiles as any)?.full_name || 'Anonymous',
        bidCount: book.bid_count || 0,
        course: book.course_code || '',
        isbn: book.isbn || '',
        listedDate: book.created_at.split('T')[0],
      }))
      setBooks(transformedBooks)
      console.log(`Loaded ${transformedBooks.length} books from database`)
    } catch (error) {
      console.error('Error loading books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [supabase])

  // Helper function to calculate time left
  const calculateTimeLeft = (endTime: string) => {
    if (!endTime) return 'No time limit'
    
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h`
  }

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.course.toLowerCase().includes(searchLower) ||
        book.isbn.includes(searchQuery)

      // Subject filter
      const matchesSubject = selectedSubject === "all" || book.subject.toLowerCase() === selectedSubject.toLowerCase()

      // Condition filter
      const matchesCondition =
        selectedCondition === "all" || book.condition.toLowerCase().replace(" ", "_") === selectedCondition

      // Price range filter
      const price = book.buyNowPrice || book.currentBid
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1]

      // Course filter
      const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(book.course)

      // Buy now / auction filters
      const matchesBuyNow = !onlyBuyNow || book.buyNowPrice !== null
      const matchesAuction = !onlyAuction || book.buyNowPrice === null

      return (
        matchesSearch &&
        matchesSubject &&
        matchesCondition &&
        matchesPrice &&
        matchesCourse &&
        matchesBuyNow &&
        matchesAuction
      )
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.buyNowPrice || a.currentBid) - (b.buyNowPrice || b.currentBid)
        case "price-high":
          return (b.buyNowPrice || b.currentBid) - (a.buyNowPrice || a.currentBid)
        case "newest":
          return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
        case "most-bids":
          return b.bidCount - a.bidCount
        case "ending-soon":
        default:
          // Simple time sorting (would be more complex in real app)
          return a.timeLeft.localeCompare(b.timeLeft)
      }
    })

    return filtered
  }, [searchQuery, selectedSubject, selectedCondition, sortBy, priceRange, selectedCourses, onlyBuyNow, onlyAuction])

  const handleCourseToggle = (course: string) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("all")
    setSelectedCondition("all")
    setPriceRange([0, 2000])
    setSelectedCourses([])
    setOnlyBuyNow(false)
    setOnlyAuction(false)
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

  const availableCourses = [...new Set(books.map((book) => book.course))].sort()

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
            {isAdmin && (
              <Button asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  Sell Book
                </Link>
              </Button>
            )}
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
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Textbooks</h1>
            <p className="text-muted-foreground">Find affordable textbooks from fellow BITS Dubai students</p>
          </div>
          <Button 
            variant="outline" 
            onClick={loadBooks}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Search and Basic Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, author, course code, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="computer science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="most-bids">Most Bids</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Course Codes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Course Codes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableCourses.map((course) => (
                    <div key={course} className="flex items-center space-x-2">
                      <Checkbox
                        id={course}
                        checked={selectedCourses.includes(course)}
                        onCheckedChange={() => handleCourseToggle(course)}
                      />
                      <Label htmlFor={course} className="text-sm cursor-pointer">
                        {course}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Listing Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Listing Type</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="buy-now" checked={onlyBuyNow} onCheckedChange={(checked) => setOnlyBuyNow(!!checked)} />
                    <Label htmlFor="buy-now" className="text-sm cursor-pointer">
                      Buy Now Available
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auction-only" checked={onlyAuction} onCheckedChange={(checked) => setOnlyAuction(!!checked)} />
                    <Label htmlFor="auction-only" className="text-sm cursor-pointer">
                      Auction Only
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedBooks.length} of {books.length} books
          </p>
          {(searchQuery ||
            selectedSubject !== "all" ||
            selectedCondition !== "all" ||
            selectedCourses.length > 0 ||
            onlyBuyNow ||
            onlyAuction) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href={`/books/${book.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                  <img
                    src={book.imageUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("[v0] Added to wishlist:", book.id)
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{book.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        by {book.author} • {book.edition}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={`text-xs ${getConditionColor(book.condition)}`}>
                      {book.condition === 'like_new' ? 'Like New' : book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {book.course}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Bid</span>
                      <span className="font-semibold text-primary">₹{book.currentBid}</span>
                    </div>
                    {book.buyNowPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Buy Now</span>
                        <span className="font-semibold">₹{book.buyNowPrice}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {book.timeLeft}
                      </div>
                      <span>{book.bidCount} bids</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Seller: {book.seller}</div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <h3 className="text-lg font-semibold mb-2">Loading books...</h3>
            <p className="text-muted-foreground">Fetching the latest textbook listings</p>
          </div>
        )}

        {!loading && filteredAndSortedBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {books.length === 0 ? 'No books available' : 'No books found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {books.length === 0 
                ? 'Be the first to list a textbook!' 
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {books.length === 0 ? (
              isAdmin && (
                <Button asChild>
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Book
                  </Link>
                </Button>
              )
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Load More */}
        {filteredAndSortedBooks.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Books
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
