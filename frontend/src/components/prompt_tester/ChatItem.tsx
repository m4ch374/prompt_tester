import React, { useEffect } from "react"

const ChatItem: React.FC<{ response: string }> = ({ response }) => {
  useEffect(() => {
    console.log(response.split("\n"))
  }, [response])

  return (
    <div className="border-t border-zinc-500/40 p-2">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-white" />
        <h3 className="text-xl">AI</h3>
      </div>
      <div className="m-4">
        {response
          .split("\n")
          .map((s, i) =>
            s ? <p key={i}>{s}</p> : i ? <br key={i} /> : undefined,
          )}
      </div>
    </div>
  )
}

export default ChatItem
