'use client'
import { useState } from 'react'

export default function FileUploader() {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleUpload = async () => {
    if (!file) return alert('Select a file first!')
    setLoading(true)
    setError('')
    setUrl('')

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: {
          'x-file-name': file.name
        },
        body: file
      })

      const data = await res.json()
      if (data.error) setError(data.error)
      else setUrl(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {url && (
        <div>
          <p>Uploaded URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <img src={url} alt="Uploaded" className="mt-2 max-w-xs"/>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}