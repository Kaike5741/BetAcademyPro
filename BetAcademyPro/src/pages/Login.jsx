import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBolt, FaFire, FaFutbol, FaLock, FaShieldAlt, FaTrophy, FaUser } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const featuredMatches = [
  { league: 'Copa Elite', match: 'Brasil x Argentina', time: '19:30', odd: '1.75' },
  { league: 'Liga Nacional', match: 'Flamengo x Palmeiras', time: '21:00', odd: '2.05' },
  { league: 'Arena Pro Cup', match: 'FURIA x LOUD', time: '19:00', odd: '1.95' }
]

export default function Login() {
  const [email, setEmail] = useState('kaike@betacademy.com')
  const [senha, setSenha] = useState('123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const usuario = await login(email, senha)
      navigate(usuario.perfil === 'admin' ? '/admin' : '/app')
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  function quickLogin(type) {
    if (type === 'admin') {
      setEmail('admin@betacademy.com')
      setSenha('123')
    } else {
      setEmail('kaike@betacademy.com')
      setSenha('123')
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero sportsbook-hero">
        <div className="brand-logo large">
          <span className="logo-accent">Bet</span>
          <span className="logo-text">Academy</span>
          <span className="logo-sub">Pro</span>
        </div>

        <div className="hero-copy">
          <span className="eyebrow">Pré-jogo • odds • ranking</span>
          <h1>Entre no jogo antes do apito inicial.</h1>
          <p>
            Acompanhe confrontos em destaque, escolha seus palpites, gerencie sua carteira
            e dispute posição no ranking da plataforma.
          </p>
        </div>

        <div className="sports-showcase">
          <div className="market-card featured-market">
            <div className="market-topline">
              <span><FaFire /> Evento em alta</span>
              <strong>96% procura</strong>
            </div>
            <div className="market-teams">
              <div>
                <small>Mandante</small>
                <strong>Brasil</strong>
              </div>
              <span className="versus">x</span>
              <div>
                <small>Visitante</small>
                <strong>Argentina</strong>
              </div>
            </div>
            <div className="market-odds">
              <button type="button"><span>Brasil</span><strong>1.75</strong></button>
              <button type="button"><span>Empate</span><strong>3.15</strong></button>
              <button type="button"><span>Argentina</span><strong>2.40</strong></button>
            </div>
          </div>

          <div className="live-feed">
            <div className="feed-title"><FaFutbol /> Próximos eventos</div>
            {featuredMatches.map((item) => (
              <div className="feed-match" key={item.match}>
                <div>
                  <span>{item.league}</span>
                  <strong>{item.match}</strong>
                </div>
                <div className="feed-odd">
                  <small>{item.time}</small>
                  <strong>{item.odd}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-grid sports-grid">
          <div><strong>Multi-esportes</strong><span>Futebol, basquete, vôlei, tênis e e-sports.</span></div>
          <div><strong>Bilhete rápido</strong><span>Retorno potencial calculado antes da confirmação.</span></div>
          <div><strong>Competição</strong><span>XP, conquistas e ranking entre jogadores.</span></div>
        </div>
      </section>

      <section className="login-card">
        <div className="project-alert platform-alert">
          <FaBolt /> Acesso da plataforma
        </div>
        <h2>Entrar na arena</h2>
        <p>Selecione seu perfil e navegue pelo painel correspondente.</p>

        <form onSubmit={handleSubmit}>
          <label className="input-group">
            E-mail
            <div className="input-icon">
              <FaUser />
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </label>
          <label className="input-group">
            Senha
            <div className="input-icon">
              <FaLock />
              <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} />
            </div>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-button full" disabled={loading}>
            {loading ? 'Entrando...' : 'Acessar'}
          </button>
        </form>

        <div className="quick-login">
          <button onClick={() => quickLogin('user')}>Kaike</button>
          <button onClick={() => quickLogin('admin')}>Administrador</button>
        </div>

        <Link className="rules-link" to="/regulamento">Regras da plataforma</Link>
      </section>
    </main>
  )
}
