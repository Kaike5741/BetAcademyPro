import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaChartPie, FaClipboardCheck, FaLock, FaPlus, FaTicketAlt, FaUsers } from 'react-icons/fa'
import { api, formatCurrency, formatDate } from '../services/api'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

export default function DashboardAdmin() {
  const [eventos, setEventos] = useState([])
  const [apostas, setApostas] = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
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
    load()
  }, [])

  const jogadores = usuarios.filter((user) => user.perfil === 'usuario')
  const eventosAbertos = eventos.filter((event) => event.status === 'aberto')
  const eventosEncerrados = eventos.filter((event) => event.status === 'encerrado')
  const totalMovimentado = apostas.reduce((acc, aposta) => acc + Number(aposta.valor || 0), 0)

  const chartData = useMemo(() => {
    const groups = apostas.reduce((acc, aposta) => {
      const evento = eventos.find((item) => item.id === aposta.eventoId)
      const esporte = evento?.esporte || 'Outros'
      acc[esporte] = (acc[esporte] || 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([name, total]) => ({ name, total }))
  }, [apostas, eventos])

  return (
    <div className="page-stack">
      <div className="hero-banner admin">
        <div>
          <span className="eyebrow">Painel administrativo</span>
          <h1>Visão geral da plataforma</h1>
          <p>Controle eventos, acompanhe apostas e finalize resultados em um fluxo organizado e profissional.</p>
        </div>
        <Link className="primary-button" to="/admin/eventos"><FaPlus /> Novo evento</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaClipboardCheck />} label="Eventos abertos" value={eventosAbertos.length} hint="Disponíveis para usuários" />
        <StatCard icon={<FaTicketAlt />} label="Apostas registradas" value={apostas.length} hint="Bilhetes registrados" />
        <StatCard icon={<FaUsers />} label="Jogadores" value={jogadores.length} hint="Perfis comuns" />
        <StatCard icon={<FaLock />} label="Eventos encerrados" value={eventosEncerrados.length} hint={formatCurrency(totalMovimentado)} />
      </div>

      <div className="content-grid two-columns">
        <section className="panel-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">Indicadores</span>
              <h2>Apostas por esporte</h2>
            </div>
            <FaChartPie />
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,.65)" />
                <YAxis stroke="rgba(255,255,255,.65)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
                <Bar dataKey="total" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">Últimos registros</span>
              <h2>Eventos cadastrados</h2>
            </div>
          </div>
          <div className="mini-list">
            {eventos.slice(0, 5).map((evento) => (
              <div className="mini-list-item" key={evento.id}>
                <div>
                  <strong>{evento.timeA} x {evento.timeB}</strong>
                  <span>{evento.esporte} • {formatDate(evento.data)} às {evento.horario}</span>
                </div>
                <StatusBadge status={evento.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
