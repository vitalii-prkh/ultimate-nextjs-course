export type RecordWith_id<T> = Prettify<{_id: string} & T>;

type Prettify<T> = {[K in keyof T]: T[K]} & {};
