import React from "react"
import ConversationTopic from "./ConversationTopic"

const Conversations: React.FC = () => {
  return (
    <div className="flex-1">
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
      <ConversationTopic />
    </div>
  )
}

export default Conversations
