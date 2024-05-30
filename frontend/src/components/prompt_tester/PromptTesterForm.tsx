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
import { TChatModel, TConversation, TMessage } from "@/services/types"
import Conversations from "./conversations/Conversations"
import promptContext from "./PromptContext"
import SystemTextBox from "./SystemTextBox"
import ChatBox from "./chat_box/ChatBox"
import Settings from "./settings/Settings"

// This is a hot dumpster fire mess
const PromptTesterForm: React.FC = () => {
  const textRef = useRef<HTMLTextAreaElement>(null)

  const [usrMsg, setUsrMsg] = useState("")

  const [sysMsg, setSysMsg] = useState("")

  const [loadingConvo, setLoadingConvo] = useState(true)
  const [conversations, setConversations] = useState<TConversation[]>([])
  const [currConversation, setCurrConversation] = useState(-1)

  const [responding, setResopnding] = useState(false)
  const [currResponse, setCurrResponse] = useState("")
  const responseRef = useRef("")
  const responseContainerRef = useRef<HTMLDivElement>(null)

  const temperatureController = useState(1)
  const maxTokenController = useState(1024)
  const topPController = useState(1)
  const modelController = useState<TChatModel>("llama3-8b-8192")
  const seedController = useState<number>()

  const setNewConvo = useCallback((cid: number, msg: TMessage) => {
    setConversations(c => {
      const itself = c.find(con => con.id === cid)

      if (!itself) return c

      const filtered = c.filter(con => con.id !== cid)
      const res = [
        { id: cid, messages: [...itself.messages, msg] },
        ...filtered,
      ]
      return cid !== -1 ? res.sort((a, b) => b.id - a.id) : res
    })
  }, [])

  useEffect(() => {
    if (loadingConvo) return

    if (conversations.map(x => x.id).includes(currConversation)) return

    console.log(conversations.length)
    if (!conversations.length || currConversation == -1) {
      setConversations(s => [{ id: -1, messages: [] }, ...s])
      setCurrConversation(-1)
      return
    }
    setCurrConversation(Math.max(...conversations.map(x => x.id)))
  }, [currConversation, conversations, loadingConvo, setNewConvo])

  useEffect(() => {
    const filtered = conversations.find(c => c.id === currConversation)

    if (!filtered) return

    const lastUsedSysMsg = filtered.messages
      .filter(m => m.role === "system")
      .splice(-1)[0]?.content
    setSysMsg(lastUsedSysMsg || "")
  }, [conversations, currConversation])

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
  }, [currResponse, conversations, currConversation])

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

        setNewConvo(currConversation, { role: "user", content: usrMsg })
        setUsrMsg("") // not sure if this will create recursion, we'll see

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

        let nextId: number | null = null // to force a non-async op

        let start = true
        reader
          ?.read()
          .then(function readChunk(
            res: ReadableStreamReadResult<Uint8Array>,
          ): Promise<void> | void {
            if (res.done) {
              setResopnding(false)
              setNewConvo(currConversation, {
                role: "assistant",
                content: responseRef.current,
              })

              if (nextId) {
                setConversations(c => {
                  const tmp = c.find(con => con.id === -1)
                  const filtered = c.filter(con => con.id !== -1)

                  return [
                    {
                      id: nextId,
                      messages: [...(tmp?.messages || [])],
                    },
                    ...filtered,
                  ] as TConversation[]
                })
                setCurrConversation(nextId)
              }
              return
            }

            if (start) {
              decode
                .decode(res.value)
                .split("\n")
                .slice(1)
                .forEach(x => (responseRef.current += x))

              const conversationId = parseInt(decode.decode(res.value)) // not the best
              nextId = conversationId // Forcing a non async op
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
    [currConversation, responding, setNewConvo, sysMsg, usrMsg],
  )

  return (
    <promptContext.Provider
      value={{
        usrMsgController: [usrMsg, setUsrMsg],
        sysMsgController: [sysMsg, setSysMsg],
        conversationsController: [conversations, setConversations],
        currConversationController: [currConversation, setCurrConversation],
        loadingConversation: [loadingConvo, setLoadingConvo],
        currResponse,
        responding,
        temperatureController,
        maxTokenController,
        topPController,
        modelController,
        seedController,
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
          <Settings />
        </div>
      </form>
    </promptContext.Provider>
  )
}

export default PromptTesterForm
