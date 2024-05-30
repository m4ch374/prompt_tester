"use client"

import React, { useContext, useEffect } from "react"
import ConversationTopic from "./ConversationTopic"
import { getChats } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"
import toast from "react-hot-toast"
import promptContext from "../PromptContext"
import Chat from "@/icons/Chat"

const Conversations: React.FC = () => {
  const promptCtx = useContext(promptContext)
  const [conversation, setConversation] = promptCtx.conversationsController

  const setCurrConvo = promptCtx.currConversationController[1]

  const setLoading = promptCtx.loadingConversation[1]

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const token = await (getCookie("auth_key") as unknown as Promise<string>)
      const resp = await getChats(token)

      if (!resp.ok) {
        toast.error(resp.error)
        setLoading(false)
        return
      }

      setConversation(resp.data.conversations)

      if (resp.data.conversations.length)
        setCurrConvo(resp.data.conversations.reverse()[0].id)

      setLoading(false)
    })()
  }, [setConversation, setCurrConvo, setLoading])

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex w-full justify-center">
        <button
          type="button"
          className="my-2 flex w-[90%] justify-center gap-2 rounded-md bg-purple-500 py-1 hover:bg-purple-600"
          onClick={() => setCurrConvo(-1)}
        >
          <Chat />
          <h1>New</h1>
        </button>
      </div>
      <div>
        {conversation.map((c, i) => (
          <ConversationTopic key={i} conversation={c} />
        ))}
      </div>
    </div>
  )
}

export default Conversations
