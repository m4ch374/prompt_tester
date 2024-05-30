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

export type TMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export type TGenerateChatRequest = {
  conversation_id: number
  system_message: TMessage
  user_message: TMessage
  model?:
    | "gemma-7b-it"
    | "llama3-70b-8192"
    | "llama3-8b-8192"
    | "mixtral-8x7b-32768"
  temperature?: number
  max_tokens?: number
  top_p?: number
  seed?: number
  stream: boolean
}

export type TGenerateChat = TEndpoint<TGenerateChatRequest, Response>

export type TConversation = {
  id: number
  messages: TMessage[]
}

type TGetChatsResponse = {
  conversations: TConversation[]
}

export type TGetChats = TEndpoint<void, TGetChatsResponse>

export type TRemoveChat = TEndpoint<{ conversation_id: number }, void>
