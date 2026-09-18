import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuth, getRole } from '../lib/auth.js'
import WalletStatus from './WalletStatus.jsx'

// Shell + header — nền --husk-100, header --paddy-900 (Phase F2)
export default function Layout() {
  const role = getRole()
  const navigate = useNavigate()
  const isBuyer = role === 'BUYER'

  const nav = isBuyer
    ? [
        { to: '/marketplace', label: 'Marketplace' },
        { to: '/buyer', label: 'Ví của tôi' },
      ]
    : [
        { to: '/farmer', label: 'Trang chủ' },
        { to: '/farmer/farms/new', label: 'Thêm farm' },
      ]

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-husk-100 text-paddy-900">
      <header className="bg-paddy-900 text-husk-100">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <Link
            to={isBuyer ? '/marketplace' : '/farmer'}
            className="font-display text-xl font-semibold tracking-tight text-husk-100"
          >
            RiceFi
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold text-white underline underline-offset-4'
                    : 'text-husk-100/70 transition-colors hover:text-white'
                }
              >
                {n.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="text-husk-100/70 transition-colors hover:text-white"
            >
              Đăng xuất
            </button>
            <WalletStatus />
          </nav>
        </div>
      </header>

      <main className={`mx-auto w-full px-4 py-6 ${isBuyer ? 'max-w-3xl' : 'max-w-xl'}`}>
        <Outlet />
      </main>
    </div>
  )
}
