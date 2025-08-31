"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Upload, X, ArrowLeft, Plus, DollarSign, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isAdminUser } from "@/lib/admin"
import type { User } from "@supabase/supabase-js"

export default function SellPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    edition: "",
    isbn: "",
    condition: "",
    description: "",
    minBidPrice: "",
    buyNowPrice: "",
    subject: "",
    courseCode: "",
  })
  const router = useRouter()
  const supabase = createClient()

  // Check authentication and admin status
  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error || !authUser) {
          router.push('/auth')
          return
        }
        
        setUser(authUser)
        const adminStatus = isAdminUser(authUser)
        setIsAdmin(adminStatus)
        
        if (!adminStatus) {
          // Non-admin users will see access denied message
          console.log('Access denied: User is not an admin')
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        router.push('/auth')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuthAndAdmin()
  }, [router, supabase])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
        .slice(0, 5 - images.length)
        .map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) {
      console.error('Unauthorized: Only admin can create listings')
      return
    }
    
    if (!user) {
      console.error('User not authenticated')
      return
    }

    try {
      // Get category ID based on subject
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${formData.subject}%`)
        .single()

      // Create book listing
      const { data, error } = await supabase
        .from('books')
        .insert({
          seller_id: user.id,
          category_id: category?.id,
          title: formData.title,
          author: formData.author,
          edition: formData.edition,
          isbn: formData.isbn,
          course_code: formData.courseCode,
          condition: formData.condition,
          description: formData.description,
          listing_type: formData.buyNowPrice ? 'both' : 'auction',
          starting_price: parseFloat(formData.minBidPrice),
          buy_now_price: formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null,
          auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          images: images.length > 0 ? images : null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating book listing:', error)
        alert('Failed to create book listing: ' + error.message)
        return
      }

      console.log('Book listing created successfully:', data)
      alert('Book listing created successfully!')
      
      // Reset form
      setFormData({
        title: "",
        author: "",
        edition: "",
        isbn: "",
        condition: "",
        description: "",
        minBidPrice: "",
        buyNowPrice: "",
        subject: "",
        courseCode: "",
      })
      setImages([])
      
      // Redirect to the new book page
      if (data.id) {
        router.push(`/books/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating book listing:', error)
      alert('Failed to create book listing. Please try again.')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Checking access permissions...</p>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
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

        <div className="container mx-auto py-16 px-4 max-w-2xl">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Only authorized administrators can create book listings.
            </p>
            
            <Alert className="mb-6 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you believe you should have access to this feature, please contact the administrator.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/books">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Books
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
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
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Admin</span>
            </div>
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

      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Link
          href="/books"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sell Your Textbook</h1>
          <p className="text-muted-foreground">
            List your textbook for auction or set a fixed price. Help fellow BITS Dubai students save money!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>Provide accurate information to help buyers find your book</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Calculus: Early Transcendentals"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="e.g., James Stewart"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    placeholder="e.g., 8th Edition"
                    value={formData.edition}
                    onChange={(e) => setFormData((prev) => ({ ...prev, edition: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN (Optional)</Label>
                  <Input
                    id="isbn"
                    placeholder="e.g., 978-1285741550"
                    value={formData.isbn}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., MATH F111, CS F211, PHY F110"
                  value={formData.courseCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, courseCode: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the BITS Dubai course code this book is used for (e.g., MATH F111, CS F211)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the book's condition, any highlights, missing pages, etc."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Book Photos (Up to 5)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Book photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Add Photo</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload clear photos of the book cover, spine, and any damage. Max 5MB per image.
                </p>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minBidPrice">Minimum Bid Price (₹) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="minBidPrice"
                        type="number"
                        placeholder="500"
                        value={formData.minBidPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, minBidPrice: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyNowPrice">Buy Now Price (₹)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="buyNowPrice"
                        type="number"
                        placeholder="1200"
                        value={formData.buyNowPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buyNowPrice: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Set a minimum bid price to start the auction. Optionally, set a "Buy Now" price for instant purchase.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  List Book for Sale
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/books">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
