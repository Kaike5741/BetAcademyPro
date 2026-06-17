import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="public-page">
      <div className="public-card center">
        <h1>404</h1>
        <p>Página não encontrada.</p>
        <Link className="primary-button" to="/login">Voltar</Link>
      </div>
    </main>
  )
}
