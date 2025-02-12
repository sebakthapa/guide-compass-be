import { User } from '@prisma/client';

export type AuthTokenData = Pick<User, 'email' | 'id' | 'role' | 'username' | 'fullname'>;

export type UserSignupBody = Pick<User, 'password' | 'email' | 'username'>;
export type UserLoginBody = Pick<User, 'password' | 'email'>;
