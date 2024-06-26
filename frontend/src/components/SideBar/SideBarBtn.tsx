"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import hoverContext from "../HoverContext"

const SideBarBtn: React.FC<{
  icon: React.ReactNode
  title: string
  link: string
  collapsed: boolean
}> = ({ icon, title, link, collapsed }) => {
  const pathname = usePathname()
  const currPath = useMemo(() => pathname === link, [link, pathname])
  const [hovering, setHovering] = useState(false)

  const { addKey, isSelfHover } = useContext(hoverContext)

  useEffect(() => {
    addKey(link, hovering ? "HOVER" : currPath ? "SELECT" : "NONE")
  }, [addKey, currPath, hovering, link])

  const isCurrHover = useMemo(() => isSelfHover(link), [isSelfHover, link])

  return (
    <Link
      href={link}
      className="relative text-nowrap rounded-md p-2"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative z-10 flex gap-2">
        <div>{icon}</div>
        {!collapsed && <h1>{title}</h1>}
      </div>
      {isCurrHover && (
        <motion.div
          className="absolute left-0 top-0 size-full rounded-[inherit] bg-purple-500"
          layoutId="selectedBackground"
        />
      )}
    </Link>
  )
}

export default SideBarBtn
