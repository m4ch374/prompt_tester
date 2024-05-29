"use client"

import Cube from "@/icons/Cube"
import { TMessage } from "@/services/types"
import React, { useContext } from "react"
import clientContext from "../ClientContext"
import Image from "next/image"

const ChatItem: React.FC<{ response: TMessage; responding?: boolean }> = ({
  response,
  responding = false,
}) => {
  const client = useContext(clientContext)[0]

  return (
    <div className="w-full border-t border-zinc-500/40 p-2">
      <div className="flex items-center gap-2">
        {response.role === "assistant" ? (
          <Cube />
        ) : client.img_link ? (
          <Image
            src={client.img_link}
            width={40}
            height={40}
            alt="profile_pic"
            className="size-8 rounded-full"
          />
        ) : (
          <div className="size-8 rounded-full bg-white" />
        )}
        <h3 className="text-xl">
          {response.role === "assistant" ? "AI" : client.name_str}
        </h3>
      </div>
      <div className="m-4">
        {response.content
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
