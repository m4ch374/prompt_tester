import { TConversation } from "@/services/types"
import { Dispatch, SetStateAction, createContext } from "react"

const promptContext = createContext<{
  sysMsgController: [string, Dispatch<SetStateAction<string>>]
  usrMsgController: [string, Dispatch<SetStateAction<string>>]
  conversationsController: [
    TConversation[],
    Dispatch<SetStateAction<TConversation[]>>,
  ]
  currConversationController: [number, Dispatch<SetStateAction<number>>]
  loadingConversation: [boolean, Dispatch<SetStateAction<boolean>>]
  currResponse: string
  responding: boolean
}>({
  sysMsgController: ["", () => {}],
  usrMsgController: ["", () => {}],
  conversationsController: [[], () => {}],
  currConversationController: [0, () => {}],
  loadingConversation: [true, () => {}],
  currResponse: "",
  responding: false,
})

export default promptContext
