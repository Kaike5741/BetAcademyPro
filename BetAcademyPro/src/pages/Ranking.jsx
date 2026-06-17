import { useEffect, useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { api } from '../services/api'
import RankingTable from '../components/RankingTable'

export default function Ranking() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/usuarios')
      const ranking = data
        .filter((usuario) => usuario.perfil === 'usuario')
        .sort((a, b) => Number(b.saldo) - Number(a.saldo) || Number(b.xp) - Number(a.xp))
      setUsuarios(ranking)
    }
    load()
  }, [])

  return (
    <div className="page-stack">
      <div className="hero-banner ranking">
        <div>
          <span className="eyebrow">Classificação geral</span>
          <h1>Ranking dos jogadores</h1>
          <p>Tabela de desempenho dos jogadores, organizada por saldo, experiência e participação nos eventos.</p>
        </div>
        <FaTrophy className="hero-symbol" />
      </div>

      <RankingTable usuarios={usuarios} />
    </div>
  )
}
