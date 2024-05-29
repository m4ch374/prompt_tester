import { Dispatch, SetStateAction, createContext } from "react"

export type TClientInfo = {
  img_link: string
  name_str: string
}

const clientContext = createContext<
  [TClientInfo, Dispatch<SetStateAction<TClientInfo>>]
>([
  {
    img_link: "",
    name_str: "",
  },
  () => {},
])

export default clientContext
