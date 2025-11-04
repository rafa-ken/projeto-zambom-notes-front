import React, { useState } from 'react'

export default function ReportsList({ reports = [], loading, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')

  function startEdit(r) {
    setEditingId(r.id)
    setTitulo(r.titulo || '')
    setConteudo(r.conteudo || '')
  }

  async function save() {
    await onUpdate(editingId, { titulo, conteudo })
    setEditingId(null); setTitulo(''); setConteudo('')
  }

  if (loading) return <p>Carregando relatórios...</p>
  if (!reports.length) return <p>Nenhum relatório encontrado.</p>

  return (
    <div className="notes">
      {reports.map(r => (
        <div key={r.id} className="note">
          {editingId === r.id ? (
            <div>
              <input value={titulo} onChange={e => setTitulo(e.target.value)} />
              <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} />
              <div>
                <button onClick={save}>Salvar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{r.titulo}</h3>
              <p>{r.conteudo}</p>
              <div className="actions">
                <button onClick={() => startEdit(r)}>Editar</button>
                <button onClick={() => onDelete(r.id)}>Apagar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
