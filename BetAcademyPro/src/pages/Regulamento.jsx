import { Link } from 'react-router-dom'
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa'

export default function Regulamento() {
  return (
    <main className="public-page">
      <div className="public-card">
        <div className="brand">
          <div className="brand-icon"><FaShieldAlt /></div>
          <div>
            <strong>BetAcademy Pro</strong>
            <span>Regulamento</span>
          </div>
        </div>
        <h1>Regras da plataforma</h1>
        <p>
          Este sistema foi criado para apresentação escolar, com dados de teste e créditos internos para demonstrar as regras de negócio.
        </p>
        <div className="rules-grid">
          <div><FaCheckCircle /><strong>Administrador</strong><span>Cadastra eventos, encerra apostas e informa resultados.</span></div>
          <div><FaCheckCircle /><strong>Jogador</strong><span>Visualiza eventos, realiza apostas e acompanha histórico.</span></div>
          <div><FaExclamationTriangle /><strong>Ambiente controlado</strong><span>Não há pagamento, saque, depósito ou integração com plataformas externas.</span></div>
        </div>
        <Link className="primary-button" to="/login">Voltar ao login</Link>
      </div>
    </main>
  )
}
