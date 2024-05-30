"use client"

import Trash from "@/icons/Trash"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { TConversation } from "@/services/types"
import promptContext from "../PromptContext"
import hoverContext from "@/components/HoverContext"
import { removeChat } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"
import toast from "react-hot-toast"

const ConversationTopic: React.FC<{
  conversation: TConversation
}> = ({ conversation }) => {
  const [hover, setHover] = useState(false)
  const conversationTopic = useMemo(() => {
    if (!conversation.messages.length) return "New Conversation"

    return (
      conversation.messages.filter(m => m.role === "user")[0]?.content || ""
    )
  }, [conversation.messages])

  const { conversationsController, currConversationController } =
    useContext(promptContext)

  const [currConvo, setCurrConvo] = currConversationController

  const setConversations = conversationsController[1]

  const { addKey, isSelfHover, removeKey } = useContext(hoverContext)

  useEffect(() => {
    addKey(
      conversation.id.toString(),
      hover
        ? "HOVER"
        : currConvo.toString() === conversation.id.toString()
          ? "SELECT"
          : "NONE",
    )
  }, [addKey, conversation.id, currConvo, hover])

  const isHighlight = useMemo(() => {
    return isSelfHover(conversation.id.toString())
  }, [conversation.id, isSelfHover])

  return (
    <div
      className="relative w-full cursor-pointer text-start text-zinc-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setCurrConvo(conversation.id)}
    >
      <h1 className="line-clamp-1 p-1.5 text-lg">{conversationTopic}</h1>

      {isHighlight && (
        <motion.div
          layoutId="topic"
          className="absolute left-0 top-0 flex size-full items-center justify-between bg-white/10"
        >
          <div className="h-full w-1 rounded-r-md bg-purple-500" />
          <div className="flex h-full items-center justify-center rounded-l bg-red-500 px-2">
            <button
              className="text-red-200"
              type="button"
              onClick={() => {
                ;(async () => {
                  const token = await (getCookie(
                    "auth_key",
                  ) as unknown as Promise<string>)
                  const resp = await removeChat(token, {
                    conversation_id: conversation.id,
                  })

                  if (!resp.ok) {
                    toast.error(resp.error)
                    return
                  }

                  setConversations(c =>
                    c.filter(con => con.id !== conversation.id),
                  )
                  removeKey(conversation.id.toString())
                })()
              }}
            >
              <Trash />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ConversationTopic
