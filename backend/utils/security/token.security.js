import jwt from "jsonwebtoken";
import * as DBService from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/user.model.js";

export const tokenTypeEnum = { access: "access", refresh: "refresh" };

export const generateToken = ({ payload = {}, signature, options = {} } = {}) => jwt.sign(payload, signature, options);
export const verifyToken = ({ token = "", signature } = {}) => jwt.verify(token, signature);

// Decode and load user from token
export const decodedToken = async ({ token = "", tokenType = tokenTypeEnum.access } = {}) => {
  const signature = tokenType === tokenTypeEnum.access ? process.env.ACCESS_TOKEN_USER_SIGNATURE : process.env.REFRESH_TOKEN_USER_SIGNATURE;
  const decoded = verifyToken({ token, signature });
  const user = await DBService.findById({ model: UserModel, id: decoded._id });
  if (!user) throw new Error("User not found");
  return user;
};
