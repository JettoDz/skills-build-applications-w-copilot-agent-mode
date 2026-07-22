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

function Workouts({ apiBaseUrl }) {
  const [workouts, setWorkouts] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/workouts/`)
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload, 'workouts')
        setWorkouts(normalized.items)
        setCount(normalized.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [apiBaseUrl])

  if (loading) return <p className="text-muted">Loading workouts...</p>
  if (error) return <p className="text-danger">Error loading workouts: {error}</p>

  return (
    <section>
      <h2 className="h4 mb-3">Workouts ({count})</h2>
      <div className="row g-3">
        {workouts.map((workout) => (
          <div className="col-md-6" key={workout._id || workout.title}>
            <article className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-2">{workout.title}</h3>
                <p className="mb-1 text-capitalize">
                  {workout.focusArea} • {workout.difficulty}
                </p>
                <p className="text-secondary mb-2">{workout.estimatedMinutes} min</p>
                <ul className="mb-0">
                  {(workout.exercises || []).map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Workouts
