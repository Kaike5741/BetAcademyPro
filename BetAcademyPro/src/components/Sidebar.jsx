import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaChartLine, FaClipboardList, FaHistory, FaHome, FaMedal, FaPlusCircle, FaShieldAlt, FaSignOutAlt, FaTrophy, FaWallet, FaBars, FaTimes, FaCoins, FaUser } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.perfil === 'admin'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  const adminLinks = [
    { to: '/admin/eventos', label: 'Eventos', icon: <FaPlusCircle /> },
    { to: '/admin/painel', label: 'Painel', icon: <FaHome /> },
    { to: '/admin/ranking', label: 'Ranking', icon: <FaTrophy /> }
  ]

  const userLinks = [
    { to: '/app/eventos', label: 'Eventos', icon: <FaClipboardList /> },
    { to: '/app/perfil', label: 'Perfil', icon: <FaUser /> },
    { to: '/app/historico', label: 'Histórico', icon: <FaHistory /> },
    { to: '/app/carteira', label: 'Carteira', icon: <FaWallet /> },
    { to: '/app/ranking', label: 'Ranking', icon: <FaChartLine /> },
    { to: '/app/conquistas', label: 'Conquistas', icon: <FaMedal /> }
  ]

  const links = isAdmin ? adminLinks : userLinks

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to={isAdmin ? "/admin/eventos" : "/app/eventos"} className="brand-logo">
            <span className="logo-accent">Bet</span>
            <span className="logo-text">Academy</span>
            <span className="logo-sub">Pro</span>
          </Link>
        </div>

        <div className="nav-links-desktop">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/admin' || link.to === '/app'}>
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-right">
          {!isAdmin && (
            <div className="balance-pill">
              <FaCoins /> {formatCurrency(user?.saldo || 0)}
            </div>
          )}
          <div className="navbar-user">
            <div className="avatar small">{user?.avatar || user?.nome?.slice(0, 2)}</div>
            <span className="navbar-username">{user?.nome?.split(' ')[0]}</span>
          </div>
          <button className="logout-btn-nav" onClick={logout} title="Sair">
            <FaSignOutAlt />
          </button>
          <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Overlay + Drawer mobile */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer} />
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Link to={isAdmin ? "/admin/eventos" : "/app/eventos"} className="brand-logo" onClick={closeDrawer}>
            <span className="logo-accent">Bet</span>
            <span className="logo-text">Academy</span>
            <span className="logo-sub">Pro</span>
          </Link>
          <button className="close-drawer" onClick={closeDrawer} aria-label="Fechar menu">
            <FaTimes />
          </button>
        </div>

        <div className="drawer-user">
          <div className="avatar">{user?.avatar || user?.nome?.slice(0, 2)}</div>
          <div>
            <strong>{user?.nome}</strong>
            <span>{isAdmin ? 'Administrador' : `${user?.nivel} • ${user?.xp} XP`}</span>
          </div>
        </div>

        {!isAdmin && (
          <div className="drawer-balance">
            <FaCoins /> {formatCurrency(user?.saldo || 0)}
          </div>
        )}

        <nav className="drawer-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/admin' || link.to === '/app'} onClick={closeDrawer}>
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="safe-badge">Modo campeonato</div>
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>
    </>
  )
}
