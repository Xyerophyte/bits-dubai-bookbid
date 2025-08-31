import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  When you create an account, we collect your BITS Dubai email address, full name, student ID, phone
                  number, year of study, and branch information to verify your eligibility and facilitate transactions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transaction Data</h3>
                <p className="text-sm text-muted-foreground">
                  We collect information about your book listings, bids, purchases, and sales to provide our marketplace
                  services. Payment information is processed securely through Stripe and is not stored on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication Data</h3>
                <p className="text-sm text-muted-foreground">
                  Messages between buyers and sellers are stored to facilitate transactions and provide customer
                  support. We may also collect feedback and reviews you provide about other users.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Verify your identity as a BITS Dubai student</li>
                <li>• Facilitate book transactions and communications</li>
                <li>• Process payments and maintain transaction records</li>
                <li>• Send important notifications about your account and transactions</li>
                <li>• Improve our services and user experience</li>
                <li>• Prevent fraud and ensure platform security</li>
                <li>• Comply with legal obligations and resolve disputes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security & Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <p className="text-sm text-muted-foreground">
                  We implement industry-standard security measures including encryption, secure authentication, and
                  regular security audits to protect your personal information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  We retain your personal information for as long as your account is active or as needed to provide
                  services. Transaction records are kept for 7 years for legal and tax purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Third-Party Services</h3>
                <p className="text-sm text-muted-foreground">
                  We use trusted third-party services like Supabase for database hosting and Stripe for payment
                  processing. These services have their own privacy policies and security measures.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Access & Control</h3>
                <p className="text-sm text-muted-foreground">
                  You can access, update, or delete your personal information through your account settings. You can
                  also request a copy of all data we have about you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  You can control what notifications you receive through your account settings. However, we may still
                  send important transactional and security-related messages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your account at any time. We will remove your personal information, though some
                  transaction records may be retained for legal purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have questions about this Privacy Policy or how we handle your data, please contact us at:
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <strong>Email:</strong> privacy@bookbid.ae
                </p>
                <p>
                  <strong>Address:</strong> BITS Pilani Dubai Campus, Dubai International Academic City, UAE
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              This Privacy Policy is effective as of the date listed above and may be updated from time to time. We will
              notify you of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
