import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false, // important for file uploads
  },
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })

    const file = files.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    try {
      const fileData = fs.readFileSync(file.filepath)

      const { data, error } = await supabase.storage
        .from('myphotos')
        .upload(`photos/${file.originalFilename}`, fileData, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) throw error

      const { publicUrl } = supabase.storage.from('myphotos').getPublicUrl(data.path)
      res.status(200).json({ url: publicUrl })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}