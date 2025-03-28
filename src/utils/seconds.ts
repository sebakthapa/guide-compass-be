import ms, { StringValue } from 'ms';

export const sec = (value: StringValue) => {
  return ms(value) / 60;
};
