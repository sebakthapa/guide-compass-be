import { Storage, TransferManager, UploadOptions } from '@google-cloud/storage';
import path from 'path';
import {
  GCLOUD_BASE_FOLDER,
  GCLOUD_BUCKET_NAME,
  GCLOUD_INTERMEDIATE_FOLDERS,
  GCLOUD_KEY_FILE_PATH,
  GCLOUD_PUBLIC_URL_BASE,
} from '../config/gcloud.config';
import { DeleteOptions } from '@google-cloud/storage/build/cjs/src/nodejs-common/service-object';

export const getStorage = () => {
  return new Storage({
    keyFilename: path.join(GCLOUD_KEY_FILE_PATH),
  });
};

export const resolveGcloudDestPath = (
  intermediateFolder: keyof typeof GCLOUD_INTERMEDIATE_FOLDERS,
  filename: string
) => {
  return `${GCLOUD_BASE_FOLDER}/${GCLOUD_INTERMEDIATE_FOLDERS[intermediateFolder]}/${filename}`;
};

export const getPathFromPublicUrl = (publicUrl: string) => {
  return decodeURIComponent(publicUrl).replace(GCLOUD_PUBLIC_URL_BASE + '/', '');
};

export const getBucket = () => getStorage().bucket(GCLOUD_BUCKET_NAME);
export const bucket = getBucket();

export const uploadToBucket = (localpath: string, options?: UploadOptions) => {
  const bucket = getBucket();

  return bucket.upload(localpath, options);
};
export const deleteFromBucket = (localpath: string, options?: DeleteOptions) => {
  const bucket = getBucket();

  return bucket.file(localpath).delete(options);
};

export const batchUploadToBucket = (folderPath: string) => {
  const bucket = getBucket();
  const transferManager = new TransferManager(bucket);

  return transferManager.uploadManyFiles(folderPath, { skipIfExists: true });
};

export const getAllFilenames = async (path: string, filterExt?: string) => {
  const bucket = getBucket();
  const [gcFiles] = await bucket.getFiles({ prefix: path });

  const filteredFileNames: string[] = [];
  gcFiles.forEach((file) => {
    if (!filterExt) {
      filteredFileNames.push(file.name);
    } else {
      if (file.name.endsWith(filterExt)) {
        filteredFileNames.push(file.name);
      }
    }
  });

  return filteredFileNames;
};

export const uploadFileStream = (data: string, filepath: string) => {
  // upload json to google cloud

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<{ success: boolean; error: any }>((resolve, reject) => {
    const responseStream = getBucket()
      .file(`${path.dirname(filepath)}/json_data.json`)
      .createWriteStream();

    responseStream.on('error', (err) => {
      reject({ error: err, success: false });
    });

    responseStream.on('finish', () => {
      resolve({ success: true, error: null });
    });

    responseStream.end(data);
  });
};

export const downloadFile = async (pathInGC: string, destination?: string) => {
  const bucket = getBucket();
  const file = bucket.file(pathInGC);
  await file.download({ destination: destination });

  return destination;
};

export const copyFile = (sourceFilePath: string, destinationFilePath: string) => {
  const bucket = getBucket();

  return bucket.file(sourceFilePath).copy(destinationFilePath);
};

export const readFileContents = async (filePath: string) => {
  const [data] = await getBucket().file(filePath).download();

  return data.toString();
};
export const readFileBuffer = async (filePath: string) => {
  const [data] = await getBucket().file(filePath).download();

  return data;
};
