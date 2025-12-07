import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}

export async function POST(req) {
  try {
    const supabase = getSupabase()

    const body = await req.arrayBuffer()
    const fileName = req.headers.get('x-file-name')

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'Missing x-file-name header' }),
        { status: 400 }
      )
    }

    const { data, error } = await supabase.storage
      .from('myphotos')
      .upload(`photos/${fileName}`, new Uint8Array(body), {
        cacheControl: '3600',
        upsert: true,
        contentType: req.headers.get('content-type') || 'application/octet-stream'
      })

    if (error) throw error

    const { data: publicData } = supabase.storage
      .from('myphotos')
      .getPublicUrl(data.path)

    return new Response(
      JSON.stringify({ url: publicData.publicUrl }),
      { status: 200 }
    )

  } catch (err) {
    console.error('Upload ERROR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}