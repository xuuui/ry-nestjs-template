import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

const services = []

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [...services],
  exports: [...services],
})
export class EventModule {}
