import { BaseService } from '@/common/base/base.service'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'
import { UserEntity } from '@/entities/sys/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UserModel } from '@/models/sys/user.model'

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(UserEntity, dataSource)
  }

  @Transaction()
  async createOne(createUserDto: CreateUserDto): Promise<UserModel> {
    const manager = useTransaction()
    return manager.save(UserEntity, createUserDto)
  }

  @Transaction()
  async updateOne(updateUserDto: UpdateUserDto): Promise<boolean> {
    const manager = useTransaction()
    const { id, ...updateUser } = updateUserDto
    await manager.findOneByOrFail(UserEntity, { id })
    await manager.update(UserEntity, id, updateUser)
    return true
  }
}
