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

function Teams({ apiBaseUrl }) {
  const [teams, setTeams] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/teams/`)
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload, 'teams')
        setTeams(normalized.items)
        setCount(normalized.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [apiBaseUrl])

  if (loading) return <p className="text-muted">Loading teams...</p>
  if (error) return <p className="text-danger">Error loading teams: {error}</p>

  return (
    <section>
      <h2 className="h4 mb-3">Teams ({count})</h2>
      <div className="row g-3">
        {teams.map((team) => (
          <div className="col-md-6" key={team._id || team.name}>
            <article className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-1">{team.name}</h3>
                <p className="text-secondary mb-2">{team.city}</p>
                <p className="mb-2">{team.motto || 'No motto set'}</p>
                <span className="badge text-bg-primary">
                  {team.memberCount ?? 0} members
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Teams
