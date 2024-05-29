"use client" // too lazy

import Send from "@/icons/Send"
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
import ChatItem from "./ChatItem"
import { TMessage } from "@/services/types"

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
  }, [allChat])

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
    <form className="flex size-full justify-stretch" onSubmit={formSubmit}>
      <div className="flex h-full flex-col border-r border-zinc-500/40 bg-black text-zinc-200 hover:bg-zinc-900">
        <label className="m-2">System Message</label>
        <textarea
          className="flex-1 resize-none bg-transparent p-2 text-zinc-400 outline-none"
          placeholder="Enter message"
          value={sysMsg}
          onChange={e => setSysMsg(e.target.value)}
        />
      </div>
      <div className="flex flex-[2] flex-col justify-end border-r border-zinc-500/40">
        <div
          className="grid items-end overflow-auto"
          ref={responseContainerRef}
        >
          {allChat
            .filter(s => s.role !== "system")
            .map((s, i) => (
              <ChatItem key={i} response={s.content} />
            ))}
          {responding && <ChatItem response={currResponse} responding={true} />}
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
      </div>
      <div className="flex-1">
        <h1 className="m-2">Settings</h1>
      </div>
    </form>
  )
}

export default PromptTesterForm
