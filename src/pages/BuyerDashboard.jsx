import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import { statusLabel } from '../lib/carbonStatus.js'
import BigNumber from '../components/BigNumber.jsx'
import TxLink from '../components/TxLink.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'

export default function BuyerDashboard() {
  const [balance, setBalance] = useState(null)
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setError(null)
    setBalance(null)
    setOrders(null)
    Promise.all([api.getWalletBalance(), api.getOrders()])
      .then(([bal, ords]) => {
        setBalance(bal)
        setOrders(ords)
      })
      .catch((e) => setError(e.message || 'Không tải được ví'))
  }

  useEffect(load, [])

  if (error) return <ErrorState message={error} onRetry={load} />
  if (balance === null || orders === null) return <LoadingState label="Đang tải ví…" />

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Ví của tôi</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-paddy-900/10 bg-white/70 p-5">
          <BigNumber value={balance.RCC} label="Số dư RCC" size="text-4xl" />
        </div>
        <div className="rounded-lg border border-paddy-900/10 bg-white/70 p-5">
          <BigNumber value={balance.USDC} label="Số dư USDC" size="text-4xl" />
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Lịch sử mua</h2>

      {orders.length === 0 ? (
        <EmptyState title="Chưa có giao dịch nào" description="Mua tín chỉ carbon từ Marketplace để bắt đầu." />
      ) : (
        <ul className="divide-y divide-paddy-900/10 rounded-lg border border-paddy-900/10 bg-white/70">
          {orders.map((o, i) => (
            <li key={`${o.txHash}-${i}`} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{o.name || o.creditId}</div>
                  <div className="font-mono text-xs text-paddy-900/50">{o.creditId}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold text-gold-500">
                    {o.amount} <span className="text-sm">RCC</span>
                  </div>
                  <div className="text-xs text-paddy-900/60">{o.usdc} USDC</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-paddy-500">{statusLabel(o.status)}</span>
                  <div className="mt-0.5">
                    <TxLink txHash={o.txHash} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
