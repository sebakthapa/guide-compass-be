import Joi from 'joi';

export const isEmail = (identifier: string) => {
  const { error } = Joi.string().email().validate(identifier);

  return !error;
};
