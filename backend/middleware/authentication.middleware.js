import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js";
import { asyncHandler } from "../utils/response.js";

// Authentication: verify token and attach req.user
export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("Authorization token missing", { cause: 401 }));
    }

    const token = authHeader.split(" ")[1];

    try {
      req.user = await decodedToken({ token, tokenType });
      return next();
    } catch (err) {
      return next(new Error("Invalid token or expired", { cause: 401 }));
    }
  });
};

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new Error("User not authenticated", { cause: 401 }));
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }
    return next();
  });
};

/**
 * Combined auth middleware
 * للتحقق من authentication + authorization في middleware واحد
 */
export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("Authorization token missing", { cause: 401 }));
    }

    const token = authHeader.split(" ")[1];

    try {
      req.user = await decodedToken({ token });
    } catch (err) {
      return next(new Error("Invalid token or expired", { cause: 401 }));
    }

    if (accessRoles.length && !accessRoles.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }

    return next();
  });
};
