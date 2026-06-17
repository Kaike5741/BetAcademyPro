import { FaCrown, FaMedal } from 'react-icons/fa'
import { formatCurrency } from '../services/api'

export default function RankingTable({ usuarios = [] }) {
  const getRankStyle = (index) => {
    if (index === 0) return { color: '#fbbf24', fontSize: '20px' } // Gold
    if (index === 1) return { color: '#cbd5e1', fontSize: '18px' } // Silver
    if (index === 2) return { color: '#b45309', fontSize: '16px' } // Bronze
    return {}
  }

  const renderRankPosition = (index) => {
    if (index === 0) return <FaCrown />
    if (index === 1 || index === 2) return <FaMedal />
    return index + 1
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Jogador</th>
            <th>Nível</th>
            <th>XP</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id}>
              <td className="rank-pos" style={getRankStyle(index)}>
                {renderRankPosition(index)}
              </td>
              <td>
                <div className="table-user">
                  <span className="avatar small">{usuario.avatar || usuario.nome.slice(0, 2)}</span>
                  <strong>{usuario.nome}</strong>
                </div>
              </td>
              <td>{usuario.nivel}</td>
              <td>{usuario.xp}</td>
              <td>{formatCurrency(usuario.saldo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
