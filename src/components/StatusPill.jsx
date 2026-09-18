import { statusLabel } from '../lib/carbonStatus.js'

// Badge trạng thái carbon — map 1-1 với CarbonAsset.status (Section 5)
export default function StatusPill({ status }) {
  return (
    <span className="inline-flex items-center rounded-full border border-paddy-900/15 bg-white/60 px-3 py-1 text-xs font-medium text-paddy-900">
      {statusLabel(status)}
    </span>
  )
}
