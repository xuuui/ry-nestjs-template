import { Request, Response } from 'express'
import { EAccountType, EOpertateType } from '../enums/sys'

export type TreeItem = {
  parentId: string
  id: string
  children?: TreeItem[]
} & Recordable

export interface AuthInfo {
  accountId: string
  accountType: EAccountType
  userId: string
  username: string
}

export interface HttpLogInfo {
  clientIp: string
  reqId: string
  token: string
  req: {
    statusCode: number
    method: string
    path: string
    params: Recordable
    query: Recordable
    body: Recordable
  }
}

export interface Captcha {
  data: any
  text: string
}

export interface OperateLogOptions {
  type: EOpertateType
  desc?: string | ((req: Request, res: Response) => string)
}
