'use client'

import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: rows, error, mutate } = useSWR('/api/db-test', fetcher)
  const [text, setText] = useState('')

  async function addRow() {
    if (!text) return alert('Type something first!')

    const res = await fetch('/api/db-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    const newData = await res.json()

    if (newData.error) {
      alert(newData.error)
    } else {
      setText('')
      // Update local cache immediately
      mutate()
    }
  }

  if (error) return <div>Error loading data: {error.message}</div>
  if (!rows) return <div>Loading...</div>

  return (
    <main style={{ padding: 40 }}>
      <h1>🧪 Supabase Text Table Test</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={addRow} style={{ marginLeft: 8 }}>
        Insert
      </button>

      <ul style={{ marginTop: 20 }}>
        {rows.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </main>
  )
}