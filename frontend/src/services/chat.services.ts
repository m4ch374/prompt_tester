import Fetcher from "@/utils/fetcher"
import { TGenerateChat } from "./types"

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
