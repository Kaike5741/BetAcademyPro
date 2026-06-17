import { useEffect, useMemo, useState } from 'react'
import { FaGift, FaWallet } from 'react-icons/fa'
import { api, formatCurrency, formatDateTime, getNivelByXp } from '../services/api'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'

export default function Carteira() {
  const { user, refreshUser } = useAuth()
  const [transacoes, setTransacoes] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await api.get('/transacoes', { params: { usuarioId: user.id } })
    setTransacoes(data.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)))
  }

  useEffect(() => { load() }, [user.id])

  const today = new Date().toISOString().slice(0, 10)
  const bonusHoje = useMemo(() => transacoes.some((item) => item.tipo === 'bonus_diario' && item.criadoEm?.startsWith(today)), [transacoes, today])

  async function resgatarBonus() {
    if (bonusHoje) return setMessage('Você já resgatou o bônus de hoje.')
    setLoading(true)
    setMessage('')

    try {
      const bonus = 250
      const novoXp = Number(user.xp || 0) + 50
      await api.patch(`/usuarios/${user.id}`, {
        saldo: Number(user.saldo) + bonus,
        xp: novoXp,
        nivel: getNivelByXp(novoXp)
      })
      await api.post('/transacoes', {
        usuarioId: user.id,
        tipo: 'bonus_diario',
        descricao: 'Bônus diário',
        valor: bonus,
        criadoEm: new Date().toISOString()
      })
      await refreshUser(user.id)
      await load()
      setMessage('Bônus resgatado com sucesso.')
    } catch {
      setMessage('Não foi possível resgatar o bônus. Confira se o JSON Server está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-stack">
      <div className="hero-banner wallet">
        <div>
          <span className="eyebrow">Carteira premium</span>
          <h1>Carteira e extrato</h1>
          <p>Acompanhe créditos, bônus, prêmios e movimentações da sua conta dentro da plataforma.</p>
        </div>
        <div className="wallet-total">
          <FaWallet />
          <span>Saldo atual</span>
          <strong>{formatCurrency(user.saldo)}</strong>
        </div>
      </div>

      <section className="bonus-card">
        <div>
          <FaGift />
          <div>
            <h2>Bônus diário</h2>
            <p>Receba créditos de participação e mantenha sua atividade nos eventos. Disponível uma vez por dia.</p>
          </div>
        </div>
        <button className="primary-button" onClick={resgatarBonus} disabled={loading || bonusHoje}>
          {bonusHoje ? 'Bônus já resgatado' : loading ? 'Resgatando...' : 'Resgatar + R$ 250'}
        </button>
      </section>

      {message && <div className="form-message">{message}</div>}

      <section className="panel-card">
        <div className="section-title compact-title">
          <div>
            <span className="eyebrow">Movimentações</span>
            <h2>Extrato da carteira</h2>
          </div>
        </div>

        {!transacoes.length ? <EmptyState title="Sem movimentações" /> : (
          <div className="transaction-list">
            {transacoes.map((item) => (
              <div className="transaction-item" key={item.id}>
                <div>
                  <strong>{item.descricao}</strong>
                  <span>{formatDateTime(item.criadoEm)}</span>
                </div>
                <strong className={item.valor >= 0 ? 'positive' : 'negative'}>{formatCurrency(item.valor)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
