import express from "express";
import {
  getAllItemByOrg,
  addItemToCart,
  deleteCart,
  deleteItemFromCart,
} from "../controllers/orgCart.controller.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { orgCartValidation } from "../validation/orgCart.validation.js";

const router = express.Router();

// 📦 Get all items in organizer's cart
router.get(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  getAllItemByOrg
);

// ➕ Add item (venue or event) to cart
router.post(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.create),
  addItemToCart
);

// 🗑 Delete entire cart
router.delete(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  deleteCart
);

// ➖ Delete one item from cart
router.delete(
  "/item",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(orgCartValidation.deleteItemInCart),
  deleteItemFromCart
);

export default router;
