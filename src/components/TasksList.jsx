import React, { useState } from 'react'

export default function TasksList({ tasks = [], loading, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [concluida, setConcluida] = useState(false)

  function startEdit(t) {
    setEditingId(t.id)
    setTitulo(t.titulo || '')
    setDescricao(t.descricao || '')
    setConcluida(!!t.concluida)
  }

  async function save() {
    await onUpdate(editingId, { titulo, descricao, concluida })
    setEditingId(null); setTitulo(''); setDescricao(''); setConcluida(false)
  }

  if (loading) return <p>Carregando tarefas...</p>
  if (!tasks.length) return <p>Nenhuma tarefa encontrada.</p>

  return (
    <div className="notes">
      {tasks.map(t => (
        <div key={t.id} className="note">
          {editingId === t.id ? (
            <div>
              <input value={titulo} onChange={e => setTitulo(e.target.value)} />
              <textarea value={descricao} onChange={e => setDescricao(e.target.value)} />
              <label>
                <input type="checkbox" checked={concluida} onChange={e => setConcluida(e.target.checked)} />
                Concluída
              </label>
              <div>
                <button onClick={save}>Salvar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{t.titulo} {t.concluida ? '(✓)' : ''}</h3>
              <p>{t.descricao}</p>
              <div className="actions">
                <button onClick={() => startEdit(t)}>Editar</button>
                <button onClick={() => onDelete(t.id)}>Apagar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
