import { User } from '@prisma/client';
import { AnyObject } from '.';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      decoded?: Omit<User, 'password'>;
      files?: { images: [] };
      images?: [];
      uploadDir?: string;
      file: object;
      rateLimitData?: AnyObject;
      allowGuest?: true;
      email?: string;
    }
  }
}
