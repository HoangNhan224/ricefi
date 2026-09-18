import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api.js'
import PaddyLevelBar from '../components/PaddyLevelBar.jsx'
import { ErrorState, LoadingState } from '../components/StateViews.jsx'
import BigNumber from '../components/BigNumber.jsx'

// Ảnh vệ tinh placeholder — ghi rõ "ảnh minh hoạ", không giả làm ảnh thật
function SatellitePlaceholder() {
  return (
    <div className="overflow-hidden rounded-lg border border-water-600/20">
      <div className="relative grid aspect-[4/3] grid-cols-6 grid-rows-4 bg-water-600/10">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`border border-water-600/10 ${i % 3 === 0 ? 'bg-water-600/20' : 'bg-paddy-500/10'}`}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded bg-husk-100/90 px-3 py-1 text-xs font-medium text-water-600">
            Ảnh vệ tinh minh hoạ — dữ liệu thật do AI/MRV cung cấp
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Verification() {
  const { farmId } = useParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle') // idle | running | done | rejected
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const start = async () => {
    setPhase('running')
    setError(null)
    try {
      const res = await api.startVerification(farmId)
      setResult(res)
      setPhase(res.status === 'VERIFIED' ? 'done' : 'rejected')
    } catch (e) {
      setError(e.message || 'Xác minh thất bại — thử lại')
      setPhase('idle')
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!farmId) setError('Thiếu farmId trong đường dẫn')
  }, [farmId])

  if (!farmId) return <ErrorState message="Thiếu farmId trong đường dẫn" />
  if (error) return <ErrorState message={error} onRetry={start} />

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Xác minh farm</h1>
      <p className="mb-2 font-mono text-xs text-paddy-900/60">{farmId}</p>

      <SatellitePlaceholder />

      <div className="mt-6 rounded-lg border border-paddy-900/10 bg-white/70 p-5">
        {phase === 'idle' && (
          <>
            <p className="text-sm text-paddy-900/70">
              AI/MRV sẽ phân tích ảnh vệ tinh + dữ liệu IoT để xác minh mô hình AWD.
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-4 w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100"
            >
              Bắt đầu xác minh
            </button>
          </>
        )}

        {phase === 'running' && (
          <div>
            <p className="mb-3 text-sm font-medium text-water-600">
              Đang phân tích — mực nước đang dâng…
            </p>
            <PaddyLevelBar level={100} running duration={1600} />
            <p className="mt-3 text-xs text-paddy-900/60">
              Mô phỏng cơ chế AWD: nước dâng khi ngập, hạ khi khô.
            </p>
          </div>
        )}

        {phase === 'done' && result && (
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm font-medium text-paddy-900">Độ tin cậy AI</span>
              <span className="font-mono text-lg text-water-600">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <PaddyLevelBar level={Math.round(result.confidence * 100)} />

            <div className="mt-6">
              <BigNumber
                value={result.carbonReduction}
                unit="tCO2e"
                label="Giảm phát thải ước tính"
                size="text-4xl"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate(`/farmer/carbon/${farmId}`)}
              className="mt-6 w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100"
            >
              Xem kết quả carbon
            </button>
          </div>
        )}

        {phase === 'rejected' && (
          <div>
            <p className="text-sm font-medium text-paddy-900">
              Không đạt xác minh — vui lòng kiểm tra lại dữ liệu farm.
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-4 w-full rounded-md bg-paddy-900 px-4 py-3 text-base font-semibold text-husk-100"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
