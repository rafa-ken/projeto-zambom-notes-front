import React, { useState } from 'react'

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!title || !content) {
      alert('Preencha título e conteúdo')
      return
    }
    setLoading(true)
    try {
      await onCreate({ title, content })
      setTitle('')
      setContent('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Conteúdo" value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar Nota'}</button>
    </form>
  )
}
