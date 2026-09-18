import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { getRole, homeForRole, isAuthed, saveAuth } from '../lib/auth.js'
import { ErrorState } from '../components/StateViews.jsx'

const DEMO_ACCOUNTS = [
  { label: 'Nông dân (Farmer)', email: 'farmer@ricefi.demo' },
  { label: 'Doanh nghiệp (Buyer)', email: 'buyer@ricefi.demo' },
]

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('farmer@ricefi.demo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Nếu đã đăng nhập thì đi thẳng về trang theo role
  if (isAuthed()) {
    return <Navigate to={homeForRole(getRole())} replace />
  }

  const submit = async (value) => {
    setLoading(true)
    setError(null)
    try {
      const auth = await api.login(value)
      saveAuth(auth)
      navigate(homeForRole(auth.role), { replace: true })
    } catch (e) {
      setError(e.message || 'Đăng nhập thất bại — thử lại')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-husk-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-4xl font-semibold tracking-tight text-paddy-900">
            RiceFi
          </div>
          <p className="mt-2 text-sm text-paddy-900/70">
            Tín chỉ carbon từ lúa — AI x Web3 cho ĐBSCL
          </p>
        </div>

        <form
          className="rounded-lg border border-paddy-900/10 bg-white/70 p-6"
          onSubmit={(e) => {
            e.preventDefault()
            submit(email)
          }}
        >
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="farmer@ricefi.demo"
            className="w-full rounded-md border border-paddy-900/20 bg-white px-3 py-2 text-base outline-none focus:border-paddy-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100 disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>

        {error && <div className="mt-4"><ErrorState message={error} /></div>}

        <div className="mt-6 border-t border-paddy-900/10 pt-4">
          <p className="mb-2 text-xs text-paddy-900/60">Tài khoản demo</p>
          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => {
                  setEmail(acc.email)
                  submit(acc.email)
                }}
                className="rounded-md border border-paddy-900/15 px-3 py-2 text-left text-sm hover:border-paddy-500 disabled:opacity-60"
              >
                <span className="font-medium">{acc.label}</span>
                <span className="ml-2 font-mono text-xs text-paddy-900/60">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
