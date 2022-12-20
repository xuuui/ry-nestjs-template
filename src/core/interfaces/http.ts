export interface HttpResponse {
  code: number
  result?: Recordable
  status: string | boolean
  message: string
}

export type ExceptionOption =
  | string
  | {
      message: string
      error?: any
    }
