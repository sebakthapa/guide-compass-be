import HttpStatus from 'http-status-codes';
import { isEmpty } from 'lodash';
import logger from './logger';
import { Prisma } from '@prisma/client';

/**
 * Build error response for validation errors.
 *
 * @param   {Error} err
 * @returns {Object}
 */

export interface ResponseError {
  isJoi: boolean;
  isBoom: boolean;
  output: { statusCode: number; payload: { message: string; error: string } };
  detail: string;
  message: string;
  details: { message: string; path: string[] }[];
  name: string;
  column: string;
  code: number;
  status: number;
  stack: string;
  longMessage: string;
  clerkError: boolean;
}

export function buildError(err: ResponseError) {
  // JWT ERRORS
  // eslint-disable-next-line no-constant-condition
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    return {
      code: HttpStatus.UNAUTHORIZED,
      message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
    };
  }

  // DB ERRORS
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma duplicate key error
    return handleDbError(err.code, err);
  }

  // Validation errors
  if (err.isJoi) {
    return {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      details:
        err.details &&
        err.details.map((err) => {
          return {
            message: err.message,
            param: err.path.join('.'),
          };
        }),
    };
  }

  // HTTP errors
  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message || err.output.payload.error,
    };
  }

  if (err.clerkError) {
    return {
      code: err.status,
      // @ts-ignore
      message: err.errors[0].longMessage,
    };
  }

  const outError = err.detail || err.message;
  const alreadyExistError = outError ? outError.match(/(already exists)/gi) : [];

  // Return INTERNAL_SERVER_ERROR for all other cases
  logger.error('Unidentified Error: ', err);

  try {
    if (JSON.parse(err.message).provider) {
      return {
        code: 400,
        message: 'Something went wrong. Please try again shortly.',
      };
    }
  } catch (error) {
    //
  }

  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: isEmpty(alreadyExistError)
      ? 'Invalid request. Please refresh the page and try again. (already exist)'
      : outError,
  };
}

function handleDbError(code: string, err: Prisma.PrismaClientKnownRequestError) {
  // The meta field contains a target with the fields that violated the unique constraint
  if (code === 'P2002') {
    const target = err.meta?.target;
    const fields = Array.isArray(target) ? target.join(', ') : target;
    const message = `Unique constraint failed on the field(s): ${fields}`;

    return {
      code: HttpStatus.CONFLICT, // HTTP 409 Conflict
      message,
    };
  } else {
    // Add more Prisma-specific error handling if needed
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
    };
  }
}
