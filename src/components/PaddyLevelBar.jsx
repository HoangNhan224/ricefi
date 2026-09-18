import { useEffect, useRef, useState } from 'react'

/**
 * PaddyLevelBar — thanh "mực nước" (signature element, Section 3.4).
 * Dùng chung cho:
 *  - Confidence AI ở trang Verification (91% → mực nước dâng tới 91%)
 *  - Progress trạng thái carbon ACTIVE → LISTED → SOLD → RETIRED (4 mốc)
 * Khi `running` = true, mực nước dâng dần từ 0 → level (mô phỏng AWD ngập/khô).
 */
export default function PaddyLevelBar({
  level = 0,
  running = false,
  duration = 1200,
  milestones = [],
}) {
  const [display, setDisplay] = useState(running ? 0 : level)
  const startRef = useRef(null)

  useEffect(() => {
    if (!running) {
      setDisplay(level)
      return
    }
    setDisplay(0)
    startRef.current = null
    let raf
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(level * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [running, level, duration])

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={Math.round(display)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-paddy-900/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-water-600"
          style={{ width: `${Math.min(100, Math.max(0, display))}%` }}
        />
      </div>
      {milestones.length > 0 && (
        <div className="relative mt-2 h-6 w-full">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${m.at}%` }}
            >
              <div
                className={`h-2 w-px ${display >= m.at ? 'bg-water-600' : 'bg-paddy-900/20'}`}
              />
              <span className="mt-1 whitespace-nowrap text-[10px] font-mono text-paddy-900/60">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
