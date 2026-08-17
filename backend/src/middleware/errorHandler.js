// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message || err);
  if (res.headersSent) return;
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ errors: { server: message } });
};
