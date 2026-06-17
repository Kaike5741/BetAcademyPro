import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaBolt, FaCoins, FaMedal, FaTicketAlt } from 'react-icons/fa'
import { api, formatCurrency, formatDate, palpiteLabel } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import EventCard from '../components/EventCard'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function DashboardUser() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState([])
  const [apostas, setApostas] = useState([])

  useEffect(() => {
    async function load() {
      const [eventosRes, apostasRes] = await Promise.all([
        api.get('/eventos'),
        api.get('/apostas', { params: { usuarioId: user.id } })
      ])
      setEventos(eventosRes.data)
      setApostas(apostasRes.data)
    }
    load()
  }, [user.id])

  const abertas = eventos.filter((evento) => evento.status === 'aberto')
  const pendentes = apostas.filter((aposta) => aposta.status === 'pendente')
  const ganhas = apostas.filter((aposta) => aposta.status === 'ganhou')

  const chartData = useMemo(() => {
    return apostas.slice(-6).map((aposta, index) => ({
      name: `Aposta ${index + 1}`,
      valor: aposta.retorno || -aposta.valor
    }))
  }, [apostas])

  return (
    <div className="page-stack">
      <div className="hero-banner user">
        <div>
          <span className="eyebrow">Bem-vindo, {user.nome}</span>
          <h1>Acompanhe seus palpites, saldo e evolução no ranking.</h1>
          <p>Seu painel reúne próximos eventos, apostas ativas, carteira e indicadores do seu desempenho.</p>
        </div>
        <Link className="primary-button" to="/app/eventos">Ver eventos</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaCoins />} label="Saldo" value={formatCurrency(user.saldo)} hint="Saldo disponível" />
        <StatCard icon={<FaBolt />} label="Experiência" value={`${user.xp} XP`} hint={user.nivel} />
        <StatCard icon={<FaTicketAlt />} label="Apostas ativas" value={pendentes.length} hint="Aguardando resultado" />
        <StatCard icon={<FaMedal />} label="Acertos" value={ganhas.length} hint="Palpites certos" />
      </div>

      <div className="content-grid two-columns">
        <section className="panel-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">Desempenho</span>
              <h2>Retorno das últimas apostas</h2>
            </div>
          </div>
          {chartData.length ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={chartData}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,.65)" />
                  <YAxis stroke="rgba(255,255,255,.65)" />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="valor" strokeWidth={3} fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState title="Sem apostas ainda" description="Faça uma aposta para gerar indicadores." />}
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">Seu histórico</span>
              <h2>Últimas apostas</h2>
            </div>
          </div>
          <div className="mini-list">
            {!apostas.length && <EmptyState title="Nenhuma aposta registrada" />}
            {apostas.slice(-5).reverse().map((aposta) => {
              const evento = eventos.find((item) => item.id === aposta.eventoId)
              return (
                <div className="mini-list-item" key={aposta.id}>
                  <div>
                    <strong>{evento ? `${evento.timeA} x ${evento.timeB}` : 'Evento removido'}</strong>
                    <span>{palpiteLabel(aposta.palpite, evento)} • {formatCurrency(aposta.valor)}</span>
                  </div>
                  <StatusBadge status={aposta.status} />
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="panel-card">
        <div className="section-title compact-title">
          <div>
            <span className="eyebrow">Eventos em destaque</span>
            <h2>Eventos em alta</h2>
          </div>
        </div>
        <div className="events-grid">
          {abertas.slice(0, 3).map((evento) => <EventCard key={evento.id} evento={evento} compact />)}
        </div>
      </section>
    </div>
  )
}
