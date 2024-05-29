export type TEndpoint<Req, Res> = {
  requestType: Req
  responseType: Res
}

export type TAuth = TEndpoint<{ access_code: string }, { access_token: string }>

type TGetProfileResponse = {
  first_name: string
  last_name: string
  profile_link: string
}

export type TGetProfile = TEndpoint<void, TGetProfileResponse>

export type TGenerateChat = TEndpoint<void, Response>
