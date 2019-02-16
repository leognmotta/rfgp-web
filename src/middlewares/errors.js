exports.catch404 = (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
};

exports.errorHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ message: message, status: status });
};
