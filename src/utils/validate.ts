import { Schema } from 'joi';
import { z } from 'zod';

export const validate = <T>(data: T, schema: Schema) => {
  const { value, error } = schema.validate(data);
  if (error) {
    return Promise.reject(error);
  } else {
    return Promise.resolve(value);
  }
};
export const validateZod = <T>(data: T, schema: z.Schema<T>) => {
  const { success, data: parsedData, error } = schema.safeParse(data);
  if (!success) {
    return Promise.reject(error);
  } else {
    return Promise.resolve(parsedData);
  }
};
