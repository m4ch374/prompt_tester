"use client"

import { generateChat } from "@/services/chat.services"
import { getCookie } from "@/utils/actions/cookies.action"
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import toast from "react-hot-toast"
import { TMessage } from "@/services/types"
import Conversations from "./Conversations"
import promptContext from "./PromptContext"
import SystemTextBox from "./SystemTextBox"
import ChatBox from "./chat_box/ChatBox"

const PromptTesterForm: React.FC = () => {
  const textRef = useRef<HTMLTextAreaElement>(null)

  const [usrMsg, setUsrMsg] = useState("")

  const [sysMsg, setSysMsg] = useState("")
  const [prevSys, setPrevSys] = useState("")

  const [allChat, setAllChat] = useState<TMessage[]>([])

  const [responding, setResopnding] = useState(false)
  const [currResponse, setCurrResponse] = useState("")
  const responseRef = useRef("")
  const responseContainerRef = useRef<HTMLDivElement>(null)

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

  const constructMessage: TMessage[] = useMemo(() => {
    const res: TMessage[] = [...allChat]

    if (sysMsg !== "" && sysMsg !== prevSys) {
      res.push({ role: "system", content: sysMsg })
    }

    res.push({ role: "user", content: usrMsg })
    return res
  }, [allChat, prevSys, sysMsg, usrMsg])

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
          messages: constructMessage,
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
        setPrevSys(sysMsg)
        const reader = resp.data.body?.getReader()
        const decode = new TextDecoder("utf-8")
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
            responseRef.current += decode.decode(res.value)
            setCurrResponse(responseRef.current)
            return reader.read().then(readChunk)
          })
          .catch(e => {
            toast.error(e as string)
          })
      })()
    },
    [constructMessage, responding, sysMsg, usrMsg],
  )

  return (
    <promptContext.Provider
      value={{
        usrMsgController: [usrMsg, setUsrMsg],
        sysMsgController: [sysMsg, setSysMsg],
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
