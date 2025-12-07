'use client'

import { useState } from 'react'

export default function FileUploader() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleUpload = async () => {
    if (!file) return alert('Select a file first')
    setUploading(true)
    setResult(null)

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: await file.arrayBuffer(),
        headers: { 'x-file-name': file.name },
      })

      const data = await res.json()

      if (data.error) {
        setResult(`Upload Failed: ${data.error}`)
      } else {
        setResult(
          <span>
            Upload Successful!{' '}
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          </span>
        )
      }
    } catch (err) {
      setResult(`Upload Failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <div>{result}</div>
    </div>
  )
}