import { NavLink } from 'react-router-dom'
import { FaChartLine, FaClipboardList, FaHistory, FaHome, FaMedal, FaPlusCircle, FaShieldAlt, FaSignOutAlt, FaTrophy, FaWallet } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.perfil === 'admin'

  const adminLinks = [
    { to: '/admin', label: 'Painel Admin', icon: <FaHome /> },
    { to: '/admin/eventos', label: 'Gerenciar Eventos', icon: <FaPlusCircle /> },
    { to: '/admin/ranking', label: 'Ranking Geral', icon: <FaTrophy /> }
  ]

  const userLinks = [
    { to: '/app', label: 'Meu Painel', icon: <FaHome /> },
    { to: '/app/eventos', label: 'Eventos', icon: <FaClipboardList /> },
    { to: '/app/historico', label: 'Histórico', icon: <FaHistory /> },
    { to: '/app/carteira', label: 'Carteira', icon: <FaWallet /> },
    { to: '/app/ranking', label: 'Ranking', icon: <FaChartLine /> },
    { to: '/app/conquistas', label: 'Conquistas', icon: <FaMedal /> }
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><FaShieldAlt /></div>
        <div>
          <strong>BetAcademy</strong>
          <span>Arena Pro</span>
        </div>
      </div>

      <div className="user-mini-card">
        <div className="avatar">{user?.avatar || user?.nome?.slice(0, 2)}</div>
        <div>
          <strong>{user?.nome}</strong>
          <span>{isAdmin ? 'Administrador' : `${user?.nivel} • ${user?.xp} XP`}</span>
        </div>
      </div>

      <nav className="menu">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/admin' || link.to === '/app'}>
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="safe-badge">Modo campeonato</div>
        <button className="logout-button" onClick={logout}>
          <FaSignOutAlt /> Sair
        </button>
      </div>
    </aside>
  )
}
