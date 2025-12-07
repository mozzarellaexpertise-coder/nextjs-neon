import { createClient } from '@supabase/supabase-js'

// Check server environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing!')
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    // Convert request body to ArrayBuffer
    const body = await req.arrayBuffer()

    // Generate safe filename
    const fileName =
      req.headers
        .get('x-file-name')
        ?.replace(/[^a-zA-Z0-9_\-\.]/g, '_') ||
      `upload-${Date.now()}`

    console.log('Uploading file to Supabase bucket:', fileName)

    // Upload to bucket
    const { data, error } = await supabase.storage
      .from('myphotos')
      .upload(`photos/${fileName}`, new Uint8Array(body), {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    if (!data?.path) throw new Error('Upload failed: no path returned')

    console.log('Upload succeeded. Path:', data.path)

    // Get public URL
    const { data: publicData, error: publicError } = supabase.storage
      .from('myphotos')
      .getPublicUrl(data.path)

    if (publicError) {
      console.error('Public URL error:', publicError)
      throw publicError
    }

    console.log('Public URL:', publicData.publicUrl)

    return new Response(JSON.stringify({ url: publicData.publicUrl }), {
      status: 200,
    })
  } catch (err) {
    console.error('Upload route error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
