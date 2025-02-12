import path from 'path';
import env from '../env';

export const PUBLIC_PATH = path.join(`${env.ROOT_PATH}`, `${env.PUBLIC_PATH}`);
export const TEMP_DIR_PATH = env.TEMP_DIR!;
export const TABLE = {} as const;
