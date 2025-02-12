export interface BaseAttribute {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export type StatusType = 'pending' | 'in_progress' | 'completed' | 'failed';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Unwrap<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  T extends (...args: any) => Promise<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = { [key: string]: any };
