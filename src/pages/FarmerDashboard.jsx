import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'
import { statusLabel } from '../lib/carbonStatus.js'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import BigNumber from '../components/BigNumber.jsx'

// Từ trạng thái carbon suy ra hành động tiếp theo cho nông dân
function nextAction(farm) {
  if (!farm.carbonStatus) return { to: `/farmer/verify/${farm.id}`, label: 'Xác minh' }
  if (farm.carbonStatus === 'PENDING_MINT') return { to: `/farmer/carbon/${farm.id}`, label: 'Tokenize' }
  if (farm.carbonStatus === 'ACTIVE') return { to: `/farmer/carbon/${farm.id}`, label: 'Rao bán' }
  return null
}

export default function FarmerDashboard() {
  const [farms, setFarms] = useState(null)
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setError(null)
    setFarms(null)
    Promise.all([api.listFarms(), api.getWalletBalance()])
      .then(([farmList, bal]) => {
        setFarms(farmList)
        setBalance(bal)
      })
      .catch((e) => setError(e.message || 'Không tải được danh sách farm'))
  }

  useEffect(load, [])

  if (error) return <ErrorState message={error} onRetry={load} />
  if (farms === null || balance === null) return <LoadingState label="Đang tải danh sách farm…" />

  const totalArea = farms.reduce((s, f) => s + (f.area || 0), 0)

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Trang trại của tôi</h1>
        <Link
          to="/farmer/farms/new"
          className="rounded-md bg-paddy-900 px-4 py-2 text-sm font-semibold text-husk-100"
        >
          + Thêm farm
        </Link>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          title="Chưa có farm nào"
          description="Thêm farm đầu tiên để bắt đầu xác minh giảm phát thải."
          action={
            <Link
              to="/farmer/farms/new"
              className="rounded-md bg-paddy-900 px-4 py-2 text-sm font-semibold text-husk-100"
            >
              Thêm farm
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-paddy-900/10 bg-white/60 p-4">
              <BigNumber value={totalArea} unit="ha" label="Tổng diện tích" size="text-3xl" />
            </div>
            <div className="rounded-lg border border-paddy-900/10 bg-white/60 p-4">
              <BigNumber value={balance.USDC} label="Số dư USDC" size="text-3xl" />
            </div>
          </div>

          <ul className="divide-y divide-paddy-900/10 rounded-lg border border-paddy-900/10 bg-white/60">
            {farms.map((f) => {
              const action = nextAction(f)
              return (
                <li key={f.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{f.name}</div>
                    <div className="mt-0.5 text-sm text-paddy-900/60">
                      {f.area} ha · {f.method}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm text-paddy-900/70">
                      {f.carbonStatus ? statusLabel(f.carbonStatus) : 'Chờ xác minh'}
                    </span>
                    {action && (
                      <Link
                        to={action.to}
                        className="rounded-md border border-paddy-500 px-3 py-1.5 text-sm font-semibold text-paddy-500"
                      >
                        {action.label}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
