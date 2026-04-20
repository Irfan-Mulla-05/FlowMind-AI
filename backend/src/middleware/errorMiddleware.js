export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Server error",
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
};
