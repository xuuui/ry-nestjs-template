import { Request, Response } from 'express'
import { Routes } from '@nestjs/core'
import { Type } from '@nestjs/common'
import { EAccountType, EOpertateType } from '../enums/sys.enum'

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

export interface RouteMetadata {
  path: string
  children?: Routes | Type<any>[] | string[]
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
