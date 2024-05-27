"use client"

import useStorage from "@/utils/hooks/UseStorage.hook"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo } from "react"

const RouteProtector: React.FC<{
  children: React.ReactNode
  fallbackRoute: string
}> = ({ children, fallbackRoute }) => {
  const authKey = useStorage("auth_key").storageItem
  const hasKey = useMemo(() => authKey !== "", [authKey])
  const navigate = useRouter()

  const whiteListed = useMemo(() => {
    if (typeof window === "undefined") return

    return window.location.pathname.startsWith("/auth")
  }, [])

  useEffect(() => {
    if (!hasKey && !whiteListed) {
      navigate.push(fallbackRoute)
      return
    }
  }, [fallbackRoute, hasKey, navigate, whiteListed])

  return children
}

export default RouteProtector
