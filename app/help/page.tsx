import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowLeft,
  Search,
  HelpCircle,
  Gavel,
  ShoppingCart,
  CreditCard,
  Shield,
  MessageCircle,
  Star,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"

const FAQ_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Users className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "You need a valid @dubai.bits-pilani.ac.in email address to sign up. Click 'Sign Up' and follow the verification process.",
      },
      {
        question: "Who can use BookBid?",
        answer:
          "BookBid is exclusively for BITS Pilani Dubai Campus students. You must verify your student status during registration.",
      },
      {
        question: "Is BookBid free to use?",
        answer:
          "Creating an account and browsing is free. We charge a 3% escrow service fee on completed transactions to ensure secure payments.",
      },
    ],
  },
  {
    id: "buying",
    title: "Buying Books",
    icon: <ShoppingCart className="h-5 w-5" />,
    questions: [
      {
        question: "How do I place a bid?",
        answer:
          "Find a book you want, enter your bid amount (must be higher than current bid), and click 'Place Bid'. You can also enable auto-bidding.",
      },
      {
        question: "What is auto-bidding?",
        answer:
          "Auto-bidding automatically places bids for you up to your maximum amount when others outbid you, helping you stay competitive.",
      },
      {
        question: "How does 'Buy Now' work?",
        answer:
          "Some listings have a 'Buy Now' price. Click this button to purchase immediately without bidding, ending the auction.",
      },
      {
        question: "When do I pay?",
        answer:
          "Payment is processed immediately when you win an auction or use 'Buy Now'. Funds are held in escrow until you confirm receipt.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling Books",
    icon: <Gavel className="h-5 w-5" />,
    questions: [
      {
        question: "How do I list a book for sale?",
        answer:
          "Click 'Sell Book', fill in the book details, upload photos, set your starting price and auction duration, then publish your listing.",
      },
      {
        question: "What should I include in my listing?",
        answer:
          "Include clear photos, accurate condition description, book title, author, edition, and any course codes. Honest descriptions build trust.",
      },
      {
        question: "How do I set the right price?",
        answer:
          "Research similar books on the platform, consider the book's condition and demand, and set a competitive starting price to attract bidders.",
      },
      {
        question: "When do I receive payment?",
        answer:
          "Payment is released from escrow after the buyer confirms they received the book in the described condition, typically within 7 days.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Security",
    icon: <CreditCard className="h-5 w-5" />,
    questions: [
      {
        question: "How does the escrow system work?",
        answer:
          "When you pay, funds are held securely by our escrow service. Sellers only receive payment after buyers confirm the book is as described.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept all major credit and debit cards through Stripe. UPI and other payment methods will be added soon.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, all payments are processed by Stripe, a leading payment processor. We never store your card details on our servers.",
      },
      {
        question: "What if there's a problem with my purchase?",
        answer:
          "Contact us within 7 days if the book doesn't match the description. We'll mediate the dispute and may issue a refund.",
      },
    ],
  },
]

const QUICK_GUIDES = [
  {
    title: "How to Buy Your First Book",
    description: "Step-by-step guide to finding and purchasing textbooks",
    steps: [
      "Browse or search for books",
      "Review seller ratings and book condition",
      "Place a bid or use Buy Now",
      "Complete secure payment",
      "Arrange pickup with seller",
    ],
  },
  {
    title: "Selling Books Successfully",
    description: "Tips for creating attractive listings that sell quickly",
    steps: [
      "Take clear, well-lit photos",
      "Write detailed, honest descriptions",
      "Set competitive starting prices",
      "Respond quickly to buyer messages",
      "Arrange safe meetups on campus",
    ],
  },
  {
    title: "Staying Safe on BookBid",
    description: "Best practices for secure transactions",
    steps: [
      "Meet in public campus locations",
      "Verify book condition before payment",
      "Use only platform messaging initially",
      "Report suspicious behavior",
      "Leave honest reviews",
    ],
  },
]

export default function HelpPage() {
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

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Help Center</h1>
            <p className="text-muted-foreground">Find answers to common questions and learn how to use BookBid</p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for help articles..." className="pl-10" />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guides */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Start Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {QUICK_GUIDES.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FAQ_CATEGORIES.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        {index < category.questions.length - 1 && <div className="border-b" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Still Need Help?
              </CardTitle>
              <CardDescription>Can't find what you're looking for? Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get instant help from our team</p>
                  <Button size="sm">Start Chat</Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Report Issue</h3>
                  <p className="text-sm text-muted-foreground mb-3">Report problems or suspicious activity</p>
                  <Button size="sm" variant="outline">
                    Report
                  </Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get detailed help via email</p>
                  <Button size="sm" variant="outline">
                    Email Us
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Support Hours:</strong> Sunday - Thursday, 9:00 AM - 6:00 PM GST
                  <br />
                  <strong>Email:</strong> support@bookbid.ae
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Community Guidelines
              </CardTitle>
              <CardDescription>Help us maintain a safe and friendly marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Do's</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Be honest about book conditions</li>
                    <li>• Respond to messages promptly</li>
                    <li>• Meet in safe, public campus locations</li>
                    <li>• Leave fair and honest reviews</li>
                    <li>• Report suspicious behavior</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">Don'ts</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Share personal contact information publicly</li>
                    <li>• Attempt to circumvent platform fees</li>
                    <li>• Create fake accounts or manipulate bids</li>
                    <li>• Harass or threaten other users</li>
                    <li>• List prohibited or counterfeit items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
