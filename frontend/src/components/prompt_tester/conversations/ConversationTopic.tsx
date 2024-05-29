"use client"

import Trash from "@/icons/Trash"
import React, { useState } from "react"
import { motion } from "framer-motion"

const ConversationTopic: React.FC<{ topic?: string }> = ({
  topic = "New Chat",
}) => {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="relative w-full cursor-pointer text-start text-zinc-400 hover:text-zinc-200"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h1 className="line-clamp-1 p-1.5 text-lg">{topic}</h1>

      {hover && (
        <motion.div
          layoutId="topic"
          className="absolute left-0 top-0 flex size-full items-center justify-between bg-white/10"
        >
          <div className="h-full w-1 rounded-r-md bg-purple-500" />
          <div className="flex h-full items-center justify-center rounded-l bg-red-500 px-2">
            <button className="text-red-200" type="button">
              <Trash />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ConversationTopic
