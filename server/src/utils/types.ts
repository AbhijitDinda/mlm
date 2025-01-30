/**
 * make K optional
 */
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * make K required
 */
export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * model select object for db query
 */
export type ModelFind<T> = Partial<T>;

/**
 * model select object for db query
 */
export type ModelMatch<T> = Partial<Record<keyof T, any>>;

/**
 * model select object for db query
 */
export type ModelSelect<T, K = {}> = Partial<Record<keyof T, 0 | 1>> &
  Partial<Record<keyof K, 0 | 1 | "string">>;

/**
 * get model functions
 */
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * get not functions properties
 */
type NonFunctionProperties<T> = Omit<T, FunctionPropertyNames<T>>;

/**
 * create model interface for insert
 */
export type ModelInsert<
  T,
  O extends Exclude<keyof T, FunctionPropertyNames<T>> = never,
  K extends keyof T = never
> = Omit<PartiallyOptional<NonFunctionProperties<T>, O>, K>;

export type ModelColumn<T> = `${Extract<keyof T, string>}`;
export type _ModelColumn<T> = `$${Extract<keyof T, string>}`;
