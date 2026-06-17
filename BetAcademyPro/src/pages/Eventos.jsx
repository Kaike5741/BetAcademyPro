import { useEffect, useMemo, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import { api, getNivelByXp } from '../services/api'
import { calcPotentialReturn } from '../utils/business'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'
import BetSlip from '../components/BetSlip'
import EmptyState from '../components/EmptyState'

export default function Eventos() {
  const { user, refreshUser } = useAuth()
  const [eventos, setEventos] = useState([])
  const [selectedEvento, setSelectedEvento] = useState(null)
  const [selectedOdd, setSelectedOdd] = useState(null)
  const [valor, setValor] = useState('100')
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await api.get('/eventos')
    setEventos(data)
  }

  useEffect(() => { load() }, [])

  const esportes = ['Todos', ...new Set(eventos.map((event) => event.esporte))]
  const eventosAbertos = useMemo(() => {
    const termo = search.trim().toLowerCase()
    return eventos
      .filter((evento) => evento.status === 'aberto')
      .filter((evento) => filter === 'Todos' || evento.esporte === filter)
      .filter((evento) => {
        if (!termo) return true
        return [evento.timeA, evento.timeB, evento.esporte, evento.liga, evento.rodada]
          .filter(Boolean)
          .some((campo) => campo.toLowerCase().includes(termo))
      })
  }, [eventos, filter, search])

  function selectOdd(evento, odd) {
    setSelectedEvento(evento)
    setSelectedOdd(odd)
    setMessage('')
  }

  async function confirmarAposta() {
    const valorNumerico = Number(valor)
    setMessage('')

    if (!selectedEvento || !selectedOdd) return setMessage('Selecione uma odd antes de confirmar.')
    if (!valorNumerico || valorNumerico <= 0) return setMessage('Digite um valor válido.')
    if (valorNumerico > Number(user.saldo)) return setMessage('Saldo insuficiente para essa aposta.')
    if (user.perfil !== 'usuario') return setMessage('Administrador não pode realizar apostas.')

    setLoading(true)
    try {
      const retornoPotencial = calcPotentialReturn(valorNumerico, selectedOdd.value)
      await api.post('/apostas', {
        usuarioId: user.id,
        eventoId: selectedEvento.id,
        palpite: selectedOdd.key,
        odd: Number(selectedOdd.value),
        valor: valorNumerico,
        retornoPotencial,
        status: 'pendente',
        retorno: 0,
        criadoEm: new Date().toISOString()
      })

      const novoXp = Number(user.xp || 0) + 35
      await api.patch(`/usuarios/${user.id}`, {
        saldo: Number(user.saldo) - valorNumerico,
        xp: novoXp,
        nivel: getNivelByXp(novoXp)
      })

      await api.post('/transacoes', {
        usuarioId: user.id,
        tipo: 'aposta',
        descricao: `Aposta - ${selectedEvento.timeA} x ${selectedEvento.timeB}`,
        valor: -valorNumerico,
        criadoEm: new Date().toISOString()
      })

      await refreshUser(user.id)
      setSelectedEvento(null)
      setSelectedOdd(null)
      setValor('100')
      setMessage('Aposta registrada com sucesso.')
    } catch {
      setMessage('Erro ao registrar aposta. Confirme se o JSON Server está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-stack with-slip">
      <div className="content-main">
        <div className="section-title">
          <div>
            <span className="eyebrow">Eventos disponíveis</span>
            <h1>Escolha uma odd e monte seu bilhete</h1>
          </div>
        </div>

        <div className="filter-bar advanced">
          <FaFilter />
          {esportes.map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>
          ))}
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar time, liga ou rodada"
          />
        </div>

        {message && <div className="form-message">{message}</div>}

        {!eventosAbertos.length ? <EmptyState title="Nenhum evento aberto" description="Aguarde o administrador cadastrar novos eventos." /> : (
          <div className="events-grid vertical">
            {eventosAbertos.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                selected={selectedEvento?.id === evento.id ? selectedOdd?.key : ''}
                onOddSelect={(odd) => selectOdd(evento, odd)}
              />
            ))}
          </div>
        )}
      </div>

      <BetSlip
        evento={selectedEvento}
        odd={selectedOdd}
        valor={valor}
        setValor={setValor}
        onConfirm={confirmarAposta}
        loading={loading}
      />
    </div>
  )
}
