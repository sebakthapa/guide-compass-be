import { UserRole } from '@prisma/client';

export const USER_PROFILE_IMAGE_FOLDER = 'profiles';
export const USER_ROLES: UserRole[] = ['ADMIN', 'GUIDE', 'USER'];
export const FE_CONTROLLED_USER_ROLES = ['GUIDE', 'USER'] as const;
