import Fetcher from "@/utils/fetcher"
import { TGetProfile } from "./types"

export const getProfile = (token: string) => {
  return Fetcher.init<TGetProfile>("GET", "/profile")
    .withToken(token)
    .newFetchData()
}
