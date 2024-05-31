"use client"

import React, { useEffect } from "react"
import toast, { Toaster, useToasterStore } from "react-hot-toast"

const MyToaster: React.FC = () => {
  const { toasts } = useToasterStore()

  useEffect(() => {
    toasts
      .filter(t => t.visible)
      .filter((_, i) => i >= 1)
      .forEach(t => toast.dismiss(t.id))
  }, [toasts])

  return (
    <Toaster
      toastOptions={{
        position: "bottom-center",
        style: {
          background: "#333",
          color: "white",
        },
      }}
    />
  )
}

export default MyToaster
