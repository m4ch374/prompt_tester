"use client"

import React, { useEffect } from "react"
import ConversationTopic from "./ConversationTopic"
import { getChats } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"

const Conversations: React.FC = () => {
  useEffect(() => {
    ;(async () => {
      const token = await (getCookie("auth_key") as unknown as Promise<string>)
      const resp = await getChats(token)

      console.log(resp)
    })()
  }, [])

  return (
    <div className="flex-1 overflow-auto">
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
    </div>
  )
}

export default Conversations
