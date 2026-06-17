import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3001'
})

export const formatCurrency = (value = 0) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export const formatDate = (date) => {
  if (!date) return 'Sem data'
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR')
}

export const formatDateTime = (date) => {
  if (!date) return 'Sem registro'
  return new Date(date).toLocaleString('pt-BR')
}

export const getNivelByXp = (xp = 0) => {
  if (xp >= 5000) return 'Diamante'
  if (xp >= 2200) return 'Ouro'
  if (xp >= 1200) return 'Prata'
  if (xp >= 500) return 'Bronze'
  return 'Iniciante'
}

export const palpiteLabel = (palpite, evento) => {
  if (!evento) return palpite
  if (palpite === 'timeA') return evento.timeA
  if (palpite === 'timeB') return evento.timeB
  if (palpite === 'empate') return 'Empate'
  return palpite || 'Não definido'
}
