"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef } from "react"

const Callback: React.FC = () => {
  const code = useSearchParams().get("code")
  const abortRef = useRef<AbortController>()
  const router = useRouter()

  useEffect(() => {
    if (typeof code === "undefined" || code == null) return
    ;(async () => {
      if (abortRef.current) {
        abortRef.current.abort(
          "Signal aborted to prevent multiple access token fetching",
        )
      }
      abortRef.current = new AbortController()
      console.log("fetching")
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/auth?access_code=${encodeURIComponent(code)}`,
        {
          method: "GET",
          signal: abortRef.current.signal,
        },
      )

      if (!resp.ok) {
        const err = (await resp.json()) as { detail: { reason: string } }
        console.error(err.detail.reason)
        router.push("/auth")
        return
      }

      const data = (await resp.json()) as { access_token: string }

      console.log(data.access_token)
      router.push("/")
    })()
  }, [code, router])

  return <h1>hi</h1>
}

export default Callback
