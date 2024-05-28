"use server"

import { cookies } from "next/headers"

export const getCookie = (field: string): string => {
  const cookieStore = cookies()
  return cookieStore.get(field)?.value || ""
}

export const setCookie = (field: string, value: string) => {
  const cookieStore = cookies()
  cookieStore.set(field, value)
}

export const deleteCookie = (field: string) => {
  const cookieStore = cookies()
  cookieStore.delete(field)
}
