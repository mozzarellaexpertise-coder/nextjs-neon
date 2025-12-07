import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase URL or SERVICE_ROLE_KEY missing!')
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const body = await req.arrayBuffer()
    const fileName =
      req.headers
        .get('x-file-name')
        ?.replace(/[^a-zA-Z0-9_\-\.]/g, '_') ||
      `upload-${Date.now()}`

    const { data, error } = await supabase.storage
      .from('myphotos')
      .upload(`photos/${fileName}`, new Uint8Array(body), {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) throw error
    if (!data?.path) throw new Error('Upload failed: no path returned')

    const { data: publicData, error: publicError } = supabase.storage
      .from('myphotos')
      .getPublicUrl(data.path)

    if (publicError) throw publicError

    return new Response(
      JSON.stringify({ url: publicData.publicUrl }),
      { status: 200 }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}