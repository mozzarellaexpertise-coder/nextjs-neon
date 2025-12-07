import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

console.log('KEY PREFIX:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20))
console.log('URL:', process.env.SUPABASE_URL)

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env variables')
  }

  return createClient(url, key)
}

export async function GET(req) {
  try {
    const supabase = getSupabaseAdmin()

    const table = new URL(req.url).searchParams.get('table')
    if (!table) {
      return new Response(JSON.stringify({ error: 'Missing ?table=' }), { status: 400 })
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(50)

    if (error) throw error

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('GET /api/db-test ERROR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const supabase = getSupabaseAdmin()

    const table = new URL(req.url).searchParams.get('table')
    if (!table) {
      return new Response(JSON.stringify({ error: 'Missing ?table=' }), { status: 400 })
    }

    const body = await req.json()

    if (!body.text) {
      return new Response(JSON.stringify({ error: 'Missing "text" in body' }), { status: 400 })
    }

    const { data, error } = await supabase
      .from(table)
      .insert([{ text: body.text }])
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('POST /api/db-test ERROR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}