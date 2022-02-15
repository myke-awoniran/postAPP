exports.errHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  res.status(statusCode).json({
    status: `${err.statusCode}`.startsWith('4') ? 'fail' : 'error',
    message,
  });
};
