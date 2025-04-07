import { z } from 'zod';

export const ESEWA_SUCCESS_SCHEMA = z.object({
  token: z.string(),
});
