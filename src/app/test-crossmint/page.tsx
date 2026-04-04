"use client"

import dynamic from "next/dynamic"

const CrossmintTest = dynamic(() => import("./crossmint-test"), { ssr: false })

export default function Page() {
  return <CrossmintTest />
}
