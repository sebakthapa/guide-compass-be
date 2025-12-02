import * as childProcess from 'child_process';
import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import { mkdirpSync } from 'mkdirp';
import { PUBLIC_PATH } from '../config/global.constants';
import { badRequest } from '@hapi/boom';

export const uploadFile = (uploadType = 'image', multiples = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = formidable({
        uploadDir: `${PUBLIC_PATH}/temp/${Date.now()}`,
        multiples,
        filter: ({ mimetype }) => {
          let allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (uploadType === 'pdf') {
            allowedMimeTypes = ['application/pdf'];
          } else if (uploadType === 'json') {
            allowedMimeTypes = ['application/json'];
          }

          if (!mimetype || !allowedMimeTypes.includes(mimetype)) {
            throw badRequest(`Invalid file type received. Supported types: ${allowedMimeTypes.join(', ')}`);
          }

          return (mimetype && allowedMimeTypes.includes(mimetype)) || false;
        },
      });

      // @ts-ignore
      mkdirpSync(form.uploadDir); // CREATE FOLDER IF IT DOESNOT EXIST

      form.parse(req, (err, fields, files) => {
        if (err) {
          // @ts-ignore
          childProcess.exec(`rmdir /s /q ${form.uploadDir}`);

          return next(err);
        }

        const filesKey = Object.keys(files);
        for (let i = 0; i < filesKey.length; i++) {
          // @ts-ignore
          req[`${filesKey[i]}`] = changeToArray(files[filesKey[i]]);
        }
        req.body = fields;
        // @ts-ignore
        req.uploadDir = form.uploadDir;

        next();
      });
    } catch (err) {
      return next(err);
    }
  };
};

const changeToArray = (data: formidable.File | formidable.File[]) => {
  if (!Array.isArray(data)) {
    if (!data) {
      return [];
    } else {
      return [data];
    }
  }

  return data;
};
