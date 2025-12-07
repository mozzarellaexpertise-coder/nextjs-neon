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
      // ** FIX #1: Use FormData for standard file uploads **
      const formData = new FormData()
      // Append the file using the key 'photo' (Server looks for this key)
      formData.append('photo', file, file.name) 

      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        // NOTE: No need for 'Content-Type' or 'x-file-name' headers here!
        body: formData // Send the FormData payload
      })

      const data = await res.json()
      if (!res.ok) {
        // Handle non-200 responses better
        throw new Error(data.error || 'Server error during upload.')
      }

      setUrl(data.url)
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

      {error && <p className="text-red-500">Upload Failed: {error}</p>}
    </div>
  )
}