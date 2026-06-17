import { FaCrown } from 'react-icons/fa'
import { formatCurrency } from '../services/api'

export default function RankingTable({ usuarios = [] }) {
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
              <td className="rank-pos">{index === 0 ? <FaCrown /> : index + 1}</td>
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
