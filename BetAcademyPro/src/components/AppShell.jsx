import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <section className="page-container">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
