"use client"

import React, { useContext } from "react"
import promptContext from "./PromptContext"

const SystemTextBox: React.FC = () => {
  const [sysMsg, setSysMsg] = useContext(promptContext).sysMsgController

  return (
    <div className="flex flex-1 flex-col border-t border-zinc-500/40 bg-black text-zinc-200 hover:bg-zinc-900">
      <label className="m-2">System Prompt</label>
      <textarea
        className="flex-1 resize-none bg-transparent p-2 text-zinc-400 outline-none"
        placeholder="Enter message"
        value={sysMsg}
        onChange={e => setSysMsg(e.target.value)}
      />
    </div>
  )
}

export default SystemTextBox
