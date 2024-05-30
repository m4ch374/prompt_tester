"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"

const Tooltip: React.FC<{ children: React.ReactNode; tooltipText: string }> = ({
  children,
  tooltipText,
}) => {
  const selfRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (!hovering) {
      setModal(false)
      return
    }

    const timeout = setTimeout(() => {
      setModal(hovering)
    }, 500)

    return () => clearTimeout(timeout)
  }, [hovering])

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      ref={selfRef}
    >
      {children}

      <AnimatePresence>
        {modal && (
          <motion.div
            className="absolute top-0 rounded-md border border-zinc-600 bg-stone-900 p-2 text-sm text-zinc-400"
            style={{
              left: (selfRef.current?.clientWidth || 0) * -1,
              width: selfRef.current?.clientWidth,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
