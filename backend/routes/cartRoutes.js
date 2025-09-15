import { Router } from "express";
import * as cartController from "../controllers/cartControllers.js";
import { authentication } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/cart.validation.js";

const router = Router();

router.post(
  "/add",
  authentication(),
  validation(validators.addToCart),
  cartController.addToCart
);

router.put(
  "/update", // 👈 update quantity
  authentication(),
  validation(validators.updateQuantity),
  cartController.updateQuantity
);

router.delete(
  "/remove",
  authentication(),
  validation(validators.removeFromCart),
  cartController.removeFromCart
);

router.post("/remove", authentication(), validation(validators.removeFromCart), cartController.removeFromCart);

router.get(
  "/:userID",
  authentication(),
  validation(validators.getCart),
  cartController.getCart
);

router.post(
  "/checkout",
  authentication(),
  validation(validators.checkout),
  cartController.proceedToPayment
);

export default router;
