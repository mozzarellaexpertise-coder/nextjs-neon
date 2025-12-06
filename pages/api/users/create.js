import sql from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

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