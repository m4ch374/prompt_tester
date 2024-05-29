import React from "react"

const ChatItem: React.FC<{ response: string; responding?: boolean }> = ({
  response,
  responding = false,
}) => {
  return (
    <div className="w-full border-t border-zinc-500/40 p-2">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-white" />
        <h3 className="text-xl">AI</h3>
      </div>
      <div className="m-4">
        {response
          .split("\n")
          .map((s, i) =>
            s ? <p key={i}>{s}</p> : i !== 0 ? <br key={i} /> : undefined,
          )}

        {responding && (
          <span className="inline animate-pulse bg-zinc-200 text-zinc-200">
            ..
          </span>
        )}
      </div>
    </div>
  )
}

export default ChatItem
