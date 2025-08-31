import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Ensure this route is dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"
  const origin = requestUrl.origin

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      } else {
        console.error("Auth exchange error:", error)
        return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${origin}/auth?error=Authentication failed`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth?error=No authentication code provided`)
}
