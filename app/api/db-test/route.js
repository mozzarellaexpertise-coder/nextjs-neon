import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('fruits')   // 👈 change this to your text-only table name
    .select('*')
    .limit(10)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()

  const { data, error } = await supabaseServer
    .from('fruits')   // 👈 same table name
    .insert([
      { name: body.text }
    ])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}