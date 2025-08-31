const { createClient } = require('@supabase/supabase-js')

// Direct environment variables (since we know them)
const supabaseUrl = 'https://cemopscerinhpreejzix.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbW9wc2NlcmluaHByZWVqeml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU5NDkwNiwiZXhwIjoyMDcyMTcwOTA2fQ.1DmwTSP71ydFZ8WcDa_QmDxU_AGoq2WI6hlYOJIOzf8'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error && error.message.includes('relation "public.profiles" does not exist')) {
      console.log('⚠️  Profiles table doesn\'t exist yet - this is expected for initial setup')
      return true
    } else if (error) {
      console.error('❌ Database connection error:', error.message)
      return false
    } else {
      console.log('✅ Database connection successful!')
      return true
    }
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

async function checkExistingTables() {
  try {
    console.log('🔍 Checking existing tables...')
    
    const tables = [
      'profiles', 'categories', 'books', 'bids', 
      'messages', 'orders', 'reviews'
    ]
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error && error.message.includes('does not exist')) {
        console.log(`⚠️  Table '${table}' does not exist`)
      } else if (error) {
        console.log(`❌ Error checking table '${table}':`, error.message)
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    }
  } catch (err) {
    console.error('❌ Error checking tables:', err.message)
  }
}

async function testAuthConnection() {
  try {
    console.log('🔍 Testing auth connection...')
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('⚠️  Auth test (expected for service role):', error.message)
    } else {
      console.log('✅ Auth connection working')
    }
  } catch (err) {
    console.log('⚠️  Auth test error (expected for service role):', err.message)
  }
}

async function main() {
  console.log('🚀 Starting database setup check...\n')
  
  console.log('Environment:')
  console.log(`- Supabase URL: ${supabaseUrl}`)
  console.log(`- Service Role Key: ${supabaseKey.substring(0, 20)}...`)
  console.log('')
  
  const connectionOk = await checkDatabaseConnection()
  if (!connectionOk) {
    process.exit(1)
  }
  
  console.log('')
  await checkExistingTables()
  
  console.log('')
  await testAuthConnection()
  
  console.log('\n✅ Database setup check complete!')
  console.log('\nNext steps:')
  console.log('1. Run the remaining database scripts in Supabase SQL Editor')
  console.log('2. Add the service role key to your Vercel environment variables')
  console.log('3. Test your application')
}

main().catch(console.error)
