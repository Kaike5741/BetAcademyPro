import { FaTicketAlt } from 'react-icons/fa'
import { calcPotentialReturn } from '../utils/business'
import { formatCurrency } from '../services/api'

export default function BetSlip({ evento, odd, valor, setValor, onConfirm, loading }) {
  if (!evento || !odd) {
    return (
      <aside className="bet-slip muted-card">
        <FaTicketAlt />
        <h3>Bilhete rápido</h3>
        <p>Selecione uma odd em algum evento aberto para montar seu bilhete.</p>
      </aside>
    )
  }

  const retorno = calcPotentialReturn(valor, odd.value)

  return (
    <aside className="bet-slip">
      <div className="slip-title">
        <FaTicketAlt />
        <div>
          <span>Bilhete selecionado</span>
          <strong>{evento.timeA} x {evento.timeB}</strong>
        </div>
      </div>

      <div className="slip-row">
        <span>Palpite</span>
        <strong>{odd.label}</strong>
      </div>
      <div className="slip-row">
        <span>Odd</span>
        <strong>{Number(odd.value).toFixed(2)}</strong>
      </div>

      <label className="input-group">
        Valor em créditos
        <input
          type="number"
          min="1"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          placeholder="Ex.: 100"
        />
      </label>

      <div className="potential-return">
        <span>Retorno potencial</span>
        <strong>{formatCurrency(retorno)}</strong>
      </div>

      <button className="primary-button full" onClick={onConfirm} disabled={loading}>
        {loading ? 'Registrando...' : 'Confirmar aposta'}
      </button>
    </aside>
  )
}
