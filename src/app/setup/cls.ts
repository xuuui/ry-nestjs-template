import { ClsModule } from 'nestjs-cls'

export function setupCls() {
  return ClsModule.forRoot({
    global: true,
  })
}
