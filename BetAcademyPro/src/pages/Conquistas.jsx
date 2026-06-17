import { useEffect, useMemo, useState } from 'react'
import { FaMedal, FaStar } from 'react-icons/fa'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Conquistas() {
  const { user } = useAuth()
  const [apostas, setApostas] = useState([])
  const [conquistas, setConquistas] = useState([])

  useEffect(() => {
    async function load() {
      const [apostasRes, conquistasRes] = await Promise.all([
        api.get('/apostas', { params: { usuarioId: user.id } }),
        api.get('/conquistas')
      ])
      setApostas(apostasRes.data)
      setConquistas(conquistasRes.data)
    }
    load()
  }, [user.id])

  const acertos = apostas.filter((aposta) => aposta.status === 'ganhou').length

  const conquistaStatus = useMemo(() => {
    return conquistas.map((item) => ({
      ...item,
      unlocked: Number(user.xp || 0) >= Number(item.xpNecessario || 0) || (item.titulo === 'Primeira aposta' && apostas.length > 0)
    }))
  }, [conquistas, user.xp, apostas.length])

  return (
    <div className="page-stack">
      <div className="hero-banner achievements">
        <div>
          <span className="eyebrow">Gamificação</span>
          <h1>Conquistas e evolução</h1>
          <p>Acompanhe XP, nível e metas de evolução criadas para deixar a plataforma mais completa na apresentação.</p>
        </div>
        <FaMedal className="hero-symbol" />
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><FaStar /></div><div><span>XP atual</span><strong>{user.xp}</strong><small>{user.nivel}</small></div></div>
        <div className="stat-card"><div className="stat-icon"><FaMedal /></div><div><span>Apostas feitas</span><strong>{apostas.length}</strong><small>Total registrado</small></div></div>
        <div className="stat-card"><div className="stat-icon"><FaMedal /></div><div><span>Acertos</span><strong>{acertos}</strong><small>Resultados ganhos</small></div></div>
      </div>

      <div className="achievement-grid">
        {conquistaStatus.map((item) => (
          <article className={`achievement-card ${item.unlocked ? 'unlocked' : ''}`} key={item.id}>
            <div className="achievement-icon"><FaMedal /></div>
            <h3>{item.titulo}</h3>
            <p>{item.descricao}</p>
            <span>{item.unlocked ? 'Liberada' : `${item.xpNecessario} XP necessários`}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
