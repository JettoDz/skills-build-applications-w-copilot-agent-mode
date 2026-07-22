import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">OctoFit Tracker</p>
          <h1 className="h2 mb-1">Presentation Tier Dashboard</h1>
          <p className="text-secondary mb-0">API base: {apiBaseUrl}</p>
          {!codespaceName && (
            <p className="text-warning-emphasis mt-2 mb-0">
              VITE_CODESPACE_NAME is not set. Using localhost fallback.
            </p>
          )}
        </div>
      </header>

      <nav className="nav nav-pills app-nav">
        <NavLink className="nav-link" to="/users">
          Users
        </NavLink>
        <NavLink className="nav-link" to="/teams">
          Teams
        </NavLink>
        <NavLink className="nav-link" to="/activities">
          Activities
        </NavLink>
        <NavLink className="nav-link" to="/leaderboard">
          Leaderboard
        </NavLink>
        <NavLink className="nav-link" to="/workouts">
          Workouts
        </NavLink>
      </nav>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
          <Route path="/activities" element={<Activities apiBaseUrl={apiBaseUrl} />} />
          <Route path="/leaderboard" element={<Leaderboard apiBaseUrl={apiBaseUrl} />} />
          <Route path="/workouts" element={<Workouts apiBaseUrl={apiBaseUrl} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
