import { FaBell, FaCoins } from 'react-icons/fa'
import { formatCurrency } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const { user } = useAuth()
  const isAdmin = user?.perfil === 'admin'

  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Central esportiva</span>
        <h2>{isAdmin ? 'Controle operacional' : `Olá, ${user?.nome?.split(' ')[0] || 'Jogador'}`}</h2>
      </div>
      <div className="topbar-actions">
        {!isAdmin && (
          <div className="balance-pill">
            <FaCoins /> {formatCurrency(user?.saldo || 0)}
          </div>
        )}
        <button className="icon-button" title="Alertas da plataforma"><FaBell /></button>
      </div>
    </header>
  )
}
