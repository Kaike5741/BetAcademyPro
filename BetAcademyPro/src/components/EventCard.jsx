import { FaCalendarAlt, FaClock, FaFire } from 'react-icons/fa'
import { formatDate } from '../services/api'
import StatusBadge from './StatusBadge'

export default function EventCard({ evento, onOddSelect, selected, compact = false }) {
  const odds = [
    { key: 'timeA', label: evento.timeA, value: evento.oddA },
    { key: 'empate', label: 'Empate', value: evento.oddEmpate },
    { key: 'timeB', label: evento.timeB, value: evento.oddB }
  ]

  return (
    <article className={`event-card ${compact ? 'compact' : ''}`}>
      <div className="event-header">
        <div>
          <div className="event-league">
            {evento.destaque && <FaFire />}
            {evento.esporte} • {evento.liga}
          </div>
          <h3>{evento.timeA} <span>x</span> {evento.timeB}</h3>
        </div>
        <StatusBadge status={evento.status} />
      </div>

      <div className="event-meta">
        <span><FaCalendarAlt /> {formatDate(evento.data)}</span>
        <span><FaClock /> {evento.horario}</span>
        <span>{evento.rodada}</span>
      </div>

      {!compact && (
        <div className="event-insights">
          <span>Mercado: {evento.mercado || 'Resultado final'}</span>
          <span>{evento.popularidade || 50}% de procura</span>
          <span>{evento.analise || 'Odds atualizadas'}</span>
        </div>
      )}

      {!compact && (
        <div className="odds-grid">
          {odds.map((odd) => (
            <button
              key={odd.key}
              className={`odd-button ${selected === odd.key ? 'selected' : ''}`}
              disabled={evento.status !== 'aberto'}
              onClick={() => onOddSelect?.(odd)}
            >
              <span>{odd.label}</span>
              <strong>{Number(odd.value).toFixed(2)}</strong>
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
