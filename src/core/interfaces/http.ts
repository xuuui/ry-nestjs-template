export interface HttpResponse {
  code: number
  result?: Record<string, any>
  status: string | boolean
  message: string
}

export type ExceptionOption =
  | string
  | {
      message: string
      error?: any
    }
