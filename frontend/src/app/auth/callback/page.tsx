"use client"

import { auth } from "@/services/auth.services"
import { setCookie } from "@/utils/actions/cookies.action"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import React, { useEffect, useRef } from "react"
import toast from "react-hot-toast"

const SIG_ABRT = "Signal aborted to prevent multiple access token fetching"

const Callback: React.FC = () => {
  const code = useSearchParams().get("code")
  const abortRef = useRef<AbortController>()
  const router = useRouter()

  useEffect(() => {
    if (typeof code === "undefined" || code == null) {
      router.push("/auth")
      return
    }
    ;(async () => {
      if (abortRef.current) {
        abortRef.current.abort(SIG_ABRT)
      }
      abortRef.current = new AbortController()
      console.log("fetching")
      const resp = await auth(code, abortRef.current)

      if (resp.error === SIG_ABRT) return

      if (!resp.ok) {
        toast.error(resp.error)
        router.push("/auth")
        return
      }

      setCookie("auth_key", resp.data.access_token)
      router.push("/prompt_tester")
    })()
  }, [code, router])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <motion.div
        className="size-[100px] bg-purple-600"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      <h1 className="mt-20 text-xl">Loading.....</h1>
    </div>
  )
}

export default Callback
