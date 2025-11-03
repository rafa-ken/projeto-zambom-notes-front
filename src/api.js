// src/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

export async function apiFetch(path, { method = "GET", body = null, token = null, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)

  if (res.status === 401) {
    const text = await res.text().catch(() => '')
    const e = new Error("Unauthorized")
    e.status = 401
    e.body = text
    throw e
  }
  if (res.status === 403) {
    const text = await res.text().catch(() => '')
    const e = new Error("Forbidden")
    e.status = 403
    e.body = text
    throw e
  }
  if (!res.ok) {
    let detail = null
    try { detail = await res.json() } catch { detail = await res.text().catch(() => null) }
    const e = new Error("API Error")
    e.status = res.status
    e.body = detail
    throw e
  }
  if (res.status === 204) return null
  return res.json()
}
