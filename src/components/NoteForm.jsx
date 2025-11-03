import React, { useState } from 'react'

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!title || !content) {
      alert('Preencha título e conteúdo')
      return
    }
    await onCreate({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Conteúdo" value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit">Criar Nota</button>
    </form>
  )
}
