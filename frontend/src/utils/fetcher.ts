import { TEndpoint } from "@/services/types"

type Method = "GET" | "POST" | "PUT" | "DELETE"

type ErrorResponse = {
  detail?: { reason: string }
  error?: string
}

// Thy type any is very much needed in this case
/* eslint-disable @typescript-eslint/no-explicit-any */

// Create the Fetcher class which acts as a wrapper around fetch() calls
// with some conveniances for fetching data from the backend API
class Fetcher<T extends TEndpoint<any, any>> {
  private baseURL = process.env.NEXT_PUBLIC_BACKEND as string

  private requestConf: RequestInit | undefined

  private stream: boolean | undefined

  private constructor(method: Method, abortController?: AbortController) {
    this.requestConf = { method }

    this.requestConf.signal = abortController?.signal

    this.stream = false

    if (method != "GET") {
      this.requestConf = {
        ...this.requestConf,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    }

    return this
  }

  // Create Fetcher instance, intialising API route to call and HTTP request method
  static init<T extends TEndpoint<any, any> = TEndpoint<void, void>>(
    method: Method,
    endpoint: string,
    abortController?: AbortController,
  ) {
    const fetcher = new Fetcher<T>(method, abortController)
    fetcher.baseURL += endpoint

    return fetcher
  }

  // Add a payload to the request body as a stringified JSON object
  withJsonPaylad(payload: T["requestType"]) {
    this.requestConf = {
      ...this.requestConf,
      body: JSON.stringify(payload),
    }
    return this
  }

  // Add search params to the request URI
  withParams(params: T["requestType"]) {
    this.baseURL += "?" + new URLSearchParams(params).toString()
    return this
  }

  // Add a token to request headers
  withToken(token: string) {
    this.requestConf = {
      ...this.requestConf,
      headers: {
        ...this.requestConf?.headers,
        Authorization: `Bearer ${token}`,
      },
    }
    return this
  }

  withStream() {
    this.stream = true
    return this
  }

  // Add currently logged in user's token to request headers
  withCurrentToken() {
    return this.withToken(localStorage.getItem("token")!)
  }

  fetchPromise(): Promise<T["requestType"]> {
    return fetch(this.baseURL, this.requestConf)
  }

  // Call the API, returning a representation of the request outcome,
  // response data and an error message if an error occured.
  async newFetchData(): Promise<{
    ok: boolean
    status: number
    data: T["responseType"]
    error: string
  }> {
    try {
      const res = await fetch(this.baseURL, this.requestConf)
      if (!res.ok) {
        const errObj = (await res.json()) as ErrorResponse
        return {
          ok: false,
          data: null,
          status: res.status,
          error:
            errObj.detail?.reason ||
            (errObj?.detail as unknown as string) ||
            errObj.error!,
        }
      }

      const resObj = this.stream
        ? res
        : ((await res.json()) as T["responseType"])
      return {
        ok: true,
        status: res.status,
        data: resObj,
        error: "",
      }
    } catch (e) {
      console.log(e)
      return {
        ok: false,
        data: null,
        status: 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        error: (e as any).toString(),
      }
    }
  }
}

export default Fetcher
