import { isFunction, isNull, isObject, isUndefined } from 'lodash'

const { toString } = Object.prototype

export function is(
  val: unknown,
  type:
    | 'Date'
    | 'RegExp'
    | 'Error'
    | 'Function'
    | 'String'
    | 'Number'
    | 'Boolean'
    | 'Undefined'
    | 'Null'
    | 'Object'
    | 'Array'
    | 'Symbol'
    | 'Promise',
): boolean {
  return toString.call(val) === `[object ${type}]`
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val)
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction((val as Recordable).then) &&
    isFunction((val as Recordable).catch)
  )
}
