import { loadEntities } from '@/utils/typeorm'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

const entities = loadEntities(__dirname)

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule.forFeature(entities)],
})
export class EntitiesModule {}
