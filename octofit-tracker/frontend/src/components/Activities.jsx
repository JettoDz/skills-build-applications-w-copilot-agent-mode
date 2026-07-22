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

function Activities({ apiBaseUrl }) {
  const [activities, setActivities] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/api/activities/`)
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload, 'activities')
        setActivities(normalized.items)
        setCount(normalized.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [apiBaseUrl])

  if (loading) return <p className="text-muted">Loading activities...</p>
  if (error) return <p className="text-danger">Error loading activities: {error}</p>

  return (
    <section>
      <h2 className="h4 mb-3">Activities ({count})</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id || `${activity.type}-${activity.completedAt}`}>
                <td>{activity.userId?.name || 'Unknown user'}</td>
                <td className="text-capitalize">{activity.type}</td>
                <td>{activity.durationMinutes} min</td>
                <td>{activity.caloriesBurned}</td>
                <td>{new Date(activity.completedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Activities
