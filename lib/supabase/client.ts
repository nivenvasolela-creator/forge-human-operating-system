import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ktdlpibaouepxmdpuiny.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZGxwaWJhb3VlcHhtZHB1aW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTI0MjcsImV4cCI6MjA5Nzk2ODQyN30.5cpK2YC4EH7sKyK5CU2Iz8Z_18SWhs4TM2MlUIef8zU'

export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
