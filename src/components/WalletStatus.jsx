import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

function shortenAddress(address) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

export default function WalletStatus() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (!publicKey) {
      setBalance(null)
      return undefined
    }

    connection.getBalance(publicKey).then(
      (lamports) => {
        if (!cancelled) setBalance(lamports / 1_000_000_000)
      },
      () => {
        if (!cancelled) setBalance(null)
      },
    )

    return () => {
      cancelled = true
    }
  }, [connection, publicKey])

  return (
    <div className="flex items-center gap-2">
      {publicKey && (
        <span className="hidden font-mono text-xs text-husk-100/80 sm:inline">
          {shortenAddress(publicKey.toBase58())}
          {balance !== null && ` · ${balance.toFixed(3)} SOL`}
        </span>
      )}
      <WalletMultiButton />
    </div>
  )
}
