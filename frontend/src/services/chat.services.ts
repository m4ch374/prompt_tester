import Fetcher from "@/utils/fetcher"
import { TGenerateChat, TGetChats } from "./types"

export const generateChat = (
  token: string,
  body: TGenerateChat["requestType"],
) => {
  return Fetcher.init<TGenerateChat>("POST", "/chat")
    .withToken(token)
    .withJsonPaylad(body)
    .withStream()
    .newFetchData()
}

export const getChats = (token: string) => {
  return Fetcher.init<TGetChats>("GET", "/chat").withToken(token).newFetchData()
}
