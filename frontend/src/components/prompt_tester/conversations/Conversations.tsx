"use client"

import React, { useContext, useEffect } from "react"
import ConversationTopic from "./ConversationTopic"
import { getChats } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"
import toast from "react-hot-toast"
import promptContext from "../PromptContext"

const Conversations: React.FC = () => {
  const [conversation, setConversation] =
    useContext(promptContext).conversationsController

  useEffect(() => {
    console.log(conversation)
  }, [conversation])

  useEffect(() => {
    ;(async () => {
      const token = await (getCookie("auth_key") as unknown as Promise<string>)
      const resp = await getChats(token)

      if (!resp.ok) {
        toast.error(resp.error)
        return
      }

      setConversation(resp.data.conversations)
    })()
  }, [setConversation])

  return (
    <div className="flex-1 overflow-auto">
      {conversation.map((c, i) => (
        <ConversationTopic key={i} conversation={c} />
      ))}
    </div>
  )
}

export default Conversations
