"use client"

import React, { Suspense } from "react"
import Callback from "./Callback"

const CallbackWrapper: React.FC = () => {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  )
}

export default CallbackWrapper
