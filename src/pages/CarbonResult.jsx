import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { CARBON_STATUS, statusLabel, stepIndex } from '../lib/carbonStatus.js'
import BigNumber from '../components/BigNumber.jsx'
import PaddyLevelBar from '../components/PaddyLevelBar.jsx'
import TxLink from '../components/TxLink.jsx'
import { ErrorState, LoadingState } from '../components/StateViews.jsx'

const MILESTONES = [
  { label: 'ACTIVE', at: 0 },
  { label: 'LISTED', at: 33 },
  { label: 'SOLD', at: 66 },
  { label: 'RETIRED', at: 100 },
]

export default function CarbonResult() {
  const { farmId } = useParams()
  const [carbon, setCarbon] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [txHash, setTxHash] = useState(null)

  const load = () => {
    setError(null)
    setCarbon(null)
    api
      .getCarbon(farmId)
      .then((c) => {
        setCarbon(c)
        setTxHash(c.txHash || null)
      })
      .catch((e) => setError(e.message || 'Không tải được dữ liệu carbon'))
  }

  useEffect(load, [farmId])

  const mint = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await api.mintCarbon({ farmId, carbonAmount: carbon.amount })
      setTxHash(res.txHash)
      setCarbon({ ...carbon, status: CARBON_STATUS.ACTIVE, txHash: res.txHash })
    } catch (e) {
      setError(e.message || 'Tokenize thất bại — thử lại')
    } finally {
      setBusy(false)
    }
  }

  const list = async () => {
    setBusy(true)
    setError(null)
    try {
      await api.listCarbon({ farmId, amount: carbon.amount, price: 8 })
      setCarbon({ ...carbon, status: CARBON_STATUS.LISTED })
    } catch (e) {
      setError(e.message || 'Rao bán thất bại — thử lại')
    } finally {
      setBusy(false)
    }
  }

  if (error && !carbon) return <ErrorState message={error} onRetry={load} />
  if (!carbon) return <LoadingState label="Đang tải kết quả carbon…" />

  const status = carbon.status || CARBON_STATUS.PENDING_MINT
  const isMinted = status !== CARBON_STATUS.PENDING_MINT

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Kết quả carbon</h1>
      <p className="mb-6 font-mono text-xs text-paddy-900/60">{farmId}</p>

      <div className="rounded-lg border border-paddy-900/10 bg-white/70 p-6">
        <BigNumber value={carbon.amount} unit={carbon.unit} label="Lượng giảm phát thải" />

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Trạng thái</span>
            <span className="text-sm font-semibold text-paddy-500">{statusLabel(status)}</span>
          </div>
          {isMinted && (
            <PaddyLevelBar
              level={stepIndex(status) >= 0 ? (stepIndex(status) / 3) * 100 : 0}
              milestones={MILESTONES}
            />
          )}
        </div>

        {txHash && (
          <div className="mt-6 border-t border-paddy-900/10 pt-4">
            <div className="mb-1 text-xs text-paddy-900/60">Transaction (Solana Devnet)</div>
            <TxLink txHash={txHash} short={false} />
          </div>
        )}

        {error && <p className="mt-4 text-sm font-medium text-paddy-900">{error}</p>}

        <div className="mt-6 flex flex-col gap-3">
          {!isMinted && (
            <button
              type="button"
              onClick={mint}
              disabled={busy}
              className="w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100 disabled:opacity-60"
            >
              {busy ? 'Đang tokenize…' : 'Tokenize carbon'}
            </button>
          )}

          {status === CARBON_STATUS.ACTIVE && (
            <button
              type="button"
              onClick={list}
              disabled={busy}
              className="w-full rounded-md bg-clay-600 px-4 py-3 text-base font-semibold text-husk-100 disabled:opacity-60"
            >
              {busy ? 'Đang rao bán…' : 'Rao bán trên Marketplace (8 USDC)'}
            </button>
          )}

          {status === CARBON_STATUS.LISTED && (
            <Link
              to="/marketplace"
              className="w-full rounded-md bg-paddy-500 px-4 py-3 text-center text-base font-semibold text-white"
            >
              Xem trên Marketplace
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
