"use client"

import { auth } from "@/services/auth.services"
import { setCookie } from "@/utils/actions/cookies.action"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef } from "react"
import toast from "react-hot-toast"

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
      const resp = await auth(code, abortRef.current)

      if (!resp.ok) {
        toast.error(resp.error)
        router.push("/auth")
        return
      }

      setCookie("auth_key", resp.data.access_token)
      router.push("/")
    })()
  }, [code, router])

  return <h1>hi</h1>
}

export default Callback
