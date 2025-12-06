import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const fileObj = files.file;
    const filePath = fileObj?.filepath;
    const fileName = fileObj?.originalFilename;

    if (!filePath || !fileName)
      return res.status(400).json({ error: 'File path or name not found' });

    try {
      const fileData = fs.readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from('myphotos')
        .upload(`photos/${fileName}`, fileData, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { publicUrl } = supabase.storage
        .from('myphotos')
        .getPublicUrl(data.path);

      return res.status(200).json({ url: publicUrl });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}