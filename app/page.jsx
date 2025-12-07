'use client'

import { useState } from 'react'
import useSWR from 'swr'

// SWR fetcher (plain JS, no TS types)
const fetcher = (url) => fetch(url).then(res => res.json())

export default function Page() {
  // --- Text Table State ---
  const [text, setText] = useState('')
  const tableName = 'fruits'
  const apiUrl = `/api/db-test?table=${tableName}`
  const { data: rows, error, mutate } = useSWR(apiUrl, fetcher)

  // --- File Upload State ---
  const [file, setFile] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  // --- Insert new row ---
  async function addRow() {
    if (!text) return alert('Type something first!')

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    const result = await res.json()

    if (result.error) alert(result.error)
    else {
      setText('')
      mutate() // refresh the table
    }
  }

  // --- Upload file ---
  async function uploadFile() {
    if (!file) return alert('Choose a file first!')

    const uploadUrl = '/api/photos/upload'
    const formData = new FormData()
    formData.append('file', file, file.name)

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()
    if (result.error) alert(result.error)
    else {
      setUploadedFiles((prev) => [...prev, result.url])
      setFile(null)
    }
  }

  // --- Loading & error states ---
  if (error) return <div>Error loading data: {error.message}</div>
  if (!rows) return <div>Loading...</div>

  return (
    <main style={{ padding: 40 }}>
      <h1>🧪 Supabase Text Table + File Upload Test</h1>

      {/* --- Text Table --- */}
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
          rows.map((r) => <li key={r.id}>{r.name}</li>)
        ) : (
          <li>No data found</li>
        )}
      </ul>

      <hr style={{ margin: '40px 0' }} />

      {/* --- File Uploader --- */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={uploadFile} style={{ marginLeft: 10, padding: 6 }}>
          Upload
        </button>
      </div>

      <div>
        {uploadedFiles.length > 0 && (
          <ul>
            {uploadedFiles.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}