import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, FileText, Users, ShieldCheck, AlertTriangle, Gavel, CreditCard } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Eligibility & Account Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Student Verification</h3>
                <p className="text-sm text-muted-foreground">
                  BookBid is exclusively for BITS Pilani Dubai Campus students. You must have a valid
                  @dubai.bits-pilani.ac.in email address and provide accurate student information during registration.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Responsibility</h3>
                <p className="text-sm text-muted-foreground">
                  You are responsible for maintaining the security of your account and all activities that occur under
                  your account. You must notify us immediately of any unauthorized use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Accurate Information</h3>
                <p className="text-sm text-muted-foreground">
                  You agree to provide accurate, current, and complete information about yourself and your listings.
                  Misrepresentation may result in account suspension or termination.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Marketplace Rules & Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Items</h3>
                <p className="text-sm text-muted-foreground">
                  Only textbooks, academic materials, and educational resources may be listed. Items must be legally
                  owned and in the condition described.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Conduct</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Listing counterfeit, stolen, or unauthorized materials</li>
                  <li>• Manipulating bids or engaging in fraudulent activities</li>
                  <li>• Harassing, threatening, or abusing other users</li>
                  <li>• Sharing contact information to circumvent platform fees</li>
                  <li>• Creating multiple accounts or fake profiles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Standards</h3>
                <p className="text-sm text-muted-foreground">
                  All content must be appropriate, accurate, and comply with UAE laws. We reserve the right to remove
                  content that violates these standards.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transactions & Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Escrow Service</h3>
                <p className="text-sm text-muted-foreground">
                  All payments are processed through our secure escrow service. Funds are held until the buyer confirms
                  receipt and satisfaction with the item, or the protection period expires.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fees & Charges</h3>
                <p className="text-sm text-muted-foreground">
                  A 3% escrow service fee is charged on all transactions to cover payment processing and buyer
                  protection. This fee is clearly displayed before payment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refunds & Disputes</h3>
                <p className="text-sm text-muted-foreground">
                  Buyers have 7 days to report issues with their purchase. We will mediate disputes and may issue
                  refunds if items are significantly different from their description.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Platform Responsibilities & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-sm text-muted-foreground">
                  We strive to maintain service availability but cannot guarantee uninterrupted access. We may
                  temporarily suspend service for maintenance or updates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Moderation</h3>
                <p className="text-sm text-muted-foreground">
                  We review listings and user content but cannot guarantee the accuracy of all information. Users are
                  responsible for verifying item details before purchase.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  BookBid acts as a platform facilitating transactions between students. We are not liable for disputes
                  between users, item quality issues, or indirect damages.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Termination & Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Termination</h3>
                <p className="text-sm text-muted-foreground">
                  We may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are
                  no longer eligible (e.g., graduation, transfer).
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  Upon account termination, we will delete personal information as outlined in our Privacy Policy, while
                  retaining transaction records as required by law.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Changes to Terms</h3>
                <p className="text-sm text-muted-foreground">
                  We may update these terms from time to time. Significant changes will be communicated via email or
                  platform notifications. Continued use constitutes acceptance of updated terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Email:</strong> support@bookbid.ae
                  </p>
                  <p>
                    <strong>Address:</strong> BITS Pilani Dubai Campus, Dubai International Academic City, UAE
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Governing Law</h3>
                <p className="text-sm text-muted-foreground">
                  These terms are governed by the laws of the United Arab Emirates. Any disputes will be resolved
                  through the courts of Dubai, UAE.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By using BookBid, you acknowledge that you have read, understood, and agree to be bound by these Terms of
              Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
