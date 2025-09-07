import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { authentication } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/cart.validation.js";

const router = Router();

//  Add ticket to the cart
router.post(
  "/add",
  authentication(), // must be signed in
  validation(validators.addToCart),
  cartController.addToCart
);

//  Remove ticket from cart
router.post(
  "/remove",
  authentication(),
  validation(validators.removeFromCart),
  cartController.removeFromCart
);

//  Empty cart
router.post(
  "/empty",
  authentication(),
  validation(validators.emptyCart),
  cartController.emptyCart
);

//  Get specific cart by user ID
router.get(
  "/:userID",
  authentication(),
  validation(validators.getCart),
  cartController.getCart
);

//  Checkout (payment)
router.post(
  "/checkout",
  authentication(),
  validation(validators.checkout),
  cartController.proceedToPayment
);

export default router;
