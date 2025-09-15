import express from "express";
import {
  getAllItemByOrg,
  addItemToCart,
  deleteCart,
  deleteItemFromCart,
} from "../controllers/orgCart.controller.js";
import {
  authentication,
  authorization,
} from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { orgCartValidation } from "../validation/orgCart.validation.js";
const router = express.Router();

router.get(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.getByOrgId),
  getAllItemByOrg
);
router.post(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.create),
  addItemToCart
);
router.delete(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.deleteCart),
  deleteCart
);
router.delete(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.deleteItemInCart),
  deleteItemFromCart
);

export default router;
