import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../components/AppShell'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import Regulamento from '../pages/Regulamento'
import DashboardAdmin from '../pages/DashboardAdmin'
import EventosAdmin from '../pages/EventosAdmin'
import DashboardUser from '../pages/DashboardUser'
import Eventos from '../pages/Eventos'
import Historico from '../pages/Historico'
import Ranking from '../pages/Ranking'
import Carteira from '../pages/Carteira'
import Conquistas from '../pages/Conquistas'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regulamento" element={<Regulamento />} />

        <Route element={<ProtectedRoute allowedProfiles={["admin"]} />}>
          <Route element={<AppShell />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/eventos" element={<EventosAdmin />} />
            <Route path="/admin/ranking" element={<Ranking />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedProfiles={["usuario"]} />}>
          <Route element={<AppShell />}>
            <Route path="/app" element={<DashboardUser />} />
            <Route path="/app/eventos" element={<Eventos />} />
            <Route path="/app/historico" element={<Historico />} />
            <Route path="/app/carteira" element={<Carteira />} />
            <Route path="/app/ranking" element={<Ranking />} />
            <Route path="/app/conquistas" element={<Conquistas />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
