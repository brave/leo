export type StringWithAutoComplete<T> = T | (string & Record<never, never>)
