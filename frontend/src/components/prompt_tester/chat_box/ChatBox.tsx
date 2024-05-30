"use client"

import React, { LegacyRef, useContext, useMemo } from "react"
import promptContext from "../PromptContext"
import ChatItem from "./ChatItem"
import Send from "@/icons/Send"
import { TMessage } from "@/services/types"

const ChatBox: React.FC<{
  responseContainerRef: LegacyRef<HTMLDivElement>
  textRef: LegacyRef<HTMLTextAreaElement>
}> = ({ responseContainerRef, textRef }) => {
  const promptCtx = useContext(promptContext)
  const responding = promptCtx.responding
  const currResponse = promptCtx.currResponse
  const [usrMsg, setUsrMsg] = promptCtx.usrMsgController

  const currChatId = promptCtx.currConversationController[0]
  const conversations = promptCtx.conversationsController[0]
  const allChat: TMessage[] = useMemo(() => {
    return (
      conversations.find(c => c.id === currChatId)?.messages ||
      ([] as TMessage[])
    )
  }, [conversations, currChatId])

  return (
    <>
      <div className="grid items-end overflow-auto" ref={responseContainerRef}>
        {allChat
          .filter(s => s.role !== "system")
          .map((s, i) => (
            <ChatItem key={i} response={s} />
          ))}
        {responding && (
          <ChatItem
            response={{ role: "assistant", content: currResponse }}
            responding={true}
          />
        )}
      </div>
      <div className="flex flex-col">
        <hr className="h-px border-0 bg-zinc-500/40" />
        <div className="relative m-4 flex flex-col rounded-md border border-zinc-600 focus:border-zinc-400">
          <textarea
            ref={textRef}
            className="size-full max-h-[15lh] resize-none rounded-[inherit] bg-transparent p-4 outline-none"
            placeholder="Enter message"
            value={usrMsg}
            onChange={e => setUsrMsg(e.target.value)}
          />
          <button
            type="submit"
            className="absolute bottom-2 right-2 place-self-end rounded-md bg-purple-500 p-2"
          >
            <Send />
          </button>
        </div>
      </div>
    </>
  )
}

export default ChatBox
