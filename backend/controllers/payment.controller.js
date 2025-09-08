import { asyncHandler } from "../utils/response.js";
import UserModel from "../DB/models/user.model.js";
import orgCart from "../DB/models/orgCart.model.js";
import CartModel from "../DB/models/cart.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = asyncHandler(async (req, res) => {
  let isOrg = false;
  const { cartId, userId, amount } = req.body;
  const checkOrgCart = await orgCart.findById(cartId);
  if (checkOrgCart) isOrg = true;
  const checkUserCart = await CartModel.findById(cartId);
  if (checkUserCart) isOrg = false;

  const existUser = await UserModel.findById(userId);
  if (!existUser) {
    return res.status(400).json({ message: "user not exist" });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "EGP",
          product_data: {
            name: `event/venue booking -ID`,
            metadata: { userId, cartId },
          },
          unit_amount: (amount + 20) * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    //   url of page of scucess of front
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.status(200).json({ id: session.id, url: session.url });
});

export { checkout };
