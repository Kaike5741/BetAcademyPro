import { useEffect, useMemo, useState } from 'react'
import { FaEdit, FaSave, FaTrashAlt } from 'react-icons/fa'
import { api, formatDate, getNivelByXp, palpiteLabel } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const initialForm = {
  timeA: '',
  timeB: '',
  esporte: 'Futebol',
  liga: '',
  data: '',
  horario: '',
  oddA: 1.8,
  oddEmpate: 3.2,
  oddB: 2.1,
  rodada: '',
  destaque: false
}

export default function EventosAdmin() {
  const [eventos, setEventos] = useState([])
  const [apostas, setApostas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const [eventosRes, apostasRes, usuariosRes] = await Promise.all([
      api.get('/eventos'),
      api.get('/apostas'),
      api.get('/usuarios')
    ])
    setEventos(eventosRes.data)
    setApostas(apostasRes.data)
    setUsuarios(usuariosRes.data)
  }

  useEffect(() => { load() }, [])

  const orderedEventos = useMemo(() => [...eventos].sort((a, b) => new Date(b.data) - new Date(a.data)), [eventos])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      ...form,
      oddA: Number(form.oddA),
      oddEmpate: Number(form.oddEmpate),
      oddB: Number(form.oddB),
      status: 'aberto',
      resultado: ''
    }

    try {
      if (editingId) {
        await api.patch(`/eventos/${editingId}`, payload)
        setMessage('Evento atualizado com sucesso.')
      } else {
        await api.post('/eventos', payload)
        setMessage('Evento cadastrado com sucesso.')
      }
      setForm(initialForm)
      setEditingId(null)
      await load()
    } catch {
      setMessage('Erro ao salvar evento. Verifique se o JSON Server está rodando.')
    } finally {
      setSaving(false)
    }
  }

  function editEvento(evento) {
    setEditingId(evento.id)
    setForm({
      timeA: evento.timeA,
      timeB: evento.timeB,
      esporte: evento.esporte,
      liga: evento.liga,
      data: evento.data,
      horario: evento.horario,
      oddA: evento.oddA,
      oddEmpate: evento.oddEmpate,
      oddB: evento.oddB,
      rodada: evento.rodada,
      destaque: evento.destaque
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteEvento(id) {
    const relacionadas = apostas.filter((aposta) => aposta.eventoId === id)
    if (relacionadas.length) {
      setMessage('Não é possível excluir evento com apostas registradas. Encerre o evento em vez disso.')
      return
    }
    await api.delete(`/eventos/${id}`)
    setMessage('Evento excluído.')
    await load()
  }

  async function encerrarEvento(evento, resultado) {
    setMessage('Processando resultado e atualizando apostas...')
    await api.patch(`/eventos/${evento.id}`, { status: 'encerrado', resultado })

    const apostasEvento = apostas.filter((aposta) => aposta.eventoId === evento.id && aposta.status === 'pendente')

    for (const aposta of apostasEvento) {
      const ganhou = aposta.palpite === resultado
      const retorno = ganhou ? Number(aposta.retornoPotencial) : 0
      await api.patch(`/apostas/${aposta.id}`, {
        status: ganhou ? 'ganhou' : 'perdeu',
        retorno
      })

      const jogador = usuarios.find((usuario) => usuario.id === aposta.usuarioId)
      if (jogador && ganhou) {
        const novoXp = Number(jogador.xp || 0) + 160
        await api.patch(`/usuarios/${jogador.id}`, {
          saldo: Number(jogador.saldo || 0) + retorno,
          xp: novoXp,
          nivel: getNivelByXp(novoXp)
        })
        await api.post('/transacoes', {
          usuarioId: jogador.id,
          tipo: 'premio',
          descricao: `Prêmio - ${evento.timeA} x ${evento.timeB}`,
          valor: retorno,
          criadoEm: new Date().toISOString()
        })
      }
    }

    setMessage(`Evento encerrado. Resultado: ${palpiteLabel(resultado, evento)}.`)
    await load()
  }

  return (
    <div className="page-stack">
      <div className="section-title">
        <div>
          <span className="eyebrow">Administração</span>
          <h1>Cadastro e gerenciamento de eventos</h1>
        </div>
      </div>

      <section className="panel-card">
        <form className="event-form" onSubmit={handleSubmit}>
          <label className="input-group">Time A<input name="timeA" value={form.timeA} onChange={handleChange} required /></label>
          <label className="input-group">Time B<input name="timeB" value={form.timeB} onChange={handleChange} required /></label>
          <label className="input-group">Esporte<select name="esporte" value={form.esporte} onChange={handleChange}><option>Futebol</option><option>Basquete</option><option>Vôlei</option><option>Tênis</option><option>E-sports</option></select></label>
          <label className="input-group">Liga<input name="liga" value={form.liga} onChange={handleChange} required /></label>
          <label className="input-group">Data<input type="date" name="data" value={form.data} onChange={handleChange} required /></label>
          <label className="input-group">Horário<input type="time" name="horario" value={form.horario} onChange={handleChange} required /></label>
          <label className="input-group">Odd Time A<input type="number" step="0.01" name="oddA" value={form.oddA} onChange={handleChange} /></label>
          <label className="input-group">Odd Empate<input type="number" step="0.01" name="oddEmpate" value={form.oddEmpate} onChange={handleChange} /></label>
          <label className="input-group">Odd Time B<input type="number" step="0.01" name="oddB" value={form.oddB} onChange={handleChange} /></label>
          <label className="input-group">Rodada<input name="rodada" value={form.rodada} onChange={handleChange} /></label>
          <label className="checkbox-line"><input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} /> Marcar como destaque</label>
          <button className="primary-button" disabled={saving}><FaSave /> {editingId ? 'Salvar edição' : 'Cadastrar evento'}</button>
        </form>
        {message && <div className="form-message">{message}</div>}
      </section>

      <section className="panel-card">
        <div className="section-title compact-title">
          <div>
            <span className="eyebrow">Controle</span>
            <h2>Eventos da plataforma</h2>
          </div>
        </div>

        {!orderedEventos.length ? <EmptyState title="Nenhum evento cadastrado" /> : (
          <div className="admin-event-list">
            {orderedEventos.map((evento) => (
              <div className="admin-event-item" key={evento.id}>
                <div>
                  <div className="event-league">{evento.esporte} • {evento.liga}</div>
                  <h3>{evento.timeA} x {evento.timeB}</h3>
                  <p>{formatDate(evento.data)} às {evento.horario} • Odds {evento.oddA} / {evento.oddEmpate} / {evento.oddB}</p>
                  <StatusBadge status={evento.status} />
                </div>

                <div className="admin-actions">
                  {evento.status === 'aberto' && (
                    <>
                      <button onClick={() => encerrarEvento(evento, 'timeA')}>Vitória {evento.timeA}</button>
                      <button onClick={() => encerrarEvento(evento, 'empate')}>Empate</button>
                      <button onClick={() => encerrarEvento(evento, 'timeB')}>Vitória {evento.timeB}</button>
                    </>
                  )}
                  <button className="ghost-button" onClick={() => editEvento(evento)}><FaEdit /> Editar</button>
                  <button className="danger-button" onClick={() => deleteEvento(evento.id)}><FaTrashAlt /> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
