// Small helpers to talk to your Node/Express backend.
// Set VITE_API_URL in a .env file (see .env.example).
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function send(path, options) {
  try {
    const res = await fetch(API + path, { credentials: 'include', ...options })
    const data = await res.json().catch(() => ({}))
    return res.ok ? { ok: true, data } : { ok: false, message: data.message || 'Something went wrong.' }
  } catch {
    return { ok: false, message: 'Could not reach the server. Is your backend running?' }
  }
}

// For normal forms (text only)
export const postJSON = (path, body) =>
  send(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

// For forms with files (DocumentImage, SchoolImage) - the browser sets the multipart header itself
export const postFormData = (path, formData) => send(path, { method: 'POST', body: formData })
