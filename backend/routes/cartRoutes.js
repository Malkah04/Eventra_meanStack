import { Router } from "express";
import * as cartController from "../controllers/cartControllers.js";
import { authentication } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/cart.validation.js";

const router = Router();

// ➕ Add to cart
router.post(
  "/add",
  authentication(),
  validation(validators.addToCart),
  cartController.addToCart
);

// ➖ Remove item from cart
router.delete(
  "/remove",
  authentication(),
  validation(validators.removeFromCart),
  cartController.removeFromCart
);

// ✏️ Update quantity
router.put(
  "/update",
  authentication(),
  validation(validators.updateQuantity),
  cartController.updateQuantity
);

// 🗑 Empty cart
router.delete(
  "/empty",
  authentication(),
  cartController.emptyCart
);

// 📦 Get user cart
router.get(
  "/",
  authentication(),
  cartController.getCart
);

// 💳 Checkout
router.post(
  "/checkout",
  authentication(),
  validation(validators.checkout),
  cartController.proceedToPayment
);

export default router;
