// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`Error ${statusCode}: ${err.message}`);
  
  // Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : '🥞',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  });
};

module.exports = {
  notFound,
  errorHandler,
};