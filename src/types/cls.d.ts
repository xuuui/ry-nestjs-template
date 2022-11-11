import { IAuthInfo } from '@/common/interfaces/sys.interface'

declare module 'nestjs-cls' {
  interface ClsStore {
    authInfo: IAuthInfo
  }
}
