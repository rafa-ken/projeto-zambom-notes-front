import React, { useState } from 'react'

export default function ReportForm({ onCreate }) {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!titulo || !conteudo) { alert('Preencha título e conteúdo'); return }
    setLoading(true)
    try {
      await onCreate({ titulo, conteudo })
      setTitulo(''); setConteudo('')
    } finally { setLoading(false) }
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <input placeholder="Título do relatório" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <textarea placeholder="Conteúdo" value={conteudo} onChange={e => setConteudo(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar Relatório'}</button>
    </form>
  )
}
