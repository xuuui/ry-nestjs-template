import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { NumericValidator } from '@/common/decorators/class-validator/numeric.decorator'
import { DictEntity } from '@/entities/sys/dict.entity'
import { OmitType } from '@nestjs/swagger'

export class DictModel extends OmitType(DictEntity, ['value']) {
  @NumericValidator()
  value: number | string

  @NestedValidator(DictModel, {
    optional: true,
    each: true,
  })
  items?: DictModel[]
}
