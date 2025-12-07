'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [rows, setRows] = useState([])
  const [text, setText] = useState('')

  async function load() {
    const res = await fetch('/api/db-test')
    const data = await res.json()
    setRows(data)
  }

  async function insert() {
    const res = await fetch('/api/db-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    const data = await res.json()
    console.log(data)
    setText('')
    load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>🧪 Supabase Text Table Test</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />

      <button onClick={insert}>Insert</button>

      <ul>
        {rows?.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </main>
  )
}
