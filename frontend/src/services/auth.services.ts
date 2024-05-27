import Fetcher from "@/utils/fetcher"
import { TAuth } from "./types"

export const auth = (accessCode: string, abortController?: AbortController) => {
  return Fetcher.init<TAuth>("GET", "/auth", abortController)
    .withParams({ access_code: accessCode })
    .newFetchData()
}
