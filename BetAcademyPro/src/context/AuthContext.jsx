import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getNivelByXp } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('@betacademy:user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  async function login(email, senha) {
    const { data } = await api.get('/usuarios', {
      params: { email: email.trim(), senha: senha.trim() }
    })

    if (!data.length) {
      throw new Error('E-mail ou senha inválidos.')
    }

    const usuario = data[0]
    localStorage.setItem('@betacademy:user', JSON.stringify(usuario))
    setUser(usuario)
    return usuario
  }

  function logout() {
    localStorage.removeItem('@betacademy:user')
    setUser(null)
  }

  async function refreshUser(id = user?.id) {
    if (!id) return null
    const { data } = await api.get(`/usuarios/${id}`)
    localStorage.setItem('@betacademy:user', JSON.stringify(data))
    setUser(data)
    return data
  }

  async function updateCurrentUser(payload) {
    if (!user?.id) return null
    const normalized = {
      ...payload,
      nivel: payload.xp !== undefined ? getNivelByXp(payload.xp) : payload.nivel
    }
    const { data } = await api.patch(`/usuarios/${user.id}`, normalized)
    localStorage.setItem('@betacademy:user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser, updateCurrentUser }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider')
  return context
}
