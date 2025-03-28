import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp';
import json from './middlewares/json';
import router from './root.routes';
import logger, { logStream } from './utils/logger';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import { PUBLIC_PATH, TEMP_DIR_PATH } from './config/global.constants';
import { genericErrorHandler, methodNotAllowed } from './middlewares/errorHandler';
import './env';
import './types/request.types';
import env from './env';
import { createServer } from 'node:http';
import helmet from 'helmet';
import './config/zod.config';

export const app = express();

// Create Missing Folders
mkdirp.sync(TEMP_DIR_PATH);
mkdirp.sync(PUBLIC_PATH);

// Create Favicon
if (!fs.existsSync(path.join(PUBLIC_PATH, 'favicon.ico'))) {
  fs.writeFileSync(`${PUBLIC_PATH}/favicon.ico`, '', 'utf-8');
}
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cookieParser());

// Trust the Proxy
app.set('trust proxy', true);

app.use(express.json());
app.use(favicon(path.join(PUBLIC_PATH, 'favicon.ico')));
app.use(morgan('dev', { stream: logStream }));
app.use('/documents', express.static('data'));
app.use(json);
app.use('/api', router);

app.use(genericErrorHandler);
app.use(methodNotAllowed);

const PORT = parseInt(env.APP_PORT || '8000');
const HOST = env.APP_HOST || 'localhost';
// if (env.NODE_ENV === 'test') {
//   PORT = parseInt(env.TEST_APP_PORT || '8000');
// }

const server = createServer(app);

server.listen(PORT, HOST, () => {
  logger.info(`Server running at ${HOST}:${PORT}`);
});
