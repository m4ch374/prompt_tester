import { TMessage } from "@/services/types"
import { Dispatch, SetStateAction, createContext } from "react"

const promptContext = createContext<{
  sysMsgController: [string, Dispatch<SetStateAction<string>>]
  usrMsgController: [string, Dispatch<SetStateAction<string>>]
  allChat: TMessage[]
  currResponse: string
  responding: boolean
}>({
  sysMsgController: ["", () => {}],
  usrMsgController: ["", () => {}],
  allChat: [],
  currResponse: "",
  responding: false,
})

export default promptContext
