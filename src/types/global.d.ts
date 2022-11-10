declare type Nullable<T> = T | null
declare type Recordable<T = any> = Record<string, T>
declare type Mapable<T = any> = Map<string, T>
declare type Indexable<T = any> = {
  [key: string]: T
}
