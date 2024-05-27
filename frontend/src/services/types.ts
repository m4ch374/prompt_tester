export type TEndpoint<Req, Res> = {
  requestType: Req
  responseType: Res
}

export type TAuth = TEndpoint<{ access_code: string }, { access_token: string }>
