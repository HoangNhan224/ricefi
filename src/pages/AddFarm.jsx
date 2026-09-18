import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'

const METHODS = [
  { value: 'AWD', label: 'AWD — ngập khô xen kẽ' },
  { value: 'MID_SEASON_DRAINAGE', label: 'Rút nước giữa vụ' },
  { value: 'DRY_SEEDING', label: 'Sạ khô' },
]

export default function AddFarm() {
  const navigate = useNavigate()
  const [name, setName] = useState('Mekong Rice #001')
  const [area, setArea] = useState('2.4')
  const [method, setMethod] = useState('AWD')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const areaNum = Number(area)
    if (!name.trim()) return setError('Nhập tên farm')
    if (!Number.isFinite(areaNum) || areaNum <= 0) return setError('Diện tích phải lớn hơn 0')
    setError(null)
    setLoading(true)
    try {
      await api.createFarm({ name: name.trim(), area: areaNum, method })
      navigate('/farmer')
    } catch (err) {
      setError(err.message || 'Không tạo được farm — thử lại')
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Thêm farm mới</h1>

      <form
        onSubmit={submit}
        className="rounded-lg border border-paddy-900/10 bg-white/70 p-6"
      >
        <label className="mb-1 block text-sm font-medium" htmlFor="name">
          Tên farm
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mekong Rice #001"
          className="w-full rounded-md border border-paddy-900/20 bg-white px-3 py-2 text-base outline-none focus:border-paddy-500"
        />

        <label className="mb-1 mt-5 block text-sm font-medium" htmlFor="area">
          Diện tích (ha)
        </label>
        <input
          id="area"
          type="number"
          step="0.1"
          min="0.1"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full rounded-md border border-paddy-900/20 bg-white px-3 py-2 text-base outline-none focus:border-paddy-500"
        />

        <label className="mb-1 mt-5 block text-sm font-medium" htmlFor="method">
          Phương pháp canh tác
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full rounded-md border border-paddy-900/20 bg-white px-3 py-2 text-base outline-none focus:border-paddy-500"
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {error && <p className="mt-4 text-sm font-medium text-paddy-900">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100 disabled:opacity-60"
        >
          {loading ? 'Đang tạo farm…' : 'Tạo farm'}
        </button>
      </form>
    </div>
  )
}
