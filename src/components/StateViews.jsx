// Các state view dùng chung: loading / error / empty (QA09, QA10)
import PaddyLevelBar from './PaddyLevelBar.jsx'

export function LoadingState({ label = 'Đang tải dữ liệu…' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-paddy-900/70">
      <PaddyLevelBar level={38} running duration={1500} />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto my-10 max-w-sm rounded-lg border border-paddy-900/15 bg-white/60 px-6 py-8 text-center">
      <p className="text-sm font-medium text-paddy-900">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-paddy-900 px-4 py-2 text-sm font-semibold text-husk-100"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="mx-auto my-10 max-w-sm rounded-lg border border-dashed border-paddy-900/25 bg-white/40 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-paddy-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-paddy-900/70">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
