import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const body = await req.arrayBuffer()
    const fileName = req.headers.get('x-file-name')?.replace(/[^a-zA-Z0-9_\-\.]/g, '_') || 'upload-file'

    const { data, error } = await supabase.storage
      .from('myphotos')
      .upload(`photos/${fileName}`, new Uint8Array(body), { cacheControl: '3600', upsert: true })

    if (error) throw error

    const { publicUrl } = supabase.storage.from('myphotos').getPublicUrl(data.path)

    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}