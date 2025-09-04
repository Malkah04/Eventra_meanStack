import { roleEnum } from "../DB/models/user.model.js";
import { profile } from "../controllers/user.controller.js";

export const endPoint={
 profile: [roleEnum.user]
}