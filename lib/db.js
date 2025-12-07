import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'

export function getDb() {
  const url = process.env.NEON_DATABASE_URL

  if (!url) {
    throw new Error('Missing NEON_DATABASE_URL in environment variables')
  }

  return neon(url)
}