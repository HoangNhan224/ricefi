// Số liệu lớn — Fraunces + --gold-500 (chỉ dùng cho con số có giá trị)
export default function BigNumber({ value, unit, label, size = 'text-5xl' }) {
  return (
    <div>
      {label && <div className="text-sm text-paddy-900/60">{label}</div>}
      <div className={`font-display font-semibold leading-none text-gold-500 ${size}`}>
        {value}
        {unit && <span className="ml-2 align-baseline text-xl text-paddy-900/70">{unit}</span>}
      </div>
    </div>
  )
}
