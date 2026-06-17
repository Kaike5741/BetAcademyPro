import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { api, formatCurrency, formatDateTime, palpiteLabel } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function Historico() {
  const { user } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState([])
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    async function load() {
      const [apostasRes, eventosRes] = await Promise.all([
        api.get('/apostas', { params: { usuarioId: user.id } }),
        api.get('/eventos')
      ])
      setApostas(apostasRes.data.reverse())
      setEventos(eventosRes.data)
    }
    load()
  }, [user.id])

  const filtered = apostas.filter((aposta) => filter === 'todos' || aposta.status === filter)

  return (
    <div className="page-stack">
      <div className="section-title">
        <div>
          <span className="eyebrow">Histórico do jogador</span>
          <h1>Controle completo das apostas</h1>
        </div>
      </div>

      <div className="filter-bar">
        <FaSearch />
        {['todos', 'pendente', 'ganhou', 'perdeu'].map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>
        ))}
      </div>

      {!filtered.length ? <EmptyState title="Nenhuma aposta encontrada" /> : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Palpite</th>
                <th>Valor</th>
                <th>Retorno potencial</th>
                <th>Status</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((aposta) => {
                const evento = eventos.find((item) => item.id === aposta.eventoId)
                return (
                  <tr key={aposta.id}>
                    <td>{evento ? `${evento.timeA} x ${evento.timeB}` : 'Evento removido'}</td>
                    <td>{palpiteLabel(aposta.palpite, evento)}</td>
                    <td>{formatCurrency(aposta.valor)}</td>
                    <td>{formatCurrency(aposta.retornoPotencial)}</td>
                    <td><StatusBadge status={aposta.status} /></td>
                    <td>{formatDateTime(aposta.criadoEm)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
