import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ktdlpibaouepxmdpuiny.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZGxwaWJhb3VlcHhtZHB1aW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTI0MjcsImV4cCI6MjA5Nzk2ODQyN30.5cpK2YC4EH7sKyK5CU2Iz8Z_18SWhs4TM2MlUIef8zU'

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). This will cause a deadlock.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes - redirect to login if not authenticated
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

    if (!user && !isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  } catch (e) {
    console.error("Middleware Error:", e)
    // Fallback: allow the request to proceed and let the client-side handle it
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
