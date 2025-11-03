import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import NotesList from './components/NotesList'
import NoteForm from './components/NoteForm'
import { apiFetch } from './api'

export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0()
  const [notes, setNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(false)

  useEffect(() => {
    if (isAuthenticated) fetchNotes()
    else setNotes([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  async function fetchNotes() {
    setLoadingNotes(true)
    try {
      // only request token if authenticated
      if (!isAuthenticated) throw new Error('Not authenticated')
      const token = await getAccessTokenSilently()
      const data = await apiFetch('/notes', { token })
      setNotes(data)
    } catch (err) {
      console.error('fetchNotes error', err)
      if (err?.status === 401) {
        try { await loginWithRedirect() } catch (e) { console.error('login redirect failed', e) }
        return
      }
      // user facing
      alert('Erro ao carregar notas. Veja console para detalhes.')
    } finally {
      setLoadingNotes(false)
    }
  }

  async function createNote(payload) {
    try {
      if (!isAuthenticated) return loginWithRedirect()
      const token = await getAccessTokenSilently()
      const note = await apiFetch('/notes', { method: 'POST', token, body: payload })
      setNotes(prev => [note, ...prev])
    } catch (err) {
      console.error('createNote error', err)
      if (err?.status === 401) return loginWithRedirect()
      if (err?.status === 403) return alert('Você não tem permissão para criar notas.')
      alert('Erro ao criar nota.')
    }
  }

  async function updateNote(id, payload) {
    try {
      if (!isAuthenticated) return loginWithRedirect()
      const token = await getAccessTokenSilently()
      const updated = await apiFetch(`/notes/${id}`, { method: 'PUT', token, body: payload })
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)))
    } catch (err) {
      console.error('updateNote error', err)
      if (err?.status === 401) return loginWithRedirect()
      if (err?.status === 403) return alert('Você não tem permissão para atualizar notas.')
      alert('Erro ao atualizar nota.')
    }
  }

  async function deleteNote(id) {
    if (!confirm('Confirma excluir esta nota?')) return
    try {
      if (!isAuthenticated) return loginWithRedirect()
      const token = await getAccessTokenSilently()
      await apiFetch(`/notes/${id}`, { method: 'DELETE', token })
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('deleteNote error', err)
      if (err?.status === 401) return loginWithRedirect()
      if (err?.status === 403) return alert('Você não tem permissão para deletar notas.')
      alert('Erro ao deletar nota.')
    }
  }

  if (isLoading) return <div className="center">Carregando...</div>

  return (
    <div className="container">
      <header>
        <h1>Notes App</h1>
        <div>
          {isAuthenticated ? (
            <>
              <span className="me">{user?.email}</span>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
            </>
          ) : (
            <button onClick={() => loginWithRedirect()}>Login</button>
          )}
        </div>
      </header>

      {isAuthenticated ? (
        <main>
          <NoteForm onCreate={createNote} />
          <NotesList notes={notes} loading={loadingNotes} onUpdate={updateNote} onDelete={deleteNote} />
        </main>
      ) : (
        <div className="center">
          <p>Você precisa autenticar para ver suas notas.</p>
        </div>
      )}
    </div>
  )
}
