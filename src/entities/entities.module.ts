import { loadEntities } from '@/utils/typeorm'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

const entities = loadEntities(__dirname)

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule.forFeature(entities)],
})
export class EntitiesModule {}
