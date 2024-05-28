import { Dispatch, SetStateAction, createContext } from "react"

type TButtonMode = "NO_HOVER" | "SELECTED" | "HOVERING"

export type THover = { [key: string]: TButtonMode }

const hoverContext = createContext<[THover, Dispatch<SetStateAction<THover>>]>([
  {},
  () => {},
])

export default hoverContext
