export default function StatusBadge({ status }) {
  const text = {
    aberto: 'Aberto',
    encerrado: 'Encerrado',
    pendente: 'Pendente',
    ganhou: 'Ganhou',
    perdeu: 'Perdeu'
  }[status] || status

  return <span className={`status-badge ${status}`}>{text}</span>
}
