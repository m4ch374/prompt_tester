import useHoverClick from "@/utils/hooks/UseHoverClick.hook"
import { createContext } from "react"

type THoverClick = ReturnType<typeof useHoverClick>

const hoverContext = createContext<THoverClick>({
  addKey: () => {},
  isSelfHover: () => false,
  removeKey: () => {},
})

export default hoverContext
