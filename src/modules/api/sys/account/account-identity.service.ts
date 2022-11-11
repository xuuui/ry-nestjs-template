import { BaseService } from '@/common/base/base.service'
import { AccountIdentityEntity } from '@/entities/sys/account-identity.entity'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class AccountIdentityService extends BaseService<AccountIdentityEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(AccountIdentityEntity, dataSource)
  }
}
