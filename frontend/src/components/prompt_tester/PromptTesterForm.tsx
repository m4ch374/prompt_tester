"use client" // too lazy

import Send from "@/icons/Send"
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
import ChatItem from "./ChatItem"

const PromptTesterForm: React.FC = () => {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [textheight, setTextheight] = useState("")

  const [currResponse, setCurrResponse] = useState("")

  const dialogBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    textRef.current.style.height = "auto"
    textRef.current.style.height = textRef.current.scrollHeight + 30 + "px"
  }, [textheight])

  const formSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    ;(async () => {
      const token = await (getCookie("auth_key") as unknown as Promise<string>)
      const resp = await generateChat(token)

      if (!resp.ok) {
        toast.error(resp.error)
        return
      }

      // I died
      const reader = resp.data.body?.getReader()
      const decode = new TextDecoder("utf-8")
      reader
        ?.read()
        .then(function readChunk(
          res: ReadableStreamReadResult<Uint8Array>,
        ): Promise<void> | void {
          if (res.done) return
          console.log(res.value)
          setCurrResponse(s => s + decode.decode(res.value))
          return reader.read().then(readChunk)
        })
        .catch(e => {
          toast.error(e as string)
        })
    })()
  }, [])

  useEffect(() => {
    console.log(dialogBoxRef.current?.clientHeight || 0)
  }, [])

  return (
    <form className="flex size-full justify-stretch" onSubmit={formSubmit}>
      <div className="flex h-full flex-col border-r border-zinc-500/40 bg-black text-zinc-200 hover:bg-zinc-900">
        <label className="m-2">System Message</label>
        <textarea
          className="flex-1 resize-none bg-transparent p-2 text-zinc-400 outline-none"
          placeholder="Enter message"
        />
      </div>
      <div className="flex flex-[2] flex-col justify-between border-r border-zinc-500/40">
        <div className="grid h-full items-end overflow-auto">
          <ChatItem response={currResponse} />
          {/* <ChatItem response={currResponse} /> */}
        </div>
        <div className="flex flex-col" ref={dialogBoxRef}>
          <hr className="h-px border-0 bg-zinc-500/40" />
          <div className="relative m-4 flex flex-col rounded-md border border-zinc-600 focus:border-zinc-400">
            <textarea
              ref={textRef}
              className="size-full max-h-[15lh] resize-none rounded-[inherit] bg-transparent p-4 outline-none"
              placeholder="Enter message"
              value={textheight}
              onChange={e => setTextheight(e.target.value)}
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
