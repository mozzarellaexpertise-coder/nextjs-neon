import sql from '../../../lib/db'

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*') // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, email } = req.body

  try {
    const result = await sql`
      INSERT INTO users (username, email)
      VALUES (${username}, ${email})
      RETURNING *
    `
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}