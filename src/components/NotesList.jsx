import React, { useState } from 'react'

export default function NotesList({ notes = [], loading, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function startEdit(note) {
    setEditingId(note.id)
    setTitle(note.title || '')
    setContent(note.content || '')
  }

  async function save() {
    await onUpdate(editingId, { title, content })
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  if (loading) return <p>Carregando notas...</p>
  if (!notes.length) return <p>Nenhuma nota encontrada.</p>

  return (
    <div className="notes">
      {notes.map(note => (
        <div key={note.id} className="note">
          {editingId === note.id ? (
            <div>
              <input value={title} onChange={e => setTitle(e.target.value)} />
              <textarea value={content} onChange={e => setContent(e.target.value)} />
              <div>
                <button onClick={save}>Salvar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="actions">
                <button onClick={() => startEdit(note)}>Editar</button>
                <button onClick={() => onDelete(note.id)}>Apagar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
