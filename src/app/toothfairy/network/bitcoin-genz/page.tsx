import dynamic from "next/dynamic"

const BitcoinGenZViewer = dynamic(
  () => import("./bitcoin-genz-viewer"),
  { ssr: false }
)

export default function BitcoinGenZPage() {
  return <BitcoinGenZViewer />
}
