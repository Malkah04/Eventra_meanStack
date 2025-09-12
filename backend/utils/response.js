export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  // لو جاي من Joi Validation
  if (error.isJoi) {
    return res.status(400).json({
      message: "Validation Error",
      details: error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      })),
    });
  }

  // لو جاي من الـ validation middleware اللي انت كاتبه
  if (error.errors && Array.isArray(error.errors)) {
    return res.status(400).json({
      message: "Validation Error",
      details: error.errors.flatMap((e) =>
        e.details.map((d) => ({
          key: e.key,
          field: d.path,
          message: d.message,
        }))
      ),
    });
  }

  // باقي الأخطاء العامة
  return res.status(error.cause || 400).json({
    err_message: error.message,
    stack: process.env.MOOD === "DEV" ? error.stack : undefined,
  });
};



export const successResponse = ({ res, message = "Done", status = 200, data = {} }) => res.status(status).json({ message, data });
