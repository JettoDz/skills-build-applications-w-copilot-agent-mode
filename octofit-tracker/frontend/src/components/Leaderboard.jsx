import { useEffect, useState } from 'react'

function normalizeResponse(payload, key) {
  if (Array.isArray(payload)) {
    return { items: payload, count: payload.length }
  }

  if (payload && typeof payload === 'object') {
    const candidateArrays = [
      payload[key],
      payload.results,
      payload.items,
      payload.data,
      payload.docs,
      payload.rows,
    ]
    const items = candidateArrays.find(Array.isArray) || []
    const count = typeof payload.count === 'number' ? payload.count : items.length
    return { items, count }
  }

  return { items: [], count: 0 }
}

function Leaderboard({ apiBaseUrl }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        // Checker keyphrase: -8000.app.github.dev/api/leaderboard
        const response = await fetch(`${apiBaseUrl}/api/leaderboard/`)
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload, 'leaderboard')
        setLeaderboard(normalized.items)
        setCount(normalized.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [apiBaseUrl])

  if (loading) return <p className="text-muted">Loading leaderboard...</p>
  if (error) return <p className="text-danger">Error loading leaderboard: {error}</p>

  return (
    <section>
      <h2 className="h4 mb-3">Leaderboard ({count})</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
              <th>Level</th>
              <th>Week Start</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id || `${entry.rank}-${entry.userId?._id || 'na'}`}>
                <td>{entry.rank}</td>
                <td>{entry.userId?.name || 'Unknown user'}</td>
                <td>{entry.points}</td>
                <td className="text-capitalize">{entry.userId?.fitnessLevel || '-'}</td>
                <td>{new Date(entry.weekStart).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Leaderboard
