import { createClient } from '@supabase/supabase-js'

export async function GET(req) {
  try {
    const supabaseServer = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const table = new URL(req.url).searchParams.get('table')
    if (!table) throw new Error('Missing table query parameter')

    const { data, error } = await supabaseServer.from(table).select('*').limit(50)
    if (error) throw error

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error('GET /api/db-test ERROR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const supabaseServer = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const table = new URL(req.url).searchParams.get('table')
    if (!table) throw new Error('Missing table query parameter')

    const body = await req.json()
    if (!body.text) throw new Error('Missing text in request body')

    const { data, error } = await supabaseServer.from(table).insert([{ text: body.text }])
    if (error) throw error

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error('POST /api/db-test ERROR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}