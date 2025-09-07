import mongoose from "mongoose";

//  Enum for cart status
export const cartStatusEnum = {
  active: "active",
  checkedOut: "checkedOut",
  cleared: "cleared",
};

// Schema for items inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal must be a positive number"],
    },
  },
  { _id: false } // prevent MongoDB from creating _id for each item
);

//  Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(cartStatusEnum),
        message: `Status must be one of: ${Object.values(cartStatusEnum).join(", ")}`,
      },
      default: cartStatusEnum.active,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual field (number of items in cart)
cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

// Middleware: calculate subtotal & totalAmount automatically before save
cartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.subtotal = item.quantity * item.price;
  });
  this.totalAmount = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  next();
});

//  Export model
export const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
CartModel.syncIndexes();

export default CartModel;
