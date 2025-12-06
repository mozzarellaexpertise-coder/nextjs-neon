import sql from '../../lib/db'

export default async function handler(req, res) {
  const result = await sql`SELECT NOW()`
  res.status(200).json(result)
}