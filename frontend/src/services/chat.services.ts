import Fetcher from "@/utils/fetcher"
import { TGenerateChat, TGetChats, TGetSettings, TRemoveChat } from "./types"

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

export const removeChat = (token: string, body: TRemoveChat["requestType"]) => {
  return Fetcher.init<TRemoveChat>("DELETE", "/chat")
    .withToken(token)
    .withJsonPaylad(body)
    .newFetchData()
}

export const getChatSettings = (
  token: string,
  body: TGetSettings["requestType"],
) => {
  return Fetcher.init<TGetSettings>("GET", "/chat/settings")
    .withToken(token)
    .withParams(body)
    .newFetchData()
}
