import { explorerTxLink } from '../lib/carbonStatus.js'

// Link Solana Explorer cho tx hash (font mono — dữ liệu máy tính, có thể copy)
export default function TxLink({ txHash, short = true }) {
  const shortHash = short && txHash.length > 18 ? `${txHash.slice(0, 10)}…${txHash.slice(-6)}` : txHash
  return (
    <a
      href={explorerTxLink(txHash)}
      target="_blank"
      rel="noreferrer"
      title={txHash}
      className="break-all font-mono text-xs text-water-600 underline decoration-water-600/40 underline-offset-2"
    >
      {shortHash}
    </a>
  )
}
