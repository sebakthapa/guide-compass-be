/* eslint-disable linebreak-style */
import path from 'path';
import env from '../env';

export const GCLOUD_BUCKET_NAME = 'chitrakala-4f296.appspot.com';
export const GCLOUD_BASE_FOLDER = 'guide_compass';
export const GCLOUD_PUBLIC_URL_BASE = `https://storage.googleapis.com/${GCLOUD_BUCKET_NAME}`;
export const GCLOUD_KEY_FILE_PATH = path.join(env.ROOT_PATH, 'keys/gcp.keys.json');

export const GCLOUD_INTERMEDIATE_FOLDERS = {
  package: 'packages',
  profile: 'profiles',
  guideDocument: 'guide_documents',
} as const;
