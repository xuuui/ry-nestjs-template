import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { DictEntity } from '@/entities/sys/dict.entity'

export class DictModel extends DictEntity {
  @NestedValidator(DictModel, {
    optional: true,
    each: true,
  })
  items?: DictModel[]
}
