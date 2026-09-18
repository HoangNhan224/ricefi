import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import BigNumber from '../components/BigNumber.jsx'
import TxLink from '../components/TxLink.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'

export default function Marketplace() {
  const [listings, setListings] = useState(null)
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState(null)
  const [buyingId, setBuyingId] = useState(null)
  const [buyResult, setBuyResult] = useState(null)

  const load = () => {
    setError(null)
    setListings(null)
    Promise.all([api.getMarketplace(), api.getWalletBalance()])
      .then(([list, bal]) => {
        setListings(list)
        setBalance(bal)
      })
      .catch((e) => setError(e.message || 'Không tải được marketplace'))
  }

  useEffect(load, [])

  const buy = async (item) => {
    setBuyingId(item.creditId)
    setError(null)
    setBuyResult(null)
    try {
      const res = await api.buyCredit({ creditId: item.creditId, amount: item.amount })
      setBuyResult(res)
      // cập nhật lại số dư + danh sách sau khi mua
      await load()
    } catch (e) {
      setError(e.message || 'Mua thất bại — thử lại')
    } finally {
      setBuyingId(null)
    }
  }

  if (error && !listings) return <ErrorState message={error} onRetry={load} />
  if (listings === null) return <LoadingState label="Đang tải marketplace…" />

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Marketplace</h1>
        {balance && (
          <div className="text-right">
            <div className="text-xs text-paddy-900/60">Số dư</div>
            <div className="font-display text-xl font-semibold text-gold-500">
              {balance.USDC} <span className="text-sm">USDC</span>
            </div>
          </div>
        )}
      </div>

      {buyResult && (
        <div className="mb-4 rounded-lg border border-paddy-500/30 bg-paddy-500/10 p-4">
          <p className="text-sm font-semibold text-paddy-900">
            Mua thành công — {buyResult.usdc} USDC đã thanh toán
          </p>
          <div className="mt-1">
            <TxLink txHash={buyResult.txHash} short={false} />
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-sm font-medium text-paddy-900">{error}</p>}

      {listings.length === 0 ? (
        <EmptyState
          title="Chưa có listing nào"
          description="Khi nông dân rao bán tín chỉ carbon, listing sẽ xuất hiện ở đây."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-paddy-900/10 bg-white/70">
          {/* Header cột — ledger */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-paddy-900/20 px-4 py-2 text-xs font-medium text-paddy-900/50">
            <span>Listing</span>
            <span className="w-20 text-right">Số lượng</span>
            <span className="w-20 text-right">Giá</span>
            <span className="w-20" />
          </div>

          <ul className="divide-y divide-paddy-900/10">
            {listings.map((item) => (
              <li
                key={item.creditId}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{item.name || item.creditId}</div>
                  <div className="font-mono text-xs text-paddy-900/50">{item.creditId}</div>
                </div>
                <div className="w-20 text-right">
                  <div className="font-display text-lg font-semibold text-gold-500">
                    {item.amount}
                  </div>
                  <div className="text-xs text-paddy-900/60">RCC</div>
                </div>
                <div className="w-20 text-right">
                  <div className="font-display text-lg font-semibold text-gold-500">
                    {item.price}
                  </div>
                  <div className="text-xs text-paddy-900/60">USDC</div>
                </div>
                <div className="w-20 text-right">
                  <button
                    type="button"
                    disabled={buyingId === item.creditId}
                    onClick={() => buy(item)}
                    className="rounded-md bg-paddy-900 px-3 py-1.5 text-sm font-semibold text-husk-100 disabled:opacity-60"
                  >
                    {buyingId === item.creditId ? '…' : 'Mua'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <BigNumber value={listings.length} label="Tổng listing đang mở" size="text-2xl" />
      </div>
    </div>
  )
}
