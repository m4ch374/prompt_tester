import { TConversation, TMessage } from "@/services/types"
import { Dispatch, SetStateAction, createContext } from "react"

const promptContext = createContext<{
  sysMsgController: [string, Dispatch<SetStateAction<string>>]
  usrMsgController: [string, Dispatch<SetStateAction<string>>]
  allChat: TMessage[]
  conversationsController: [
    TConversation[],
    Dispatch<SetStateAction<TConversation[]>>,
  ]
  currConversationController: [number, Dispatch<SetStateAction<number>>]
  currResponse: string
  responding: boolean
}>({
  sysMsgController: ["", () => {}],
  usrMsgController: ["", () => {}],
  allChat: [],
  conversationsController: [[], () => {}],
  currConversationController: [0, () => {}],
  currResponse: "",
  responding: false,
})

export default promptContext
