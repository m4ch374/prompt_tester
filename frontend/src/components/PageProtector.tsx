"use client"

import { getCookie } from "@/utils/actions/cookies.action"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const PageProtector: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    ;(async () => {
      // oh my god
      const cookie_str = await (getCookie(
        "auth_key",
      ) as unknown as Promise<string>)

      if (!pathname.startsWith("/auth") && cookie_str === "") {
        router.push("/auth")
      }
    })()
  }, [pathname, router])

  return <>{children}</>
}

export default PageProtector
