import { TChatModel, TConversation } from "@/services/types"
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
  temperatureController: [number, Dispatch<SetStateAction<number>>]
  maxTokenController: [number, Dispatch<SetStateAction<number>>]
  topPController: [number, Dispatch<SetStateAction<number>>]
  modelController: [TChatModel, Dispatch<SetStateAction<TChatModel>>]
  seedController: [
    number | undefined,
    Dispatch<SetStateAction<number | undefined>>,
  ]
}>({
  sysMsgController: ["", () => {}],
  usrMsgController: ["", () => {}],
  conversationsController: [[], () => {}],
  currConversationController: [0, () => {}],
  loadingConversation: [true, () => {}],
  currResponse: "",
  responding: false,
  temperatureController: [1, () => {}],
  maxTokenController: [1024, () => {}],
  topPController: [1, () => {}],
  modelController: ["llama3-8b-8192", () => {}],
  seedController: [undefined, () => {}],
})

export default promptContext
