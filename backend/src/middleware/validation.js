import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = {};
  errors.array().forEach((err) => {
    if (!formatted[err.path]) {
      formatted[err.path] = err.msg;
    }
  });
  return res.status(400).json({ errors: formatted });
};
