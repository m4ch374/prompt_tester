"use client"

import { generateChat } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import toast from "react-hot-toast"
import { TConversation, TMessage } from "@/services/types"
import Conversations from "./conversations/Conversations"
import promptContext from "./PromptContext"
import SystemTextBox from "./SystemTextBox"
import ChatBox from "./chat_box/ChatBox"

// This is a hot dumpster fire mess
const PromptTesterForm: React.FC = () => {
  const textRef = useRef<HTMLTextAreaElement>(null)

  const [usrMsg, setUsrMsg] = useState("")

  const [sysMsg, setSysMsg] = useState("")

  const [conversations, setConversations] = useState<TConversation[]>([])
  const [currConversation, setCurrConversation] = useState(-1)

  const [allChat, setAllChat] = useState<TMessage[]>([])

  const [responding, setResopnding] = useState(false)
  const [currResponse, setCurrResponse] = useState("")
  const responseRef = useRef("")
  const responseContainerRef = useRef<HTMLDivElement>(null)

  const [conversationId, setConversationId] = useState(-1)

  useEffect(() => {
    if (currConversation === -1) return

    const currChat = conversations.filter(c => c.id === currConversation)[0]
    const lastUsedSysMsg = currChat.messages
      .filter(m => m.role === "system")
      .splice(-1)[0]?.content
    setAllChat(currChat.messages)
    setSysMsg(lastUsedSysMsg || "")
  }, [conversations, currConversation])

  useEffect(() => {
    console.log(conversationId)
  }, [conversationId])

  useEffect(() => {
    if (!textRef.current) return

    textRef.current.style.height = "auto"
    textRef.current.style.height = textRef.current.scrollHeight + 30 + "px"
  }, [usrMsg])

  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop =
        responseContainerRef.current.scrollHeight
    }
  }, [allChat, currResponse])

  const formSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      responseRef.current = ""
      setCurrResponse("")
      if (responding) toast.error("The chat is responding")
      ;(async () => {
        const token = await (getCookie(
          "auth_key",
        ) as unknown as Promise<string>)
        setResopnding(true)
        setAllChat(c => [...c, { role: "user", content: usrMsg }])

        setUsrMsg("") // not sure if this will create recursion, will see

        const resp = await generateChat(token, {
          conversation_id: currConversation,
          system_message: { role: "system", content: sysMsg },
          user_message: { role: "user", content: usrMsg },
          stream: true,
          seed: 1,
          model: "llama3-8b-8192",
        })

        if (!resp.ok) {
          toast.error(resp.error)
          setResopnding(false)
          return
        }

        // I died
        const reader = resp.data.body?.getReader()
        const decode = new TextDecoder("utf-8")

        let start = true
        reader
          ?.read()
          .then(function readChunk(
            res: ReadableStreamReadResult<Uint8Array>,
          ): Promise<void> | void {
            if (res.done) {
              setResopnding(false)
              setAllChat(c => [
                ...c,
                { role: "assistant", content: responseRef.current },
              ])
              return
            }

            if (start) {
              decode
                .decode(res.value)
                .split("\n")
                .slice(1)
                .forEach(x => (responseRef.current += x))
              setConversationId(parseInt(decode.decode(res.value)))
              start = false
            } else {
              responseRef.current += decode.decode(res.value)
            }
            setCurrResponse(responseRef.current)
            return reader.read().then(readChunk)
          })
          .catch(e => {
            toast.error(e as string)
          })
      })()
    },
    [currConversation, responding, sysMsg, usrMsg],
  )

  return (
    <promptContext.Provider
      value={{
        usrMsgController: [usrMsg, setUsrMsg],
        sysMsgController: [sysMsg, setSysMsg],
        conversationsController: [conversations, setConversations],
        currConversationController: [currConversation, setCurrConversation],
        allChat,
        currResponse,
        responding,
      }}
    >
      <form className="flex size-full justify-stretch" onSubmit={formSubmit}>
        <div className="flex flex-1 flex-col justify-between border-r border-zinc-500/40">
          <Conversations />
          <SystemTextBox />
        </div>
        <div className="flex flex-[2.5] flex-col justify-end border-r border-zinc-500/40">
          <ChatBox
            responseContainerRef={responseContainerRef}
            textRef={textRef}
          />
        </div>
        <div className="flex-1">
          <h1 className="m-2">Settings</h1>
        </div>
      </form>
    </promptContext.Provider>
  )
}

export default PromptTesterForm
