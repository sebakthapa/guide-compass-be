import { badRequest } from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';

/**
 * Middleware to handle empty JSON body requests and other edge cases if any.
 *
 * @param  {Object}   request
 * @param  {Object}   response
 * @param  {Function} next
 */
export default function json(request: Request, response: Response, next: NextFunction) {
  const { body, method } = request;
  const disallowedHttpHeaders = ['PUT', 'POST', 'PATCH'];

  if (request.is('application/json') && disallowedHttpHeaders.includes(method) && isEmpty(body)) {
    throw badRequest('Empty JSON');
  }

  return next();
}
