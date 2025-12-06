import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false, // we will handle the stream manually
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    // Read raw body as ArrayBuffer
    const body = await req.arrayBuffer();
    const fileName = req.headers.get('x-file-name');

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'Missing file name header' }), { status: 400 });
    }

    const { data, error } = await supabase.storage
      .from('myphotos')
      .upload(`photos/${fileName}`, new Uint8Array(body), {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { publicUrl } = supabase.storage.from('myphotos').getPublicUrl(data.path);

    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}