'use client'

import useSWR from 'swr'
import { useState } from 'react'

// SWR fetcher
const fetcher = (url) => fetch(url).then(res => res.json())

export default function TextTables() {
  const [text, setText] = useState('')
  const tableName = 'fruits' // Change this to test any table
  const apiUrl = `/api/db-test?table=${tableName}`

  // SWR hook
  const { data: rows, error, mutate } = useSWR(apiUrl, fetcher)

  // Insert new row
  async function addRow() {
    if (!text) return alert('Type something first!')

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    const result = await res.json()

    if (result.error) {
      alert(result.error)
    } else {
      setText('')
      mutate() // refresh the table
    }
  }

  // Loading & error states
  if (error) return <div>Error loading data: {error.message}</div>
  if (!rows) return <div>Loading...</div>

  return (
    <main style={{ padding: 40 }}>
      <h1>🧪 Supabase Text Table Test</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          style={{ padding: 6, width: 250 }}
        />
        <button onClick={addRow} style={{ marginLeft: 10, padding: 6 }}>
          Insert
        </button>
      </div>

      <ul>
        {rows.length > 0 ? (
          rows.map((r) => (
            <li key={r.id}>{r.text ?? '[No Text]'}</li>
          ))
        ) : (
          <li>No data found</li>
        )}
      </ul>
    </main>
  )
}