import Fetcher from "@/utils/fetcher"
import { TGenerateChat } from "./types"

export const generateChat = (token: string) => {
  return Fetcher.init<TGenerateChat>("POST", "/chat")
    .withToken(token)
    .withStream()
    .newFetchData()
}
