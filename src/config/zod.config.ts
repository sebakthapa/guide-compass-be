import { z } from 'zod';

// Set the global error map
z.setErrorMap((error, ctx) => {
  if (error.code === 'invalid_type' && error.received === 'undefined') {
    return { message: `${error.path.at(-1)} is required.` };
  }

  return { message: ctx.defaultError }; // Default error message for other cases
});
