import React, { useState } from 'react'

export default function TaskForm({ onCreate }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!titulo || !descricao) { alert('Preencha título e descrição'); return }
    setLoading(true)
    try {
      await onCreate({ titulo, descricao })
      setTitulo(''); setDescricao('')
    } finally { setLoading(false) }
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <input placeholder="Título da tarefa" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar Tarefa'}</button>
    </form>
  )
}
