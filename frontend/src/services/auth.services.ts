import Fetcher from "@/utils/fetcher"
import { TAuth } from "./types"

export const auth = (accessCode: string, abortController?: AbortController) => {
  return Fetcher.init<TAuth>("POST", "/auth", abortController)
    .withJsonPaylad({ access_code: accessCode })
    .newFetchData()
}
