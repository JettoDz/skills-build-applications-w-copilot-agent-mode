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

function Users({ apiBaseUrl }) {
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/api/users/`)
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload, 'users')
        setUsers(normalized.items)
        setCount(normalized.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [apiBaseUrl])

  if (loading) return <p className="text-muted">Loading users...</p>
  if (error) return <p className="text-danger">Error loading users: {error}</p>

  return (
    <section>
      <h2 className="h4 mb-3">Users ({count})</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Fitness Level</th>
              <th>Weekly Goal (min)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="text-capitalize">{user.fitnessLevel}</td>
                <td>{user.weeklyGoalMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Users
