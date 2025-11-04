// src/api.js
// substitui o BASE único por um mapeamento de serviços
const BASES = {
  notes: import.meta.env.VITE_API_NOTES_URL || 'http://localhost:5002',
  reports: import.meta.env.VITE_API_REPORTS_URL || 'http://localhost:5001',
  tasks: import.meta.env.VITE_API_TASKS_URL || 'http://localhost:5000'
}

export async function apiFetch(path, { base = BASES.notes, method = "GET", body = null, token = null, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${base}${path}`, opts)

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

/**
 * Helper para chamar um "service" lógico: 'notes' | 'reports' | 'tasks'
 * Exemplo: serviceFetch('reports', '/reports', { method: 'GET', token })
 */
export function serviceFetch(service, path, opts = {}) {
  const base = BASES[service]
  if (!base) throw new Error(`Unknown service: ${service}`)
  return apiFetch(path, { base, ...opts })
}